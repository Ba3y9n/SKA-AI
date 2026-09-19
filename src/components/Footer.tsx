import React from 'react';
import { Flag, Heart, Sparkles, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-emerald-900/50 bg-[#040805] text-gray-400 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
        
        {/* Identity & Context */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-bold text-white text-base flex items-center gap-1.5">
              رِواء <span className="text-emerald-400 font-mono text-sm">AI</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-medium">
              اليوم الوطني السعودي 96 🇸🇦
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-md">
            مشروع ويب تفاعلي يربط الهوية السعودية بطموحات الجيل الجديد عبر الذكاء الاصطناعي والصوت.
          </p>
        </div>

        {/* Academic / Student Club Credit */}
        <div className="text-xs space-y-1 text-gray-400">
          <p className="flex items-center justify-center md:justify-end gap-1.5 text-gray-300 font-medium">
            <span>مشاركة في مسابقة أعمال اليوم الوطني 96</span>
            <Flag className="w-3.5 h-3.5 text-emerald-400" />
          </p>
          <p className="text-emerald-400/80">
            النادي الطلابي بكلية الأعمال والاقتصاد
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
        <p>
          جميع الحقوق محفوظة © 2026 | صوتنا يصنع المستقبل
        </p>
        <div className="flex items-center gap-4 font-mono text-emerald-400/70">
          <span>React + TypeScript</span>
          <span>•</span>
          <span>Tailwind CSS</span>
          <span>•</span>
          <span>Gemini 3.7 Flash</span>
        </div>
      </div>
    </footer>
  );
};
