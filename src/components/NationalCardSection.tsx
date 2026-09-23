import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const NationalCardSection: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section className="relative w-full py-40 bg-[#064C3B] overflow-hidden z-20">
      
      {/* Background Parallax from the Hero Image */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-20"
        style={{ y: bgY }}
      >
        <img 
          src="/national_hero.jpg" 
          alt="اليوم الوطني" 
          className="w-full h-full object-cover object-center filter grayscale brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#064C3B]/80 via-transparent to-[#064C3B]" />
      </motion.div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl text-emerald-300 font-bold mb-6 tracking-wide drop-shadow-md"
        >
          اليوم الوطني السعودي 96
        </motion.p>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-xl"
        >
          عزّنا برؤيتنا، وهمّتنا،<br />
          <span className="text-emerald-400">وأصالتنا التي لا تتغير.</span>
        </motion.h2>
      </div>
    </section>
  );
};
