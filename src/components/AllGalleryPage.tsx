import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  ArrowRight, 
  Search, 
  Trash2, 
  Plus, 
  X, 
  Filter, 
  Sparkles, 
  ImagePlus, 
  CheckCircle2, 
  Calendar, 
  Eye, 
  ChevronRight, 
  ChevronLeft,
  GraduationCap,
  Clock,
  Download
} from 'lucide-react';
import { GallerySubmission, GalleryCategory } from '../types/gallery';
import { 
  fetchPublicApprovedPhotos, 
  fetchMySubmissions, 
  submitPhotoForReview, 
  deletePhotoSubmission, 
  getUserToken, 
  subscribeToGalleryChanges 
} from '../services/galleryService';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Footer } from './Footer';

interface AllGalleryPageProps {
  onBackToHome: () => void;
  onOpenAdmin?: () => void;
}

const ITEMS_PER_PAGE = 24;

export const AllGalleryPage: React.FC<AllGalleryPageProps> = ({ onBackToHome, onOpenAdmin }) => {
  const [approvedPhotos, setApprovedPhotos] = useState<GallerySubmission[]>([]);
  const [myPhotos, setMyPhotos] = useState<GallerySubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'approved' | 'mySubmissions'>('approved');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Selected Photo for Lightbox Modal
  const [lightboxPhoto, setLightboxPhoto] = useState<GallerySubmission | null>(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; url?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Photo Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentMajor, setStudentMajor] = useState('نظم المعلومات الإدارية');
  const [uploadCategory, setUploadCategory] = useState<GalleryCategory>('فعاليات الكلية');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { uploaderId, submissionToken } = useMemo(() => getUserToken(), []);

  const loadData = async () => {
    try {
      const [approved, mine] = await Promise.all([
        fetchPublicApprovedPhotos(),
        fetchMySubmissions()
      ]);
      setApprovedPhotos(approved);
      setMyPhotos(mine);
    } catch (e) {
      console.error('Failed to load gallery in page:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadData();

    const unsubscribe = subscribeToGalleryChanges(() => {
      loadData();
    });

    const interval = setInterval(loadData, 6000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const categories = ['الكل', 'فعاليات الكلية', 'أجواء وطنية', 'لحظات وطنية'];

  const displayedList = activeTab === 'approved' ? approvedPhotos : myPhotos;

  const filteredPhotos = useMemo(() => {
    return displayedList.filter((item) => {
      // Category Filter
      if (selectedCategory !== 'الكل') {
        if (item.category !== selectedCategory) return false;
      }

      // Search Query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (item.student_name && item.student_name.toLowerCase().includes(q)) ||
        (item.major && item.major.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    });
  }, [displayedList, selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPhotos.length / ITEMS_PER_PAGE));
  const paginatedPhotos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPhotos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPhotos, currentPage]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1400;
        const MAX_HEIGHT = 1400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/webp', 0.85);
        setSelectedImage(compressed);
        setUploadError(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      setUploadError('يرجى اختيار صورة للمشاركة.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    try {
      await submitPhotoForReview({
        imageUrl: selectedImage,
        studentName: studentName.trim() || undefined,
        major: studentMajor,
        description: description.trim() || undefined,
        category: uploadCategory
      });

      setUploadSuccess(true);
      await loadData();

      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploadModalOpen(false);
        setSelectedImage(null);
        setDescription('');
        setStudentName('');
      }, 1600);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError('فشل حفظ الصورة، يرجى المحاولة مرة ثانية.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deletePhotoSubmission(deleteTarget.id, deleteTarget.url);
      if (res.success) {
        setApprovedPhotos(prev => prev.filter(p => p.id !== deleteTarget.id));
        setMyPhotos(prev => prev.filter(p => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error('Failed to delete photo:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#002B15] text-white font-arabic selection:bg-saudi-600 selection:text-white flex flex-col justify-between">
      
      {/* Sticky Header */}
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
            <span className="font-black text-gold text-lg tracking-wider">معرض اللحظات الوطنية</span>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold hover:bg-gold-light text-saudi-900 font-bold text-sm shadow-md transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">أضيفي صورتكِ</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-gold/30 text-gold-light text-sm font-bold mb-4 shadow-sm">
            <Camera className="w-4 h-4 text-gold" />
            <span>{approvedPhotos.length} صورة معتمدة من طالبات الكلية</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">
            حكايات وصور <span className="text-gold">طالبات الكلية</span>
          </h1>
          <p className="text-base sm:text-lg text-saudi-100 font-medium leading-relaxed">
            معرض توثيقي تفاعلي يخلد فعاليات ولحظات طالبات كلية الأعمال والاقتصاد بمناسبة اليوم الوطني 96.
          </p>
        </div>

        {/* Search, Tabs, and Filter Controls */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-12 shadow-2xl">
          
          {/* Top Row: Search and Tabs */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            
            {/* Live Search */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="ابحثي باسم الطالبة، التخصص، نوع المشاركة، أو الوصف..."
                className="w-full pl-4 pr-12 py-3 bg-white/10 border border-white/15 rounded-2xl text-white placeholder:text-saudi-200/60 font-medium focus:outline-none focus:border-gold transition-all text-sm sm:text-base"
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

            {/* Public vs My Uploads Switch */}
            <div className="flex bg-white/10 p-1.5 rounded-full border border-white/10 shrink-0 w-full md:w-auto">
              <button
                onClick={() => {
                  setActiveTab('approved');
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'approved'
                    ? 'bg-gold text-saudi-900 shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                المعرض العام ({approvedPhotos.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('mySubmissions');
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'mySubmissions'
                    ? 'bg-gold text-saudi-900 shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                مشاركاتي ({myPhotos.length})
              </button>
            </div>

          </div>

          {/* Bottom Row: Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
            <span className="text-xs font-bold text-gold uppercase tracking-wider ml-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> التصنيف:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gold text-saudi-900 shadow-md scale-105'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Content Section: Loading / Empty / Grid */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-saudi-200 font-bold">جاري تحميل صور المعرض التفاعلي...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            {activeTab === 'mySubmissions' ? (
              <>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">لم تقومي برفع أي صور بعد</h3>
                <p className="text-base sm:text-lg text-saudi-200 font-bold mb-8">شاركي صوركِ وفعالياتكِ ليتم اعتمادها وتخليدها بالمعرض.</p>
              </>
            ) : approvedPhotos.length === 0 ? (
              <>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">هنا تُخلد حكايات ولحظات طالبات الكلية ✨</h3>
                <p className="text-base sm:text-lg text-saudi-200 font-bold mb-8">كوني أول من يشارك لحظته وصورته في المعرض الوطني.</p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-black text-white mb-2">لم يتم العثور على صور مطابقة</h3>
                <p className="text-sm sm:text-base text-saudi-200 font-medium mb-6">جربي تعديل خيارات البحث أو تصفية التصنيف.</p>
              </>
            )}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gold hover:bg-gold-light text-saudi-900 font-black text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>أضيفي صورتكِ الآن</span>
            </button>
          </div>
        ) : (
          <>
            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {paginatedPhotos.map((item, idx) => {
                  const isOwner = item.submission_token === submissionToken || item.uploader_id === uploaderId;
                  const formattedDate = new Date(item.created_at).toLocaleDateString('ar-SA', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.35, delay: (idx % 12) * 0.03 }}
                      className="group relative flex flex-col bg-white/10 backdrop-blur-xl border border-white/15 hover:border-gold/50 rounded-[2rem] overflow-hidden shadow-xl transition-all duration-300 text-right"
                    >
                      {/* Photo Thumbnail Container */}
                      <div 
                        className="relative aspect-square w-full overflow-hidden bg-black/40 cursor-pointer"
                        onClick={() => setLightboxPhoto(item)}
                      >
                        <img
                          src={item.image_url}
                          alt={item.description || 'صورة من طالبات الكلية'}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-saudi-900/80 backdrop-blur-md text-gold text-xs font-bold border border-gold/30">
                              {item.category}
                            </span>
                            <div className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                              <Eye className="w-4 h-4" />
                            </div>
                          </div>

                          <div className="text-white text-xs font-bold flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gold" />
                            <span>{formattedDate}</span>
                          </div>
                        </div>

                        {/* Status Badge if in My Uploads */}
                        {activeTab === 'mySubmissions' && (
                          <div className="absolute top-3 right-3 z-10">
                            {item.status === 'approved' && (
                              <span className="px-3 py-1 rounded-full bg-green-500/90 text-white text-xs font-bold shadow-md">
                                معتمدة ✓
                              </span>
                            )}
                            {item.status === 'pending' && (
                              <span className="px-3 py-1 rounded-full bg-amber-500/90 text-saudi-900 text-xs font-bold shadow-md flex items-center gap-1">
                                <Clock className="w-3 h-3" /> قيد المراجعة
                              </span>
                            )}
                            {item.status === 'rejected' && (
                              <span className="px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-bold shadow-md">
                                مرفوضة
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Details Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-black text-base text-white group-hover:text-gold transition-colors">
                              {item.student_name || 'طالبة الكلية'}
                            </h3>
                            {isOwner && (
                              <button
                                onClick={() => setDeleteTarget({ id: item.id, url: item.image_url })}
                                className="p-1.5 rounded-full text-red-400 hover:text-white hover:bg-red-500/80 transition-colors"
                                title="حذف هذه الصورة"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-saudi-200 font-bold px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10">
                              {item.major || 'كلية الأعمال والاقتصاد'}
                            </span>
                          </div>

                          {item.description && (
                            <p className="text-xs text-saudi-100 font-medium leading-relaxed line-clamp-2 mb-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-saudi-300 font-bold mt-2">
                          <span>{item.category}</span>
                          <span>{formattedDate}</span>
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

      {/* Upload Photo Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-saudi-950/80 backdrop-blur-md"
              onClick={() => setIsUploadModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white text-saudi-900 w-full max-w-lg rounded-[2.5rem] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto z-10 text-right"
            >
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute top-5 left-5 text-gray-400 hover:text-saudi-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-saudi-50 text-saudi-600 flex items-center justify-center mb-3">
                  <Camera className="w-6 h-6 text-saudi-600" />
                </div>
                <h3 className="text-2xl font-black text-saudi-900 mb-1">أضيفي صورتكِ للمعرض</h3>
                <p className="text-sm font-bold text-gray-500">شاركي لحظاتكِ واحتفالكِ باليوم الوطني 96 بكلية الأعمال والاقتصاد.</p>
              </div>

              {uploadSuccess ? (
                <div className="py-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black text-saudi-900 mb-2">تم استلام صورتكِ بنجاح!</h4>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                    حالة الصورة الآن <strong>قيد المراجعة (Pending)</strong>، وستظهر في المعرض العام فور اعتمادها من قبل المشرف.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  {uploadError && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200">
                      {uploadError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">الاسم (اختياري)</label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="مثال: ريم الحربي"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">التخصص *</label>
                      <select
                        value={studentMajor}
                        onChange={(e) => setStudentMajor(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      >
                        <option value="نظم المعلومات الإدارية">نظم المعلومات الإدارية</option>
                        <option value="المحاسبة">المحاسبة</option>
                        <option value="المالية">المالية</option>
                        <option value="إدارة الأعمال">إدارة الأعمال</option>
                        <option value="الاقتصاد">الاقتصاد</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">التصنيف *</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value as GalleryCategory)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                    >
                      <option value="فعاليات الكلية">فعاليات الكلية</option>
                      <option value="أجواء وطنية">أجواء وطنية</option>
                      <option value="لحظات وطنية">لحظات وطنية</option>
                    </select>
                  </div>

                  {/* Image Picker */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">الصورة *</label>
                    {selectedImage ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-black/5">
                        <img src={selectedImage} alt="المعاينة" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setSelectedImage(null)}
                          className="absolute top-2 left-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-saudi-600 hover:bg-saudi-50/30 transition-all text-center">
                        <ImagePlus className="w-8 h-8 text-saudi-600 mb-2" />
                        <span className="text-sm font-bold text-saudi-800">اضغطي لاختيار صورة من جهازكِ</span>
                        <span className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP (سيتم ضغطها تلقائيًا للسرعة)</span>
                        <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">وصف الصورة (اختياري)</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="كلمة أو وصف قصير يوثق اللحظة..."
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600 resize-none"
                    />
                  </div>

                  <div className="p-3 bg-saudi-50 rounded-xl border border-saudi-100 text-[11px] text-saudi-700 font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-saudi-600 shrink-0" />
                    <span>تخضع الصور للمراجعة والاعتماد من مشرف الكلية قبل ظهورها في المعرض العام.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading || !selectedImage}
                    className="w-full py-3.5 bg-saudi-600 hover:bg-saudi-700 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                  >
                    {isUploading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        <span>إرسال الصورة للمراجعة</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxPhoto && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            >
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute -top-12 left-0 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full rounded-3xl overflow-hidden border border-white/20 bg-black/60 shadow-2xl flex items-center justify-center max-h-[75vh]">
                <img
                  src={lightboxPhoto.image_url}
                  alt={lightboxPhoto.description || 'صورة المعرض'}
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>

              <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 mt-3 border border-white/15 text-white flex items-center justify-between text-right">
                <div>
                  <h4 className="font-black text-base text-gold">
                    {lightboxPhoto.student_name || 'طالبة الكلية'} - <span className="text-white font-medium text-xs">{lightboxPhoto.major}</span>
                  </h4>
                  {lightboxPhoto.description && (
                    <p className="text-xs text-saudi-100 font-medium mt-0.5">{lightboxPhoto.description}</p>
                  )}
                </div>

                <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full border border-white/10 shrink-0">
                  {lightboxPhoto.category}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="تأكيد حذف الصورة"
        message="هل أنتِ متأكدة من حذف الصورة؟"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Global Luxury Footer */}
      <Footer />

    </div>
  );
};
