import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Trash2, 
  Quote, 
  Edit2, 
  ChevronRight, 
  ChevronLeft, 
  Filter,
  GraduationCap
} from 'lucide-react';
import { Ambition } from '../types/ambition';
import { deleteAmbition } from '../services/apiService';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Footer } from './Footer';

interface AllAspirationsPageProps {
  ambitions: Ambition[];
  onBackToHome: () => void;
  onAddClick: () => void;
  onDelete?: (id: string) => void;
}

const ITEMS_PER_PAGE = 12;

export const AllAspirationsPage: React.FC<AllAspirationsPageProps> = ({
  ambitions,
  onBackToHome,
  onAddClick,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState<string>('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ownedIds, setOwnedIds] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const majors = ['الكل', 'المحاسبة', 'المالية', 'نظم المعلومات الإدارية', 'إدارة الأعمال', 'الاقتصاد'];

  const filteredAmbitions = useMemo(() => {
    const seen = new Set<string>();
    return ambitions.filter((item) => {
      if (!item.id || seen.has(item.id)) return false;
      seen.add(item.id);

      // Major filter
      if (selectedMajor !== 'الكل') {
        const itemMajor = (item.major || item.department || '').toLowerCase();
        if (!itemMajor.includes(selectedMajor.toLowerCase())) return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (item.text && item.text.toLowerCase().includes(q)) ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.major && item.major.toLowerCase().includes(q)) ||
        (item.department && item.department.toLowerCase().includes(q))
      );
    });
  }, [ambitions, searchQuery, selectedMajor]);

  const totalPages = Math.max(1, Math.ceil(filteredAmbitions.length / ITEMS_PER_PAGE));
  const paginatedAmbitions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAmbitions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAmbitions, currentPage]);

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

  return (
    <div className="min-h-screen bg-[#002B15] text-white font-arabic selection:bg-saudi-600 selection:text-white flex flex-col justify-between">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#002411]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors border border-white/10"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>

          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="الشعار" className="w-8 h-8 object-contain" />
            <span className="font-black text-gold text-lg tracking-wider">جدار المستقبل الكامل</span>
          </div>

          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold hover:bg-gold-light text-saudi-900 font-bold text-sm shadow-md transition-all"
          >
            <Edit2 className="w-4 h-4" />
            <span className="hidden sm:inline">اكتبي رؤيتك</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-gold/30 text-gold-light text-sm font-bold mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>{filteredAmbitions.length} طموح موثق لطالبات الكلية</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">
            سجل طموحات <span className="text-gold">الجيل القادم</span>
          </h1>
          <p className="text-base sm:text-lg text-saudi-100 font-medium leading-relaxed">
            مساحة رقمية تجمع رؤى وطموحات طالبات كلية الأعمال والاقتصاد لمستقبل الوطن.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gold-light opacity-80" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="ابحثي بالاسم، التخصص، أو النص..."
                className="w-full pr-11 pl-4 py-3 rounded-xl bg-white/10 text-white placeholder-saudi-200/60 text-sm border border-white/10 focus:border-gold outline-none text-right"
              />
            </div>

            {/* Total Count */}
            <div className="text-xs sm:text-sm font-bold text-saudi-200 px-2">
              عرض {paginatedAmbitions.length} من أصل {filteredAmbitions.length} طموح
            </div>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {majors.map((major) => (
              <button
                key={major}
                onClick={() => {
                  setSelectedMajor(major);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedMajor === major
                    ? 'bg-gold text-saudi-900 shadow-md font-black'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                }`}
              >
                {major}
              </button>
            ))}
          </div>
        </div>

        {/* Ambitions Grid */}
        {filteredAmbitions.length === 0 ? (
          <div className="text-center py-24 rounded-3xl bg-white/5 border border-white/10 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">لا توجد نتائج مطابقة</h3>
            <p className="text-sm text-saudi-200 mb-6">لم يتم العثور على طموحات تطابق خيارات البحث.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedMajor('الكل'); }}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full border border-white/10 transition-colors"
            >
              إعادة ضبط الفلترة
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {paginatedAmbitions.map((item, idx) => {
                const isOwner = ownedIds.includes(item.id) || (item.id && item.id.startsWith('local-'));
                const formattedDate = item.created_at
                  ? new Date(item.created_at).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '';

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: (idx % 6) * 0.04 }}
                    className="group relative flex flex-col justify-between bg-white/10 backdrop-blur-xl border border-white/20 hover:border-gold/40 rounded-[2rem] p-6 sm:p-8 shadow-xl transition-all duration-300 overflow-hidden"
                  >
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

                      <p className="text-base sm:text-lg font-bold leading-relaxed text-white mb-8 min-h-[70px]">
                        "{item.text}"
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-5 border-t border-white/10">
                      <div>
                        <h4 className="text-base font-black text-gold-light mb-0.5">{item.name || 'طالبة طموحة'}</h4>
                        <p className="text-xs font-bold text-saudi-200 opacity-80">{item.major || item.department || 'كلية الأعمال والاقتصاد'}</p>
                      </div>

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
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1));
                window.scrollTo({ top: 200, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 px-3">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  }}
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
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 200, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        title="تأكيد حذف الطموح"
        message="هل أنتِ متأكدة من حذف هذا الطموح؟"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
};
