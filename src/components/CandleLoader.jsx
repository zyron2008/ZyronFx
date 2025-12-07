import React from 'react';
import { motion } from 'framer-motion';

const CandleLoader = () => {
  const candleVariants = {
    animate: {
      y: [-10, 10],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut'
      }
    }
  };

  const flameVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-8 h-12 relative"
        variants={candleVariants}
        animate="animate"
      >
        <div className="w-full h-full bg-white rounded-md" />
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-6 bg-yellow-400 rounded-full"
          style={{
            filter: 'blur(4px)',
            boxShadow: '0 0 10px #fef08a, 0 0 20px #fef08a, 0 0 30px #fde047',
          }}
          variants={flameVariants}
          animate="animate"
        />
      </motion.div>
      <div className="w-12 h-2 bg-gray-600 rounded-full mt-2" />
    </div>
  );
};

export default CandleLoader;