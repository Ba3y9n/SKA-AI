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
      className="relative w-full h-[calc(100vh-80px)] min-h-[640px] overflow-hidden bg-white select-none"
    >
      {/* Dynamic Background Image with Smooth Depth & Zoom */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        initial={{ scale: 1.08 }}
        animate={{ scale: [1.08, 1.02, 1.08] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
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
      <div className="absolute inset-0 z-10 bg-radial-gradient from-transparent via-transparent to-black/15 pointer-events-none" />

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
          {/* Letter Reveal Title */}
          <motion.h1 
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-saudi-700 mb-4 tracking-tight drop-shadow-sm flex items-center justify-center gap-1 sm:gap-2 flex-wrap"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.2
                }
              }
            }}
          >
            {titleText.split('').map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 25, filter: 'blur(8px)' },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    filter: 'blur(0px)',
                    transition: { duration: 0.6, ease: "easeOut" }
                  }
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl font-bold text-saudi-600 max-w-2xl leading-relaxed mb-6 px-4"
          >
            رحلة رقمية تروي هوية وطنية، أصواتًا، وإنجازات من كلية الأعمال والاقتصاد
          </motion.p>

          {/* Animated Scroll Indicator Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            whileHover={{ scale: 1.15 }}
            className="relative flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-gold text-saudi-700 flex items-center justify-center shadow-[0_4px_25px_rgba(201,162,39,0.4)] group-hover:bg-gold-light transition-all duration-300">
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-white" 
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
