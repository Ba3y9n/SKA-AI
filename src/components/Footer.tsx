import React from 'react';
import { RewaaLogo } from './RewaaLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full text-white py-16 sm:py-20 mt-auto overflow-hidden">
      {/* Background Image with Sadu Pattern */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/sadu_pattern.webp')] bg-cover bg-center opacity-40"
      ></div>
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#06241a] via-[#093526]/90 to-[#0B3D2E]/80"></div>

      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        
        {/* Brand */}
        <div className="flex flex-col items-center mb-12">
          <img src="/nd96_logo.webp" alt="اليوم الوطني 96" className="h-14 sm:h-16 object-contain mb-6 drop-shadow-md" />
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">رِواء</h2>
          <p className="text-sm text-emerald-100/90 font-medium tracking-wide">صوت الجيل السعودي الرقمي</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-14">
          <a href="#" className="text-sm font-bold text-emerald-50 hover:text-white transition-colors">
            تحدث مع رِواء
          </a>
          <a href="#" className="text-sm font-bold text-emerald-50 hover:text-white transition-colors">
            صوتنا يصنع المستقبل
          </a>
          <a href="#" className="text-sm font-bold text-emerald-50 hover:text-white transition-colors">
            أضيفي طموحك
          </a>
        </nav>

        {/* Divider */}
        <div className="w-32 h-px bg-emerald-500/30 mb-12"></div>

        {/* Entities */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-12 text-sm font-bold text-emerald-50">
          <span>كلية الأعمال والاقتصاد</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-emerald-500"></span>
          <span>جامعة القصيم</span>
        </div>

        {/* Copyright */}
        <div className="text-xs text-emerald-400/80 font-medium tracking-wider">
          &copy; 2026 رِواء AI — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
};
