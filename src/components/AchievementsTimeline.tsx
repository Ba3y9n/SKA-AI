import React from 'react';
import { Sparkles, Award } from 'lucide-react';

const collegeAchievements = [
  {
    id: 1,
    title: 'المرتبة الثانية وطنياً لتصنيف QS العالمي',
    entity: 'كلية الأعمال والاقتصاد',
    date: '2024 - 2025',
    desc: 'حقق برنامج ماجستير إدارة الأعمال (MBA) المرتبة الثانية وطنياً و201 عالمياً وفق تصنيف QS لبرامج الماجستير.',
    source: 'وكالة الأنباء السعودية (واس)',
  },
  {
    id: 2,
    title: 'الاعتماد الدولي المرموق AACSB',
    entity: 'كلية الأعمال والاقتصاد',
    date: 'اعتماد مستمر',
    desc: 'نالت الكلية الاعتماد الأكاديمي الدولي الكامل من الهيئة الدولية لتطوير كليات إدارة الأعمال (AACSB)، وهو أعلى اعتماد تخصصي.',
    source: 'موقع هيئة AACSB',
  }
];

const studentAchievements: any[] = [
  // To be filled with real female student achievements. Currently empty to show empty state.
];

export const AchievementsTimeline: React.FC = () => {
  return (
    <section className="py-16 bg-white w-full border-t border-gray-100 flex flex-col gap-16">
      
      {/* Student Achievements Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 mb-4">
          <Award className="w-4 h-4" />
          طالباتنا فخرنا
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          من هنا تبدأ الإنجازات
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          إنجازات طالبات كلية الأعمال والاقتصاد الموثقة التي تعكس جودة المخرجات وعمق الأثر.
        </p>

        {studentAchievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-emerald-200 rounded-3xl bg-emerald-50/30 max-w-2xl mx-auto">
            <Sparkles className="w-12 h-12 text-emerald-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">في انتظار إنجازك القادم!</h3>
            <p className="text-sm text-gray-500">
              سيتم قريباً توثيق أحدث إنجازات طالباتنا هنا لتكون مصدر إلهام للجميع.
            </p>
          </div>
        ) : (
          <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar gap-6 items-stretch">
            {studentAchievements.map((item) => (
              <div 
                key={item.id} 
                className="snap-center shrink-0 w-80 sm:w-96 bg-white rounded-3xl p-6 sm:p-8 text-right border border-emerald-100 shadow-sm flex flex-col items-start transition-transform hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-100/50"
              >
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full mb-4">
                  {item.entity}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{item.desc}</p>
                
                <div className="w-full flex flex-col gap-2 mt-auto pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-900">{item.studentName}</span>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-medium text-gray-500">{item.date}</span>
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      المصدر: {item.source}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* College/University Achievements Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full text-center pt-12 border-t border-gray-100/60">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
          عن الكلية والجامعة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {collegeAchievements.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-2xl p-6 text-right border border-gray-100 hover:border-emerald-200 transition-colors">
              <span className="text-xs font-bold text-gray-600 bg-gray-200 px-3 py-1 rounded-full mb-3 inline-block">
                {item.entity}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.desc}</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200/60">
                <span className="text-xs text-gray-500">{item.date}</span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  {item.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
