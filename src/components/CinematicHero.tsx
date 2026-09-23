import React from 'react';
import { motion } from 'framer-motion';

export const CinematicHero: React.FC = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#064C3B]">
      
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/national_hero.jpg" 
          alt="Hero" 
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#F8FBF8]" />
      </motion.div>

      {/* Content over Hero */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-lg tracking-tight"
        >
          رِواء
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-2xl md:text-4xl text-[#DDF5EA] font-bold mb-4 drop-shadow-md"
        >
          صوت الجيل السعودي الرقمي
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-lg md:text-xl text-white/90 font-medium tracking-wide drop-shadow-sm"
        >
          من حكاية الأمس إلى طموح الغد.
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce text-[#064C3B]"
      >
        <span className="text-xs uppercase tracking-widest mb-2 font-bold drop-shadow-sm">اكتشف الحكاية ↓</span>
      </motion.div>

    </section>
  );
};
