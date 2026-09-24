import React from 'react';
import { RewaaLogo } from './RewaaLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-saudi-700 text-saudi-50 py-12 border-t border-saudi-600/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Identity */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src="/logo.png" 
              alt="شعار المنصة" 
              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg" 
            />
            <div>
              <h3 className="text-2xl font-black tracking-widest mb-1 text-gold">رِواء</h3>
              <p className="text-saudi-300 text-sm font-bold tracking-wider">
                صوت الجيل السعودي الرقمي
              </p>
            </div>
          </div>

          {/* Links / Info */}
          <div className="flex items-center gap-6 text-sm font-bold text-gray-400">
            <span className="hover:text-gold-light transition-colors cursor-pointer">عن رِواء</span>
            <span className="hover:text-gold-light transition-colors cursor-pointer">الخصوصية</span>
            <span className="hover:text-gold-light transition-colors cursor-pointer">شروط الاستخدام</span>
          </div>

        </div>

        {/* Copyright & Dev Credit */}
        <div className="mt-12 pt-6 border-t border-saudi-900/30 flex flex-col md:flex-row items-center justify-between text-xs font-medium space-y-4 md:space-y-0">
          <p className="text-gray-500">© {new Date().getFullYear()} رِواء AI. جميع الحقوق محفوظة.</p>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-gray-500">
            <p>بمبادرة من طالبات ودكتورات كلية الأعمال والاقتصاد - جامعة القصيم</p>
            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-600"></div>
            <p className="flex items-center gap-1.5 mt-2 md:mt-0 text-gray-400">
              <span>فريق التطوير:</span>
              <a 
                href="https://www.linkedin.com/in/bayan-almutairi-93a872333?utm_source=share_via&utm_content=profile&utm_medium=member_ios" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold-light hover:text-gold font-bold transition-colors underline decoration-gold/30 hover:decoration-gold"
              >
                بيان المطيري
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
