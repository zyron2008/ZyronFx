import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Key, Save, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tools = [
  { key: 'access_feed', label: 'Feed', expiryKey: 'access_feed_expires_at' },
  { key: 'access_economic_calendar', label: 'Calendar', expiryKey: 'access_economic_calendar_expires_at' },
  { key: 'access_market_sentiment', label: 'Sentiment', expiryKey: 'access_market_sentiment_expires_at' },
  { key: 'access_macro_analysis', label: 'Macro', expiryKey: 'access_macro_analysis_expires_at' },
  { key: 'access_interest_rates', label: 'Rates', expiryKey: 'access_interest_rates_expires_at' },
  { key: 'access_implied_volatility', label: 'Volatility', expiryKey: 'access_implied_volatility_expires_at' },
];

const EditUserForm = ({ user, onSave, onCancel }) => {
  const [editingUser, setEditingUser] = useState({ ...user });
  const [mentorshipDays, setMentorshipDays] = useState(30);
  const [toolAccessDays, setToolAccessDays] = useState(tools.reduce((acc, tool) => ({ ...acc, [tool.key]: 30 }), {}));
  const [grantAllTools, setGrantAllTools] = useState(false);
  const [allToolsDays, setAllToolsDays] = useState(30);
  const [newUserPassword, setNewUserPassword] = useState('');
  const [confirmNewUserPassword, setConfirmNewUserPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();
  const { session } = useAuth();

  const handlePermissionChange = (key, value) => {
    setEditingUser(prev => ({ ...prev, [key]: value }));
  };

  const handleToolDaysChange = (key, value) => {
    setToolAccessDays(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    let updateData = { ...editingUser };

    if (newUserPassword) {
      if (newUserPassword !== confirmNewUserPassword) {
        toast({ title: 'Error', description: 'New passwords do not match.', variant: 'destructive' });
        setIsSaving(false);
        return;
      }
      if (newUserPassword.length < 6) {
        toast({ title: 'Error', description: 'New password must be at least 6 characters.', variant: 'destructive' });
        setIsSaving(false);
        return;
      }
      try {
        const { data, error } = await supabase.functions.invoke('reset-user-password', {
          body: { userId: editingUser.id, newPassword: newUserPassword },
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (error) throw error;
        if(data.error) throw new Error(data.error);

        toast({ title: 'Success', description: data.message });
        setNewUserPassword('');
        setConfirmNewUserPassword('');
      } catch(error) {
        toast({ title: 'Error', description: `Failed to reset password: ${error.message}`, variant: 'destructive' });
        setIsSaving(false);
        return; // Stop if password reset fails
      }
    }

    if (updateData.has_mentorship_access && mentorshipDays > 0) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(mentorshipDays, 10));
      updateData.mentorship_access_expires_at = expiryDate.toISOString();
    } else if (!updateData.has_mentorship_access) {
      updateData.mentorship_access_expires_at = null;
    }

    if (grantAllTools) {
      tools.forEach(tool => {
        updateData[tool.key] = true;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + parseInt(allToolsDays, 10));
        updateData[tool.expiryKey] = expiryDate.toISOString();
      });
    } else {
      tools.forEach(tool => {
        if (updateData[tool.key]) {
          const days = toolAccessDays[tool.key] || 30;
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + parseInt(days, 10));
          updateData[tool.expiryKey] = expiryDate.toISOString();
        } else {
          updateData[tool.expiryKey] = null;
        }
      });
    }

    await onSave(updateData);
    setIsSaving(false);
  };


  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-white/10 space-y-6">
      <div className="space-y-4">
        <h4 className="font-semibold mb-2 text-white flex items-center gap-2"><Key /> Set New Password</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="New Password" />
          <Input type="password" value={confirmNewUserPassword} onChange={(e) => setConfirmNewUserPassword(e.target.value)} placeholder="Confirm New Password" />
        </div>
      </div>
      
      <div className="space-y-4">
          <h4 className="font-semibold mb-2 text-white">Tool Access</h4>
          <div className="flex items-center space-x-4 p-4 bg-black/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox id={`${user.id}-all-tools`} checked={grantAllTools} onCheckedChange={setGrantAllTools} className="border-white/30" />
              <Label htmlFor={`${user.id}-all-tools`} className="text-sm font-medium text-gray-300">Grant All Tools</Label>
            </div>
            {grantAllTools && (
              <div className="flex items-center space-x-2">
                <Input id={`${user.id}-all-tools-days`} type="number" value={allToolsDays} onChange={(e) => setAllToolsDays(e.target.value)} className="w-24 h-8" placeholder="Days"/>
                <Label htmlFor={`${user.id}-all-tools-days`} className="text-sm font-medium text-gray-300">Days</Label>
              </div>
            )}
          </div>
          {!grantAllTools && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tools.map(tool => (
                <div key={tool.key} className="flex items-center justify-between p-2 bg-black/10 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`${user.id}-${tool.key}`} checked={!!editingUser[tool.key]} onCheckedChange={(checked) => handlePermissionChange(tool.key, checked)} className="border-white/30" />
                    <Label htmlFor={`${user.id}-${tool.key}`} className="text-sm font-medium text-gray-300">{tool.label}</Label>
                  </div>
                  {editingUser[tool.key] && (
                    <div className="flex items-center space-x-2">
                      <Input id={`${user.id}-${tool.key}-days`} type="number" value={toolAccessDays[tool.key] || 30} onChange={(e) => handleToolDaysChange(tool.key, e.target.value)} className="w-20 h-7" placeholder="Days"/>
                      <Label htmlFor={`${user.id}-${tool.key}-days`} className="text-xs font-medium text-gray-400">Days</Label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>
      <div>
        <h4 className="font-semibold mb-2 text-white">Mentorship Access</h4>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox id={`${user.id}-mentorship`} checked={!!editingUser.has_mentorship_access} onCheckedChange={(checked) => handlePermissionChange('has_mentorship_access', checked)} className="border-white/30" />
            <Label htmlFor={`${user.id}-mentorship`} className="text-sm font-medium text-gray-300">Grant Access</Label>
          </div>
          {editingUser.has_mentorship_access && (
            <div className="flex items-center space-x-2">
              <Input id="mentorship-days" type="number" value={mentorshipDays} onChange={(e) => setMentorshipDays(e.target.value)} className="w-24 h-8" placeholder="Days"/>
              <Label htmlFor="mentorship-days" className="text-sm font-medium text-gray-300">Days</Label>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <Button onClick={onCancel} variant="ghost" className="text-gray-400 hover:bg-gray-500/20 hover:text-gray-300">
          <XCircle className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg shadow-blue-500/20">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </motion.div>
  );
};

export default EditUserForm;