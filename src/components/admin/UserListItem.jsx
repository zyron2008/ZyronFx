import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, XCircle, UserCheck, UserX, LogOut, Loader2, History } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import EditUserForm from './EditUserForm';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const tools = [
  { key: 'access_feed', label: 'Feed', expiryKey: 'access_feed_expires_at' },
  { key: 'access_economic_calendar', label: 'Calendar', expiryKey: 'access_economic_calendar_expires_at' },
  { key: 'access_market_sentiment', label: 'Sentiment', expiryKey: 'access_market_sentiment_expires_at' },
  { key: 'access_macro_analysis', label: 'Macro', expiryKey: 'access_macro_analysis_expires_at' },
  { key: 'access_interest_rates', label: 'Rates', expiryKey: 'access_interest_rates_expires_at' },
  { key: 'access_implied_volatility', label: 'Volatility', expiryKey: 'access_implied_volatility_expires_at' },
];

const UserLoginHistory = ({ userId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const { session } = useAuth();
    const { toast } = useToast();
  
    const fetchHistory = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-user-login-history', {
          body: { userId },
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (error) throw error;
        if (data.error) throw new Error(data.error);
        setHistory(data.loginHistory || []);
      } catch (error) {
        toast({ title: 'Error fetching login history', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Sheet onOpenChange={(open) => open && fetchHistory()}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-purple-400 hover:bg-purple-500/20 hover:text-purple-300">
            <History className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="text-white">
          <SheetHeader>
            <SheetTitle>Login History</SheetTitle>
          </SheetHeader>
          <div className="py-4 h-full overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : history.length > 0 ? (
              <ul className="space-y-4">
                {history.map((entry, index) => (
                  <li key={index} className="p-3 bg-black/20 border border-white/10 rounded-lg">
                    <p className="text-sm font-semibold">{new Date(entry.timestamp).toLocaleString()}</p>
                    <p className="text-xs text-gray-400">IP: {entry.ip_address}</p>
                    <p className="text-xs text-gray-400 truncate">Device: {entry.user_agent}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center mt-8">No login history found.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
};

const UserListItem = ({ user, isEditing, onEdit, onUserUpdated, onCancelEdit }) => {
  const { user: adminUser, session } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleDeleteUser = async () => {
    if (user.role === 'admin') {
      toast({ title: 'Error', description: 'Cannot delete an admin account.', variant: 'destructive' });
      return;
    }
    setIsDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: user.id },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      toast({ title: 'Success', description: 'User deleted.' });
      onUserUpdated();
    } catch (error) {
      toast({ title: 'Error', description: `Failed to delete user: ${error.message}`, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOutUser = async () => {
    if (user.role === 'admin') {
      toast({ title: 'Action not allowed', description: 'Cannot remotely sign out an admin.', variant: 'destructive' });
      return;
    }
    setIsSigningOut(true);
    try {
      const { data, error } = await supabase.functions.invoke('sign-out-user', {
        body: { userId: user.id },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({ title: 'Success', description: data.message });
      onUserUpdated();
    } catch (error) {
      toast({ title: 'Error', description: `Failed to sign out user: ${error.message}`, variant: 'destructive' });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSaveEdit = async (updateData) => {
    const { id, email, user_email, created_at, last_sign_in_at, ...profileData } = updateData;

    const { error } = await supabase.from('profiles').update(profileData).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: `Failed to update user: ${error.message}`, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'User profile updated.' });
      onCancelEdit();
      onUserUpdated();
    }
  };

  const handleStatusChange = async (status) => {
    const { error } = await supabase.from('profiles').update({ status }).eq('id', user.id);
    if (error) {
      toast({ title: 'Error', description: `Failed to update status: ${error.message}`, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `User status updated to ${status}.` });
      onUserUpdated();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-black/20 p-4 rounded-xl border border-white/10"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-white break-all">{user.email}</p>
          <p className="text-xs text-gray-400">Role: {user.role} | Status: <span className={`font-semibold ${user.status === 'approved' ? 'text-green-400' : user.status === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}>{user.status || 'approved'}</span></p>
          <p className="text-xs text-gray-400">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
          {user.last_sign_in_at && (
             <p className="text-xs text-gray-400">Last seen: {new Date(user.last_sign_in_at).toLocaleString()}</p>
          )}
          {user.has_mentorship_access && user.mentorship_access_expires_at && (
            <p className="text-xs text-blue-300">Mentorship expires: {new Date(user.mentorship_access_expires_at).toLocaleDateString()}</p>
          )}
          {tools.map(tool => user[tool.key] && user[tool.expiryKey] && (
            <p key={tool.key} className="text-xs text-purple-300">{tool.label} expires: {new Date(user[tool.expiryKey]).toLocaleDateString()}</p>
          ))}
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {isEditing ? (
            <Button onClick={onCancelEdit} variant="ghost" size="icon" className="text-gray-400 hover:bg-gray-500/20 hover:text-gray-300">
              <XCircle className="h-4 w-4" />
            </Button>
          ) : (
            <>
              {user.status === 'pending' && user.role !== 'admin' && (
                <>
                  <Button onClick={() => handleStatusChange('approved')} variant="ghost" size="icon" className="text-green-400 hover:bg-green-500/20 hover:text-green-300"><UserCheck className="h-4 w-4" /></Button>
                  <Button onClick={() => handleStatusChange('declined')} variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/20 hover:text-red-300"><UserX className="h-4 w-4" /></Button>
                </>
              )}
              {user.id !== adminUser?.id && (
                <Button onClick={() => onEdit(user.id)} variant="ghost" size="icon" className="text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"><Edit className="h-4 w-4" /></Button>
              )}
              {user.role !== 'admin' && (
                <>
                  <UserLoginHistory userId={user.id} />
                  <Button onClick={handleSignOutUser} variant="ghost" size="icon" disabled={isSigningOut} className="text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300">
                    {isSigningOut ? <Loader2 className="h-4 w-4 animate-spin"/> : <LogOut className="h-4 w-4" />}
                  </Button>
                  <Button onClick={handleDeleteUser} variant="destructive" size="icon" disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      {isEditing && (
          <EditUserForm user={user} onSave={handleSaveEdit} onCancel={onCancelEdit} />
      )}
    </motion.div>
  );
};

export default UserListItem;