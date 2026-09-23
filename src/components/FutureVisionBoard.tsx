import React from 'react';
import { motion } from 'framer-motion';
import { Ambition } from '../types/ambition';
import { Plus } from 'lucide-react';

interface FutureVisionBoardProps {
  ambitions: Ambition[];
  onAddClick: () => void;
}

export const FutureVisionBoard: React.FC<FutureVisionBoardProps> = ({ ambitions, onAddClick }) => {
  return (
    <section className="relative w-full py-40 bg-[#006C4F] overflow-hidden z-20">
      
      {/* Background Rings */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full border border-white/5 absolute" />
        <div className="w-[1200px] h-[1200px] rounded-full border border-white/5 absolute" />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center px-6 mb-24 max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-md"
        >
          صوتنا يصنع <span className="text-[#DDF5EA]">المستقبل</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-3xl text-emerald-100 font-medium mb-12"
        >
          وش طموحك للسعودية؟
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onClick={onAddClick}
          className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-[#006C4F] font-black text-lg md:text-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          <Plus className="w-6 h-6" />
          أضف طموحك
        </motion.button>
      </div>

      {/* Floating Constellation Wall */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 min-h-[600px]">
        {ambitions.length === 0 ? (
          <div className="text-center text-emerald-200/50 font-bold mt-20">كوني أول من يشارك طموحه...</div>
        ) : (
          <div className="relative w-full h-full flex flex-wrap justify-center gap-6 mt-10">
            {ambitions.map((ambition, i) => {
              const duration = 4 + (i % 4);
              const delay = i * 0.2;
              
              return (
                <motion.div
                  key={ambition.id}
                  animate={{
                    y: [0, -10, 0],
                    x: [0, (i % 2 === 0 ? 5 : -5), 0]
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay
                  }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl w-[280px] md:w-[320px] hover:bg-white/20 transition-colors shadow-lg"
                >
                  <p className="text-white font-medium text-lg leading-relaxed mb-6">
                    "{ambition.text}"
                  </p>
                  <div className="flex items-center justify-between border-t border-white/20 pt-4">
                    <span className="text-sm font-bold text-[#DDF5EA]">{ambition.name || ambition.department || 'صوت طموح'}</span>
                    <span className="text-xs text-emerald-200">{ambition.role || 'مشاركة'}</span>
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
