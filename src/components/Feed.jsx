import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

const Feed = () => {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="pt-16">
        <div className="min-h-[calc(100vh-64px)] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-grow flex flex-col"
          >
            <h1 className="text-2xl font-bold text-white mb-4 text-center">
              Financial Source By <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-400">PROFITIX</span>
            </h1>
            <div className="flex-grow rounded-xl overflow-hidden backdrop-blur-sm border border-white/10">
              <iframe
                src="MaiN Tain By Profitix"
                title="NewsFeed"
                className="w-full h-full"
                style={{ minHeight: "1500px", border: "none" }}
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xs text-gray-500 mt-4"
          >
            Powered by newsquawk
          </motion.p>
        </div>
      </main>
    </div>
  );
};

export default Feed;