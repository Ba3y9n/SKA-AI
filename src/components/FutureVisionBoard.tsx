import React, { useState } from 'react';
import { Ambition } from '../types/ambition';
import { Sparkles, MessageCircle } from 'lucide-react';

interface FutureVisionBoardProps {
  ambitions: Ambition[];
  onOpenAddModal: () => void;
}

export const FutureVisionBoard: React.FC<FutureVisionBoardProps> = ({ ambitions, onOpenAddModal }) => {
  const [activeAmbition, setActiveAmbition] = useState<string | null>(null);

  return (
    <section className="py-20 w-full relative overflow-hidden bg-white border-t border-emerald-50">
      
      {/* Soft Green Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-emerald-50/50 rounded-[100%] blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          صوتنا يصنع المستقبل
        </h2>
        <p className="text-lg text-emerald-700 font-medium mb-10">
          وش طموحك للسعودية؟
        </p>
        
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200/50 transition-all transform hover:-translate-y-1"
        >
          <Sparkles className="w-5 h-5" />
          <span>أضيفي طموحك للوطن</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {ambitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto bg-gray-50/50 rounded-3xl border border-gray-100">
            <MessageCircle className="w-12 h-12 text-emerald-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">كوني من أول الأصوات</h3>
            <p className="text-sm text-gray-500 mb-6">
              أضيفي طموحك وخليه جزءًا من المستقبل.
            </p>
            <button
              onClick={onOpenAddModal}
              className="text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-5 py-2.5 rounded-full transition-colors"
            >
              أضيفي طموحك
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 px-2 py-8">
            <style>{`
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
              }
            `}</style>
            {ambitions.map((ambition, idx) => {
              const isActive = activeAmbition === ambition.id;
              // Add slight random delays so they float independently
              const animationDelay = `${(idx % 5) * 0.4}s`;
              
              return (
                <div
                  key={ambition.id}
                  onClick={() => setActiveAmbition(isActive ? null : ambition.id)}
                  style={{ animation: `float 4s ease-in-out infinite ${animationDelay}` }}
                  className={`
                    cursor-pointer transition-all duration-500 ease-out flex flex-col items-center text-center
                    bg-white border shadow-sm
                    ${isActive 
                      ? 'w-full sm:w-96 rounded-3xl p-6 sm:p-8 border-emerald-200 shadow-emerald-100 shadow-xl scale-100 sm:scale-105 z-20' 
                      : 'w-48 sm:w-64 rounded-full p-4 sm:p-6 border-gray-100 hover:border-emerald-100 hover:shadow-md z-10 opacity-90 hover:opacity-100'
                    }
                  `}
                >
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mb-3">
                    {ambition.department}
                  </span>
                  
                  <p className={`font-medium text-gray-800 transition-all ${isActive ? 'text-lg sm:text-xl leading-relaxed' : 'text-sm line-clamp-2'}`}>
                    "{ambition.text}"
                  </p>

                  {isActive && ambition.major && (
                    <div className="mt-6 pt-4 border-t border-emerald-50 w-full animate-fadeIn">
                      <span className="text-xs font-semibold text-gray-500">
                        طالبة - {ambition.major}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </section>
  );
};
