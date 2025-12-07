import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, ArrowRight, AlertCircle, CheckCircle, Key, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Seo from '@/components/Seo';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status === 'pending') {
      setStatusMessage({ 
        type: 'warning',
        title: 'Approval Pending', 
        description: 'Your account is awaiting admin approval. Please check back later.' 
      });
      navigate('/login', { replace: true });
    }
    if (status === 'pending_verification') {
        setStatusMessage({
            type: 'success',
            title: 'Verification Email Sent',
            description: 'Please check your email to verify your account. Access is pending admin approval.'
        });
        navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    
    if(error) {
        setIsSubmitting(false);
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message,
        });
    }
    // On success, the AuthContext will handle navigation.
    // We don't set isSubmitting to false here because the page will navigate away.
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (isSubmitting || !email) return;
    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/change-password`,
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Error sending reset link",
        description: error.message,
      });
    } else {
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password.",
      });
      setForgotPasswordMode(false);
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
        title={forgotPasswordMode ? 'Reset Password' : 'Login'}
        description={forgotPasswordMode ? 'Reset your password to regain access to your account.' : 'Sign in to access your dashboard and trading tools.'}
      />
      <div className="min-h-screen flex items-center justify-center p-4">
         <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors flex items-center gap-2 z-20">
           <ArrowRight className="w-4 h-4 transform rotate-180" /> Back to Home
         </button>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md p-8 space-y-6 bg-black/20 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/10"
        >
          <div className="text-center">
            <img src="https://i.imageupload.app/ff82f4c309a3a7811e2d.png" alt="Profitix Logo" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white tracking-tight">
              {forgotPasswordMode ? 'Reset Password' : 'Welcome Back'}
            </h1>
            <p className="mt-2 text-gray-400">
              {forgotPasswordMode ? 'Enter your email to get a reset link.' : 'Sign in to access your dashboard.'}
            </p>
          </div>

          {statusMessage && (
            <motion.div 
              initial={{opacity: 0, y: -10}}
              animate={{opacity: 1, y: 0}}
              className={`p-4 rounded-xl flex items-start space-x-3 ${statusMessage.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-green-500/10 border border-green-500/30'}`}>
                {statusMessage.type === 'warning' ? 
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" /> : 
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                }
              <div>
                <h3 className={`font-semibold ${statusMessage.type === 'warning' ? 'text-yellow-300' : 'text-green-300'}`}>{statusMessage.title}</h3>
                <p className={`text-sm ${statusMessage.type === 'warning' ? 'text-yellow-400/80' : 'text-green-400/80'}`}>{statusMessage.description}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={forgotPasswordMode ? handlePasswordReset : handleLogin} className="space-y-6">
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

            {!forgotPasswordMode && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
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
            )}

            <div>
              <Button type="submit" size="lg" className="w-full font-semibold bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform duration-300" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                {isSubmitting ? 'Processing...' : (forgotPasswordMode ? 'Send Reset Link' : 'Sign In')}
              </Button>
            </div>
          </form>

          <div className="text-center space-y-2">
            <button
              onClick={() => {
                setForgotPasswordMode(!forgotPasswordMode)
                setStatusMessage(null)
              }}
              className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
            >
              {forgotPasswordMode ? 'Back to Sign In' : 'Forgot your password?'}
            </button>
            <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <button onClick={() => navigate('/signup')} className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
                    Sign Up
                </button>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;