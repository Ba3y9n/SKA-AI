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
  const yTransform = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-saudi-700 text-saudi-50 overflow-hidden py-32 z-20"
    >
      {/* Sleek Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-saudi-700 via-[#0a2f22] to-saudi-700" />
      
      {/* Subtle Central Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Ambient Moving Typography Behind Text */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-[0.08] pointer-events-none flex flex-col justify-center gap-16 select-none">
        <motion.div style={{ x: typographyX }} className="whitespace-nowrap">
          <span className="text-8xl md:text-[12rem] font-black text-white uppercase tracking-widest px-6">الهوية • الأثر • الطموح • المستقبل</span>
        </motion.div>
        <motion.div style={{ x: typographyXReverse }} className="whitespace-nowrap">
          <span className="text-8xl md:text-[12rem] font-black text-gold-light uppercase tracking-widest px-6">كلية الأعمال والاقتصاد • اليوم الوطني 96</span>
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div style={{ y: yTransform }} className="max-w-5xl mx-auto px-6 text-center relative z-10">
        


        {/* Cinematic Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-2xl">
            صوتٌ <span className="text-gold-light">يروي...</span>
          </h2>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
            وصوتٌ <span className="text-gold">يُسمع.</span>
          </h2>
        </motion.div>

        {/* Dynamic Voice Waveform Visualization (Wide & Long) */}
        <div className="mt-16 flex items-center justify-center gap-1 md:gap-1.5 h-32 group cursor-pointer mb-20 w-full max-w-6xl mx-auto overflow-hidden px-4">
          {[...Array(90)].map((_, i) => {
            const isCenter = Math.abs(i - 45) < 15;
            return (
              <motion.div
                key={i}
                className={`w-1.5 md:w-2 rounded-full transition-colors duration-500 ${
                  isCenter ? 'bg-gold group-hover:bg-gold-light' : 'bg-gold/30 group-hover:bg-gold/60'
                }`}
                animate={{
                  height: [
                    `${10 + (i % 7) * 10}%`,
                    `${60 + ((i * 11) % 40)}%`,
                    `${20 + (i % 4) * 15}%`,
                    `${90 + ((i * 3) % 10)}%`,
                    `${15 + (i % 5) * 15}%`,
                  ],
                }}
                transition={{
                  duration: 1.5 + (i % 7) * 0.15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.02,
                }}
              />
            );
          })}
        </div>

        {/* Poem Section - Pure Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto flex flex-col items-center"
        >
          <span className="text-gold-light text-lg md:text-xl font-bold tracking-widest mb-6 block">
            قصيدة وطن
          </span>
          
          <h3 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg leading-tight">
            وطني الحبيبُ وهل أُحِبُّ سِواهُ؟
          </h3>
          
          {/* Thick, Clear Gold Line */}
          <div className="w-48 md:w-64 h-2 bg-gradient-to-r from-transparent via-gold to-transparent mb-10 rounded-full" />
          
          <p className="text-2xl md:text-4xl text-saudi-100 font-medium leading-[2] md:leading-[2]">
            روحي وما مـَلَكَتْ يداي فـِداهُ،<br />
            وطني الذي قد عِشْتُ تحتَ سَمائِهِ،<br />
            <span className="text-gold-light font-black mt-4 block text-3xl md:text-5xl drop-shadow-md">وهوَ الذي قد عِشْتُ فـَوْقَ ثَراهُ.</span>
          </p>
        </motion.div>
      </motion.div>

    </section>
  );
};
