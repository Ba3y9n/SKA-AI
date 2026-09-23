import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { peopleData, PersonAchievement } from '../data/achievementsData';
import { ChevronLeft, ExternalLink, Link2, X } from 'lucide-react';

export const AchievementsTimeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'faculty'>('students');
  const [filterMajor, setFilterMajor] = useState<string>('الكل');
  const [filterType, setFilterType] = useState<string>('الكل');
  const [filterYear, setFilterYear] = useState<string>('الكل');
  const [selectedPerson, setSelectedPerson] = useState<PersonAchievement | null>(null);

  const validPeople = useMemo(() => peopleData.filter(p => p.source.verified), []);
  const students = useMemo(() => validPeople.filter(p => p.classification === 'طالبة' || p.classification === 'خريجة'), [validPeople]);
  const faculty = useMemo(() => validPeople.filter(p => p.classification === 'دكتورة' || p.classification === 'عضو هيئة تدريس'), [validPeople]);
  
  const currentList = activeTab === 'students' ? students : faculty;
  
  const filteredList = useMemo(() => {
    return currentList.filter(p => {
      const matchMajor = filterMajor === 'الكل' || p.major === filterMajor;
      const matchType = filterType === 'الكل' || p.type === filterType;
      const matchYear = filterYear === 'الكل' || p.year === filterYear;
      return matchMajor && matchType && matchYear;
    });
  }, [currentList, filterMajor, filterType, filterYear]);

  const uniqueMajors = ['الكل', ...Array.from(new Set(currentList.map(p => p.major)))];
  const uniqueTypes = ['الكل', ...Array.from(new Set(currentList.map(p => p.type)))];
  const uniqueYears = ['الكل', '2026', '2025', '2024', '2023'];

  return (
    <section className="relative w-full py-32 bg-[#F8FBF8] overflow-hidden z-20 font-sans" id="achievements">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full opacity-50 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_#DDF5EA_0%,_transparent_50%)]" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center lg:text-right relative z-10">
        <h2 className="text-4xl md:text-6xl font-black text-[#064C3B] mb-4">طالبات ودكتورات كلية الأعمال والاقتصاد</h2>
        <p className="text-xl md:text-2xl text-[#008F68] font-bold">وجوه صنعت أثرًا... وإنجازات تستحق أن تُروى.</p>
      </div>

      {/* Stats - Elegant */}
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-[2rem] p-8 border border-[#DDF5EA] shadow-[0_10px_40px_rgba(0,143,104,0.05)]">
          {[
            { label: 'الطالبات والخريجات', value: students.length },
            { label: 'عضوات هيئة التدريس', value: faculty.length },
            { label: 'إنجازات موثقة', value: validPeople.length },
            { label: 'مجالات التخصص', value: new Set(validPeople.map(p => p.major)).size }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center border-l last:border-0 border-gray-100">
              <span className="text-4xl font-black text-[#008F68] mb-1">{stat.value}</span>
              <span className="text-sm font-bold text-gray-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 mb-10 relative z-10">
        <div className="flex flex-wrap gap-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => { setActiveTab('students'); setFilterMajor('الكل'); setFilterType('الكل'); setFilterYear('الكل'); }}
            className={`text-2xl md:text-3xl font-black transition-all ${activeTab === 'students' ? 'text-[#064C3B]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            الطالبات والخريجات
          </button>
          <span className="text-2xl md:text-3xl text-gray-300 font-black">/</span>
          <button
            onClick={() => { setActiveTab('faculty'); setFilterMajor('الكل'); setFilterType('الكل'); setFilterYear('الكل'); }}
            className={`text-2xl md:text-3xl font-black transition-all ${activeTab === 'faculty' ? 'text-[#064C3B]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            الدكتورات وعضوات هيئة التدريس
          </button>
        </div>
      </div>

      {/* Grid Cards - Editorial */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredList.map((person) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={person.id}
                onClick={() => setSelectedPerson(person)}
                className="group bg-white rounded-[2rem] p-8 border border-emerald-50 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Decorative accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-[4rem] -z-0 transition-transform group-hover:scale-125" />
                
                <div className="relative z-10 flex items-center justify-between mb-8">
                  <div>
                    <h4 className="font-black text-[#064C3B] text-2xl mb-1">{person.nameAr}</h4>
                    <p className="text-sm text-[#008F68] font-bold">{person.major}</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[#F8FBF8] border border-[#DDF5EA] flex items-center justify-center text-[#008F68] font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                    {person.nameAr.charAt(0)}
                  </div>
                </div>

                <div className="relative z-10 flex-1">
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-[#006C4F] rounded-full text-[11px] font-black tracking-wide mb-4">
                    {person.classification}
                  </span>
                  <h5 className="font-bold text-gray-800 text-lg leading-snug">
                    {person.achievementTitle}
                  </h5>
                </div>

                <div className="relative z-10 mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-sm font-black text-gray-400">{person.year}</span>
                  <span className="text-sm font-bold text-[#008F68] flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                    عرض التفاصيل <ChevronLeft className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal / Story View */}
      <AnimatePresence>
        {selectedPerson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedPerson(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] relative"
            >
              <button 
                onClick={() => setSelectedPerson(null)}
                className="absolute top-6 left-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="bg-[#F8FBF8] p-8 md:p-12 md:w-1/3 flex flex-col items-center text-center border-b md:border-b-0 md:border-l border-emerald-50">
                <div className="w-32 h-32 rounded-full bg-white border border-[#DDF5EA] shadow-md flex items-center justify-center text-[#008F68] font-black text-5xl mb-6">
                  {selectedPerson.nameAr.charAt(0)}
                </div>
                <h3 className="text-3xl font-black text-[#064C3B] mb-2">{selectedPerson.nameAr}</h3>
                {selectedPerson.nameEn && <p className="text-sm font-bold text-gray-400 mb-4">{selectedPerson.nameEn}</p>}
                <span className="px-4 py-1.5 bg-emerald-100 text-[#006C4F] rounded-full text-sm font-bold mb-2">
                  {selectedPerson.classification}
                </span>
                <p className="text-[#008F68] font-bold">{selectedPerson.major}</p>
              </div>

              <div className="p-8 md:p-12 md:w-2/3 overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-black border border-gray-200">
                    {selectedPerson.year}
                  </span>
                  <span className="text-sm font-bold text-gray-400">{selectedPerson.type}</span>
                </div>
                
                <h4 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">{selectedPerson.achievementTitle}</h4>

                <div className="mb-10">
                  <p className="text-gray-600 leading-loose text-lg font-medium">
                    {selectedPerson.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-100">
                  {selectedPerson.linkedIn && (
                    <a href={selectedPerson.linkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-sm transition">
                      <ExternalLink className="w-4 h-4" /> عرض في LinkedIn
                    </a>
                  )}
                  {selectedPerson.officialSource && (
                    <a href={selectedPerson.officialSource} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-50 text-[#008F68] hover:bg-emerald-100 font-bold text-sm transition">
                      <Link2 className="w-4 h-4" /> المصدر الرسمي
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
