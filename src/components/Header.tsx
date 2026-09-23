import React from 'react';
import { Mic, Volume2 } from 'lucide-react';

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
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img 
            src="/logo.png" 
            alt="شعار المنصة" 
            className="h-10 sm:h-12 object-contain" 
          />
        </div>

        {/* Actions & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          <button
            onClick={onToggleVoice}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              isAutoVoiceEnabled
                ? 'bg-saudi-500/20 text-saudi-100 hover:bg-saudi-500/30'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {isAutoVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            <span className="hidden sm:inline">{isAutoVoiceEnabled ? 'الصوت مفعل' : 'صامت'}</span>
          </button>

          <button
            onClick={onOpenAmbitionModal}
            className="flex items-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-saudi-600 border border-gold hover:bg-saudi-700 hover:border-gold-light text-white shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <span className="hidden sm:inline">أضف طموحك</span>
            <span className="sm:hidden">طموحك</span>
          </button>
        </div>

      </div>
    </header>
  );
};
