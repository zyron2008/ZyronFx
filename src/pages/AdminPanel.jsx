import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Header from '@/components/Header';
import Seo from '@/components/Seo';
import AddUserForm from '@/components/admin/AddUserForm';
import ContactMessages from '@/components/admin/ContactMessages';
import UserList from '@/components/admin/UserList';
import { Users, Clock, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [isSigningOutAll, setIsSigningOutAll] = useState(false);

  const { toast } = useToast();
  const { session } = useAuth();

  const fetchUsers = useCallback(async () => {
    if (!session) return;
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-users', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      const authUsers = data.users;
      const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*');
      if (profilesError) throw new Error(profilesError.message);

      const usersById = authUsers.reduce((acc, user) => ({ ...acc, [user.id]: user }), {});
      
      const combinedUsers = profiles.map(profile => ({
        ...profile,
        email: usersById[profile.id]?.email || 'N/A',
        created_at: usersById[profile.id]?.created_at,
        last_sign_in_at: usersById[profile.id]?.last_sign_in_at,
      })).filter(u => u.email !== 'N/A');

      setUsers(combinedUsers);
    } catch (error) {
      toast({ title: 'Error fetching users', description: error.message, variant: 'destructive' });
    } finally {
      setLoadingUsers(false);
    }
  }, [toast, session]);

  useEffect(() => {
    if (session) {
      fetchUsers();
    }
  }, [fetchUsers, session]);

  const handleSignOutAll = async () => {
    setIsSigningOutAll(true);
    try {
      const { data, error } = await supabase.functions.invoke('sign-out-all-users', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      toast({ title: 'Success', description: data.message });
      await fetchUsers();
    } catch (error) {
      toast({ title: 'Error', description: `Failed to sign out all users: ${error.message}`, variant: 'destructive' });
    } finally {
      setIsSigningOutAll(false);
    }
  };
  
  const pendingUsers = users.filter(u => u.status === 'pending');
  const approvedUsers = users.filter(u => u.status === 'approved' || u.status === null);

  return (
    <>
      <Seo title="Admin Panel" description="Manage users, permissions, and view contact messages." />
      <div className="min-h-screen bg-grid-pattern">
        <Header />
        <main className="pt-24 p-4 sm:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">Admin Panel</h1>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                <AddUserForm onUserAdded={fetchUsers} />
                <ContactMessages />
              </div>

              <div className="lg:col-span-2 bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <div className="flex flex-wrap gap-4 items-center justify-between border-b border-white/10 mb-4 pb-4">
                  <div className="flex">
                    <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 text-lg font-semibold flex items-center gap-2 ${activeTab === 'pending' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>
                      <Clock className="w-5 h-5"/> Pending <span className="text-xs bg-yellow-400/20 text-yellow-300 rounded-full px-2 py-0.5">{pendingUsers.length}</span>
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`px-4 py-2 text-lg font-semibold flex items-center gap-2 ${activeTab === 'users' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>
                      <Users className="w-5 h-5"/> All Users
                    </button>
                  </div>
                   <Button onClick={handleSignOutAll} variant="destructive" size="sm" disabled={isSigningOutAll}>
                    {isSigningOutAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                    Sign Out All
                  </Button>
                </div>
                {loadingUsers ? <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                  <UserList 
                    users={activeTab === 'pending' ? pendingUsers : approvedUsers}
                    onUserUpdated={fetchUsers}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AdminPanel;