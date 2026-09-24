import React, { useState } from 'react';
import { submitAmbitionIdea } from '../services/apiService';
import { X, Send, Sparkles, ImagePlus, RefreshCw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ambition } from '../types/ambition';

interface AmbitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newAmbition: Ambition) => void;
}

export const AmbitionModal: React.FC<AmbitionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('طالبة');
  const [major, setMajor] = useState('');
  const [text, setText] = useState('');
  const [ambitionImage, setAmbitionImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAmbitionImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const inserted = await submitAmbitionIdea({
        text: text.trim(),
        name: name.trim() || 'طالبة طموحة',
        role: `${role} - ${major || 'كلية الأعمال والاقتصاد'}`,
        department: major || 'كلية الأعمال والاقتصاد',
        status: 'approved',
        is_approved: true
      });

      setIsSuccess(true);
      if (onSuccess && inserted) {
        onSuccess(inserted);
        const owned = JSON.parse(localStorage.getItem('ownedAmbitions') || '[]');
        if (inserted.id) {
          owned.push(inserted.id);
          localStorage.setItem('ownedAmbitions', JSON.stringify(owned));
        }
      }

      setTimeout(() => {
        setIsSuccess(false);
        setName('');
        setRole('طالبة');
        setMajor('');
        setText('');
        setAmbitionImage(null);
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error submitting ambition:', error);
      setSubmitError('تعذر حفظ الطموح حالياً، يرجى المحاولة مرة ثانية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[125] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-saudi-700/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto z-10 text-right"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_#DDF5EA_0%,_transparent_70%)]" />

            <button 
              onClick={onClose}
              className="absolute top-5 left-5 text-gray-400 hover:text-saudi-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-saudi-700 mb-1">أضف طموحك للسعودية</h3>
            <p className="text-saudi-600 font-bold text-sm mb-6">صوتنا يصنع المستقبل في اليوم الوطني 96</p>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="w-16 h-16 bg-[#DDF5EA] rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-saudi-600" />
                </div>
                <h4 className="text-2xl font-black text-saudi-700 mb-2">تم تسجيل طموحكِ بنجاح!</h4>
                <p className="text-gray-500 text-sm">طموحكِ يضيء جدار المستقبل ويخلد بصمتكِ.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-xs font-bold text-saudi-700 mb-1.5">الاسم (اختياري)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اكتبي اسمك هنا..."
                    className="w-full bg-saudi-100 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-saudi-600 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-saudi-700 mb-1.5">الصفة</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-saudi-100 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-saudi-600 transition-colors"
                    >
                      <option value="طالبة">طالبة</option>
                      <option value="خريجة">خريجة</option>
                      <option value="عضو هيئة تدريس">عضو هيئة تدريس</option>
                      <option value="زائر">زائر</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-saudi-700 mb-1.5">التخصص / القسم</label>
                    <input
                      type="text"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="مثال: إدارة أعمال، نظم معلومات..."
                      className="w-full bg-saudi-100 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-saudi-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-saudi-700 mb-1.5">طموحك أو فكرتك للوطن</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="ما هو طموحك ورؤيتك للمستقبل؟"
                    rows={3}
                    required
                    className="w-full bg-saudi-100 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-saudi-600 transition-colors resize-none"
                  />
                </div>

                {/* Optional Image for Ambition */}
                <div>
                  <label className="block text-xs font-bold text-saudi-700 mb-1.5">صورة داعمة لطموحك (اختياري)</label>
                  {!ambitionImage ? (
                    <label className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-dashed border-gold-light rounded-xl bg-saudi-50/40 text-emerald-800 text-xs font-bold cursor-pointer hover:bg-saudi-50 transition-colors">
                      <ImagePlus className="w-4 h-4 text-saudi-600" />
                      <span>إضافة صورة (اختياري)</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-28 flex items-center justify-center">
                      <img src={ambitionImage} alt="معاينة" className="h-full w-full object-cover" />
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <label className="px-2.5 py-1 bg-black/60 hover:bg-black/80 text-white rounded-lg text-[11px] font-bold cursor-pointer flex items-center gap-1 transition-colors">
                          <RefreshCw className="w-3 h-3" />
                          <span>استبدال</span>
                          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => setAmbitionImage(null)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!text.trim() || isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-saudi-600 hover:bg-saudi-700 disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition-colors shadow-lg text-sm"
                  >
                    {isSubmitting ? 'جاري الحفظ...' : (
                      <>
                        <Send className="w-4 h-4" />
                        نشر الطموح
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
