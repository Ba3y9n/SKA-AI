import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { RewaaLogo } from './RewaaLogo';

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
    <header className="sticky top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 w-full flex items-center justify-between gap-4">
        
        {/* Brand Identity */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer shrink-0" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          role="button"
          tabIndex={0}
          aria-label="العودة لأعلى الصفحة"
        >
          <RewaaLogo className="w-10 h-10 text-[#006C4F]" />
          <div>
            <span className="text-xl font-black tracking-tight text-[#004B37] block leading-none">رِواء</span>
            <span className="text-[10px] font-bold text-gray-400 block tracking-wide">صوت الجيل الرقمي</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 font-bold text-xs sm:text-sm text-gray-700">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#006C4F] transition-colors">رِواء</button>
          <button onClick={() => scrollToSection('storytelling')} className="hover:text-[#006C4F] transition-colors">المعنى</button>
          <button onClick={() => scrollToSection('storytelling')} className="hover:text-[#006C4F] transition-colors">الرسالة</button>
          <button onClick={() => scrollToSection('storytelling')} className="hover:text-[#006C4F] transition-colors">الهدف</button>
          <button onClick={() => scrollToSection('ambitions')} className="hover:text-[#006C4F] transition-colors">صوتنا يصنع المستقبل</button>
          <button onClick={() => scrollToSection('achievements')} className="hover:text-[#006C4F] transition-colors">الإنجازات</button>
        </nav>

        {/* Actions & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleVoice}
            aria-label={isAutoVoiceEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 min-h-[44px] rounded-full text-xs sm:text-sm font-bold transition-all ${
              isAutoVoiceEnabled
                ? 'bg-emerald-50 text-[#006C4F] hover:bg-emerald-100 border border-emerald-200'
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {isAutoVoiceEnabled ? <Volume2 className="w-4 h-4 text-[#006C4F]" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAutoVoiceEnabled ? 'الصوت مفعل' : 'صامت'}</span>
          </button>

          <button
            onClick={onOpenAmbitionModal}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 min-h-[44px] rounded-full text-xs sm:text-sm font-bold bg-[#006C4F] hover:bg-[#004B37] text-white shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <span>أضيفي طموحك</span>
          </button>
        </div>

      </div>
    </header>
  );
};
