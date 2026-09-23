import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { peopleData, PersonAchievement } from '../data/achievementsData';
import { ChevronDown, Plus, Trash2, ImagePlus, X } from 'lucide-react';

interface UserAchievement extends Omit<PersonAchievement, 'id'> {
  id: string;
  isUserAdded: boolean;
  userImage?: string;
}

export const AchievementsTimeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'faculty'>('students');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Achievement Form State
  const [newName, setNewName] = useState('');
  const [newMajor, setNewMajor] = useState('');
  const [newType, setNewType] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState<string | undefined>();

  useEffect(() => {
    const saved = localStorage.getItem('user_achievements');
    if (saved) {
      try {
        setUserAchievements(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse user achievements');
      }
    }
  }, []);

  const saveUserAchievements = (achievements: UserAchievement[]) => {
    setUserAchievements(achievements);
    try {
      localStorage.setItem('user_achievements', JSON.stringify(achievements));
    } catch (e) {
      alert('مساحة التخزين ممتلئة.');
    }
  };

  const allAchievements = useMemo(() => {
    const base: UserAchievement[] = peopleData.filter(p => p.source.verified).map(p => ({ ...p, isUserAdded: false }));
    return [...userAchievements, ...base];
  }, [userAchievements]);

  const students = useMemo(() => allAchievements.filter(p => p.classification === 'طالبة' || p.classification === 'خريجة'), [allAchievements]);
  const faculty = useMemo(() => allAchievements.filter(p => p.classification === 'دكتورة' || p.classification === 'عضو هيئة تدريس'), [allAchievements]);
  
  const currentList = activeTab === 'students' ? students : faculty;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newMajor || !newDesc) return;

    const newAch: UserAchievement = {
      id: 'usr_' + Date.now(),
      nameAr: newName,
      nameEn: '',
      classification: activeTab === 'students' ? 'طالبة' : 'عضو هيئة تدريس',
      major: newMajor,
      type: newType || 'إنجاز عام',
      achievementTitle: newType || 'إنجاز',
      year: new Date().getFullYear().toString(),
      description: newDesc,
      source: { 
        sourceType: 'user', 
        sourceName: 'User Added', 
        verified: true, 
        dateVerified: new Date().toISOString() 
      },
      isUserAdded: true,
      userImage: newImage
    };

    saveUserAchievements([newAch, ...userAchievements]);
    setIsAddModalOpen(false);
    setNewName(''); setNewMajor(''); setNewType(''); setNewDesc(''); setNewImage(undefined);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    saveUserAchievements(userAchievements.filter(a => a.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="relative w-full py-32 bg-white overflow-hidden z-20 border-t border-gray-100" id="achievements">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 mb-16 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-[#064C3B] mb-6 leading-tight"
        >
          أصوات صنعت أثرًا... وإنجازات تستحق أن تُروى
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-[#008F68] font-medium leading-relaxed"
        >
          مساحة تحتفي بإنجازات طالبات كلية الأعمال والاقتصاد، وتجارب عضوات هيئة التدريس وإسهاماتهن.
        </motion.p>
      </div>

      {/* Interactive Stats */}
      <div className="max-w-5xl mx-auto px-6 mb-20 relative z-10">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { label: 'طالبة وخريجة', value: students.length },
            { label: 'دكتورة وعضوة هيئة تدريس', value: faculty.length },
            { label: 'إجمالي الإنجازات', value: allAchievements.length },
            { label: 'تخصصات', value: new Set(allAchievements.map(a => a.major)).size }
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              key={i} 
              className="text-center flex flex-col items-center"
            >
              <span className="text-5xl md:text-6xl font-black text-[#008F68] mb-2 drop-shadow-sm">{stat.value}</span>
              <span className="text-sm md:text-base font-bold text-gray-500">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 mb-12 relative z-10 flex justify-center">
        <div className="flex bg-[#F8FBF8] p-2 rounded-full border border-gray-200 shadow-sm relative">
          <div 
            className="absolute top-2 bottom-2 w-[50%] bg-white rounded-full shadow-sm border border-gray-100 transition-all duration-500 ease-out"
            style={{ left: activeTab === 'students' ? '2%' : '48%', width: '48%' }}
          />
          <button
            onClick={() => setActiveTab('students')}
            className={`relative z-10 px-8 py-3 rounded-full text-lg md:text-xl font-bold transition-colors duration-300 w-48 md:w-64 ${activeTab === 'students' ? 'text-[#064C3B]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            الطالبات والخريجات
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`relative z-10 px-8 py-3 rounded-full text-lg md:text-xl font-bold transition-colors duration-300 w-48 md:w-64 ${activeTab === 'faculty' ? 'text-[#064C3B]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            الدكتورات وعضوات هيئة التدريس
          </button>
        </div>
      </div>

      {/* Add Button */}
      <div className="max-w-4xl mx-auto px-6 mb-10 text-left">
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#008F68] hover:bg-[#064C3B] text-white rounded-full font-bold transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          إضافة إنجاز جديد
        </button>
      </div>

      {/* Interactive List */}
      <div className="max-w-4xl mx-auto px-6 relative z-10 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {currentList.map((person, index) => {
            const isExpanded = expandedId === person.id;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
                key={person.id}
                onClick={() => setExpandedId(isExpanded ? null : person.id)}
                className={`group mb-4 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${isExpanded ? 'bg-[#F8FBF8] border-[#008F68] shadow-lg' : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-[#DDF5EA]'}`}
              >
                <div className="p-6 md:p-8 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    {/* Avatar or Uploaded Image */}
                    <div className="w-16 h-16 shrink-0 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden">
                      {person.userImage ? (
                        <img src={person.userImage} alt={person.nameAr} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <span className="text-[#008F68] font-black text-2xl">{person.nameAr.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className={`font-black transition-colors ${isExpanded ? 'text-[#064C3B] text-2xl' : 'text-gray-800 text-xl group-hover:text-[#008F68]'}`}>
                        {person.nameAr}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2 items-center">
                        <span className="text-[#008F68] font-bold text-sm">{person.major}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-gray-500 font-medium text-sm">{person.type || person.achievementTitle}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {person.isUserAdded && (
                      <button 
                        onClick={(e) => handleDelete(person.id, e)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-gray-400">
                      <ChevronDown className="w-6 h-6" />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 md:px-8 pb-8 overflow-hidden"
                    >
                      <div className="pt-6 border-t border-gray-200">
                        <p className="text-gray-700 leading-loose text-lg font-medium">
                          {person.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          
          {currentList.length === 0 && (
            <div className="text-center py-20 text-gray-400 font-bold">لا توجد إنجازات مضافة بعد.</div>
          )}
        </AnimatePresence>
      </div>

      {/* Outro Text */}
      <div className="max-w-3xl mx-auto px-6 mt-32 text-center relative z-10">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-black text-[#064C3B] leading-relaxed drop-shadow-sm"
        >
          كل إنجاز حكاية،<br />
          وكل حكاية صوت يستحق أن يُسمع.
        </motion.p>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#064C3B]/60 backdrop-blur-md"
              onClick={() => setIsAddModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-3xl p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 left-6 text-gray-400 hover:text-[#064C3B]"><X className="w-6 h-6" /></button>
              <h3 className="text-2xl font-black text-[#064C3B] mb-6">إضافة إنجاز جديد</h3>
              
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">الاسم</label>
                  <input type="text" required value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#008F68] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">التخصص</label>
                  <input type="text" required value={newMajor} onChange={e => setNewMajor(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#008F68] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">نوع الإنجاز (اختياري)</label>
                  <input type="text" placeholder="مثال: بحث علمي، جائزة، مبادرة..." value={newType} onChange={e => setNewType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#008F68] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">نبذة عن الإنجاز</label>
                  <textarea required rows={3} value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#008F68] outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">صورة للإنجاز (اختياري)</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-[#008F68] transition-colors">
                    {newImage ? (
                      <img src={newImage} alt="Preview" className="h-full object-contain py-2" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImagePlus className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">اضغط لرفع صورة</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <button type="submit" className="w-full bg-[#008F68] text-white font-black py-4 rounded-xl mt-4 hover:bg-[#064C3B] transition-colors shadow-lg">إضافة الإنجاز</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
