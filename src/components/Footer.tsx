import React from 'react';
import { RewaaLogo } from './RewaaLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#022c22] text-white py-12 border-t border-emerald-900/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Identity */}
          <div className="flex items-center gap-4">
            <RewaaLogo className="w-12 h-12 text-[#008F68]" />
            <div>
              <h3 className="text-2xl font-black tracking-widest mb-1">رِواء</h3>
              <p className="text-emerald-500/80 text-sm font-bold tracking-wider">
                صوت الجيل السعودي الرقمي
              </p>
            </div>
          </div>

          {/* Links / Info */}
          <div className="flex items-center gap-6 text-sm font-bold text-gray-400">
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">عن رِواء</span>
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">الخصوصية</span>
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">شروط الاستخدام</span>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-emerald-900/30 text-center md:text-left flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} رِواء AI. جميع الحقوق محفوظة.</p>
          <p className="mt-2 md:mt-0">بمبادرة من طالبات ودكتورات كلية الأعمال والاقتصاد - جامعة القصيم</p>
        </div>
      </div>
    </footer>
  );
};
