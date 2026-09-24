import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Edit2, Trash2, Quote, AlertCircle, X, Search, ChevronRight, ChevronLeft, LayoutGrid, Layers } from 'lucide-react';
import { Ambition } from '../types/ambition';
import { deleteAmbition } from '../services/apiService';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface FutureVisionBoardProps {
  ambitions: Ambition[];
  onAddClick: () => void;
  onDelete?: (id: string) => void;
}

const ITEMS_PER_PAGE = 6;

export const FutureVisionBoard: React.FC<FutureVisionBoardProps> = ({ ambitions, onAddClick, onDelete }) => {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ownedIds, setOwnedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);

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

  // Deduplicate and filter ambitions
  const filteredAmbitions = useMemo(() => {
    const seen = new Set<string>();
    return ambitions.filter((item) => {
      if (!item.id || seen.has(item.id)) return false;
      seen.add(item.id);

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (item.text && item.text.toLowerCase().includes(q)) ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.major && item.major.toLowerCase().includes(q)) ||
        (item.department && item.department.toLowerCase().includes(q))
      );
    });
  }, [ambitions, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAmbitions.length / ITEMS_PER_PAGE));
  const paginatedAmbitions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAmbitions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAmbitions, currentPage]);

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
              <span>جدار المستقبل • {filteredAmbitions.length} طموح موثق</span>
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
            {/* View all / Secondary Interface Button */}
            {filteredAmbitions.length > 3 && (
              <button
                onClick={() => setIsFullViewOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-gold/30 font-bold text-sm sm:text-base shadow-lg transition-all"
              >
                <Layers className="w-4 h-4 text-gold" />
                <span>عرض جميع الطموحات ({filteredAmbitions.length})</span>
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

        {/* Live Search & Filter Bar */}
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gold-light opacity-80" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ابحثي في طموحات الطالبات..."
              className="w-full pr-11 pl-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-saudi-200/60 text-sm border border-white/10 focus:border-gold outline-none text-right"
            />
          </div>

          <div className="text-xs sm:text-sm font-bold text-saudi-200 px-3">
            عرض {paginatedAmbitions.length} من أصل {filteredAmbitions.length} طموح
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 min-h-[360px]">
          <AnimatePresence mode="popLayout">
            {paginatedAmbitions.map((item, idx) => {
              const isOwner = ownedIds.includes(item.id) || (item.id && item.id.startsWith('local-'));
              
              const mockDate = item.created_at 
                ? new Date(item.created_at).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', year: 'numeric' })
                : new Date(Date.now() - idx * 86400000).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', year: 'numeric' });

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

        {filteredAmbitions.length === 0 && (
          <div className="text-center py-20 text-saudi-200/80 font-bold bg-white/5 rounded-3xl border border-white/10">
            لا توجد طموحات تطابق بحثك حالياً.
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 px-3">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-full font-bold text-sm transition-all ${
                    currentPage === i + 1
                      ? 'bg-gold text-saudi-900 shadow-md font-black scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>

      {/* Secondary Interface: Full Ambitions Modal Drawer */}
      <AnimatePresence>
        {isFullViewOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-saudi-900/80 backdrop-blur-xl" 
              onClick={() => setIsFullViewOpen(false)} 
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-5xl bg-saudi-800 border border-gold/30 rounded-3xl p-6 sm:p-10 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-right"
            >
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <button onClick={() => setIsFullViewOpen(false)} className="p-2.5 rounded-full hover:bg-white/10 text-saudi-200 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-white">سجل طموحات طالبات الكلية ({filteredAmbitions.length})</h3>
                  <Sparkles className="w-6 h-6 text-gold" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAmbitions.map((item, idx) => (
                  <div key={item.id || idx} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                    <p className="text-base text-white font-bold mb-3 leading-relaxed">"{item.text}"</p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                      <span className="text-gold-light font-black">{item.name || 'طالبة طموحة'} - {item.major || item.department}</span>
                      {ownedIds.includes(item.id) && (
                        <button 
                          onClick={() => setDeleteTargetId(item.id)}
                          className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        title="تأكيد حذف الطموح"
        message="هل أنتِ متأكدة من رغبتك في حذف هذا الطموح من المنصة؟"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

    </section>
  );
};
