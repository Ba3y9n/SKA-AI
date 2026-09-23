import React, { useState } from 'react';
import { submitAmbitionIdea } from '../services/apiService';
import { X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AmbitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmbitionModal: React.FC<AmbitionModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('طالبة');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await submitAmbitionIdea({
        text: text.trim(),
        name: name.trim() || 'صوت طموح',
        role,
        department: 'كلية الأعمال والاقتصاد', // Fallback for old schema compatibility
        status: 'approved', // Auto-approve for the demo effect (realtime sync)
        is_approved: true
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setName('');
        setRole('طالبة');
        setText('');
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting ambition:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#064C3B]/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_#DDF5EA_0%,_transparent_70%)]" />

            <button 
              onClick={onClose}
              className="absolute top-6 left-6 text-gray-400 hover:text-[#064C3B] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-3xl font-black text-[#064C3B] mb-2">أضف طموحك</h3>
            <p className="text-[#008F68] font-bold mb-8">صوتنا يصنع المستقبل.</p>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 bg-[#DDF5EA] rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-[#008F68]" />
                </div>
                <h4 className="text-2xl font-black text-[#064C3B] mb-2">تم إرسال طموحك بنجاح!</h4>
                <p className="text-gray-500">سيظهر الآن في جدار المستقبل.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-[#064C3B] mb-2">الاسم (اختياري)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اكتب اسمك هنا..."
                    className="w-full bg-[#F8FBF8] border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#008F68] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#064C3B] mb-2">الصفة</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#F8FBF8] border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#008F68] transition-colors appearance-none"
                  >
                    <option value="طالبة">طالبة</option>
                    <option value="خريجة">خريجة</option>
                    <option value="عضو هيئة تدريس">عضو هيئة تدريس</option>
                    <option value="زائر">زائر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#064C3B] mb-2">طموحك للسعودية</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="ما هو طموحك ورؤيتك للمستقبل؟"
                    rows={4}
                    required
                    className="w-full bg-[#F8FBF8] border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#008F68] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!text.trim() || isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#008F68] hover:bg-[#006C4F] disabled:opacity-50 text-white font-black py-4 rounded-xl transition-colors shadow-lg"
                >
                  {isSubmitting ? 'جاري الإرسال...' : (
                    <>
                      <Send className="w-5 h-5" />
                      إرسال الطموح
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
