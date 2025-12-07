import React from 'react';
import { motion } from 'framer-motion';

const LiveBackground = () => {
  const imageUrl = 'https://i.postimg.cc/BbsTYPCD/70975a56-4833-4deb-ba9d-8e7200447a20.webp';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: '120% 120%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 30,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
        }}
      />
      <div className="absolute inset-0 bg-[#020024]/50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:2rem_2rem]" />
    </div>
  );
};

export default LiveBackground;