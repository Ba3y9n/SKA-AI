import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  ArrowRight, 
  Search, 
  Trash2, 
  Plus, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft, 
  Filter, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  X, 
  ImagePlus, 
  CheckCircle2,
  Calendar,
  Share2
} from 'lucide-react';
import { 
  DatabaseAchievement, 
  fetchDatabaseAchievements, 
  submitDatabaseAchievement, 
  deleteDatabaseAchievement, 
  getAchievementUserToken 
} from '../services/achievementsService';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Footer } from './Footer';

interface AllAchievementsPageProps {
  onBackToHome: () => void;
}

const ITEMS_PER_PAGE = 12;

export const AllAchievementsPage: React.FC<AllAchievementsPageProps> = ({ onBackToHome }) => {
  const [achievements, setAchievements] = useState<DatabaseAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('الكل');
  const [selectedMajor, setSelectedMajor] = useState<string>('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const [myUserToken, setMyUserToken] = useState<string>('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Achievement Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newClassification, setNewClassification] = useState<'طالبة' | 'خريجة' | 'عضو هيئة تدريس'>('طالبة');
  const [newMajor, setNewMajor] = useState('نظم المعلومات الإدارية');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('ابتكار ومنافسات');
  const [newDesc, setNewDesc] = useState('');
  const [newLinkedIn, setNewLinkedIn] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await fetchDatabaseAchievements();
      setAchievements(data);
    } catch (e) {
      console.error('Failed to load achievements in page:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const token = getAchievementUserToken();
    setMyUserToken(token);
    loadData();

    // Auto sync with database every 6 seconds
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, []);

  const classifications = ['الكل', 'طالبة', 'خريجة', 'عضو هيئة تدريس'];
  const majors = ['الكل', 'نظم المعلومات الإدارية', 'المحاسبة', 'المالية', 'إدارة الأعمال', 'الاقتصاد'];

  const filteredAchievements = useMemo(() => {
    return achievements.filter((item) => {
      // Classification filter
      if (selectedClassification !== 'الكل') {
        if (selectedClassification === 'عضو هيئة تدريس') {
          if (item.classification !== 'عضو هيئة تدريس' && item.classification !== 'دكتورة') return false;
        } else {
          if (item.classification !== selectedClassification) return false;
        }
      }

      // Major filter
      if (selectedMajor !== 'الكل') {
        const itemMajor = (item.major || '').toLowerCase();
        if (!itemMajor.includes(selectedMajor.toLowerCase())) return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (item.nameAr && item.nameAr.toLowerCase().includes(q)) ||
        (item.nameEn && item.nameEn.toLowerCase().includes(q)) ||
        (item.achievementTitle && item.achievementTitle.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.major && item.major.toLowerCase().includes(q)) ||
        (item.type && item.type.toLowerCase().includes(q))
      );
    });
  }, [achievements, selectedClassification, selectedMajor, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredAchievements.length / ITEMS_PER_PAGE));
  const paginatedAchievements = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAchievements.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAchievements, currentPage]);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const success = await deleteDatabaseAchievement(deleteTargetId);
      if (success) {
        setAchievements(prev => prev.filter(a => a.id !== deleteTargetId));
        setDeleteTargetId(null);
      }
    } catch (err) {
      console.error('Failed to delete achievement:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTitle.trim() || !newDesc.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const created = await submitDatabaseAchievement({
        nameAr: newName.trim(),
        nameEn: '',
        classification: newClassification,
        major: newMajor,
        achievementTitle: newTitle.trim(),
        type: newType,
        year: new Date().getFullYear().toString(),
        description: newDesc.trim(),
        linkedIn: newLinkedIn.trim() || undefined,
        officialSource: newSource.trim() || undefined,
        imageUrl: newImage || undefined
      });

      setAchievements(prev => [created, ...prev]);
      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
        setIsAddModalOpen(false);
        setNewName('');
        setNewTitle('');
        setNewDesc('');
        setNewLinkedIn('');
        setNewSource('');
        setNewImage(null);
      }, 1400);
    } catch (err: any) {
      console.error('Failed to submit achievement:', err);
      setSubmitError('تعذر حفظ الإنجاز حالياً، يرجى التحقق من الاتصال والمحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#002B15] text-white font-arabic selection:bg-saudi-600 selection:text-white flex flex-col justify-between">
      
      {/* Top Header Bar */}
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
            <span className="font-black text-gold text-lg tracking-wider">سجل الإنجازات الموثقة</span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold hover:bg-gold-light text-saudi-900 font-bold text-sm shadow-md transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">إضافة إنجاز جديد</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        
        {/* Page Hero & Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-gold/30 text-gold-light text-sm font-bold mb-4 shadow-sm">
            <Award className="w-4 h-4 text-gold" />
            <span>{achievements.length} إنجاز موثق لكلية الأعمال والاقتصاد</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">
            سجل إنجازات <span className="text-gold">الفخر والأثر</span>
          </h1>
          <p className="text-base sm:text-lg text-saudi-100 font-medium leading-relaxed">
            منصة توثق إبداعات وتميز طالبات وخريجات وأعضاء هيئة التدريس بكلية الأعمال والاقتصاد.
          </p>
        </div>

        {/* Search and Filters Controls */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-12 shadow-2xl">
          
          {/* Live Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ابحث باسم الطالبة، التخصص، نوع الإنجاز، أو الكلمات المفتاحية..."
              className="w-full pl-4 pr-12 py-3.5 bg-white/10 border border-white/15 rounded-2xl text-white placeholder:text-saudi-200/60 font-medium focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills Grid */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4 border-t border-white/10">
            
            {/* Classification Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gold uppercase tracking-wider ml-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> الفئة:
              </span>
              {classifications.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedClassification(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    selectedClassification === cat
                      ? 'bg-gold text-saudi-900 shadow-md scale-105'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Major Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gold uppercase tracking-wider ml-2 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> التخصص:
              </span>
              {majors.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMajor(m);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    selectedMajor === m
                      ? 'bg-gold text-saudi-900 shadow-md scale-105'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/5'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Content Section: Loading / Empty / Grid */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-saudi-200 font-bold">جاري تحميل سجل الإنجازات الموثقة...</p>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            {achievements.length === 0 ? (
              <>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">هنا تُخلد إنجازات طالبات وأعضاء الكلية ✨</h3>
                <p className="text-base sm:text-lg text-saudi-200 font-bold mb-8">كوني أول من يوثق إنجازه في سجل الكلية الذهبي.</p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-black text-white mb-2">لم يتم العثور على نتائج مطابقة</h3>
                <p className="text-sm sm:text-base text-saudi-200 font-medium mb-6">جربي تعديل خيارات البحث أو تصفية التخصصات.</p>
              </>
            )}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gold hover:bg-gold-light text-saudi-900 font-black text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة إنجاز جديد</span>
            </button>
          </div>
        ) : (
          <>
            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <AnimatePresence mode="popLayout">
                {paginatedAchievements.map((item, idx) => {
                  const isOwner = item.isUserAdded && (item.userToken === myUserToken || !item.userToken);

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 30, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.35, delay: (idx % 12) * 0.04 }}
                      whileHover={{ y: -6 }}
                      className="group relative flex flex-col justify-between bg-white/10 backdrop-blur-xl border border-white/20 hover:border-gold/50 rounded-[2rem] p-6 sm:p-8 shadow-xl transition-all duration-300 overflow-hidden text-right"
                    >
                      {/* Hover subtle glow */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-gold/0 via-gold/0 to-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="relative z-10 flex-1">
                        
                        {/* Card Top: Avatar & Owner Delete */}
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center gap-3.5">
                            <div className="w-14 h-14 rounded-2xl bg-saudi-700/80 border border-gold/30 flex items-center justify-center overflow-hidden shadow-inner text-gold font-black text-xl shrink-0">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.nameAr} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              ) : (
                                <span>{item.nameAr ? item.nameAr.charAt(0) : 'ط'}</span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-black text-lg sm:text-xl text-white leading-tight group-hover:text-gold transition-colors">
                                {item.nameAr}
                              </h3>
                              <span className="text-xs text-saudi-200 font-bold">
                                {item.classification || 'طالبة'}
                              </span>
                            </div>
                          </div>

                          {/* Delete Button for Owner */}
                          {isOwner && (
                            <button
                              onClick={() => setDeleteTargetId(item.id)}
                              className="p-2 rounded-full text-red-400 hover:text-white hover:bg-red-500/80 border border-red-400/20 hover:border-red-500 transition-all shadow-sm"
                              title="حذف هذا الإنجاز"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Badges: Major & Type */}
                        <div className="flex flex-wrap gap-2 items-center mb-4">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-saudi-700/80 text-saudi-100 border border-saudi-600">
                            {item.major}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gold/20 text-gold-light border border-gold/30">
                            {item.type || item.achievementTitle}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h4 className="text-base sm:text-lg font-bold text-gold-light mb-2 leading-snug">
                          {item.achievementTitle}
                        </h4>
                        <p className="text-sm text-saudi-100 leading-relaxed font-medium mb-6 line-clamp-4 group-hover:line-clamp-none transition-all">
                          {item.description}
                        </p>

                      </div>

                      {/* Card Footer: Year & Social/Source Links */}
                      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between mt-auto text-xs text-saudi-200">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          <span>{item.year || '2026'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.linkedIn && (
                            <a
                              href={item.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                            >
                              <span>LinkedIn</span>
                              <ExternalLink className="w-3 h-3 text-gold" />
                            </a>
                          )}
                          {item.officialSource && (
                            <a
                              href={item.officialSource}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                            >
                              <span>المصدر</span>
                              <ExternalLink className="w-3 h-3 text-gold" />
                            </a>
                          )}
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-14 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                        currentPage === i + 1
                          ? 'bg-gold text-saudi-900 shadow-md scale-105'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

      </main>

      {/* Add Achievement Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-saudi-950/80 backdrop-blur-md"
              onClick={() => setIsAddModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white text-saudi-900 w-full max-w-xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto z-10 text-right"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 left-5 text-gray-400 hover:text-saudi-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-saudi-50 text-saudi-600 flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-saudi-600" />
                </div>
                <h3 className="text-2xl font-black text-saudi-900 mb-1">توثيق إنجاز جديد</h3>
                <p className="text-sm font-bold text-gray-500">شاركينا إنجازكِ الأكاديمي أو المهني ليكون فخرًا للكلية والوطن.</p>
              </div>

              {submitSuccess ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black text-saudi-900 mb-2">تم توثيق الإنجاز بنجاح!</h4>
                  <p className="text-gray-600 text-sm">إنجازكِ متاح الآن في سجل الإنجازات المعتمد.</p>
                </div>
              ) : (
                <form onSubmit={handleAddSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل *</label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="مثال: سارة العتيبي"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">الفئة *</label>
                      <select
                        value={newClassification}
                        onChange={(e) => setNewClassification(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      >
                        <option value="طالبة">طالبة</option>
                        <option value="خريجة">خريجة</option>
                        <option value="عضو هيئة تدريس">عضو هيئة تدريس</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">التخصص *</label>
                      <select
                        value={newMajor}
                        onChange={(e) => setNewMajor(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      >
                        <option value="نظم المعلومات الإدارية">نظم المعلومات الإدارية</option>
                        <option value="المحاسبة">المحاسبة</option>
                        <option value="المالية">المالية</option>
                        <option value="إدارة الأعمال">إدارة الأعمال</option>
                        <option value="الاقتصاد">الاقتصاد</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">نوع الإنجاز *</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      >
                        <option value="ابتكار ومنافسات">ابتكار ومنافسات</option>
                        <option value="بحث ونشر علمي">بحث ونشر علمي</option>
                        <option value="مراكز متقدمة">مراكز متقدمة</option>
                        <option value="ريادة وابتكار">ريادة وابتكار</option>
                        <option value="قيادة وتطوع">قيادة وتطوع</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">عنوان الإنجاز *</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="مثال: المركز الأول في هاكاثون الابتكار المالي"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">تفاصيل ووصف الإنجاز *</label>
                    <textarea
                      required
                      rows={3}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="اشرحي نبذة عن الإنجاز والأثر المحقق..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">رابط LinkedIn (اختياري)</label>
                      <input
                        type="url"
                        value={newLinkedIn}
                        onChange={(e) => setNewLinkedIn(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">رابط توثيق رسمي (اختياري)</label>
                      <input
                        type="url"
                        value={newSource}
                        onChange={(e) => setNewSource(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">صورة الإنجاز أو الشعار (اختياري)</label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all border border-gray-200">
                        <ImagePlus className="w-4 h-4" />
                        <span>اختيار صورة</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      {newImage && (
                        <div className="flex items-center gap-2 text-xs text-green-600 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تم تجهيز الصورة</span>
                          <button type="button" onClick={() => setNewImage(null)} className="text-red-500 hover:underline">إلغاء</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-saudi-600 hover:bg-saudi-700 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Award className="w-5 h-5" />
                        <span>حفظ وتوثيق الإنجاز</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        title="تأكيد حذف الإنجاز"
        message="هل أنتِ متأكدة من حذف هذا الإنجاز؟"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Global Luxury Footer */}
      <Footer />

    </div>
  );
};
