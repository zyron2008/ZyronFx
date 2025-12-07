import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Lock, Camera, Loader2 } from 'lucide-react';

const ProfileSettingsPage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  const getInitials = (name) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    const names = name.split(' ');
    if (names.length === 1 || !names[1]) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  const handleAvatarClick = () => {
    if (!isUploading) {
        fileInputRef.current.click();
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
      });
      return;
    }

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    if (profile && profile.avatar_url) {
      const pathOnly = profile.avatar_url.substring(profile.avatar_url.indexOf('/avatars/') + 9);
      await supabase.storage.from('avatars').remove([pathOnly]);
    }
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: uploadError.message,
      });
      setIsUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrlData.publicUrl })
      .eq('id', user.id);
      
    if (updateError) {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: updateError.message,
      });
    } else {
      toast({ title: "Success", description: "Profile picture updated." });
      await refreshProfile();
    }
    
    setIsUploading(false);
    event.target.value = '';
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);
      
    if (error) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    } else {
      toast({ title: "Success", description: "Profile information updated." });
      await refreshProfile();
    }
    
    setIsUpdatingProfile(false);
  };
  
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "Passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "Error", description: "Password must be at least 6 characters long." });
      return;
    }
    
    setIsUpdatingPassword(true);
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      toast({ variant: "destructive", title: "Password update failed", description: error.message });
    } else {
      toast({ title: "Success", description: "Password updated successfully." });
      setNewPassword('');
      setConfirmPassword('');
    }
    
    setIsUpdatingPassword(false);
  };

  return (
    <>
      <Seo title="Profile Settings" description="Manage your profile information and account settings." />
      <div className="min-h-screen w-full">
        <Header />
        <main className="pt-32 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-4"
          >
            <h1 className="text-4xl font-bold text-white mb-8">Profile Settings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 flex flex-col items-center">
                 <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                    <Avatar className="w-32 h-32 text-4xl border-4 border-white/10 shadow-lg">
                      <AvatarImage src={avatarUrl} alt={fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-pink-700 text-white font-bold">
                        {getInitials(fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isUploading ? <Loader2 className="w-8 h-8 text-white animate-spin"/> : <Camera className="w-8 h-8 text-white"/>}
                    </div>
                 </div>
                 <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} hidden accept="image/png, image/jpeg, image/gif" />
                 <p className="text-gray-400 text-sm mt-4 text-center">Click to change avatar<br/>(Max 2MB)</p>
              </div>

              <div className="md:col-span-2 space-y-12">
                <form onSubmit={handleProfileUpdate} className="space-y-6 p-8 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10">
                   <h2 className="text-2xl font-semibold text-white flex items-center gap-3"><User /> Profile Information</h2>
                   <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={user?.email || ''} disabled className="bg-white/5 cursor-not-allowed"/>
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
                   </div>
                   <Button type="submit" disabled={isUpdatingProfile} className="bg-gradient-to-r from-blue-500 to-teal-500">
                     {isUpdatingProfile ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
                   </Button>
                </form>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-6 p-8 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10">
                   <h2 className="text-2xl font-semibold text-white flex items-center gap-3"><Lock /> Change Password</h2>
                   <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" />
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                   </div>
                   <Button type="submit" disabled={isUpdatingPassword} className="bg-gradient-to-r from-pink-500 to-purple-600">
                    {isUpdatingPassword ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : 'Update Password'}
                   </Button>
                </form>
              </div>
            </div>

          </motion.div>
        </main>
      </div>
    </>
  );
};

export default ProfileSettingsPage;