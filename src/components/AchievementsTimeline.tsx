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
    <section className="relative w-full py-32 bg-[#05110a] overflow-hidden z-20 font-sans" id="achievements">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_#10B981_0%,_transparent_70%)]" />

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-16 text-center lg:text-right relative z-10">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">طالبات ودكتورات كلية الأعمال والاقتصاد</h2>
        <p className="text-xl md:text-2xl text-emerald-400 font-bold">وجوه صنعت أثرًا... وإنجازات تستحق أن تُروى.</p>
      </div>

      {/* Stats - Minimal */}
      <div className="max-w-6xl mx-auto px-6 mb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'الطالبات والخريجات', value: students.length },
            { label: 'عضوات هيئة التدريس', value: faculty.length },
            { label: 'إنجازات موثقة', value: validPeople.length },
            { label: 'مجالات التخصص', value: new Set(validPeople.map(p => p.major)).size }
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="flex flex-col border-r border-emerald-900/50 pr-6 last:border-0"
            >
              <span className="text-4xl font-black text-emerald-300 mb-1">{stat.value}</span>
              <span className="text-sm font-medium text-gray-400">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 mb-10 relative z-10">
        <div className="flex flex-wrap gap-4 border-b border-emerald-900/30 pb-4">
          <button
            onClick={() => { setActiveTab('students'); setFilterMajor('الكل'); setFilterType('الكل'); setFilterYear('الكل'); }}
            className={`text-2xl md:text-3xl font-black transition-all ${activeTab === 'students' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
          >
            الطالبات والخريجات
          </button>
          <span className="text-2xl md:text-3xl text-gray-800 font-black">/</span>
          <button
            onClick={() => { setActiveTab('faculty'); setFilterMajor('الكل'); setFilterType('الكل'); setFilterYear('الكل'); }}
            className={`text-2xl md:text-3xl font-black transition-all ${activeTab === 'faculty' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
          >
            الدكتورات وعضوات هيئة التدريس
          </button>
        </div>
      </div>

      {/* Filters - Chips */}
      <div className="max-w-6xl mx-auto px-6 mb-12 relative z-10 flex flex-wrap gap-3">
        {[...uniqueMajors, ...uniqueTypes, ...uniqueYears].filter(f => f !== 'الكل').map(f => {
          const isActive = filterMajor === f || filterType === f || filterYear === f;
          return (
            <button
              key={f}
              onClick={() => {
                if (uniqueMajors.includes(f)) setFilterMajor(isActive ? 'الكل' : f);
                if (uniqueTypes.includes(f)) setFilterType(isActive ? 'الكل' : f);
                if (uniqueYears.includes(f)) setFilterYear(isActive ? 'الكل' : f);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                isActive 
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Grid Cards - Glassmorphism */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredList.map((person) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={person.id}
                onClick={() => setSelectedPerson(person)}
                className="group relative bg-[#091810]/80 backdrop-blur-md rounded-3xl p-6 border border-emerald-900/50 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col h-full"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-extrabold text-white text-xl mb-1">{person.nameAr}</h4>
                    <p className="text-xs text-emerald-400 font-bold">{person.major}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-black text-lg">
                    {person.nameAr.charAt(0)}
                  </div>
                </div>

                <div className="relative z-10 flex-1">
                  <span className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-gray-300 font-bold mb-3">
                    {person.type}
                  </span>
                  <h5 className="font-bold text-gray-100 text-base leading-snug">
                    {person.achievementTitle}
                  </h5>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-emerald-900/50 flex items-center justify-between">
                  <span className="text-sm font-black text-emerald-500">{person.year}</span>
                  <span className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    عرض التفاصيل <ChevronLeft className="w-3 h-3" />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
            onClick={() => setSelectedPerson(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0A1F16] border border-emerald-800/50 w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative"
            >
              <button 
                onClick={() => setSelectedPerson(null)}
                className="absolute top-6 left-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 md:p-12 overflow-y-auto">
                <div className="mb-8 border-b border-emerald-900/50 pb-8">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold mb-4 inline-block">
                    {selectedPerson.classification}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-2">{selectedPerson.nameAr}</h3>
                  {selectedPerson.nameEn && <p className="text-sm font-bold text-gray-400 mb-4">{selectedPerson.nameEn}</p>}
                  <p className="text-emerald-400 font-bold text-lg">{selectedPerson.major}</p>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-white/10 text-white rounded-full text-sm font-black border border-white/5">
                    {selectedPerson.year}
                  </span>
                  <h4 className="text-xl md:text-2xl font-bold text-emerald-50">{selectedPerson.achievementTitle}</h4>
                </div>

                <div className="mb-10">
                  <p className="text-gray-300 leading-loose text-base md:text-lg font-medium">
                    {selectedPerson.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {selectedPerson.linkedIn && (
                    <a href={selectedPerson.linkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/20 font-bold text-sm transition">
                      <ExternalLink className="w-4 h-4" /> LinkedIn
                    </a>
                  )}
                  {selectedPerson.officialSource && (
                    <a href={selectedPerson.officialSource} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/20 font-bold text-sm transition">
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
