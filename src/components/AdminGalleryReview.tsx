import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  Trash2, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Bell, 
  ShieldCheck, 
  Filter,
  Image as ImageIcon,
  KeyRound,
  RefreshCw,
  Eye
} from 'lucide-react';
import { GallerySubmission, GallerySubmissionStatus } from '../types/gallery';
import { 
  fetchAllAdminSubmissions, 
  updatePhotoStatus, 
  deletePhotoSubmission,
  subscribeToGalleryChanges
} from '../services/galleryService';

interface AdminGalleryReviewProps {
  onBackToSite: () => void;
}

export const AdminGalleryReview: React.FC<AdminGalleryReviewProps> = ({ onBackToSite }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cbe_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [submissions, setSubmissions] = useState<GallerySubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedImage, setSelectedImage] = useState<GallerySubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastPendingCount, setLastPendingCount] = useState(0);
  const [newArrivalAlert, setNewArrivalAlert] = useState(false);

  const loadData = async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const data = await fetchAllAdminSubmissions();
      const currentPending = data.filter(s => s.status === 'pending').length;
      
      if (lastPendingCount > 0 && currentPending > lastPendingCount) {
        setNewArrivalAlert(true);
      }
      setLastPendingCount(currentPending);
      setSubmissions(data);
    } catch (e) {
      console.error('Failed to load admin submissions', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData(true);
      const interval = setInterval(() => loadData(false), 4000);
      const unsubscribe = subscribeToGalleryChanges(() => loadData(false));
      return () => {
        clearInterval(interval);
        unsubscribe();
      };
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setIsVerifying(true);
    setAuthError(false);

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setIsAuthenticated(true);
          sessionStorage.setItem('cbe_admin_auth', 'true');
          setAuthError(false);
          return;
        }
      }

      // Fallback check for new passcode Ba#6i6
      if (pinInput.trim() === 'Ba#6i6' || pinInput.trim().toLowerCase() === 'ba#6i6') {
        setIsAuthenticated(true);
        sessionStorage.setItem('cbe_admin_auth', 'true');
        setAuthError(false);
      } else {
        setAuthError(true);
      }
    } catch {
      if (pinInput.trim() === 'Ba#6i6' || pinInput.trim().toLowerCase() === 'ba#6i6') {
        setIsAuthenticated(true);
        sessionStorage.setItem('cbe_admin_auth', 'true');
        setAuthError(false);
      } else {
        setAuthError(true);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleApprove = async (id: string) => {
    // Optimistic UI Update: immediately change status in local state
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
    await updatePhotoStatus(id, 'approved', 'مشرف الكلية');
  };

  const handleReject = async (id: string) => {
    // Optimistic UI Update: immediately change status in local state
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
    await updatePhotoStatus(id, 'rejected', 'مشرف الكلية');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الصورة نهائياً من قاعدة البيانات والتخزين؟')) {
      // Optimistic UI Update: immediately remove from local state
      setSubmissions(prev => prev.filter(s => s.id !== id));
      await deletePhotoSubmission(id, true);
    }
  };

  const filteredSubmissions = submissions.filter(s => {
    if (activeTab === 'all') return true;
    return s.status === activeTab;
  });

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  // Render Authentication Pin Gate if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-saudi-100 text-saudi-700 font-arabic antialiased flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-2xl max-w-md w-full text-right relative overflow-hidden">
          <div className="w-14 h-14 bg-saudi-50 text-saudi-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <KeyRound className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-black text-saudi-700 text-center mb-2">لوحة مراجعة المشرف</h2>
          <p className="text-xs text-gray-500 text-center mb-8">يرجى إدخال رمز التحقق الخاص بمشرف المعرض للمتابعة</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">كلمة مرور المشرف</label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="أدخل كلمة المرور الخاصة بالمشرف"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center text-base font-mono text-gray-900 focus:border-saudi-600 outline-none"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-bold text-center">رمز الدخول غير صحيح، يرجى المحاولة مرة أخرى.</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-saudi-600 hover:bg-saudi-700 text-white font-black text-sm shadow-md transition-colors"
            >
              تسجيل الدخول للوحة
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={onBackToSite}
              className="text-xs font-bold text-gray-500 hover:text-saudi-600 transition-colors"
            >
              العودة إلى الموقع الرئيسي
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-saudi-100 text-saudi-700 font-arabic antialiased selection:bg-saudi-600 selection:text-white pb-24">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs sm:text-sm transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للموقع</span>
            </button>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-saudi-600" />
              <h1 className="text-base sm:text-lg font-black text-saudi-700">لوحة مراجعة معرض اليوم الوطني</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData(true)}
              className={`p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
              title="تحديث البيانات"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('cbe_admin_auth');
                setIsAuthenticated(false);
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              خروج
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Supervisor Notification Banner */}
        {pendingCount > 0 && (
          <div className="mb-8 p-5 rounded-2xl bg-saudi-700 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-saudi-500/20 border border-gold-light/30 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-gold-light" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">وصلت صورة جديدة للمراجعة في معرض اليوم الوطني.</h2>
                <p className="text-xs text-saudi-200 mt-0.5">يوجد حالياً {pendingCount} صورة بانتظار الاعتماد من قِبلك.</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('pending')}
              className="px-5 py-2.5 rounded-xl bg-white text-saudi-700 font-bold text-xs hover:bg-saudi-50 transition-colors shrink-0 shadow-sm"
            >
              عرض الصور المنتظرة ({pendingCount})
            </button>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-saudi-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>الصور بانتظار المراجعة</span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-white text-xs font-black">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('approved')}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'approved'
                  ? 'bg-saudi-700 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>الصور المعتمدة ({approvedCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('rejected')}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'rejected'
                  ? 'bg-amber-700 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>الصور المرفوضة ({rejectedCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>الكل ({submissions.length})</span>
            </button>
          </div>
        </div>

        {/* Submissions Grid */}
        {isLoading ? (
          <div className="py-24 text-center text-gray-400 font-bold">جاري جلب الصور من قاعدة البيانات...</div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="py-24 text-center rounded-3xl bg-white border border-gray-200 shadow-sm p-8">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-base font-bold text-gray-700">لا توجد صور في هذا التصنيف حالياً</p>
            <p className="text-xs text-gray-400 mt-1">الصور المرسلة من مختلف الأجهزة ستظهر هنا للمراجعة والاعتماد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubmissions.map((sub) => {
              const statusLabels: Record<GallerySubmissionStatus, { label: string; class: string }> = {
                pending: { label: 'قيد المراجعة', class: 'bg-amber-100 text-amber-900 border-amber-200' },
                approved: { label: 'تم اعتماد الصورة', class: 'bg-saudi-100 text-saudi-900 border-saudi-200' },
                rejected: { label: 'تم رفض الصورة', class: 'bg-red-100 text-red-900 border-red-200' },
                deleted: { label: 'محذوفة', class: 'bg-gray-100 text-gray-700 border-gray-200' }
              };

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  {/* Photo Visual */}
                  <div
                    onClick={() => setSelectedImage(sub)}
                    className="relative aspect-[4/3] bg-gray-100 cursor-pointer overflow-hidden group"
                  >
                    <img
                      src={sub.image_url}
                      alt={sub.description || 'مشاركة اليوم الوطني'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusLabels[sub.status].class}`}>
                        {statusLabels[sub.status].label}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 text-white text-[11px] font-bold backdrop-blur-sm">
                        {sub.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>معاينة مكبرة</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 text-right flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-bold text-saudi-700 mb-2 leading-relaxed">
                        {sub.description || 'بدون وصف إضافي'}
                      </p>
                      
                      <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                        <p><span className="font-bold text-gray-700">تاريخ الرفع:</span> {new Date(sub.created_at).toLocaleString('ar-SA')}</p>
                        {sub.reviewed_at && (
                          <p><span className="font-bold text-gray-700">تاريخ المراجعة:</span> {new Date(sub.reviewed_at).toLocaleString('ar-SA')}</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-5 border-t border-gray-100 flex items-center justify-between gap-2">
                      {sub.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(sub.id)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-saudi-600 hover:bg-saudi-700 text-white font-bold text-xs transition-colors shadow-sm"
                          >
                            <Check className="w-4 h-4" />
                            <span>موافقة</span>
                          </button>
                          <button
                            onClick={() => handleReject(sub.id)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-sm"
                          >
                            <X className="w-4 h-4" />
                            <span>رفض</span>
                          </button>
                        </>
                      )}

                      {sub.status === 'rejected' && (
                        <button
                          onClick={() => handleApprove(sub.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-saudi-600 hover:bg-saudi-700 text-white font-bold text-xs transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          <span>إعادة اعتماد</span>
                        </button>
                      )}

                      {sub.status === 'approved' && (
                        <button
                          onClick={() => handleReject(sub.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>إلغاء الاعتماد</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        title="حذف نهائي من قاعدة البيانات"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.description || 'معاينة'}
                className="max-h-[80vh] w-auto object-contain rounded-2xl"
              />
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
