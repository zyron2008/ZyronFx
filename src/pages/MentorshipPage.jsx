import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const MentorshipPage = () => {
  const { toast } = useToast();

  const handleNotImplemented = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      description: "Mentorship booking and resources are coming soon.",
    });
  };

  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="pt-20">
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
          >
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 mb-8">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4">
              Mentorship Program
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              Accelerate your trading journey with personalized guidance from experienced mentors.
            </p>
            <div className="space-y-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-black/30 p-8 rounded-lg border border-white/10"
              >
                <h2 className="text-2xl font-bold text-pink-400 mb-4">Book a Session</h2>
                <p className="text-gray-400 mb-6">Schedule a one-on-one session with a mentor to review your strategy, analyze trades, and get personalized feedback.</p>
                <Button onClick={handleNotImplemented} className="bg-gradient-to-r from-pink-500 to-purple-600">
                  Browse Mentors
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-black/30 p-8 rounded-lg border border-white/10"
              >
                <h2 className="text-2xl font-bold text-blue-400 mb-4">Exclusive Resources</h2>
                <p className="text-gray-400 mb-6">Access a library of curated content, including advanced strategy guides, webinars, and case studies, available only to our members.</p>
                <Button onClick={handleNotImplemented} className="bg-gradient-to-r from-blue-500 to-teal-500">
                  Explore Library
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MentorshipPage;