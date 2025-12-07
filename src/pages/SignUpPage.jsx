import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Mail, Key, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Seo from '@/components/Seo';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message,
      });
    } else if (data.user) {
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account. Your access is pending admin approval.",
      });
      navigate('/login?status=pending_verification');
    }
    setIsSubmitting(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <>
      <Seo 
        title="Sign Up" 
        description="Create an account to join the Profitix Academy and get access to our tools." 
      />
      <div className="min-h-screen flex items-center justify-center p-4">
         <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors flex items-center gap-2 z-20">
           <ArrowRight className="w-4 h-4 transform rotate-180" /> Back to Home
         </button>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md p-8 space-y-8 bg-black/20 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/10"
        >
          <div className="text-center">
            <img src="https://i.imageupload.app/ff82f4c309a3a7811e2d.png" alt="Profitix Logo" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Join the Community
            </h1>
            <p className="mt-2 text-gray-400">
              Create your account to get started.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="full-name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="•••••••• (Min. 6 characters)"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <Button type="submit" size="lg" className="w-full font-semibold bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform duration-300" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </div>
          </form>

           <div className="text-center">
            <button
                onClick={() => navigate('/login')}
                className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
            >
                Already have an account? Sign In
            </button>
           </div>

        </motion.div>
      </div>
    </>
  );
};

export default SignUpPage;