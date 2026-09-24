import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export const CinematicHero: React.FC = () => {
  const [heroImage, setHeroImage] = useState<string>('/national_hero.jpg');

  useEffect(() => {
    const savedImage = localStorage.getItem('custom_hero_image');
    if (savedImage) {
      setHeroImage(savedImage);
    }
  }, []);

  // Mouse Parallax Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 100 });

  const bgX = useTransform(smoothX, [-0.5, 0.5], ['20px', '-20px']);
  const bgY = useTransform(smoothY, [-0.5, 0.5], ['20px', '-20px']);
  const titleX = useTransform(smoothX, [-0.5, 0.5], ['-15px', '15px']);
  const titleY = useTransform(smoothY, [-0.5, 0.5], ['-15px', '15px']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const titleText = "اكتشف الحكاية";

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative w-full h-[calc(100vh-80px)] min-h-[640px] overflow-hidden bg-saudi-900 select-none"
    >
      {/* 1. Cinematic Premium Reveal (Dark Green to Transparent with Gold Glow) */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="absolute inset-0 z-50 bg-[#001f0f] pointer-events-none flex items-center justify-center"
      >
        {/* Subtle gold glow in the center that expands and fades */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="w-full h-full max-w-4xl bg-[radial-gradient(circle_at_center,_rgba(201,162,39,0.4)_0%,_transparent_70%)]"
        />
      </motion.div>

      {/* 2. Opening Golden Particles Scattering */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden"
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`gold-spark-${i}`}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 1.5, 0], 
              x: (Math.random() - 0.5) * 800, 
              y: (Math.random() - 0.5) * 800,
              opacity: [1, 1, 0]
            }}
            transition={{ duration: 2 + Math.random() * 1.5, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full bg-gold shadow-[0_0_15px_rgba(201,162,39,1)] blur-[1px]"
          />
        ))}
      </motion.div>

      {/* Dynamic Background Image with Smooth Depth & Zoom */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        initial={{ scale: 1.2, opacity: 0, filter: 'blur(20px)' }}
        animate={{ scale: [1.2, 1.05, 1.08], opacity: 1, filter: 'blur(0px)' }}
        transition={{ 
          opacity: { duration: 2.5, ease: "easeOut" },
          filter: { duration: 2.5, ease: "easeOut" },
          scale: { duration: 25, repeat: Infinity, ease: "linear" } 
        }}
        className="absolute inset-0 z-0 origin-center"
      >
        <img 
          src={heroImage} 
          alt="Hero" 
          className="w-full h-full object-cover object-center pointer-events-none"
        />
      </motion.div>

      {/* Atmospheric Soft Radiant Gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-saudi-100 via-saudi-100/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-radial-gradient from-transparent via-transparent to-black/20 pointer-events-none" />

      {/* Interactive Title & Subtitle with Parallax and Letter Reveal */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-12 sm:pb-16 z-20 px-4 text-center">
        <motion.div 
          style={{ x: titleX, y: titleY }}
          className="cursor-pointer group flex flex-col items-center max-w-4xl"
          onClick={() => {
            const nextSection = document.getElementById('identity-section') || document.getElementById('rewaa-ai');
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
            }
          }}
        >
          {/* Unified Cinematic Title Reveal */}
          <motion.h1 
            initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-saudi-700 mb-4 tracking-tight drop-shadow-md text-center"
          >
            اكتشف الحكاية
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className="text-base sm:text-lg md:text-xl font-bold text-saudi-600 max-w-2xl leading-relaxed mb-6 px-4 drop-shadow-sm"
          >
            رحلة رقمية تروي هوية وطنية، أصواتًا، وإنجازات من كلية الأعمال والاقتصاد
          </motion.p>

          {/* Animated Scroll Indicator Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            whileHover={{ scale: 1.15 }}
            className="relative flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-gold/40 text-saudi-700 flex items-center justify-center shadow-[0_4px_25px_rgba(201,162,39,0.3)] group-hover:bg-gold transition-all duration-300">
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-saudi-700 group-hover:text-white transition-colors" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={3}
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </motion.svg>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
