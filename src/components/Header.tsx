import React from 'react';
import { Volume2, VolumeX, Sparkles, Flag } from 'lucide-react';

interface HeaderProps {
  isAutoVoiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenAmbitionModal: () => void;
}

import { RewaaLogo } from './RewaaLogo';

export const Header: React.FC<HeaderProps> = ({
  isAutoVoiceEnabled,
  onToggleVoice,
  onOpenAmbitionModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-50 bg-white/80 backdrop-blur-xl transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand & Project Identity - Simplified with ND96 Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/nd96_logo.webp" 
            alt="عزنا بطبعنا - اليوم الوطني 96" 
            className="h-10 sm:h-12 object-contain" 
          />
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
