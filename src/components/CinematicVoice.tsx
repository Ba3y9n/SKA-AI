import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const CinematicVoice: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const typographyX = useTransform(scrollYProgress, [0.3, 0.8], ['-15%', '15%']);
  const typographyXReverse = useTransform(scrollYProgress, [0.3, 0.8], ['15%', '-15%']);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-gradient-to-b from-[#04241a] via-[#064C3B] to-[#032017] text-white overflow-hidden py-36 z-20"
    >
      {/* Saudi Geometric Pattern / Sadu Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#10B981 1px, transparent 1px)`,
          backgroundSize: `32px 32px`,
          backgroundPosition: `0 0, 16px 16px`
        }}
      />

      {/* Decorative Traditional Diamond Motifs */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-48 h-48 border border-gold-light/10 rotate-45 pointer-events-none hidden lg:block" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 border border-gold-light/10 rotate-45 pointer-events-none hidden lg:block" />

      {/* Glowing Ambiance */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-saudi-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. Main Voice Cinematic Heading */}
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        
        {/* Subtle Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-saudi-200 text-sm font-bold mb-8 shadow-inner"
        >
          <span className="w-2 h-2 rounded-full bg-gold-light animate-ping" />
          رِواء تجربة صوتية ورقمية
        </motion.div>

        {/* Cinematic Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-2xl">
            صوتٌ <motion.span 
              animate={{ 
                color: ['#ffffff', '#6ee7b7', '#a7f3d0', '#ffffff'],
                textShadow: ['0 0 20px rgba(16,185,129,0.3)', '0 0 35px rgba(16,185,129,0.7)', '0 0 20px rgba(16,185,129,0.3)']
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              يروي...
            </motion.span>
          </h2>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#6ee7b7] leading-tight tracking-tight drop-shadow-2xl">
            وصوتٌ يُسمع.
          </h2>
        </motion.div>

        {/* Dynamic Voice Waveform Visualization */}
        <div className="mt-14 flex items-center justify-center gap-1.5 md:gap-2 h-28">
          {[...Array(24)].map((_, i) => {
            const isCenter = Math.abs(i - 12) < 5;
            return (
              <motion.div
                key={i}
                className={`w-1 md:w-1.5 rounded-full ${
                  isCenter ? 'bg-gradient-to-t from-gold-light to-teal-200' : 'bg-saudi-500/60'
                }`}
                animate={{
                  height: [
                    `${15 + (i % 6) * 10}%`,
                    `${60 + ((i * 7) % 40)}%`,
                    `${20 + (i % 4) * 15}%`,
                    `${85 + ((i * 3) % 15)}%`,
                    `${25 + (i % 5) * 10}%`,
                  ],
                }}
                transition={{
                  duration: 1.2 + (i % 5) * 0.25,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.05,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Section "فكرة" — Clean, Integrated without extra white cards */}
      <div className="w-full relative pt-28 pb-12 flex flex-col items-center justify-center border-t border-white/10 mt-28">
        
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 px-6 max-w-4xl"
        >
          <span className="text-gold-light text-sm md:text-base font-bold tracking-widest uppercase mb-3 block">
            رؤية المشروع
          </span>
          <h3 className="text-4xl md:text-6xl font-black text-white mb-8 drop-shadow-lg">
            فكرة
          </h3>
          <p className="text-xl md:text-3xl text-saudi-100 font-medium leading-loose md:leading-relaxed">
            رِواء ليست مجرد مساعد افتراضي،<br />
            بل مساحة رقمية تُروى فيها قصص الإنجاز،<br />
            <span className="text-gold-light font-bold">وتُسمع فيها أصوات الطموح.</span>
          </p>
        </motion.div>

        {/* Ambient Moving Typography Behind Text */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-[0.06] pointer-events-none flex flex-col justify-center gap-6 select-none">
          <motion.div style={{ x: typographyX }} className="whitespace-nowrap">
            <span className="text-7xl md:text-9xl font-black text-white uppercase tracking-widest px-6">الهوية • الأثر • الطموح • المستقبل</span>
          </motion.div>
          <motion.div style={{ x: typographyXReverse }} className="whitespace-nowrap">
            <span className="text-7xl md:text-9xl font-black text-gold-light uppercase tracking-widest px-6">كلية الأعمال والاقتصاد • اليوم الوطني 96</span>
          </motion.div>
        </div>
      </div>

    </section>
  );
};
