import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

const ImpliedVolatility = () => {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="pt-16">
        <div className="min-h-[calc(100vh-64px)] flex flex-col p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-grow flex flex-col"
          >
            <h1 className="text-2xl font-bold text-white mb-4 text-center">
              Implied Volatility
            </h1>
            <div className="flex-grow bg-black/20 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10">
              <iframe
                src="https://ivtracker.replit.app/"
                title="Implied Volatility"
                className="w-full h-full"
                style={{ minHeight: "1500px", border: "none" }}
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ImpliedVolatility;