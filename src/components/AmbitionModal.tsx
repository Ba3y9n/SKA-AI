import React, { useState } from 'react';
import { submitAmbitionIdea } from '../services/apiService';
import { Ambition } from '../types/ambition';
import { Sparkles, X, Send, BrainCircuit, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AmbitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAmbitionAdded: (ambition: Ambition) => void;
}

export const AmbitionModal: React.FC<AmbitionModalProps> = ({
  isOpen,
  onClose,
  onAmbitionAdded,
}) => {
  const [ideaText, setIdeaText] = useState('');
  const [department, setDepartment] = useState('كلية الأعمال والاقتصاد');
  const [major, setMajor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCard, setSuccessCard] = useState<Ambition | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim() || !department.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const resultCard = await submitAmbitionIdea(ideaText.trim(), department.trim(), major.trim() || undefined);
      setSuccessCard(resultCard);
      onAmbitionAdded(resultCard);

      // Trigger Celebration Confetti with Saudi green colors
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#006C35', '#10B981', '#34D399', '#ffffff'],
      });
    } catch (err: any) {
      console.error('Submit ambition error:', err);
      setError(err.message || 'حدث خطأ أثناء إرسال الطموح، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setIdeaText('');
    setMajor('');
    setSuccessCard(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-emerald-100 p-6 sm:p-8 shadow-xl">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 left-4 p-2 rounded-full text-gray-400 hover:text-gray-800 hover:bg-emerald-50 transition"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        {!successCard ? (
          <div>
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-3 shadow-inner">
                <Sparkles className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                أضيفي طموحك للوطن
              </h3>
              <p className="text-sm text-gray-600 mt-2 font-medium leading-relaxed">
                "طموحات طالباتنا اليوم هي إنجازات الوطن غداً."
              </p>
            </div>

            {/* Ambition Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  الكلية:
                </label>
                <input
                  type="text"
                  value={department}
                  disabled
                  className="w-full rounded-xl bg-gray-100 border border-gray-200 p-3 text-sm text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  التخصص (اختياري):
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="مثال: إدارة أعمال، مالية، اقتصاد..."
                  disabled={isLoading}
                  className="w-full rounded-xl bg-slate-50 border border-emerald-100 p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ما هو طموحك لمستقبل المملكة؟
                </label>
                <textarea
                  rows={4}
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="مثال: أتمنى أن أساهم في بناء اقتصاد رقمي..."
                  disabled={isLoading}
                  className="w-full rounded-xl bg-slate-50 border border-emerald-100 p-3.5 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-none transition"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 text-center bg-red-50 p-2 rounded-md">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!ideaText.trim() || isLoading}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-4"
              >
                {isLoading ? (
                  <>
                    <BrainCircuit className="w-5 h-5 animate-spin" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 rtl:rotate-180" />
                    <span>تأكيد الإرسال</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-4 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h4 className="text-xl font-bold text-gray-900">تم حفظ طموحك بنجاح!</h4>
            
            <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm text-right">
              <p className="text-gray-800 text-sm font-medium leading-relaxed">
                "{successCard.text}"
              </p>
              <div className="mt-4 pt-3 border-t border-emerald-50 text-xs text-emerald-700 font-semibold">
                طالبة من {successCard.department} {successCard.major ? ` - ${successCard.major}` : ''}
              </div>
            </div>

            <p className="text-xs text-gray-500 px-4">
              سيظهر طموحك في جدار المستقبل بمجرد مراجعته واعتماده.
            </p>

            <button
              onClick={handleResetAndClose}
              className="mt-4 px-6 py-2.5 w-full rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-md"
            >
              العودة للرئيسية
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
