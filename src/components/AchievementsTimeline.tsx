import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Achievement {
  id: string;
  names: string;
  title: string;
  event: string;
  year: string;
  details: string;
  source: string;
}

export const AchievementsTimeline: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Female student achievements from College of Business and Economics
  const achievements: Achievement[] = [
    {
      id: "1",
      names: "فدوى المانعي ولولو الراشد",
      title: "المركز الثاني",
      event: "ملتقى الابتكار المحاسبي (مسار الحلول)",
      year: "2024",
      details: "تنافس فريقهن مع 40 فريقاً يمثلون 18 جامعة على مستوى المملكة، وقدموا حلولاً محاسبية مبتكرة ومتميزة.",
      source: "https://qu.edu.sa/"
    },
    {
      id: "2",
      names: "طالبات نادي المحاسبة",
      title: "تنظيم مبادرة 'أرقام وحقائق'",
      event: "مبادرات الكلية المجتمعية",
      year: "2023",
      details: "نظم النادي الطلابي بقيادة طالبات الكلية مبادرة تفاعلية لتعزيز الوعي المالي والمحاسبي في المجتمع المحلي.",
      source: "https://cbe.qu.edu.sa/"
    }
  ];

  return (
    <section className="relative w-full py-32 bg-[#e8f5e9] overflow-hidden flex flex-col items-center">
      
      {/* Decorative BG */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 text-center mb-20 px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-extrabold text-[#0B3D2E] mb-4"
        >
          من بنات الكلية
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-emerald-700 font-medium max-w-2xl mx-auto"
        >
          إنجازات طالبات ودكتورات كلية الأعمال والاقتصاد بجامعة القصيم التي نفخر بها.
        </motion.p>
      </div>

      {/* Interactive Orbital Timeline */}
      <div className="relative z-10 w-full max-w-6xl flex justify-center items-center h-[400px]">
        
        {/* The Path */}
        <div className="absolute w-full h-px bg-emerald-300"></div>

        <div className="flex justify-between items-center w-full max-w-4xl px-8 relative">
          {achievements.map((item, index) => {
            const isActive = activeId === item.id;
            // Alternate up/down positioning
            const isUp = index % 2 === 0;

            return (
              <div key={item.id} className="relative flex flex-col items-center justify-center">
                
                {/* Node */}
                <motion.button
                  onClick={() => setActiveId(isActive ? null : item.id)}
                  whileHover={{ scale: 1.2 }}
                  className={`w-6 h-6 rounded-full border-4 border-white shadow-lg transition-colors z-20 ${isActive ? 'bg-[#0B3D2E]' : 'bg-emerald-500'}`}
                />

                {/* Connecting Line */}
                <div className={`absolute w-px h-16 bg-emerald-300 -z-10 ${isUp ? 'bottom-full' : 'top-full'}`}></div>

                {/* Info Card (Always visible briefly, expands on click) */}
                <div className={`absolute w-48 text-center ${isUp ? 'bottom-[80px]' : 'top-[80px]'}`}>
                  <span className="block text-xs font-bold text-emerald-600 mb-1">{item.year}</span>
                  <span className="block text-sm font-bold text-gray-800 line-clamp-2">{item.names}</span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Expanded Detail Modal */}
      <AnimatePresence>
        {activeId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B3D2E]/80 backdrop-blur-md"
            onClick={() => setActiveId(null)}
          >
            {achievements.filter(a => a.id === activeId).map(achievement => (
              <div 
                key={achievement.id}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative text-center"
              >
                <button 
                  onClick={() => setActiveId(null)}
                  className="absolute top-4 left-4 text-gray-400 hover:text-gray-800 text-sm font-bold underline"
                >
                  إغلاق
                </button>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-4">{achievement.year}</span>
                <h3 className="text-2xl font-bold text-[#0B3D2E] mb-2">{achievement.names}</h3>
                <h4 className="text-lg font-semibold text-emerald-600 mb-6">{achievement.title} — {achievement.event}</h4>
                <p className="text-gray-600 leading-relaxed mb-8">{achievement.details}</p>
                <a 
                  href={achievement.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-full transition-colors"
                >
                  المصدر
                </a>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
    </section>
  );
};
