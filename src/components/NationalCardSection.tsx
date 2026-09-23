import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const NationalCardSection: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.4]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-gradient-to-b from-white via-emerald-50/40 to-white overflow-hidden"
    >
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] rounded-full border border-emerald-400 border-dashed animate-[spin_80s_linear_infinite]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        
        {/* Section Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm font-bold tracking-wide mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          الهوية الوطنية السعودية 96
        </motion.div>

        {/* National Card Showcase */}
        <motion.div 
          style={{ scale, opacity }}
          className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/15 border border-emerald-200/60 bg-gradient-to-br from-[#0B3D2E] via-[#0D4A38] to-[#06241A] p-1 sm:p-2"
        >
          {/* Card Inner Container */}
          <div className="relative w-full rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
            
            {/* National Card Image (Asset) with Graceful Fallback */}
            <img 
              src="/national_card.webp" 
              onError={(e) => {
                // If specific national_card.webp isn't yet in place, fallback to the official 96 visual hero
                (e.target as HTMLImageElement).src = '/national_hero.jpg';
              }}
              alt="بطاقة الهوية الوطنية 96" 
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />

            {/* Gradient Overlay for Card Typography */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-10 text-right">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs sm:text-sm font-bold text-emerald-300 tracking-wider mb-1"
              >
                اليوم الوطني السعودي 96
              </motion.span>
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white leading-snug drop-shadow"
              >
                عزّنا برؤيتنا، وهمتنا، وأصالتنا التي لا تتغير
              </motion.h3>
            </div>
          </div>
        </motion.div>

        {/* Visual Transition Indicator linking to the Story */}
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          whileInView={{ opacity: 1, height: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-px bg-gradient-to-b from-emerald-500 via-emerald-300 to-transparent mt-12 mb-2"
        />

      </div>
    </section>
  );
};
