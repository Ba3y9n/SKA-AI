import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const CinematicVoice: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const typographyX = useTransform(scrollYProgress, [0.3, 0.8], ['-15%', '15%']);
  const typographyXReverse = useTransform(scrollYProgress, [0.3, 0.8], ['15%', '-15%']);
  const yTransform = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Synchronized Karaoke-style Poem lines highlight progression
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLineIndex((prev) => (prev + 1) % 4);
    }, 4000); // 4 seconds per line
    return () => clearInterval(timer);
  }, []);

  const poemLines = [
    "وطني الحبيبُ وهل أُحِبُّ سِواهُ؟",
    "روحي وما مـَلَكَتْ يداي فـِداهُ،",
    "وطني الذي قد عِشْتُ تحتَ سَمائِهِ،",
    "وهوَ الذي قد عِشْتُ فـَوْقَ ثَراهُ."
  ];

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-saudi-700 text-saudi-50 overflow-hidden py-32 z-20"
      id="cinematic-voice"
    >
      {/* Sleek Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-saudi-700 via-[#093324] to-saudi-700" />
      
      {/* Subtle Central Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Ambient Moving Typography Behind Text */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-[0.06] pointer-events-none flex flex-col justify-center gap-16 select-none">
        <motion.div style={{ x: typographyX }} className="whitespace-nowrap">
          <span className="text-8xl md:text-[12rem] font-black text-white uppercase tracking-widest px-6">الهوية • الأثر • الطموح • المستقبل</span>
        </motion.div>
        <motion.div style={{ x: typographyXReverse }} className="whitespace-nowrap">
          <span className="text-8xl md:text-[12rem] font-black text-gold-light uppercase tracking-widest px-6">كلية الأعمال والاقتصاد • اليوم الوطني 96</span>
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div style={{ y: yTransform }} className="max-w-5xl mx-auto px-6 text-center relative z-10">
        
        {/* Cinematic Section Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saudi-50/10 border border-gold/30 text-gold-light text-sm font-bold mb-6 shadow-md">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>اقرأ الحكاية بصوت الوطن</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-2xl">
            صوتٌ يروي... <span className="text-gold">وأثرٌ يبقى.</span>
          </h2>

          <p className="text-lg sm:text-xl font-medium text-saudi-100 max-w-2xl mx-auto">
            قصيدة وطنية تحمل مشاعر الانتماء والاعتزاز بالهوية السعودية
          </p>
        </motion.div>

        {/* Dynamic Voice Waveform Visualization (Fake reactive waveform) */}
        <div className="flex items-center justify-center gap-1 md:gap-1.5 h-28 mb-12 w-full max-w-5xl mx-auto overflow-hidden px-4 opacity-80">
          {[...Array(60)].map((_, i) => {
            const isCenter = Math.abs(i - 30) < 15;
            // Waveform height changes slightly based on the activeLineIndex to simulate speaking
            const baseHeight = isCenter ? 40 : 15;
            const dynamicMultiplier = (activeLineIndex + 1) * 0.2 + 0.8;
            
            return (
              <motion.div
                key={i}
                className={`w-1.5 md:w-2 rounded-full transition-colors duration-500 ${
                  isCenter ? 'bg-gold shadow-[0_0_12px_rgba(201,162,39,0.5)]' : 'bg-gold-light/40'
                }`}
                animate={{
                  height: [
                    `${baseHeight + ((i * 7) % 30) * dynamicMultiplier}%`,
                    `${baseHeight + 40 - ((i * 5) % 20) * dynamicMultiplier}%`,
                    `${baseHeight + 10 + ((i * 11) % 40) * dynamicMultiplier}%`,
                    `${baseHeight + 35 - ((i * 3) % 25) * dynamicMultiplier}%`,
                  ]
                }}
                transition={{
                  duration: 1.2 + (i % 5) * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.02,
                }}
              />
            );
          })}
        </div>

        {/* Poem Section - Synchronized Line Highlights (Karaoke Style) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto flex flex-col items-center bg-white/5 p-8 sm:p-14 rounded-[2.5rem] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-gold/30 transition-all duration-700"
        >
          {/* Internal Glow on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="space-y-6 sm:space-y-8 text-xl sm:text-3xl lg:text-4xl font-medium leading-relaxed w-full z-10">
            {poemLines.map((line, idx) => {
              const isActive = activeLineIndex === idx;
              return (
                <motion.p
                  key={idx}
                  className={`transition-all duration-1000 ease-out ${
                    isActive 
                      ? 'text-gold-light font-black scale-105 sm:scale-110 drop-shadow-[0_0_25px_rgba(201,162,39,0.8)]' 
                      : 'text-saudi-100/50 scale-95 blur-[1px]'
                  }`}
                  layout
                >
                  {line}
                </motion.p>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
};
