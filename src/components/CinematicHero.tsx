import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RewaaLogo } from './RewaaLogo';
import { Mic } from 'lucide-react';

interface CinematicHeroProps {
  onTalk: () => void;
  isListening: boolean;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ onTalk, isListening }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Hero Image Fades and Parallax
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], ['0%', '10%']);
  
  // Rewaa Character Reveal
  const rewaaOpacity = useTransform(scrollYProgress, [0.15, 0.3, 0.45], [0, 1, 1]);
  const rewaaScale = useTransform(scrollYProgress, [0.15, 0.3, 0.6], [0.8, 1, 1.05]);
  const rewaaY = useTransform(scrollYProgress, [0.2, 0.3, 0.6], ['20%', '0%', '-5%']);
  
  // Text Reveal
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.3, 0.4], ['20px', '0px']);

  return (
    <section ref={containerRef} className="relative w-full h-[250vh] bg-[#05110a]">
      
      {/* Sticky Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Layer 1: National Hero Image (Fades out) */}
        <motion.div 
          className="absolute inset-0 z-0 origin-top"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#05110a]/40 via-[#05110a]/20 to-[#05110a] z-10" />
          <img 
            src="/national_hero.jpg" 
            alt="Hero" 
            className="w-full h-full object-cover object-top"
          />
        </motion.div>

        {/* Hero Header overlay (Fades out) */}
        <motion.div 
          className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
          style={{ opacity: heroOpacity }}
        >
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">رِواء</h1>
            <p className="text-xl md:text-3xl text-emerald-300 font-bold mb-4 drop-shadow-lg">صوت الجيل السعودي الرقمي</p>
            <p className="text-lg text-gray-300 font-medium tracking-wide">من حكاية الأمس إلى طموح الغد.</p>
          </div>
          
          <div className="absolute bottom-12 flex flex-col items-center animate-bounce opacity-80">
            <span className="text-xs text-white uppercase tracking-[0.3em] mb-2 font-medium">اكتشف الحكاية</span>
            <div className="w-px h-8 bg-white/50" />
          </div>
        </motion.div>

        {/* Layer 2: Deep Green Transition with Particles */}
        <div className="absolute inset-0 z-0 bg-[#05110a] pointer-events-none" style={{ opacity: 1 }} />
        
        {/* Layer 3: Rewaa Intro */}
        <motion.div 
          className="absolute inset-0 z-20 flex flex-col items-center justify-center"
          style={{ opacity: rewaaOpacity, scale: rewaaScale, y: rewaaY }}
        >
          {/* Animated Glow Rings behind Avatar */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-emerald-900/30 rounded-full blur-[100px] animate-pulse" />
          
          <img 
            src="/rewaa_avatar_real_transparent.png" 
            alt="رِواء" 
            className="relative z-10 w-64 md:w-[400px] object-contain drop-shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-[floating_6s_ease-in-out_infinite]"
          />
        </motion.div>

        {/* Rewaa Text & Mic Button */}
        <motion.div 
          className="absolute bottom-20 inset-x-0 z-30 flex flex-col items-center text-center px-4"
          style={{ opacity: textOpacity, y: textY }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-2">أنا <span className="text-emerald-400">رِواء</span></h2>
          <p className="text-xl text-emerald-100/80 font-bold mb-6">صوت الجيل السعودي الرقمي</p>
          <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
            لست مجرد مساعد افتراضي، <br />
            بل راوية رقمية لحكاية وطن، وأصوات جيل يصنع مستقبله.
          </p>

          <button 
            onClick={onTalk}
            className={`group relative flex items-center gap-4 px-10 py-5 rounded-full bg-emerald-900/40 border border-emerald-500/30 backdrop-blur-md hover:bg-emerald-800/60 hover:border-emerald-400 transition-all duration-300 ${isListening ? 'shadow-[0_0_40px_rgba(16,185,129,0.5)] scale-105' : ''}`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500 text-white'}`}>
              <Mic className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              {isListening ? 'جاري الاستماع...' : 'تحدث مع رِواء'}
            </span>
          </button>
        </motion.div>

      </div>
    </section>
  );
};
