import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const CinematicVoice: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const typographyX = useTransform(scrollYProgress, [0.3, 0.7], ['-20%', '20%']);
  const typographyXReverse = useTransform(scrollYProgress, [0.3, 0.7], ['20%', '-20%']);

  return (
    <section ref={containerRef} className="relative w-full bg-[#EEF8F2] overflow-hidden py-32 z-20 border-t border-emerald-100/50">
      
      {/* 1. Voice Section */}
      <div className="max-w-5xl mx-auto px-6 text-center mb-40 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-7xl md:text-9xl font-black text-emerald-900/5 tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none">
            صوت
          </h2>
          <div className="relative z-10">
            <h3 className="text-4xl md:text-6xl font-black text-[#008F68] mb-6">صوت يروي...</h3>
            <h3 className="text-4xl md:text-6xl font-black text-[#064C3B]">وصوت يُسمع.</h3>
          </div>
        </motion.div>

        {/* Abstract Waveform Animation */}
        <div className="mt-20 flex items-center justify-center gap-1.5 h-32 opacity-80">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 sm:w-2 bg-[#008F68] rounded-full"
              animate={{
                height: ['20%', '80%', '40%', '100%', '30%', '20%'],
              }}
              transition={{
                duration: 1.5 + Math.random() * 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random(),
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. Idea Section */}
      <div className="w-full relative py-20 flex flex-col items-center justify-center mt-20">
        <h2 className="text-4xl md:text-6xl font-black text-[#006C4F] mb-12">فكرة</h2>
        <div className="max-w-3xl px-6 text-center z-10 relative">
          <p className="text-xl md:text-3xl text-gray-700 font-medium leading-loose">
            رِواء تجربة رقمية تستمع إلى أصوات الجيل السعودي،<br/>
            وتجمع بين الذكاء الاصطناعي،<br/>
            والهوية، والإنجاز، والطموح.
          </p>
        </div>

        {/* Moving Typography Background */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-10 pointer-events-none flex flex-col justify-center gap-8">
          <motion.div style={{ x: typographyX }} className="whitespace-nowrap">
            <span className="text-7xl md:text-9xl font-black text-emerald-800 uppercase tracking-widest px-4">الهوية الهوية الهوية الهوية</span>
          </motion.div>
          <motion.div style={{ x: typographyXReverse }} className="whitespace-nowrap">
            <span className="text-7xl md:text-9xl font-black text-emerald-600 uppercase tracking-widest px-4">الأثر الأثر الأثر الأثر الأثر</span>
          </motion.div>
          <motion.div style={{ x: typographyX }} className="whitespace-nowrap">
            <span className="text-7xl md:text-9xl font-black text-emerald-800 uppercase tracking-widest px-4">الطموح الطموح الطموح الطموح</span>
          </motion.div>
          <motion.div style={{ x: typographyXReverse }} className="whitespace-nowrap">
            <span className="text-7xl md:text-9xl font-black text-emerald-600 uppercase tracking-widest px-4">المستقبل المستقبل المستقبل</span>
          </motion.div>
        </div>
      </div>

    </section>
  );
};
