import React from 'react';
import { RewaaLogo } from './RewaaLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#003828] text-white py-14 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-right">
          
          {/* Identity */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <RewaaLogo className="w-12 h-12 text-emerald-300" />
            <div>
              <h3 className="text-2xl font-black tracking-tight text-white">رِواء AI</h3>
              <p className="text-emerald-200/80 text-xs font-bold tracking-wide">
                صوت الجيل السعودي الرقمي • اليوم الوطني 96
              </p>
            </div>
          </div>

          {/* Links / Info */}
          <div className="flex items-center gap-6 text-xs sm:text-sm font-bold text-gray-300">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-emerald-300 transition-colors">عن رِواء</button>
            <a href="#storytelling" className="hover:text-emerald-300 transition-colors">مسار الحكاية</a>
            <a href="#ambitions" className="hover:text-emerald-300 transition-colors">جدار الطموحات</a>
            <a href="#achievements" className="hover:text-emerald-300 transition-colors">الإنجازات</a>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-emerald-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-200/60 font-medium text-center md:text-right">
          <p>© {new Date().getFullYear()} رِواء AI — المنصة الرقمية التفاعلية لليوم الوطني 96.</p>
          <p>بمبادرة من طالبات ودكتورات كلية الأعمال والاقتصاد — جامعة القصيم</p>
        </div>
      </div>
    </footer>
  );
};
