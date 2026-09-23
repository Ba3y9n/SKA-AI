import React from 'react';
import { motion } from 'framer-motion';

export const NationalCardSection: React.FC = () => {
  return (
    <section className="relative w-full py-32 bg-[#05110a] overflow-hidden z-20 border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-right">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-md"
            >
              عزّنا برؤيتنا، وهمّتنا،<br />
              <span className="text-emerald-400">وأصالتنا التي لا تتغير.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 font-medium tracking-wide"
            >
              اليوم الوطني السعودي 96
            </motion.p>
          </div>

          {/* Card Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 w-full max-w-md relative perspective-1000"
          >
            {/* Soft border glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-green-900/30 rounded-3xl blur-md" />
            <img 
              src="/media_1790129786646.jpg" 
              alt="البطاقة الوطنية" 
              className="relative w-full h-auto rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 object-cover"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
