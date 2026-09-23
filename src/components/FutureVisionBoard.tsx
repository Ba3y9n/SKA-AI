import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Ambition } from '../types/ambition';
import { Plus } from 'lucide-react';

interface FutureVisionBoardProps {
  ambitions: Ambition[];
  onAddClick: () => void;
}

export const FutureVisionBoard: React.FC<FutureVisionBoardProps> = ({ ambitions, onAddClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={containerRef} className="relative w-full py-40 bg-[#020804] overflow-hidden z-20">
      
      {/* Dark Parallax Background */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-40"
        style={{ y: bgY }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a2e1c_0%,_transparent_100%)]" />
      </motion.div>

      {/* Header */}
      <div className="relative z-10 text-center px-6 mb-24 max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-xl"
        >
          صوتنا يصنع <span className="text-emerald-400">المستقبل</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-3xl text-gray-300 font-medium mb-12"
        >
          وش طموحك للسعودية؟
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onClick={onAddClick}
          className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg md:text-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:-translate-y-1"
        >
          <Plus className="w-6 h-6" />
          أضف طموحك
        </motion.button>
      </div>

      {/* Floating Constellation Wall */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 min-h-[600px]">
        {ambitions.length === 0 ? (
          <div className="text-center text-gray-500 font-bold mt-20">كوني أول من يشارك طموحه...</div>
        ) : (
          <div className="relative w-full h-full flex flex-wrap justify-center gap-6 mt-10">
            {ambitions.map((ambition, i) => {
              // Random float animations for constellation effect
              const duration = 4 + (i % 4);
              const delay = i * 0.2;
              
              return (
                <motion.div
                  key={ambition.id}
                  animate={{
                    y: [0, -15, 0],
                    x: [0, (i % 2 === 0 ? 10 : -10), 0]
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay
                  }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl w-[280px] md:w-[320px] hover:bg-white/10 hover:border-emerald-500/50 transition-colors"
                >
                  <p className="text-emerald-50 font-medium text-lg leading-relaxed mb-6">
                    "{ambition.text}"
                  </p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-sm font-bold text-emerald-400">{ambition.name || ambition.department || 'صوت طموح'}</span>
                    <span className="text-xs text-gray-500">{ambition.role || 'مشاركة'}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </section>
  );
};
