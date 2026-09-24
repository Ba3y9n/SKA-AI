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
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-100 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 w-full flex items-center justify-between gap-4">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img 
            src="/logo.png" 
            alt="شعار المنصة" 
            className="h-10 sm:h-12 lg:h-14 object-contain" 
          />
        </div>

        {/* Navigation Links (Hidden on very small screens) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-bold text-sm text-saudi-700">
          <button onClick={() => scrollToSection('gallery')} className="hover:text-gold transition-colors">المعرض</button>
          <button onClick={() => scrollToSection('achievements')} className="hover:text-gold transition-colors">الإنجازات</button>
          <button onClick={() => scrollToSection('ambitions')} className="hover:text-gold transition-colors">الطموح</button>
        </nav>

        {/* Actions & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleVoice}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-full text-xs sm:text-sm font-bold transition-all ${
              isAutoVoiceEnabled
                ? 'bg-saudi-50 text-saudi-700 hover:bg-saudi-100 border border-saudi-200'
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {isAutoVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-saudi-600" /> : <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            <span className="hidden sm:inline">{isAutoVoiceEnabled ? 'الصوت مفعل' : 'صامت'}</span>
          </button>

          <button
            onClick={onOpenAmbitionModal}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 min-h-[44px] rounded-full text-xs sm:text-sm font-bold bg-saudi-600 border border-gold hover:bg-saudi-700 hover:border-gold-light text-white shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <span className="hidden sm:inline">أضف طموحك</span>
            <span className="sm:hidden">طموحك</span>
          </button>
        </div>

      </div>
    </header>
  );
};
