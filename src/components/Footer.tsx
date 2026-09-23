import React from 'react';
import { RewaaLogo } from './RewaaLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0B3D2E] text-white py-12 sm:py-16 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        
        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <RewaaLogo className="w-12 h-12 mb-4" />
          <h2 className="text-xl font-bold tracking-tight text-white">رِواء</h2>
          <p className="text-sm text-emerald-300/80 mt-1">صوت الجيل السعودي الرقمي</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-12">
          <a href="#" className="text-sm font-medium text-emerald-100 hover:text-white transition-colors">
            تحدث مع رِواء
          </a>
          <a href="#" className="text-sm font-medium text-emerald-100 hover:text-white transition-colors">
            صوتنا يصنع المستقبل
          </a>
          <a href="#" className="text-sm font-medium text-emerald-100 hover:text-white transition-colors">
            أضيفي طموحك
          </a>
        </nav>

        {/* Divider */}
        <div className="w-24 h-px bg-emerald-700/50 mb-10"></div>

        {/* Entities */}
        <div className="flex flex-col gap-2 mb-12">
          <span className="text-sm font-semibold text-white">كلية الأعمال والاقتصاد</span>
          <span className="text-sm font-medium text-emerald-200">جامعة القصيم</span>
          <span className="text-xs font-medium text-emerald-400 mt-2">اليوم الوطني السعودي 96</span>
        </div>

        {/* Copyright */}
        <div className="text-xs text-emerald-500/60 font-medium">
          &copy; 2026 رِواء AI
        </div>
      </div>
    </footer>
  );
};
