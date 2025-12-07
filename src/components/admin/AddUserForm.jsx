import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const AddUserForm = ({ onUserAdded }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const { toast } = useToast();

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!email || !password || isAddingUser) return;
    setIsAddingUser(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `User with email "${email}" created.` });
      setEmail('');
      setPassword('');
      onUserAdded();
    }
    setIsAddingUser(false);
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
      <h3 className="text-2xl font-semibold text-white mb-4 flex items-center"><UserPlus className="mr-2" />Add New User</h3>
      <form onSubmit={handleAddUser} className="space-y-4">
        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@example.com" />
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" />
        <Button type="submit" disabled={isAddingUser} className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90">
          {isAddingUser ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : 'Add User'}
        </Button>
      </form>
    </div>
  );
};

export default AddUserForm;