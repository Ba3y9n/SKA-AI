import React from 'react';
import { Flag } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-gray-100 bg-white text-gray-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-right">
        
        {/* Identity & Context */}
        <div className="space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-extrabold text-gray-900 text-lg flex items-center gap-1.5">
              رِواء <span className="text-emerald-600 font-mono text-sm mt-1">AI</span>
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold tracking-wide">
              اليوم الوطني 96 🇸🇦
            </span>
          </div>
          <p className="text-sm text-gray-500 max-w-sm">
            صوت الجيل السعودي الرقمي. تجربة تفاعلية تجمع بين أصالة الهوية وقوة الذكاء الاصطناعي.
          </p>
        </div>

        {/* Links & Credits */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 text-sm font-medium">
          <div className="flex flex-col gap-2">
            <span className="text-gray-900 font-bold mb-1">الروابط السريعة</span>
            <a href="#" className="hover:text-emerald-600 transition-colors">تحدث مع رِواء</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">أضف طموحك</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-gray-900 font-bold mb-1">عن المشروع</span>
            <span className="text-gray-500">جامعة القصيم</span>
            <span className="text-gray-500 flex items-center justify-center sm:justify-start gap-1.5">
              كلية الأعمال والاقتصاد <Flag className="w-3.5 h-3.5 text-emerald-500" />
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <p className="font-medium text-gray-500">
          جميع الحقوق محفوظة © 2026 | صوتنا يصنع المستقبل
        </p>
        <div className="flex items-center gap-3 font-mono text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          <span>React</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span>Supabase</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="text-emerald-600 font-semibold">Gemini Flash</span>
        </div>
      </div>
    </footer>
  );
};
