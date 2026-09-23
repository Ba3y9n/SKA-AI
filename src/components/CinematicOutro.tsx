import React from 'react';
import { motion } from 'framer-motion';
import { RewaaLogo } from './RewaaLogo';

export const CinematicOutro: React.FC = () => {
  return (
    <section className="relative w-full py-40 bg-[#020804] overflow-hidden flex flex-col items-center justify-center text-center px-4 z-20 border-t border-white/5">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none" />

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
          className="w-48 md:w-64 opacity-50 filter drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        />
      </motion.div>

      {/* Narrative Outro */}
      <div className="space-y-12 mb-20 relative z-10">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-3xl md:text-5xl font-black text-white"
        >
          من إرثنا نستمد قوتنا.
        </motion.h3>
        
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-3xl md:text-5xl font-black text-emerald-400"
        >
          من إنجازاتنا نصنع أثرنا.
        </motion.h3>
        
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
          className="text-3xl md:text-5xl font-black text-white"
        >
          ومن طموحنا نبني مستقبلنا.
        </motion.h3>
      </div>

      {/* Final Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 1.5 }}
        className="flex flex-col items-center relative z-10"
      >
        <RewaaLogo className="w-20 h-20 text-emerald-500 mb-6" />
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-widest mb-4">رِواء</h2>
        <p className="text-xl text-emerald-600/80 font-bold tracking-widest">
          من حكاية الأمس إلى طموح الغد.
        </p>
      </motion.div>

    </section>
  );
};
