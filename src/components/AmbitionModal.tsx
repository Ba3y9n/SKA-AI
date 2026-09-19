import React, { useState } from 'react';
import { submitAmbitionIdea } from '../services/apiService';
import { AmbitionCard } from '../types/ambition';
import { Sparkles, X, Send, BrainCircuit, HeartHandshake, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AmbitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAmbitionAdded: (ambition: AmbitionCard) => void;
}

export const AmbitionModal: React.FC<AmbitionModalProps> = ({
  isOpen,
  onClose,
  onAmbitionAdded,
}) => {
  const [ideaText, setIdeaText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCard, setSuccessCard] = useState<AmbitionCard | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const resultCard = await submitAmbitionIdea(ideaText.trim());
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
      // Fallback local ambition card
      const fallbackCard: AmbitionCard = {
        id: 'local-' + Date.now(),
        category: 'طموح شباب الوطن',
        highlightPhrase: `طموحك: ${ideaText.trim().slice(0, 25)}`,
        fullIdea: ideaText.trim(),
        colorGradient: 'from-emerald-500/20 to-green-600/30',
        iconName: 'Sparkles',
        dateStr: 'اليوم الوطني 96',
      };
      setSuccessCard(fallbackCard);
      onAmbitionAdded(fallbackCard);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#006C35', '#10B981'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setIdeaText('');
    setSuccessCard(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0e2217] to-[#06110a] border border-emerald-600/40 p-6 sm:p-8 shadow-2xl shadow-emerald-950/80">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 left-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-emerald-900/40 transition"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        {!successCard ? (
          <div>
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 mb-3 shadow-inner">
                <Sparkles className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
                صوتنا يصنع المستقبل 🇸🇦
              </h3>
              <p className="text-sm text-emerald-300/80 mt-2 font-light leading-relaxed">
                "لو كان بإمكانك صناعة تغيير واحد لمستقبل السعودية، وش بيكون؟"
              </p>
            </div>

            {/* Ambition Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  شارك فكرتك أو طموحك (دون مشاركة أي بيانات شخصية):
                </label>
                <textarea
                  rows={4}
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="مثال: أتمنى أشوف تقنيات ذكاء اصطناعي سعودية تساعد في تطوير التعليم والمدارس..."
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-emerald-950/40 border border-emerald-700/60 p-3.5 text-sm text-gray-100 placeholder-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 outline-none resize-none transition"
                  aria-label="اكتب طموحك لمستقبل السعودية"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 text-center">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!ideaText.trim() || isLoading}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <BrainCircuit className="w-5 h-5 animate-spin" />
                    <span>Gemini يحلل طموحك...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 rtl:rotate-180" />
                    <span>تخليد طموحي في لوحة المستقبل</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-4 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h4 className="text-xl font-bold text-white">طموحك يضيء سماء الوطن! 🇸🇦</h4>
            
            {/* Generated Ambition Card Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900/50 to-green-950/80 border border-emerald-500/40 shadow-xl text-right">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {successCard.category}
              </span>
              <h5 className="text-lg font-bold text-emerald-200 mt-2.5">
                {successCard.highlightPhrase}
              </h5>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                "{successCard.fullIdea}"
              </p>
            </div>

            <p className="text-xs text-emerald-300/70">
              تمت إضافة طموحك بنجاح إلى لوحة "صوتنا يصنع المستقبل".
            </p>

            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition"
            >
              عرض لوحة الطموحات
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
