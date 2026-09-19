import React from 'react';
import { Volume2, VolumeX, Sparkles, Flag, Compass } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-emerald-900/40 bg-[#060c08]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-950 p-2 shadow-lg border border-emerald-500/30">
            <img src="/logo.svg" alt="رِواء AI Logo" className="w-full h-full object-contain" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#060c08]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                رِواء <span className="text-emerald-400 font-mono text-sm sm:text-base">AI</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
                <Flag className="w-3 h-3 text-emerald-400" />
                اليوم الوطني السعودي 96
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              صوت سعودي من جيل المستقبل | كلية الأعمال والاقتصاد
            </p>
          </div>
        </div>

        {/* Actions & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Action Button: صوتنا يصنع المستقبل */}
          <button
            onClick={onOpenAmbitionModal}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-md shadow-emerald-900/30 transition-all transform active:scale-95 border border-emerald-400/30"
            aria-label="شارك طموحك لمستقبل السعودية"
          >
            <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span className="hidden xs:inline">صوتنا يصنع المستقبل</span>
            <span className="xs:hidden">طموحك</span>
            <span className="text-emerald-200">🇸🇦</span>
          </button>

          {/* Voice Auto-Play Toggle */}
          <button
            onClick={onToggleVoice}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              isAutoVoiceEnabled
                ? 'bg-emerald-950/70 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/70'
                : 'bg-gray-900/70 border-gray-700/60 text-gray-400 hover:bg-gray-800/70'
            }`}
            title={isAutoVoiceEnabled ? 'الصوت التلقائي مفعل' : 'الصوت التلقائي معطل'}
            aria-label={isAutoVoiceEnabled ? 'تعطيل نطق الردود صوتياً' : 'تفعيل نطق الردود صوتياً'}
          >
            {isAutoVoiceEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline">الصوت مفعل</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-gray-400" />
                <span className="hidden md:inline">الصوت صامت</span>
              </>
            )}
          </button>

          {/* AI Model indicator */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 border border-emerald-900/40 text-[11px] font-mono text-emerald-400/90">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Gemini Flash 3.7
          </div>
        </div>

      </div>
    </header>
  );
};
