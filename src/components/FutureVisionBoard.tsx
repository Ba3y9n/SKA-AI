import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ambition } from '../types/ambition';
import { Sparkles, Plus, Quote, X } from 'lucide-react';

interface FutureVisionBoardProps {
  ambitions: Ambition[];
  onOpenAddModal: () => void;
}

export const FutureVisionBoard: React.FC<FutureVisionBoardProps> = ({ ambitions, onOpenAddModal }) => {
  const [selectedAmbition, setSelectedAmbition] = useState<Ambition | null>(null);

  return (
    <section className="relative w-full py-28 sm:py-36 bg-[#0B3D2E] overflow-hidden text-white flex flex-col items-center">
      
      {/* Sadu Pattern Texture with Deep Forest Green Blend */}
      <div 
        className="absolute inset-0 bg-[url('/sadu_pattern.webp')] bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06241a] via-transparent to-[#0B3D2E] pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-20 text-center mb-16 px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs sm:text-sm font-bold mb-4"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>جدار المستقبل</span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4"
        >
          صوتنا يصنع المستقبل
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-2xl text-emerald-200 font-medium mb-8"
        >
          وش طموحك للسعودية؟
        </motion.p>

        {/* Central Add Ambition Button */}
        <motion.button
          onClick={onOpenAddModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-950/50 transition-all border-2 border-emerald-300"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>أضيفي طموحك</span>
        </motion.button>
      </div>

      {/* Ambitions Container (Desktop Grid/Orbit & Mobile Stream) */}
      <div className="relative z-20 w-full max-w-6xl px-4 sm:px-6">
        {ambitions.length === 0 ? (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto py-16 px-8 rounded-3xl bg-white/5 border border-emerald-500/20 backdrop-blur-md text-center flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-4">
              <Quote className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">كوني أول صوت يضيف طموحه</h3>
            <p className="text-sm text-emerald-200/70 mb-6">
              شاركينا رؤيتك وطموحك لمستقبل المملكة ليكون جزءاً من صوت الجيل الرقمي.
            </p>
            <button
              onClick={onOpenAddModal}
              className="px-6 py-2.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition shadow-lg"
            >
              أضيفي طموحك الآن
            </button>
          </motion.div>
        ) : (
          /* Real Ambition Floating Nodes / Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {ambitions.map((ambition, idx) => {
              const isRecent = idx === 0;

              return (
                <motion.div
                  key={ambition.id || `ambition-${idx}`}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 6) * 0.08, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedAmbition(ambition)}
                  className={`relative p-6 sm:p-7 rounded-3xl backdrop-blur-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                    isRecent
                      ? 'bg-gradient-to-br from-emerald-800/80 via-emerald-900/90 to-[#0A2F22]/90 border-emerald-400/80 shadow-2xl shadow-emerald-500/20'
                      : 'bg-white/10 hover:bg-white/15 border-emerald-500/30 hover:border-emerald-400/60 shadow-lg'
                  }`}
                >
                  {/* Subtle Glow Layer */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10" />

                  {/* Header Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      {ambition.department || 'كلية الأعمال والاقتصاد'}
                    </span>
                    {isRecent && (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 tracking-wider">
                        جديد
                      </span>
                    )}
                  </div>

                  {/* Ambition Quote Content */}
                  <div className="my-2">
                    <p className="text-base sm:text-lg font-bold text-white leading-relaxed line-clamp-4 group-hover:text-emerald-100 transition-colors">
                      "{ambition.text}"
                    </p>
                  </div>

                  {/* Footer Info */}
                  <div className="mt-4 pt-4 border-t border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300 font-semibold">
                    <span>
                      {ambition.major ? `طالبة - ${ambition.major}` : 'طالبة طموحة'}
                    </span>
                    <span className="text-emerald-400/60 group-hover:text-emerald-300 transition-colors">
                      عرض التفاصيل &larr;
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expanded Ambition Modal */}
      <AnimatePresence>
        {selectedAmbition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAmbition(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0B3D2E] via-[#093526] to-[#06241a] border border-emerald-400/50 shadow-2xl text-white text-right"
            >
              <button
                onClick={() => setSelectedAmbition(null)}
                className="absolute top-5 left-5 p-2 rounded-full text-emerald-300 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-block px-3.5 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold mb-4">
                {selectedAmbition.department}
              </div>

              <div className="my-4">
                <p className="text-xl sm:text-2xl font-bold leading-relaxed text-white">
                  "{selectedAmbition.text}"
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
                <span className="font-bold">
                  {selectedAmbition.major ? `طالبة - ${selectedAmbition.major}` : 'طالبة'}
                </span>
                <span className="text-emerald-400/70">
                  {selectedAmbition.created_at ? new Date(selectedAmbition.created_at).toLocaleDateString('ar-SA') : ''}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
