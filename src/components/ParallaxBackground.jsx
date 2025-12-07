import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxBackground = () => {
  const { scrollYProgress } = useScroll();

  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const yFg = useTransform(scrollYProgress, [0, 1], ['0%', '150%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const bgImage1 = 'https://horizons-cdn.hostinger.com/48180719-2e3c-4425-9736-2a7b0aba5062/fd69adcf96c14d4c54a3c7a168a190fb.webp';
  const bgImage2 = 'https://horizons-cdn.hostinger.com/48180719-2e3c-4425-9736-2a7b0aba5062/a94a3c721c8d471a7a2ceb17957626b6.jpg';

  return (
    <>
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage1})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          y: yBg,
        }}
      />
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage2})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          y: yFg,
          opacity: opacity,
        }}
      />
      <div className="fixed inset-0 z-0 bg-black/30"></div>
    </>
  );
};

export default ParallaxBackground;