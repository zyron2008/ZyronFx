import React from 'react';
import { motion } from 'framer-motion';

const OrbLoader = () => {
  return (
    <div className="relative w-24 h-24">
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white/50"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-white/50"
        animate={{
          scale: [1.1, 0.9, 1.1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.5
        }}
      />
       <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, ease: "linear", repeat: Infinity }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg shadow-white"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/70 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-white/70 rounded-full"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-white/70 rounded-full"></div>
      </motion.div>
    </div>
  );
};

export default OrbLoader;