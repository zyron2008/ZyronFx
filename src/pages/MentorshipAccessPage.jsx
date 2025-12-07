import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Seo from '@/components/Seo';

const MentorshipAccessPage = () => {
  const { toast } = useToast();

  const handleNotImplemented = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      description: "The application process for mentorship access is coming soon.",
    });
  };

  return (
    <>
      <Seo 
        title="Mentorship Access" 
        description="Unlock exclusive access to our mentorship program and accelerate your trading journey." 
      />
      <div className="min-h-screen w-full">
        <Header />
        <main className="pt-20">
          <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="w-full max-w-2xl bg-black/30 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12"
            >
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-8 shadow-lg shadow-yellow-500/20">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                Exclusive Access Required
              </h1>
              <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
                Our Mentorship Program is a premium offering designed to provide personalized, high-impact guidance. Access is currently limited to ensure quality.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
              >
                <Button onClick={handleNotImplemented} size="lg" className="bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold text-lg shadow-lg shadow-blue-500/30">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Request Access
                </Button>
              </motion.div>
               <p className="text-sm text-gray-500 mt-8">
                Admins have automatic access. If you believe you should have access, please contact support.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MentorshipAccessPage;