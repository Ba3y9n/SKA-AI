import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { peopleData, projectsData, PersonAchievement } from '../data/achievementsData';
import { GraduationCap, BookOpen, Star, ChevronLeft, ChevronRight, ExternalLink, Link2, Info, Building2, MapPin } from 'lucide-react';

export const AchievementsTimeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'faculty'>('students');
  const [filterMajor, setFilterMajor] = useState<string>('الكل');
  const [filterType, setFilterType] = useState<string>('الكل');
  const [filterYear, setFilterYear] = useState<string>('الكل');
  const [selectedPerson, setSelectedPerson] = useState<PersonAchievement | null>(null);
  const [showSources, setShowSources] = useState(false);

  // Derived Data
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

  // Unique Filter Options
  const uniqueMajors = ['الكل', ...Array.from(new Set(currentList.map(p => p.major)))];
  const uniqueTypes = ['الكل', ...Array.from(new Set(currentList.map(p => p.type)))];
  const uniqueYears = ['الكل', '2026', '2025', '2024', '2023'];

  // Stats
  const totalStudents = students.length;
  const totalFaculty = faculty.length;
  const totalAchievements = validPeople.length;
  const totalFields = new Set(validPeople.map(p => p.major)).size;

  return (
    <section className="relative w-full bg-slate-50 overflow-hidden font-sans pb-24" id="achievements">
      
      {/* 1. Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 bg-emerald-50/50 border-b border-emerald-100 overflow-hidden">
        {/* Subtle Decorative Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_#10B981_1px,_transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Avatar Integration */}
        <div className="absolute top-10 left-10 opacity-30 pointer-events-none hidden lg:block">
          <img src="/rewaa_avatar_real_transparent.png" alt="" className="w-64 h-64 object-contain filter grayscale opacity-20 drop-shadow-2xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-black text-[#0B3D2E] tracking-tight mb-6"
          >
            طالبات ودكتورات كلية الأعمال والاقتصاد
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl sm:text-2xl text-emerald-800 font-bold mb-4"
          >
            وجوه صنعت أثرًا... وإنجازات تستحق أن تُروى
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-emerald-600/80 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            مساحة نحتفي فيها بإنجازات طالبات وخريجات وعضوات هيئة التدريس في كلية الأعمال والاقتصاد بجامعة القصيم.
          </motion.p>
        </div>
      </div>

      {/* 2. Statistics Dynamic Cards */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 -mt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shadow-xl shadow-emerald-900/5 rounded-3xl bg-white border border-emerald-50 p-4 sm:p-6">
          {[
            { label: 'طالبة وخريجة', value: totalStudents, icon: GraduationCap },
            { label: 'عضو هيئة تدريس', value: totalFaculty, icon: Building2 },
            { label: 'إنجاز موثق', value: totalAchievements, icon: Star },
            { label: 'مجال تخصص', value: totalFields, icon: BookOpen }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 text-center rounded-2xl bg-slate-50 hover:bg-emerald-50 transition-colors">
              <stat.icon className="w-6 h-6 text-emerald-600 mb-2 opacity-80" />
              <span className="text-2xl sm:text-3xl font-black text-[#0B3D2E]">{stat.value}</span>
              <span className="text-xs sm:text-sm font-bold text-gray-500 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Main Content: Tabs & Filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        
        {/* Toggle Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 p-1 rounded-full shadow-inner border border-gray-200 w-full sm:w-auto">
            <button
              onClick={() => { setActiveTab('students'); setFilterMajor('الكل'); setFilterType('الكل'); setFilterYear('الكل'); }}
              className={`flex-1 sm:px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-[#0B3D2E] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              الطالبات والخريجات
            </button>
            <button
              onClick={() => { setActiveTab('faculty'); setFilterMajor('الكل'); setFilterType('الكل'); setFilterYear('الكل'); }}
              className={`flex-1 sm:px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'faculty' ? 'bg-[#0B3D2E] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              الدكاترة وعضوات هيئة التدريس
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-10 items-center justify-center">
          <select value={filterMajor} onChange={e => setFilterMajor(e.target.value)} className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[160px] shadow-sm">
            {uniqueMajors.map(m => <option key={m} value={m}>{m === 'الكل' ? 'جميع التخصصات' : m}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[160px] shadow-sm">
            {uniqueTypes.map(t => <option key={t} value={t}>{t === 'الكل' ? 'جميع الإنجازات' : t}</option>)}
          </select>
          <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[160px] shadow-sm">
            {uniqueYears.map(y => <option key={y} value={y}>{y === 'الكل' ? 'جميع السنوات' : y}</option>)}
          </select>
        </div>

        {/* 4. People Cards Grid */}
        {filteredList.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-semibold text-lg bg-white rounded-3xl border border-gray-100 shadow-sm">
            لا توجد إنجازات تطابق الفرز الحالي.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredList.map((person) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={person.id}
                  onClick={() => setSelectedPerson(person)}
                  className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full hover:-translate-y-1.5"
                >
                  {/* Decorative Hover Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-[#0B3D2E] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {person.nameAr.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#0B3D2E] text-lg leading-tight mb-1">{person.nameAr}</h4>
                      <p className="text-xs text-gray-500 font-bold">{person.major}</p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-md text-[10px] font-black tracking-wide mb-3">
                      {person.type}
                    </div>
                    <h5 className="font-bold text-gray-800 text-base leading-snug mb-3">
                      {person.achievementTitle}
                    </h5>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-sm font-black text-gray-400">{person.year}</span>
                    <span className="text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      اكتشف الإنجاز <ChevronLeft className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 5. Projects Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-32">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-black text-[#0B3D2E] mb-4">مشاريع صنعت الفرق</h3>
          <p className="text-gray-500 font-medium">مشاريع طلابية ابتكارية تم توثيقها في المعارض الأكاديمية.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectsData.map(proj => (
            <div key={proj.id} className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-2xl font-black text-emerald-700">{proj.projectName}</h4>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{proj.year}</span>
              </div>
              <p className="text-sm text-gray-600 font-semibold mb-4 leading-relaxed bg-gray-50 p-4 rounded-xl">
                {proj.idea}
              </p>
              <div className="mb-4">
                <span className="block text-xs text-gray-400 font-bold mb-2">فريق العمل:</span>
                <div className="flex flex-wrap gap-2">
                  {proj.team.map(member => (
                    <span key={member} className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-md text-xs font-bold">{member}</span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500 font-bold">
                <MapPin className="w-4 h-4 text-gray-400" />
                المصدر: {proj.sourceName}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Achievement Journey (Timeline Alternative) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-32">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-black text-[#0B3D2E] mb-4">رحلة الإنجازات</h3>
        </div>
        <div className="relative w-full overflow-x-auto pb-8 hide-scrollbar">
          <div className="flex items-center min-w-[600px] justify-between relative px-10">
            {/* The Path */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-emerald-100 -translate-y-1/2 z-0"></div>
            
            {['2023', '2024', '2025', '2026'].map((year) => (
              <div key={year} className="relative z-10 flex flex-col items-center group cursor-default">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-emerald-50 shadow-md flex items-center justify-center text-[#0B3D2E] font-black text-lg transition-transform group-hover:scale-110 group-hover:border-emerald-200">
                  {year}
                </div>
                <div className="mt-4 text-center w-32">
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">
                    {validPeople.filter(p => p.year === year).length} إنجازات
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Sources Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-24 text-center">
        <h4 className="text-xl font-black text-gray-800 mb-3">كيف نوثّق الإنجازات؟</h4>
        <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed">
          تعتمد هذه الصفحة حصرياً على مصادر موثوقة تم التحقق منها مثل الموقع الرسمي لجامعة القصيم، الحسابات الرسمية لكلية الأعمال والاقتصاد، والمنشورات المهنية المؤكدة عبر LinkedIn.
        </p>
        <button 
          onClick={() => setShowSources(!showSources)}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50 transition"
        >
          <Info className="w-4 h-4" />
          <span>{showSources ? 'إخفاء سجل المصادر' : 'عرض سجل المصادر'}</span>
        </button>
        
        <AnimatePresence>
          {showSources && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 text-right overflow-hidden"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-sm">
                <ul className="space-y-4">
                  {validPeople.map(p => (
                    <li key={p.id} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                      <strong className="text-emerald-800 block mb-1">{p.nameAr}</strong>
                      <span className="text-gray-500 text-xs flex items-center gap-2">
                        <Link2 className="w-3 h-3" />
                        تم التحقق عبر: {p.source.sourceName} ({p.source.dateVerified})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 8. Detailed Person Modal */}
      <AnimatePresence>
        {selectedPerson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedPerson(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-emerald-50/50 p-6 sm:p-8 flex items-start justify-between border-b border-emerald-100 relative">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0B3D2E] mb-1">{selectedPerson.nameAr}</h3>
                  {selectedPerson.nameEn && <p className="text-xs font-bold text-gray-400 mb-3">{selectedPerson.nameEn}</p>}
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-emerald-600 text-white rounded-md text-xs font-bold">{selectedPerson.classification}</span>
                    <span className="px-3 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-md text-xs font-bold">{selectedPerson.major}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPerson(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-700 shadow-sm border border-gray-100"
                >
                  <ChevronLeft className="w-5 h-5 -ml-0.5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-black">
                    {selectedPerson.year}
                  </span>
                  <h4 className="text-xl font-bold text-gray-800">{selectedPerson.achievementTitle}</h4>
                </div>

                <div className="mb-8">
                  <p className="text-gray-600 leading-loose text-sm sm:text-base font-medium">
                    {selectedPerson.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                  {selectedPerson.linkedIn && (
                    <a href={selectedPerson.linkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-sm transition">
                      <ExternalLink className="w-4 h-4" /> LinkedIn
                    </a>
                  )}
                  {selectedPerson.officialSource && (
                    <a href={selectedPerson.officialSource} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-sm transition">
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
