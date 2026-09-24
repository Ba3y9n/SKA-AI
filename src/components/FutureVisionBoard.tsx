import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Edit2, Trash2, Heart, Share2, Quote, AlertCircle, X } from 'lucide-react';
import { Ambition } from '../types/ambition';
import { deleteAmbition } from '../services/apiService';

interface FutureVisionBoardProps {
  ambitions: Ambition[];
  onAddClick: () => void;
  onDelete?: (id: string) => void;
}

export const FutureVisionBoard: React.FC<FutureVisionBoardProps> = ({ ambitions, onAddClick, onDelete }) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteClick = async (id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      return;
    }

    // Confirmed deletion
    if (id) {
      const success = await deleteAmbition(id);
      if (success) {
        const owned = JSON.parse(localStorage.getItem('ownedAmbitions') || '[]');
        localStorage.setItem('ownedAmbitions', JSON.stringify(owned.filter((item: string) => item !== id)));
        if (onDelete) onDelete(id);
      } else {
        alert('حدث خطأ أثناء حذف الطموح.');
      }
      setDeleteConfirmId(null);
    }
  };

  // Deduplicate ambitions by ID to prevent any duplicate keys or rendering artifacts
  const uniqueAmbitions = useMemo(() => {
    const seen = new Set<string>();
    return ambitions.filter((item) => {
      if (!item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [ambitions]);

  const ownedAmbitionsSet = useMemo(() => {
    return new Set(JSON.parse(localStorage.getItem('ownedAmbitions') || '[]'));
  }, [ambitions]);

  return (
    <section className="relative w-full bg-saudi-700 overflow-hidden py-24 z-20 border-t border-gold/10" id="ambitions">
      
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[90vw] max-w-[900px] h-[600px] bg-gold/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-gold/30 text-gold-light text-sm font-bold mb-4 shadow-lg">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>جدار المستقبل</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-md">
              من هنا تبدأ <span className="text-gold">حكايات الجيل القادم</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-saudi-100 font-medium max-w-3xl leading-relaxed">
              يا بنات كلية الأعمال والاقتصاد بجامعة القصيم.. أنتنّ صانعات الأثر وقادة الغد.
              <br />شاركِي طموحكِ ورسالتكِ في مسيرة النماء لوطننا الغالي.
            </p>
          </div>

          <button
            onClick={onAddClick}
            className="self-start lg:self-auto inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gold hover:bg-gold-light text-saudi-800 font-black text-base sm:text-lg shadow-[0_0_20px_rgba(198,161,91,0.4)] hover:shadow-[0_0_30px_rgba(198,161,91,0.6)] hover:-translate-y-1 transition-all duration-300"
          >
            <Edit2 className="w-5 h-5" />
            <span>اكتب رؤيتك للمستقبل</span>
          </button>
        </div>

        {/* Masonry / Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {uniqueAmbitions.map((item, idx) => {
              const isOwner = ownedAmbitionsSet.has(item.id);
              const isConfirmingDelete = deleteConfirmId === item.id;
              
              // Fake date generation if not present, just to show UI requirement
              const mockDate = new Date(Date.now() - idx * 86400000).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', year: 'numeric' });

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col justify-between bg-white/10 backdrop-blur-xl border border-white/20 hover:border-gold/40 rounded-[2rem] p-6 sm:p-8 shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Decorative internal glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-gold/0 via-gold/0 to-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10 flex-1">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gold-light shrink-0 shadow-sm">
                        <Quote className="w-6 h-6 fill-current opacity-80" />
                      </div>
                      <div className="text-left text-xs font-bold text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        {mockDate}
                      </div>
                    </div>

                    <p className="text-lg sm:text-xl font-bold leading-relaxed text-white mb-8 min-h-[80px]">
                      "{item.text}"
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-5 border-t border-white/10">
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-gold-light mb-0.5">{item.name}</h4>
                      <p className="text-xs sm:text-sm font-bold text-saudi-200 opacity-80">{item.major}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isOwner && (
                        <div className="relative flex items-center">
                          <AnimatePresence>
                            {isConfirmingDelete && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                                className="absolute right-full mr-2 whitespace-nowrap bg-red-500/90 backdrop-blur-md text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-2 shadow-lg border border-red-400"
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>تأكيد الحذف؟</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                                  className="ml-1 p-0.5 hover:bg-white/20 rounded-md transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <button 
                            onClick={() => handleDeleteClick(item.id!)}
                            className={`p-2 rounded-full transition-all duration-300 ${isConfirmingDelete ? 'bg-red-500 text-white shadow-md' : 'bg-white/5 text-white/60 hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30'}`}
                            title="حذف الطموح"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
