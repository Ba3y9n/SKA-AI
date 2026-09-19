import React from 'react';
import { Volume2, VolumeX, Sparkles, Flag } from 'lucide-react';

interface HeaderProps {
  isAutoVoiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenAmbitionModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAutoVoiceEnabled,
  onToggleVoice,
  onOpenAmbitionModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-white/90 backdrop-blur-xl transition-all shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 p-1 border border-emerald-200 overflow-hidden">
            <img src="/rewaa_logo.png" alt="رِواء AI" className="w-full h-full object-cover" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 flex items-center gap-1.5">
                رِواء <span className="text-emerald-700 font-mono text-sm sm:text-base">AI</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Flag className="w-3 h-3 text-emerald-600" />
                اليوم الوطني السعودي 96
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block">
              صوت سعودي من جيل المستقبل | كلية الأعمال والاقتصاد
            </p>
          </div>
        </div>

        {/* Actions & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Action Button: أضف طموحك (Optional) */}
          <button
            onClick={onOpenAmbitionModal}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all transform active:scale-95 border border-emerald-600"
            aria-label="أضف طموحك لمستقبل السعودية"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>أضف طموحك</span>
          </button>

          {/* Voice Auto-Play Toggle */}
          <button
            onClick={onToggleVoice}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              isAutoVoiceEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
            }`}
            title={isAutoVoiceEnabled ? 'الصوت مفعل' : 'الصوت معطل'}
            aria-label={isAutoVoiceEnabled ? 'تعطيل نطق الردود' : 'تفعيل نطق الردود'}
          >
            {isAutoVoiceEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span className="hidden md:inline">الصوت مفعل</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-gray-400" />
                <span className="hidden md:inline">الصوت صامت</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
