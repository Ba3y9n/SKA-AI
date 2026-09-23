import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, MessageCircle, Sparkles } from 'lucide-react';
import { Ambition } from '../types/ambition';
import { RewaaLogo } from './RewaaLogo';

interface ShareAmbitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ambition: Ambition | null;
}

export const ShareAmbitionModal: React.FC<ShareAmbitionModalProps> = ({ isOpen, onClose, ambition }) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!ambition) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ska-ai.vercel.app/';
  const authorName = ambition.name || ambition.department || 'طالبة بكلية الأعمال والاقتصاد';
  const authorRole = ambition.role || ambition.major || 'كلية الأعمال والاقتصاد';

  const shareText = `طموح ${authorName} (${authorRole}) للسعودية في اليوم الوطني 96:\n"${ambition.text}"\n\nشاركي طموحكِ عبر رِواء AI: ${currentUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `طموح ${authorName} — اليوم الوطني 96`,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        console.log('Share canceled or not supported');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto z-10 text-right"
          >
            <button
              onClick={onClose}
              className="absolute top-5 left-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#008F68] font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              <span>مشاركة الطموح الوطني</span>
            </div>
            <h3 className="text-2xl font-black text-[#064C3B] mb-6">بطاقة الطموح الوطنية</h3>

            {/* Generated Saudi 96 Digital Card */}
            <div
              ref={cardRef}
              className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#064C3B] via-[#043328] to-[#011c15] text-white shadow-xl border border-emerald-500/30 overflow-hidden mb-6"
            >
              {/* Pattern Texture */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#10B981 1.5px, transparent 1.5px)`,
                  backgroundSize: `20px 20px`
                }}
              />

              {/* Card Header with Logos */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6 relative z-10">
                <div className="flex items-center gap-2.5">
                  <RewaaLogo className="w-8 h-8 text-emerald-400" />
                  <div>
                    <p className="font-black text-white text-base leading-none">رِواء AI</p>
                    <p className="text-[10px] text-emerald-300">صوت الجيل الرقمي</p>
                  </div>
                </div>

                <div className="text-left">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[11px] font-bold text-emerald-200 border border-white/10">
                    اليوم الوطني 96 🇸🇦
                  </span>
                </div>
              </div>

              {/* Card Body - Ambition Text */}
              <div className="my-6 relative z-10">
                <p className="text-lg sm:text-xl font-bold leading-relaxed text-emerald-50 mb-6">
                  "{ambition.text}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center font-black text-emerald-200">
                    {authorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm">{authorName}</h4>
                    <p className="text-xs text-emerald-300">{authorRole}</p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-300/80 font-medium relative z-10">
                <span>كلية الأعمال والاقتصاد — جامعة القصيم</span>
                <span className="font-mono text-emerald-400 font-bold">#صوتنا_يصنع_المستقبل</span>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
              </button>
            </div>

            {/* Native Share button */}
            <div className="mt-3">
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#006C4F] font-bold text-sm transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>خيارات مشاركة أخرى</span>
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
