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
  Image as ImageIcon
} from 'lucide-react';
import { GallerySubmission, GallerySubmissionStatus } from '../types/gallery';
import { 
  fetchAllAdminSubmissions, 
  updatePhotoStatus, 
  deletePhotoSubmission, 
  getAdminNotifications, 
  markNotificationsAsRead 
} from '../services/galleryService';

interface AdminGalleryReviewProps {
  onBackToSite: () => void;
}

export const AdminGalleryReview: React.FC<AdminGalleryReviewProps> = ({ onBackToSite }) => {
  const [submissions, setSubmissions] = useState<GallerySubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; timestamp: string; read: boolean }>>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GallerySubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchAllAdminSubmissions();
    setSubmissions(data);
    const notifs = getAdminNotifications();
    setNotifications(notifs);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    await updatePhotoStatus(id, 'approved', 'مشرف الكلية');
    loadData();
  };

  const handleReject = async (id: string) => {
    await updatePhotoStatus(id, 'rejected', 'مشرف الكلية');
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الصورة نهائياً من قاعدة البيانات والتخزين؟')) {
      await deletePhotoSubmission(id, undefined, true);
      loadData();
    }
  };

  const filteredSubmissions = submissions.filter(s => {
    if (activeTab === 'all') return true;
    return s.status === activeTab;
  });

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F8FBF8] text-[#064C3B] font-arabic antialiased selection:bg-[#008F68] selection:text-white pb-24">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للموقع الرئيسي</span>
            </button>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#008F68]" />
              <h1 className="text-xl font-black text-[#064C3B]">لوحة مراجعة معرض اليوم الوطني</h1>
            </div>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markNotificationsAsRead();
              }}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 relative transition-colors"
              title="الإشعارات"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 text-right"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                    <span className="text-sm font-bold text-[#064C3B]">سجل التنبيهات</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-6">لا توجد إشعارات جديدة</p>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/60 text-xs"
                        >
                          <p className="font-bold text-[#064C3B] mb-1">{notif.message}</p>
                          <p className="text-[10px] text-gray-400">{new Date(notif.timestamp).toLocaleString('ar-SA')}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        
        {/* Supervisor Notification Banner */}
        {pendingCount > 0 && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-emerald-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold">وصلت صورة جديدة للمراجعة في معرض اليوم الوطني.</h2>
                <p className="text-xs text-emerald-200 mt-0.5">يوجد حالياً {pendingCount} صورة بانتظار الاعتماد قبل النشر للعامة.</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('pending')}
              className="px-5 py-2 rounded-xl bg-white text-[#064C3B] font-bold text-xs hover:bg-emerald-50 transition-colors shrink-0"
            >
              عرض الصور المعلقة
            </button>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-[#008F68] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>الصور بانتظار المراجعة</span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-black">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('approved')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'approved'
                  ? 'bg-[#064C3B] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>الصور المعتمدة</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                {approvedCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('rejected')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'rejected'
                  ? 'bg-amber-700 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>الصور المرفوضة</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                {rejectedCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
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
          <div className="py-24 text-center text-gray-400 font-bold">جاري تحميل الصور...</div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="py-24 text-center rounded-3xl bg-white border border-gray-200 shadow-sm p-8">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-base font-bold text-gray-700">لا توجد صور في هذا القسم حالياً</p>
            <p className="text-xs text-gray-400 mt-1">الصور المرسلة من الطالبات ستظهر هنا للمراجعة والاعتماد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubmissions.map((sub) => {
              const statusLabels: Record<GallerySubmissionStatus, { label: string; class: string }> = {
                pending: { label: 'قيد المراجعة', class: 'bg-amber-100 text-amber-900 border-amber-200' },
                approved: { label: 'تم اعتماد الصورة', class: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
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
                  </div>

                  {/* Details */}
                  <div className="p-5 text-right flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#064C3B] mb-2 leading-relaxed">
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
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#008F68] hover:bg-[#064C3B] text-white font-bold text-xs transition-colors shadow-sm"
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
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#008F68] hover:bg-[#064C3B] text-white font-bold text-xs transition-colors"
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
                        title="حذف نهائي"
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

      {/* Lightbox */}
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
