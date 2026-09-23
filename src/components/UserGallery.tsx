import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, Trash2, X, ChevronRight, ChevronLeft, ShieldAlert, Sparkles, Filter, RefreshCw, UploadCloud } from 'lucide-react';

interface GalleryPhoto {
  id: string;
  url: string;
  title?: string;
  category: 'فعاليات' | 'أجواء الكلية' | 'لحظات وطنية';
  createdAt: string;
  isUserAdded?: boolean;
  userToken?: string;
}

// Initial curated showcase photos
const INITIAL_COLLEGE_PHOTOS: GalleryPhoto[] = [
  {
    id: 'c-1',
    url: '/national_hero.jpg',
    title: 'بهو كلية الأعمال والاقتصاد — احتفالات 96',
    category: 'أجواء الكلية',
    createdAt: '2026-09-23',
    isUserAdded: false,
  },
  {
    id: 'c-2',
    url: '/media_1790129786646.jpg',
    title: 'الركن الوطني التراثي',
    category: 'فعاليات',
    createdAt: '2026-09-23',
    isUserAdded: false,
  }
];

export const UserGallery: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(INITIAL_COLLEGE_PHOTOS);
  const [activeFilter, setActiveFilter] = useState<string>('الكل');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload modal state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'فعاليات' | 'أجواء الكلية' | 'لحظات وطنية'>('أجواء الكلية');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // User persistent identifier for deletion ownership
  const [myUserToken, setMyUserToken] = useState<string>('');

  useEffect(() => {
    let token = localStorage.getItem('rewaa_user_token');
    if (!token) {
      token = 'usr_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('rewaa_user_token', token);
    }
    setMyUserToken(token);

    const savedPhotos = localStorage.getItem('cbe_gallery_photos');
    if (savedPhotos) {
      try {
        const parsed = JSON.parse(savedPhotos);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPhotos([...parsed, ...INITIAL_COLLEGE_PHOTOS.filter(init => !parsed.some((p: any) => p.id === init.id))]);
        }
      } catch (e) {
        console.error('Failed to load gallery photos', e);
      }
    }
  }, []);

  const savePhotos = (updated: GalleryPhoto[]) => {
    setPhotos(updated);
    const userOnly = updated.filter(p => p.isUserAdded);
    try {
      localStorage.setItem('cbe_gallery_photos', JSON.stringify(userOnly));
    } catch (e) {
      console.warn('Storage full for images');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newPhoto: GalleryPhoto = {
        id: 'user_img_' + Date.now(),
        url: previewUrl,
        title: photoTitle.trim() || 'لحظة وطنية من بهو الكلية',
        category: selectedCategory,
        createdAt: new Date().toISOString().split('T')[0],
        isUserAdded: true,
        userToken: myUserToken
      };

      const updated = [newPhoto, ...photos];
      savePhotos(updated);
      setIsSubmitting(false);
      setSubmissionSuccess(true);

      setTimeout(() => {
        setSubmissionSuccess(false);
        setPreviewUrl(null);
        setPhotoTitle('');
        setIsUploadModalOpen(false);
      }, 2000);
    }, 600);
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      const updated = photos.filter(p => p.id !== id);
      savePhotos(updated);
      if (lightboxIndex !== null) setLightboxIndex(null);
    }
  };

  const filteredPhotos = photos.filter(p => activeFilter === 'الكل' || p.category === activeFilter);

  return (
    <section className="relative w-full py-32 bg-white overflow-hidden z-20 border-t border-gray-100" id="gallery">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-50/70 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#008F68]/10 text-[#006C4F] text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4 text-[#008F68]" />
              عدسة كلية الأعمال والاقتصاد
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#064C3B] leading-tight mb-4">
              شاركنا لحظات اليوم الوطني في كلية الأعمال والاقتصاد
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl leading-relaxed">
              التقط لحظتك في البهو وشاركنا أجواء اليوم الوطني داخل الكلية.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="self-start lg:self-auto inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#008F68] hover:bg-[#064C3B] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <ImagePlus className="w-5 h-5" />
            <span>+ أضف صورتك</span>
          </button>
        </div>

        {/* Gallery Title & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 mb-10 border-b border-gray-100">
          <h3 className="text-2xl font-black text-[#064C3B] flex items-center gap-2">
            من عدسة كلية الأعمال والاقتصاد 🇸🇦
          </h3>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['الكل', 'فعاليات', 'أجواء الكلية', 'لحظات وطنية'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  activeFilter === cat
                    ? 'bg-[#064C3B] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-[#008F68]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Masonry-style Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPhotos.map((photo, idx) => {
              const isOwner = photo.isUserAdded && photo.userToken === myUserToken;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  key={photo.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer aspect-[4/3]"
                >
                  <img
                    src={photo.url}
                    alt={photo.title || 'صورة من بهو الكلية'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
                        {photo.category}
                      </span>
                      {isOwner && (
                        <button
                          onClick={(e) => handleDeletePhoto(photo.id, e)}
                          className="p-2.5 rounded-full bg-red-500 text-white hover:bg-red-600 hover:scale-110 transition-all shadow-md"
                          title="حذف صورتي"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div>
                      <p className="text-white font-bold text-lg mb-1">{photo.title}</p>
                      <p className="text-emerald-300 text-xs font-medium">{photo.createdAt}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredPhotos.length === 0 && (
          <div className="py-20 text-center text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-3xl">
            لا توجد صور في هذا التصنيف حالياً. كوني أول من يشارك صورته!
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 left-6 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev / Next controls */}
            {filteredPhotos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center"
            >
              <img
                src={filteredPhotos[lightboxIndex].url}
                alt={filteredPhotos[lightboxIndex].title}
                className="max-h-[75vh] w-auto object-contain rounded-2xl"
              />
              <div className="mt-4 text-center text-white">
                <p className="text-xl font-black">{filteredPhotos[lightboxIndex].title}</p>
                <span className="text-sm text-emerald-400 font-bold">{filteredPhotos[lightboxIndex].category}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setIsUploadModalOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-3xl p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute top-6 left-6 text-gray-400 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-black text-[#064C3B] mb-2">إضافة صورة من بهو الكلية</h3>
              <p className="text-sm text-gray-500 mb-6">شاركي لحظات الاحتفال باليوم الوطني 96</p>

              {/* Privacy Notice Alert */}
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">ملاحظة الخصوصية والمراجعة:</p>
                  <p>• سيتم مراجعة الصورة قبل نشرها في المعرض العام.</p>
                  <p>• يرجى عدم رفع صور تُظهر وجوه الطالبات بوضوح دون موافقتهن.</p>
                </div>
              </div>

              {submissionSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-[#008F68] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black text-[#064C3B] mb-2">تم استلام صورتك بنجاح!</h4>
                  <p className="text-gray-600 text-sm">تمت إضافة الصورة إلى معرضك وستظهر للجميع بعد المراجعة.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitPhoto} className="space-y-5">
                  
                  {/* Image Picker / Preview Area */}
                  {!previewUrl ? (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-emerald-300 rounded-2xl cursor-pointer hover:bg-emerald-50/50 transition-colors">
                      <UploadCloud className="w-10 h-10 text-[#008F68] mb-2" />
                      <span className="font-bold text-[#064C3B] text-base mb-1">اضغط لاختيار صورة من جهازك</span>
                      <span className="text-xs text-gray-400">JPG, PNG, WebP (بحد أقصى 5MB)</span>
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </label>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 h-56 flex items-center justify-center">
                      <img src={previewUrl} alt="معاينة" className="h-full w-full object-contain" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <label className="px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors">
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>استبدال</span>
                          <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => setPreviewUrl(null)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Title / Description */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">وصف الصورة (اختياري)</label>
                    <input
                      type="text"
                      placeholder="مثال: جانب من ركن القهوة السعودية في بهو الكلية"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#008F68] outline-none"
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
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!previewUrl || isSubmitting}
                      className="w-full py-4 rounded-xl bg-[#008F68] hover:bg-[#064C3B] disabled:opacity-50 text-white font-black text-base shadow-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'جاري الإرسال...' : 'إرسال الصورة للمعرض'}
                    </button>
                  </div>

                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
