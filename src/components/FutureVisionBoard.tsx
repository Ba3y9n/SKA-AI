import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Edit2, Trash2, Quote, ArrowLeft, Layers } from 'lucide-react';
import { Ambition } from '../types/ambition';
import { deleteAmbition } from '../services/apiService';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface FutureVisionBoardProps {
  ambitions: Ambition[];
  onAddClick: () => void;
  onViewAllClick?: () => void;
  onDelete?: (id: string) => void;
}

const PREVIEW_LIMIT = 6;

export const FutureVisionBoard: React.FC<FutureVisionBoardProps> = ({
  ambitions,
  onAddClick,
  onViewAllClick,
  onDelete,
}) => {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ownedIds, setOwnedIds] = useState<string[]>([]);

  useEffect(() => {
    const updateOwned = () => {
      try {
        const list = JSON.parse(localStorage.getItem('ownedAmbitions') || '[]');
        setOwnedIds(list);
      } catch (e) {}
    };
    updateOwned();
    window.addEventListener('storage', updateOwned);
    return () => window.removeEventListener('storage', updateOwned);
  }, [ambitions]);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const owned = JSON.parse(localStorage.getItem('ownedAmbitions') || '[]');
      localStorage.setItem('ownedAmbitions', JSON.stringify(owned.filter((item: string) => item !== deleteTargetId)));
      setOwnedIds(prev => prev.filter(item => item !== deleteTargetId));

      await deleteAmbition(deleteTargetId);
      if (onDelete) onDelete(deleteTargetId);
      setDeleteTargetId(null);
    } catch (err) {
      console.error('Failed to delete ambition:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Deduplicate and get preview of latest 6
  const validAmbitions = useMemo(() => {
    const seen = new Set<string>();
    return ambitions.filter((item) => {
      if (!item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [ambitions]);

  const previewAmbitions = useMemo(() => {
    return validAmbitions.slice(0, PREVIEW_LIMIT);
  }, [validAmbitions]);

  return (
    <section className="relative w-full bg-saudi-700 overflow-hidden py-24 z-20 border-t border-gold/10" id="ambitions">
      
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[90vw] max-w-[900px] h-[600px] bg-gold/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-gold/30 text-gold-light text-sm font-bold mb-4 shadow-lg">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>جدار المستقبل • {validAmbitions.length} طموح موثق</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-md">
              من هنا تبدأ <span className="text-gold">حكايات الجيل القادم</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-saudi-100 font-medium max-w-3xl leading-relaxed">
              إلى طالبات كلية الأعمال والاقتصاد.. أنتنّ ركيزة المستقبل وصانعات الأثر.
              <br />دوّنّ طموحاتكُنّ، وشاركنَ رؤيتكُنّ لتُخلّد في مسيرة النماء والازدهار لوطننا الغالي.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {/* View all button */}
            {validAmbitions.length > 0 && onViewAllClick && (
              <button
                onClick={onViewAllClick}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-gold/30 font-bold text-sm sm:text-base shadow-lg transition-all"
              >
                <Layers className="w-4 h-4 text-gold" />
                <span>عرض جميع الطموحات ({validAmbitions.length})</span>
              </button>
            )}

            {/* Add Ambition Button */}
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gold hover:bg-gold-light text-saudi-800 font-black text-base sm:text-lg shadow-[0_0_20px_rgba(198,161,91,0.4)] hover:shadow-[0_0_30px_rgba(198,161,91,0.6)] hover:-translate-y-1 transition-all duration-300"
            >
              <Edit2 className="w-5 h-5" />
              <span>اكتب رؤيتك للمستقبل</span>
            </button>
          </div>
        </div>

        {/* Empty State: If No Ambitions Exist Yet */}
        {validAmbitions.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">هنا تبدأ حكايات الجيل القادم ✨</h3>
            <p className="text-base sm:text-lg text-saudi-200 font-bold mb-8">كوني أول من يشارك طموحه</p>
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gold hover:bg-gold-light text-saudi-800 font-black text-base shadow-[0_0_20px_rgba(198,161,91,0.4)] hover:shadow-[0_0_30px_rgba(198,161,91,0.6)] hover:-translate-y-1 transition-all"
            >
              <Edit2 className="w-5 h-5" />
              <span>اكتبي رؤيتك للمستقبل</span>
            </button>
          </div>
        ) : (
          <>
            {/* Cards Grid: Preview of Latest 6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <AnimatePresence mode="popLayout">
                {previewAmbitions.map((item, idx) => {
                  const isOwner = ownedIds.includes(item.id) || (item.id && item.id.startsWith('local-'));
                  const formattedDate = item.created_at
                    ? new Date(item.created_at).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '';

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: (idx % 6) * 0.05, ease: "easeOut" }}
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
                          {formattedDate && (
                            <div className="text-left text-xs font-bold text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                              {formattedDate}
                            </div>
                          )}
                        </div>

                        <p className="text-lg sm:text-xl font-bold leading-relaxed text-white mb-8 min-h-[80px]">
                          "{item.text}"
                        </p>
                      </div>

                      <div className="relative z-10 flex items-center justify-between pt-5 border-t border-white/10">
                        <div>
                          <h4 className="text-base sm:text-lg font-black text-gold-light mb-0.5">{item.name || 'طالبة طموحة'}</h4>
                          <p className="text-xs sm:text-sm font-bold text-saudi-200 opacity-80">{item.major || item.department || 'كلية الأعمال والاقتصاد'}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isOwner && (
                            <button 
                              onClick={() => setDeleteTargetId(item.id!)}
                              className="p-2.5 rounded-full transition-all duration-300 bg-white/10 text-white/70 hover:bg-red-500 hover:text-white border border-white/10 hover:border-red-500 shadow-sm"
                              title="حذف هذا الطموح"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Bottom View All CTA if more than 6 ambitions */}
            {validAmbitions.length > PREVIEW_LIMIT && onViewAllClick && (
              <div className="mt-12 text-center">
                <button
                  onClick={onViewAllClick}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-gold/40 font-bold text-base shadow-lg hover:shadow-xl transition-all"
                >
                  <span>عرض جميع الطموحات ({validAmbitions.length})</span>
                  <ArrowLeft className="w-5 h-5 text-gold" />
                </button>
              </div>
            )}
          </>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        title="تأكيد حذف الطموح"
        message="هل أنتِ متأكدة من حذف هذا الطموح؟"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

    </section>
  );
};
