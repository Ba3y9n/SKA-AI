import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const CinematicVoice: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

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

      {/* Main Content */}
      <motion.div style={{ y: yTransform }} className="max-w-5xl mx-auto px-6 text-center relative z-10">
        
        {/* Subtle Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-saudi-50/10 backdrop-blur-md border border-gold/30 text-gold-light text-sm font-bold mb-10 shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
          تجربة رقمية فريدة
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
            صوتٌ <span className="text-gold-light">يروي...</span>
          </h2>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
            وصوتٌ <span className="text-gold">يُسمع.</span>
          </h2>
        </motion.div>

        {/* Dynamic Voice Waveform Visualization */}
        <div className="mt-16 flex items-center justify-center gap-1.5 md:gap-2 h-32 group cursor-pointer">
          {[...Array(28)].map((_, i) => {
            const isCenter = Math.abs(i - 14) < 6;
            return (
              <motion.div
                key={i}
                className={`w-1.5 md:w-2 rounded-full transition-colors duration-500 ${
                  isCenter ? 'bg-gold group-hover:bg-gold-light' : 'bg-gold/30 group-hover:bg-gold/50'
                }`}
                animate={{
                  height: [
                    `${20 + (i % 5) * 10}%`,
                    `${70 + ((i * 7) % 30)}%`,
                    `${30 + (i % 3) * 15}%`,
                    `${90 + ((i * 5) % 10)}%`,
                    `${25 + (i % 4) * 10}%`,
                  ],
                }}
                transition={{
                  duration: 1.5 + (i % 5) * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.05,
                }}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Idea Section */}
      <div className="w-full relative pt-24 mt-16 flex flex-col items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-saudi-50/5 backdrop-blur-xl border border-gold/20 rounded-[2.5rem] p-10 md:p-14 text-center max-w-4xl mx-4 shadow-2xl card-gold-hover"
        >
          <span className="text-gold-light text-sm md:text-base font-bold tracking-widest uppercase mb-4 block">
            رؤية المشروع
          </span>
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg title-gold-line">
            فكرة
          </h3>
          <p className="text-xl md:text-2xl text-saudi-100 font-medium leading-loose md:leading-relaxed mt-6">
            رِواء ليست مجرد مساعد افتراضي،<br />
            بل مساحة رقمية تُروى فيها قصص الإنجاز،<br />
            <span className="text-gold-light font-bold">وتُسمع فيها أصوات الطموح.</span>
          </p>
        </motion.div>
      </div>

    </section>
  );
};
