import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ambition } from '../types/ambition';

interface FutureVisionBoardProps {
  ambitions: Ambition[];
  onOpenAddModal: () => void;
}

export const FutureVisionBoard: React.FC<FutureVisionBoardProps> = ({ ambitions, onOpenAddModal }) => {
  const [activeAmbition, setActiveAmbition] = useState<string | null>(null);

  // Generate random positions for nodes in a scattered orbital layout
  const getRandomPosition = (index: number, total: number) => {
    // Spiral distribution
    const angle = index * 137.5 * (Math.PI / 180);
    const radius = 120 + (index * 15);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <section className="relative w-full py-32 bg-[#0B3D2E] overflow-hidden text-white flex flex-col items-center">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('/sadu_pattern.webp')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F16] via-transparent to-[#0B3D2E]"></div>

      {/* Header */}
      <div className="relative z-20 text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-emerald-50"
        >
          صوتنا يصنع المستقبل
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-emerald-300 font-medium mb-10"
        >
          وش طموحك للسعودية؟
        </motion.p>
      </div>

      {/* Interactive Node System */}
      <div className="relative z-10 w-full max-w-4xl h-[600px] flex items-center justify-center">
        
        {/* Center Action Button */}
        <motion.button
          onClick={onOpenAddModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute z-30 w-32 h-32 rounded-full bg-emerald-500 hover:bg-emerald-400 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-colors border-4 border-[#0B3D2E]"
        >
          <span className="text-3xl mb-1">+</span>
          <span className="text-sm font-bold">أضيفي طموحك</span>
        </motion.button>

        {/* Orbit Lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[300px] h-[300px] rounded-full border border-emerald-400"></div>
          <div className="absolute w-[450px] h-[450px] rounded-full border border-emerald-500/50 border-dashed animate-[spin_60s_linear_infinite]"></div>
        </div>

        {/* Nodes */}
        {ambitions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute z-10 text-emerald-200/50 text-sm font-medium mt-48 text-center"
          >
            كوني من أول الأصوات في جدار المستقبل
          </motion.div>
        ) : (
          ambitions.map((ambition, idx) => {
            const pos = getRandomPosition(idx, ambitions.length);
            const isActive = activeAmbition === ambition.id;
            
            return (
              <motion.div
                key={ambition.id}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, type: "spring" }}
                className="absolute z-20 flex justify-center items-center"
                style={{ 
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                }}
              >
                <div 
                  onClick={() => setActiveAmbition(isActive ? null : ambition.id)}
                  className={`
                    cursor-pointer transition-all duration-300 backdrop-blur-md border 
                    ${isActive 
                      ? 'w-64 p-6 bg-white rounded-3xl text-gray-900 border-emerald-200 shadow-xl shadow-black/20 z-50 fixed inset-0 m-auto h-fit scale-110' 
                      : 'w-16 h-16 rounded-full bg-emerald-800/80 border-emerald-500/50 hover:bg-emerald-600 hover:border-emerald-300 hover:scale-110 flex items-center justify-center'
                    }
                  `}
                >
                  {isActive ? (
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mb-3 inline-block">
                        {ambition.department}
                      </span>
                      <p className="font-medium text-lg leading-relaxed mb-4">"{ambition.text}"</p>
                      {ambition.major && (
                        <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 font-semibold">
                          طالبة - {ambition.major}
                        </div>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveAmbition(null); }}
                        className="mt-4 text-xs text-emerald-600 font-bold underline"
                      >
                        إغلاق
                      </button>
                    </div>
                  ) : (
                    <span className="text-xl text-emerald-200 opacity-70">"</span>
                  )}
                </div>
                
                {/* Connection Line to Center */}
                {!isActive && (
                  <svg className="absolute -z-10 pointer-events-none" style={{ left: 32, top: 32, width: Math.abs(pos.x), height: Math.abs(pos.y), overflow: 'visible' }}>
                    <line x1="0" y1="0" x2={-pos.x} y2={-pos.y} stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
                  </svg>
                )}
              </motion.div>
            );
          })
        )}
        
        {/* Overlay when a node is active */}
        <AnimatePresence>
          {activeAmbition && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveAmbition(null)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm cursor-pointer"
            />
          )}
        </AnimatePresence>
      </div>

    </section>
  );
};
