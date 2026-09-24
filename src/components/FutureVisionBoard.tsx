import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ambition } from '../types/ambition';
import { Plus, Share2, Sparkles, User } from 'lucide-react';
import { ShareAmbitionModal } from './ShareAmbitionModal';

interface FutureVisionBoardProps {
  ambitions: Ambition[];
  onAddClick: () => void;
}

export const FutureVisionBoard: React.FC<FutureVisionBoardProps> = ({ ambitions, onAddClick }) => {
  const [selectedAmbitionForShare, setSelectedAmbitionForShare] = useState<Ambition | null>(null);

  // Clean, genuine ambitions from database
  const cleanAmbitions = React.useMemo(() => {
    return (ambitions || []).filter(a => 
      a.text && 
      !a.text.startsWith('{') && 
      !a.text.includes('CBE_GALLERY') && 
      !a.department?.startsWith('CBE_GALLERY') &&
      a.text !== 'test 1' &&
      a.text !== 'test 3' &&
      a.text !== 'انا بيان'
    );
  }, [ambitions]);

  return (
    <section className="relative w-full py-28 bg-[#004B37] text-white overflow-hidden z-20 border-t border-saudi-700/60" id="ambitions">
      
      {/* Background Subtle Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs sm:text-sm font-bold mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>جدار طموحات طالبات كلية الأعمال والاقتصاد</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 tracking-tight">
              صوتنا يصنع <span className="text-emerald-300">المستقبل</span>
            </h2>
            
            <p className="text-lg sm:text-2xl text-emerald-100 font-bold mb-3">
              وش طموحك للسعودية؟
            </p>
            
            <p className="text-sm sm:text-base text-gray-200 max-w-2xl leading-relaxed">
              كل فكرة وطموح تشاركينه هنا يضيء مسيرة النماء ويعكس طموح جيل يصنع الفارق في مسيرة الوطن.
            </p>
          </div>

          <button
            onClick={onAddClick}
            className="self-start lg:self-auto inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white hover:bg-emerald-50 text-[#004B37] font-black text-base sm:text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="w-5 h-5 text-[#004B37]" />
            <span>أضيفي طموحك</span>
          </button>
        </div>

        {/* Multi-Card Grid */}
        {cleanAmbitions.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 text-emerald-200">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">كوني أول من يشارك طموحها للوطن!</h3>
            <p className="text-gray-300 text-sm max-w-md mx-auto mb-6">
              شاركي طموحك ورسالتك في مسيرة النماء ليظهر هنا ويوثق أثرك.
            </p>
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#004B37] font-bold text-sm shadow-md hover:bg-emerald-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>أضيفي طموحك الآن</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {cleanAmbitions.map((ambition, i) => {
                const authorName = ambition.name || 'طالبة طموحة';
                const authorRole = ambition.role || ambition.department || 'كلية الأعمال والاقتصاد';

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-5%" }}
                    transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
                    key={ambition.id || `amb-${i}`}
                    className="group bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 sm:p-7 border border-white/15 shadow-lg hover:shadow-2xl hover:border-white/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      {/* Author Header */}
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-emerald-200 font-black text-base shadow-sm">
                            {authorName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-base text-white">{authorName}</h4>
                            <p className="text-xs text-emerald-200/90 font-medium">{authorRole}</p>
                          </div>
                        </div>

                        {/* Share Action Button */}
                        <button
                          onClick={() => setSelectedAmbitionForShare(ambition)}
                          title="مشاركة الطموح"
                          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-emerald-100 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Ambition Quote */}
                      <p className="text-white text-base sm:text-lg font-medium leading-relaxed mb-6 text-right">
                        "{ambition.text}"
                      </p>
                    </div>

                    {/* Footer / Meta */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/70 font-medium">
                      <span>اليوم الوطني السعودي 96</span>
                      <span>{ambition.created_at ? new Date(ambition.created_at).toLocaleDateString('ar-SA') : '2026'}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* Share Ambition Modal */}
      {selectedAmbitionForShare && (
        <ShareAmbitionModal
          isOpen={true}
          ambition={selectedAmbitionForShare}
          onClose={() => setSelectedAmbitionForShare(null)}
        />
      )}

    </section>
  );
};
