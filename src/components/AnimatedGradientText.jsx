import React from 'react';
import { motion } from 'framer-motion';

const AnimatedGradientText = ({ children, className }) => {
  return (
    <motion.span
      className={className}
      style={{
        display: 'inline-block',
        backgroundSize: '200% 200%',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 4,
        ease: 'linear',
        repeat: Infinity,
      }}
    >
      {children}
    </motion.span>
  );
};

export default AnimatedGradientText;