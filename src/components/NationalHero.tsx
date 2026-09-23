import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RewaaLogo } from './RewaaLogo';

export const NationalHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Animations tied to scroll
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.5, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

  return (
    <section ref={containerRef} className="relative w-full h-[100vh] sm:h-[120vh] overflow-hidden bg-[#0A1F16]">
      
      {/* Sticky Header inside Hero */}
      <motion.header 
        className="absolute top-0 inset-x-0 z-50 flex justify-between items-center px-6 py-6"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
      >
        <div className="flex items-center gap-3 text-white">
          <RewaaLogo className="w-10 h-10" />
          <h1 className="text-xl font-bold tracking-widest hidden sm:block">رِواء</h1>
        </div>
        <img src="/nd96_logo.webp" alt="96" className="h-10 opacity-90 drop-shadow-lg" />
      </motion.header>

      {/* Immersive Image */}
      <motion.div 
        className="absolute inset-0 z-0 origin-top"
        style={{ scale, opacity, y }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0A1F16]/90 z-10" />
        <img 
          src="/national_hero.jpg" 
          alt="عزنا بطبعنا - اليوم الوطني 96" 
          className="w-full h-full object-cover object-top"
        />
      </motion.div>

      {/* Transition Overlay (Dark Green that morphes into the next section) */}
      <motion.div 
        className="absolute inset-0 z-20 bg-gradient-to-b from-transparent to-[#e8f5e9]"
        style={{ opacity: overlayOpacity }}
      />
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 inset-x-0 z-30 flex flex-col items-center text-white/70"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
      >
        <span className="text-xs uppercase tracking-widest mb-2 font-medium">اكتشف</span>
        <div className="w-px h-12 bg-white/30 overflow-hidden relative">
          <motion.div 
            className="w-full h-1/2 bg-white absolute top-0"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>

    </section>
  );
};
