import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Seo from '@/components/Seo';

const InterestRates = () => {
  return (
    <>
      <Seo 
        title="Interest Rates" 
        description="Track global interest rates and central bank policies." 
      />
      <div className="min-h-screen w-full">
        <Header />
        <main className="pt-24">
          <div className="min-h-[calc(100vh-8rem)] flex flex-col p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-grow flex flex-col"
            >
              <h1 className="text-3xl font-bold text-white mb-6 text-center">
                Interest Rate Tracker
              </h1>
              <div className="flex-grow bg-black/20 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10">
                <iframe
                  src="https://1bullbear.com/e/interest"
                  title="Interest Rate Tracker"
                  className="w-full h-full"
                  style={{ minHeight: "1500px", border: "none" }}
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default InterestRates;