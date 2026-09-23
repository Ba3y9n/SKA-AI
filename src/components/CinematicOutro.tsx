import React from 'react';
import { motion } from 'framer-motion';
import { RewaaLogo } from './RewaaLogo';

export const CinematicOutro: React.FC = () => {
  return (
    <section className="relative w-full py-40 bg-[#064C3B] overflow-hidden flex flex-col items-center justify-center text-center px-4 z-20">
      
      {/* Rewaa Final Appearance */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.5 }}
        className="mb-16"
      >
        <img 
          src="/rewaa_avatar_real_transparent.png" 
          alt="رِواء" 
          className="w-40 md:w-48 opacity-80 filter drop-shadow-2xl"
        />
      </motion.div>

      {/* Narrative Outro */}
      <div className="space-y-6 mb-20 relative z-10">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-6xl font-black text-white"
        >
          من حكاية الأمس
        </motion.h3>
        
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-4xl md:text-6xl font-black text-[#DDF5EA]"
        >
          إلى طموح الغد.
        </motion.h3>
      </div>

      {/* Final Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 1 }}
        className="flex flex-col items-center relative z-10 pt-12 border-t border-white/20 w-full max-w-sm"
      >
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-widest mb-4">رِواء</h2>
      </motion.div>

    </section>
  );
};
