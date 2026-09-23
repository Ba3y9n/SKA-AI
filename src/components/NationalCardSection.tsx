import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const NationalCardSection: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0.3, 0.6], [100, -100]);

  return (
    <section className="relative w-full py-32 bg-[#F8FBF8] overflow-hidden z-20">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Massive Text Side */}
        <div className="flex-1 text-right z-10">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h3 className="text-2xl md:text-3xl text-[#008F68] font-bold mb-6 tracking-wide uppercase">
              اليوم الوطني السعودي 96
            </h3>
            <h2 className="text-5xl md:text-7xl font-black text-[#064C3B] leading-tight mb-8">
              عزّنا برؤيتنا،<br />
              وهمّتنا،<br />
              <span className="text-[#008F68]">وأصالتنا التي لا تتغير.</span>
            </h2>
            <p className="text-xl text-gray-600 font-medium leading-relaxed max-w-lg">
              قصة تُروى عبر الأجيال، حيث يلتقي عمق التاريخ بطموح المستقبل، لنرسم معاً لوحة وطن لا يعرف المستحيل.
            </p>
          </motion.div>
        </div>

        {/* Large Image Side (No white card behind it, just the image itself beautifully integrated) */}
        <div className="flex-1 w-full relative h-[600px] lg:h-[800px] rounded-[3rem] overflow-hidden shadow-2xl">
          <motion.div 
            className="absolute inset-0 w-full h-[120%]"
            style={{ y }}
          >
            <img 
              src="/media_1790129786646.jpg" 
              alt="اليوم الوطني" 
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
          {/* Subtle inner gradient to blend edges if needed */}
          <div className="absolute inset-0 border-[8px] border-[#F8FBF8] rounded-[3rem] pointer-events-none" />
        </div>

      </div>
    </section>
  );
};
