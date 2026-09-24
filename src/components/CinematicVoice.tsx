import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Sparkles } from 'lucide-react';

export const CinematicVoice: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlayingPoem, setIsPlayingPoem] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const typographyX = useTransform(scrollYProgress, [0.3, 0.8], ['-15%', '15%']);
  const typographyXReverse = useTransform(scrollYProgress, [0.3, 0.8], ['15%', '-15%']);
  const yTransform = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Synchronized Poem lines highlight progression
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingPoem) {
      timer = setInterval(() => {
        setActiveLineIndex((prev) => (prev + 1) % 4);
      }, 3500);
    } else {
      setActiveLineIndex(0);
    }
    return () => clearInterval(timer);
  }, [isPlayingPoem]);

  const togglePlayPoem = () => {
    setIsPlayingPoem(!isPlayingPoem);
  };

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
          className="relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saudi-50/10 border border-gold/30 text-gold-light text-sm font-bold mb-6 shadow-md">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>تجربة صوتية تفاعلية</span>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-2xl">
            صوتٌ <span className="text-gold-light">يروي...</span>
          </h2>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
            وصوتٌ <span className="text-gold">يُسمع.</span>
          </h2>
        </motion.div>

        {/* Dynamic Voice Waveform Visualization */}
        <div className="mt-14 flex items-center justify-center gap-1 md:gap-1.5 h-28 group cursor-pointer mb-12 w-full max-w-5xl mx-auto overflow-hidden px-4">
          {[...Array(70)].map((_, i) => {
            const isCenter = Math.abs(i - 35) < 15;
            return (
              <motion.div
                key={i}
                className={`w-1.5 md:w-2 rounded-full transition-colors duration-500 ${
                  isPlayingPoem 
                    ? isCenter ? 'bg-gold shadow-[0_0_12px_rgba(201,162,39,0.8)]' : 'bg-gold-light/60'
                    : isCenter ? 'bg-gold/60 group-hover:bg-gold-light' : 'bg-gold/25 group-hover:bg-gold/50'
                }`}
                animate={{
                  height: isPlayingPoem
                    ? [
                        `${15 + ((i * 7) % 65)}%`,
                        `${90 - ((i * 5) % 50)}%`,
                        `${30 + ((i * 11) % 60)}%`,
                        `${85 - ((i * 3) % 40)}%`,
                        `${20 + ((i * 4) % 50)}%`,
                      ]
                    : [
                        `${10 + (i % 7) * 10}%`,
                        `${50 + ((i * 11) % 35)}%`,
                        `${20 + (i % 4) * 15}%`,
                        `${65 + ((i * 3) % 10)}%`,
                        `${15 + (i % 5) * 15}%`,
                      ],
                }}
                transition={{
                  duration: isPlayingPoem ? 0.8 + (i % 5) * 0.1 : 1.6 + (i % 7) * 0.15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.015,
                }}
              />
            );
          })}
        </div>

        {/* Interactive Play Button */}
        <div className="flex justify-center mb-16">
          <button
            onClick={togglePlayPoem}
            className={`inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-base transition-all duration-300 shadow-xl ${
              isPlayingPoem
                ? 'bg-gold text-saudi-800 shadow-[0_0_30px_rgba(201,162,39,0.5)] scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white border border-gold/40 hover:border-gold'
            }`}
          >
            {isPlayingPoem ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            <span>{isPlayingPoem ? 'إيقاف اللحن الوطني' : 'استمع إلى اللحن الوطني'}</span>
          </button>
        </div>

        {/* Poem Section - Synchronized Line Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto flex flex-col items-center bg-saudi-800/40 p-8 sm:p-12 rounded-[2.5rem] border border-gold/20 backdrop-blur-md shadow-2xl"
        >
          <span className="text-gold-light text-sm sm:text-base font-bold tracking-widest mb-4 block">
            قصيدة وطن • كلية الأعمال والاقتصاد
          </span>
          
          <h3 className={`text-3xl sm:text-5xl font-black mb-6 transition-all duration-700 ${
            activeLineIndex === 0 && isPlayingPoem ? 'text-gold-light scale-105 drop-shadow-[0_0_20px_rgba(201,162,39,0.5)]' : 'text-white'
          }`}>
            {poemLines[0]}
          </h3>
          
          {/* Thick, Clear Gold Line */}
          <div className="w-40 sm:w-60 h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent mb-8 rounded-full" />
          
          <div className="space-y-4 text-xl sm:text-3xl font-medium leading-relaxed">
            <p className={`transition-all duration-700 ${
              activeLineIndex === 1 && isPlayingPoem ? 'text-gold-light font-bold scale-105 drop-shadow-md' : 'text-saudi-100'
            }`}>
              {poemLines[1]}
            </p>
            <p className={`transition-all duration-700 ${
              activeLineIndex === 2 && isPlayingPoem ? 'text-gold-light font-bold scale-105 drop-shadow-md' : 'text-saudi-100'
            }`}>
              {poemLines[2]}
            </p>
            <p className={`transition-all duration-700 text-2xl sm:text-4xl font-black pt-3 ${
              activeLineIndex === 3 && isPlayingPoem ? 'text-gold scale-105 drop-shadow-[0_0_25px_rgba(201,162,39,0.7)]' : 'text-gold-light'
            }`}>
              {poemLines[3]}
            </p>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
};
