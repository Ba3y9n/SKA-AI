import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ImagePlus, 
  Trash2, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ShieldAlert, 
  RefreshCw, 
  UploadCloud, 
  Clock, 
  CheckCircle2, 
  Eye, 
  FolderHeart,
  Lock,
  Loader2
} from 'lucide-react';
import { GallerySubmission } from '../types/gallery';
import { 
  fetchPublicApprovedPhotos, 
  fetchMySubmissions, 
  submitPhotoForReview, 
  deletePhotoSubmission,
  subscribeToGalleryChanges
} from '../services/galleryService';
import { optimizeImageFile } from '../utils/imageOptimizer';

interface UserGalleryProps {
  onOpenAdmin?: () => void;
}

export const UserGallery: React.FC<UserGalleryProps> = ({ onOpenAdmin }) => {
  const [approvedPhotos, setApprovedPhotos] = useState<GallerySubmission[]>([]);
  const [myPhotos, setMyPhotos] = useState<GallerySubmission[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('الكل');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  
  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoDescription, setPhotoDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'فعاليات' | 'أجواء الكلية' | 'لحظات وطنية'>('أجواء الكلية');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // My Submissions Modal
  const [isMySubmissionsOpen, setIsMySubmissionsOpen] = useState(false);

  const loadData = async () => {
    try {
      const [approved, mine] = await Promise.all([
        fetchPublicApprovedPhotos(),
        fetchMySubmissions()
      ]);
      setApprovedPhotos(approved);
      setMyPhotos(mine);
    } catch (e) {
      console.error('Failed to load gallery photos', e);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  useEffect(() => {
    loadData();

    // Polling every 5 seconds for cross-device live sync
    const interval = setInterval(loadData, 5000);
    const unsubscribe = subscribeToGalleryChanges(loadData);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadError(null);
      setIsOptimizing(true);
      try {
        const optimized = await optimizeImageFile(file, 1440, 0.85);
        setPreviewUrl(optimized);
      } catch (err: any) {
        setUploadError('تعذر معالجة الصورة، يرجى اختيار ملف صورة صالح.');
      } finally {
        setIsOptimizing(false);
      }
    }
  };

  // Cancel Preview & reset upload
  const handleCancelPreview = () => {
    setPreviewUrl(null);
    setPhotoDescription('');
    setUploadError(null);
  };

  // Submit for Review
  const handleSubmitForReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) return;

    setIsSubmitting(true);
    setUploadError(null);

    try {
      await submitPhotoForReview({
        imageUrl: previewUrl,
        description: photoDescription.trim() || undefined,
        category: selectedCategory,
      });

      setSubmissionSuccessMsg('تم استلام الصورة وستتم مراجعتها قبل نشرها.');
      await loadData();

      setTimeout(() => {
        setSubmissionSuccessMsg(null);
        setPreviewUrl(null);
        setPhotoDescription('');
        setIsUploadModalOpen(false);
        setIsSubmitting(false);
      }, 2400);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى.');
      setIsSubmitting(false);
    }
  };

  // User deletes their own pending submission
  const handleDeleteMySubmission = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المشاركة؟')) {
      const res = await deletePhotoSubmission(id);
      if (res.success) {
        await loadData();
      } else {
        alert(res.message);
      }
    }
  };

  const filteredApprovedPhotos = approvedPhotos.filter(p => activeFilter === 'الكل' || p.category === activeFilter);
  const pendingCount = myPhotos.filter(p => p.status === 'pending').length;

  return (
    <section className="relative w-full py-28 bg-[#F8FBF8] overflow-hidden z-20 border-t border-gray-100" id="gallery">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 text-right">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#064C3B] leading-tight mb-4 tracking-tight">
              شاركنا لحظات اليوم الوطني في كلية الأعمال والاقتصاد
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl leading-relaxed">
              التقط لحظتك في البهو وشاركنا أجواء اليوم الوطني داخل الكلية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {/* My Submissions button */}
            {myPhotos.length > 0 && (
              <button
                onClick={() => setIsMySubmissionsOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-emerald-50 border border-emerald-200 text-[#006C4F] font-bold text-sm shadow-sm transition-all"
              >
                <FolderHeart className="w-4 h-4 text-[#008F68]" />
                <span>مشاركاتي ({myPhotos.length})</span>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    {pendingCount} قيد المراجعة
                  </span>
                )}
              </button>
            )}

            {/* Primary Add Photo Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#008F68] hover:bg-[#064C3B] text-white font-black text-base sm:text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <ImagePlus className="w-5 h-5" />
              <span>أضف صورتك</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Admin Gateway */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200/70">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {['الكل', 'فعاليات', 'أجواء الكلية', 'لحظات وطنية'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  activeFilter === cat
                    ? 'bg-[#064C3B] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-emerald-50 hover:text-[#008F68] border border-gray-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Discreet Admin Link */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-xs text-gray-400 hover:text-[#008F68] flex items-center gap-1.5 self-end sm:self-auto font-medium transition-colors p-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>لوحة مراجعة المشرف</span>
            </button>
          )}
        </div>

        {/* Masonry / Editorial Public Gallery (Approved Only) */}
        {isLoadingGallery ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="aspect-[4/3] rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filteredApprovedPhotos.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white border-2 border-dashed border-gray-200 p-8">
            <UploadCloud className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-bold text-gray-700">لا توجد صور معتمدة في المعرض حالياً</p>
            <p className="text-sm text-gray-400 mt-1">شاركي صورتك من بهو الكلية لتكوني أول من يظهر بعد اعتماد المشرف.</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#008F68] text-white text-sm font-bold shadow-md hover:bg-[#064C3B] transition-colors"
            >
              <ImagePlus className="w-4 h-4" />
              <span>أضف صورتك الآن</span>
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredApprovedPhotos.map((photo, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  key={photo.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative rounded-3xl overflow-hidden bg-white border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer aspect-[4/3]"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.description || 'صورة من بهو الكلية'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Clean Hover Overlay with "عرض الصورة" */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                    <div className="flex justify-end">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
                        {photo.category}
                      </span>
                    </div>

                    <div className="text-right">
                      {photo.description && (
                        <p className="text-white font-bold text-base mb-2 line-clamp-2">{photo.description}</p>
                      )}
                      <div className="inline-flex items-center gap-1.5 text-emerald-300 text-xs font-bold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                        <Eye className="w-3.5 h-3.5" />
                        <span>عرض الصورة</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredApprovedPhotos[lightboxIndex] && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 left-6 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev / Next controls */}
            {filteredApprovedPhotos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((lightboxIndex - 1 + filteredApprovedPhotos.length) % filteredApprovedPhotos.length);
                  }}
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((lightboxIndex + 1) % filteredApprovedPhotos.length);
                  }}
                  className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center"
            >
              <img
                src={filteredApprovedPhotos[lightboxIndex].image_url}
                alt={filteredApprovedPhotos[lightboxIndex].description || 'معاينة'}
                className="max-h-[75vh] w-auto object-contain rounded-2xl"
              />
              <div className="mt-4 text-center text-white">
                {filteredApprovedPhotos[lightboxIndex].description && (
                  <p className="text-base sm:text-lg font-bold">{filteredApprovedPhotos[lightboxIndex].description}</p>
                )}
                <span className="text-xs text-emerald-400 font-bold">{filteredApprovedPhotos[lightboxIndex].category}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal / Bottom Sheet */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => !isSubmitting && setIsUploadModalOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto z-10 text-right"
            >
              <button
                onClick={() => !isSubmitting && setIsUploadModalOpen(false)}
                className="absolute top-5 left-5 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-black text-[#064C3B] mb-1">أضف صورة من أجواء اليوم الوطني</h3>
              <p className="text-sm text-gray-500 mb-6">شاركنا لحظة التقطتها داخل بهو كلية الأعمال والاقتصاد.</p>

              {/* Privacy Notices */}
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>تنبيه الخصوصية والمراجعة:</span>
                </div>
                <p>• يرجى عدم رفع صور تظهر وجوه الطالبات بوضوح دون موافقتهن.</p>
                <p>• تخضع الصور للمراجعة قبل ظهورها في المعرض العام.</p>
              </div>

              {uploadError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                  {uploadError}
                </div>
              )}

              {submissionSuccessMsg ? (
                <div className="py-10 text-center">
                  <div className="w-14 h-14 bg-emerald-100 text-[#008F68] rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-black text-[#064C3B] mb-2">{submissionSuccessMsg}</h4>
                  <p className="text-gray-500 text-xs">يمكنكِ متابعة حالة الصورة وحذفها عبر زر مشاركاتي.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitForReview} className="space-y-5">
                  
                  {/* Image Picker OR Preview Section */}
                  {!previewUrl ? (
                    <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-emerald-300 rounded-2xl cursor-pointer hover:bg-emerald-50/50 transition-colors text-center p-4">
                      {isOptimizing ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="w-8 h-8 text-[#008F68] animate-spin mb-2" />
                          <span className="text-xs text-gray-500 font-bold">جاري معالجة وتحسين الصورة...</span>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-10 h-10 text-[#008F68] mb-2" />
                          <span className="font-bold text-[#064C3B] text-base mb-1">اختر صورة من جهازك</span>
                          <span className="text-xs text-gray-400 font-medium">JPG / PNG / WebP</span>
                          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} className="hidden" />
                        </>
                      )}
                    </label>
                  ) : (
                    <div className="space-y-3">
                      {/* Big Preview */}
                      <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 h-64 flex items-center justify-center">
                        <img src={previewUrl} alt="معاينة الصورة" className="h-full w-full object-contain" />
                      </div>

                      {/* Preview Action Buttons */}
                      <div className="flex items-center gap-2">
                        <label className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>استبدال الصورة</span>
                          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={handleCancelPreview}
                          className="flex-1 py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف الصورة</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Description Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">وصف الصورة (اختياري)</label>
                    <input
                      type="text"
                      placeholder="مثال: جانب من ركن القهوة السعودية في بهو الكلية"
                      value={photoDescription}
                      onChange={(e) => setPhotoDescription(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-[#008F68] outline-none"
                    />
                  </div>

                  {/* Category Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">التصنيف</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['أجواء الكلية', 'فعاليات', 'لحظات وطنية'] as const).map((cat) => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                            selectedCategory === cat
                              ? 'bg-emerald-50 border-[#008F68] text-[#006C4F]'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!previewUrl || isSubmitting || isOptimizing}
                      className="w-full py-4 rounded-xl bg-[#008F68] hover:bg-[#064C3B] disabled:opacity-50 text-white font-black text-base shadow-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>جاري الإرسال إلى قاعدة البيانات...</span>
                        </>
                      ) : (
                        <span>إرسال للمراجعة</span>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* My Submissions Modal */}
      <AnimatePresence>
        {isMySubmissionsOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setIsMySubmissionsOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto z-10 text-right"
            >
              <button
                onClick={() => setIsMySubmissionsOpen(false)}
                className="absolute top-5 left-5 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-black text-[#064C3B] mb-1">مشاركاتي</h3>
              <p className="text-xs text-gray-500 mb-6">متابعة حالة الصور التي قمتِ برفعها</p>

              {myPhotos.length === 0 ? (
                <p className="text-center py-12 text-sm text-gray-400 font-bold">لم تقومي برفع أي صور بعد.</p>
              ) : (
                <div className="space-y-4">
                  {myPhotos.map((item) => {
                    const statusConfig = {
                      pending: { label: 'قيد المراجعة', class: 'bg-amber-100 text-amber-900 border-amber-200' },
                      approved: { label: 'تم اعتماد الصورة', class: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
                      rejected: { label: 'تم رفض الصورة', class: 'bg-red-100 text-red-900 border-red-200' },
                      deleted: { label: 'محذوفة', class: 'bg-gray-100 text-gray-700 border-gray-200' },
                    }[item.status];

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image_url}
                            alt="مشاركتي"
                            className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                          />
                          <div>
                            <p className="text-sm font-bold text-[#064C3B] mb-1">{item.description || 'بدون وصف'}</p>
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusConfig.class}`}>
                                {statusConfig.label}
                              </span>
                              <span className="text-[11px] text-gray-400">{item.category}</span>
                            </div>
                          </div>
                        </div>

                        {item.status === 'pending' && (
                          <button
                            onClick={() => handleDeleteMySubmission(item.id)}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors self-end sm:self-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف مشاركتي</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
