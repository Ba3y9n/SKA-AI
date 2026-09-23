import React from 'react';
import { Ambition } from '../types/ambition';
import { Sparkles, PlusCircle, Quote } from 'lucide-react';

interface FutureVisionBoardProps {
  ambitions: Ambition[];
  onOpenAddModal: () => void;
}

export const FutureVisionBoard: React.FC<FutureVisionBoardProps> = ({
  ambitions,
  onOpenAddModal,
}) => {
  return (
    <section className="w-full py-12 px-4 sm:px-6 bg-emerald-50/30 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden">
      {/* Background Soft Gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/60 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 relative z-10 text-center md:text-right">
        <div>
          <div className="inline-flex items-center justify-center md:justify-start gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-3 mx-auto md:mx-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>صوت الجيل</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            صوتنا يصنع المستقبل
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-lg">
            طموحات طلاب وطالبات كلية الأعمال والاقتصاد لمستقبل مشرق يواكب تطلعات رؤية السعودية 2030.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1 active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          <span>أضف طموحك</span>
        </button>
      </div>

      {/* Empty State */}
      {ambitions.length === 0 ? (
        <div className="relative z-10 flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-emerald-200">
          <Sparkles className="w-12 h-12 text-emerald-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">كوني من أول الأصوات</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            لا توجد طموحات معتمدة حتى الآن. أضيفي طموحك ليكون الأول في جدار المستقبل.
          </p>
        </div>
      ) : (
        /* Ambitions Grid (Soft Bubbles/Cards Style) */
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ambitions.map((ambition) => (
            <div
              key={ambition.id}
              className="group bg-white rounded-3xl p-6 sm:p-8 border border-emerald-50 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 hover:border-emerald-200 transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <Quote className="w-8 h-8 text-emerald-100 group-hover:text-emerald-200 transition-colors" />
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {new Date(ambition.created_at).toLocaleDateString('ar-SA')}
                </span>
              </div>
              
              <p className="text-gray-800 text-base sm:text-lg font-medium leading-relaxed mb-6 flex-grow">
                "{ambition.text}"
              </p>
              
              <div className="mt-auto pt-4 border-t border-gray-50">
                <p className="text-xs font-bold text-gray-900">طالبة من:</p>
                <p className="text-sm font-medium text-emerald-700 mt-0.5">
                  {ambition.department} {ambition.major ? ` - ${ambition.major}` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
