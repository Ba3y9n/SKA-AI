import React from 'react';
import { motion, Variants } from 'framer-motion';

export const ScrollQuote: React.FC = () => {
  const quote = "عزّنا برؤيتنا، وشجاعتنا، وهمتنا، وأصالتنا، وكرمنا، وجودنا.. 96 عاماً من المجد والتاريخ والشموخ. دمت يا وطني عزيزاً شامخاً، ودام عزك بطبعك الأصيل الذي لا يتغير!";
  
  // Split into words for staggered animation
  const words = quote.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const child: Variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
    },
  };

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-[#e8f5e9] overflow-hidden px-4 py-20 z-10">
      
      {/* Background Watermark */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.03, scale: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <img src="/nd96_logo.webp" alt="" className="w-[80vw] max-w-[800px] object-contain rotate-6" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-relaxed sm:leading-relaxed text-[#0B3D2E] flex flex-wrap justify-center gap-x-3 gap-y-4">
          {words.map((word, index) => (
            <motion.span 
              key={index} 
              variants={child}
              className={`${word.includes("96") ? 'text-emerald-500 font-black' : ''}`}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Decorative Line bridging to Rewaa */}
      <motion.div 
        initial={{ height: 0 }}
        whileInView={{ height: 120 }}
        viewport={{ once: false }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-emerald-600 to-transparent"
      />
    </section>
  );
};
