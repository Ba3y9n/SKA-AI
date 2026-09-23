import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { peopleData, PersonAchievement } from '../data/achievementsData';
import { ChevronDown, Plus, Trash2, ImagePlus, X, RefreshCw, Sparkles, ExternalLink, Link2, Award, GraduationCap, Briefcase } from 'lucide-react';

interface UserAchievement extends Omit<PersonAchievement, 'id'> {
  id: string;
  isUserAdded: boolean;
  userToken?: string;
  userImage?: string;
}

export const AchievementsTimeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'faculty'>('students');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [myUserToken, setMyUserToken] = useState<string>('');

  // New Achievement Form State
  const [newName, setNewName] = useState('');
  const [newMajor, setNewMajor] = useState('');
  const [newType, setNewType] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem('rewaa_user_token');
    if (!token) {
      token = 'usr_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('rewaa_user_token', token);
    }
    setMyUserToken(token);

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

    setIsSubmitting(true);
    setTimeout(() => {
      const newAch: UserAchievement = {
        id: 'usr_ach_' + Date.now(),
        nameAr: newName.trim(),
        nameEn: '',
        classification: activeTab === 'students' ? 'طالبة' : 'عضو هيئة تدريس',
        major: newMajor.trim(),
        type: newType.trim() || 'إنجاز متميز',
        achievementTitle: newType.trim() || 'إنجاز أكاديمي/مهني',
        year: new Date().getFullYear().toString(),
        description: newDesc.trim(),
        source: { 
          sourceType: 'user', 
          sourceName: 'مشاركة مستخدم', 
          verified: true, 
          dateVerified: new Date().toISOString() 
        },
        isUserAdded: true,
        userToken: myUserToken,
        userImage: newImage || undefined
      };

      saveUserAchievements([newAch, ...userAchievements]);
      setIsSubmitting(false);
      setIsAddModalOpen(false);
      setNewName('');
      setNewMajor('');
      setNewType('');
      setNewDesc('');
      setNewImage(null);
    }, 400);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذا الإنجاز؟')) {
      saveUserAchievements(userAchievements.filter(a => a.id !== id));
    }
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
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saudi-50/60 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 mb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saudi-600/10 text-saudi-700 text-sm font-bold mb-4">
          <Award className="w-4 h-4 text-saudi-600" />
          طالبات كلية الأعمال والاقتصاد ودكتوراتها
        </div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-black text-saudi-700 mb-4 leading-tight"
        >
          أصوات صنعت أثرًا... وإنجازات تستحق أن تُروى
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed"
        >
          مساحة نحتفي فيها بإنجازات طالبات كلية الأعمال والاقتصاد وإسهامات دكتوراتها.
        </motion.p>
      </div>

      {/* Interactive Stats */}
      <div className="max-w-5xl mx-auto px-6 mb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 sm:p-8 rounded-[2rem] bg-saudi-100 border border-saudi-100/80 shadow-sm">
          {[
            { label: 'طالبة وخريجة', value: students.length, icon: GraduationCap },
            { label: 'دكتورة وعضوة هيئة تدريس', value: faculty.length, icon: Briefcase },
            { label: 'إجمالي الإنجازات', value: allAchievements.length, icon: Award },
            { label: 'تخصصات وأقسام', value: new Set(allAchievements.map(a => a.major)).size, icon: Sparkles }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                key={i} 
                className="text-center flex flex-col items-center justify-center p-2"
              >
                <div className="w-10 h-10 rounded-full bg-saudi-100/60 text-saudi-600 flex items-center justify-center mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-3xl sm:text-4xl font-black text-saudi-700 mb-1">{stat.value}</span>
                <span className="text-xs sm:text-sm font-bold text-gray-500">{stat.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Segmented Switch Tabs */}
      <div className="max-w-4xl mx-auto px-6 mb-12 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex bg-gray-100/80 p-1.5 rounded-full border border-gray-200/80 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-bold transition-all duration-300 ${
              activeTab === 'students' 
                ? 'bg-white text-saudi-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            الطالبات والخريجات
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-bold transition-all duration-300 ${
              activeTab === 'faculty' 
                ? 'bg-white text-saudi-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            الدكتورات وعضوات هيئة التدريس
          </button>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-saudi-600 hover:bg-saudi-700 text-white rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>+ إضافة إنجاز جديد</span>
        </button>

      </div>

      {/* Interactive Story Cards / Grid List */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentList.map((person, index) => {
              const isOwner = person.isUserAdded && person.userToken === myUserToken;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{ duration: 0.4, delay: (index % 6) * 0.08 }}
                  key={person.id}
                  className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,108,79,0.04)] hover:shadow-xl hover:border-saudi-200 transition-all duration-300 flex flex-col justify-between h-full text-right overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-saudi-50 to-transparent rounded-br-[3rem] -z-0 group-hover:scale-110 transition-transform duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-14 h-14 shrink-0 rounded-full bg-saudi-50 border border-saudi-100 flex items-center justify-center overflow-hidden shadow-sm">
                        {person.userImage ? (
                          <img src={person.userImage} alt={person.nameAr} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <span className="text-saudi-600 font-black text-xl">{person.nameAr.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {isOwner && (
                          <button 
                            onClick={(e) => handleDelete(person.id, e)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="حذف هذا الإنجاز"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="font-black text-xl text-saudi-700 mb-1 leading-tight group-hover:text-saudi-600 transition-colors">
                      {person.nameAr}
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 font-medium mb-4">
                      <span className="text-saudi-600 font-bold px-2 py-1 bg-saudi-50 rounded-md">{person.major}</span>
                      <span className="text-gold-light/90 font-bold">{person.type || person.achievementTitle}</span>
                    </div>

                    <h4 className="text-base font-bold text-gray-900 mb-2">{person.achievementTitle}</h4>
                    <p className="text-gray-600 leading-relaxed text-sm font-medium mb-6 line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                      {person.description}
                    </p>
                  </div>

                  {/* Footer links */}
                  <div className="relative z-10 pt-5 border-t border-gray-100 flex flex-wrap items-center gap-2 mt-auto">
                    {person.linkedIn && (
                      <a href={person.linkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] text-xs font-bold transition-colors w-full sm:w-auto">
                        <ExternalLink className="w-4 h-4" /> حسابه في لينكد إن
                      </a>
                    )}
                    {person.officialSource && (
                      <a href={person.officialSource} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-saudi-50 hover:bg-saudi-100 text-saudi-700 text-xs font-bold transition-colors w-full sm:w-auto">
                        <Link2 className="w-4 h-4" /> المصدر الرسمي
                      </a>
                    )}
                    {(!person.linkedIn && !person.officialSource) && (
                      <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        {person.source.sourceName}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          {currentList.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20 text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-3xl"
            >
              لا توجد إنجازات مضافة في هذه الفئة بعد.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Outro Concluding Phrase */}
      <div className="max-w-3xl mx-auto px-6 mt-28 text-center relative z-10">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-black text-saudi-700 leading-relaxed"
        >
          «كل إنجاز حكاية، وكل حكاية صوت يستحق أن يُسمع.»
        </motion.p>
      </div>

      {/* Add Achievement Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[125] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-saudi-700/60 backdrop-blur-md"
              onClick={() => setIsAddModalOpen(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto text-right z-10"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="absolute top-5 left-5 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-2xl font-black text-saudi-700 mb-1">إضافة إنجاز جديد</h3>
              <p className="text-xs text-gray-500 mb-6">
                {activeTab === 'students' ? 'توثيق إنجاز لطالبة أو خريجة' : 'توثيق إنجاز لدكتورة أو عضوة هيئة تدريس'}
              </p>
              
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">الاسم الكريم</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="مثال: نورة المحمد"
                    value={newName} 
                    onChange={e => setNewName(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-saudi-600 outline-none" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">التخصص / القسم</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="مثال: المحاسبة"
                      value={newMajor} 
                      onChange={e => setNewMajor(e.target.value)} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-saudi-600 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">نوع الإنجاز</label>
                    <input 
                      type="text" 
                      placeholder="بحث، جائزة، ابتكار..." 
                      value={newType} 
                      onChange={e => setNewType(e.target.value)} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-saudi-600 outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">نبذة عن الإنجاز والأثر</label>
                  <textarea 
                    required 
                    rows={3} 
                    placeholder="تفاصيل الإسهام أو الجائزة أو المشروع المتميز..."
                    value={newDesc} 
                    onChange={e => setNewDesc(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-saudi-600 outline-none resize-none" 
                  />
                </div>

                {/* Optional Image with Preview / Replace / Delete */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">صورة شخصية أو صورة الإنجاز (اختياري)</label>
                  {!newImage ? (
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gold-light rounded-xl cursor-pointer hover:bg-saudi-50/40 transition-colors">
                      <ImagePlus className="w-6 h-6 text-saudi-600 mb-1.5" />
                      <span className="text-xs font-bold text-saudi-700">اضغط لرفع صورة</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-28 flex items-center justify-center">
                      <img src={newImage} alt="معاينة" className="h-full w-full object-contain" />
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <label className="px-2.5 py-1 bg-black/60 hover:bg-black/80 text-white rounded-lg text-[11px] font-bold cursor-pointer flex items-center gap-1 transition-colors">
                          <RefreshCw className="w-3 h-3" />
                          <span>استبدال</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => setNewImage(null)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-saudi-600 hover:bg-saudi-700 disabled:opacity-50 text-white font-black py-3.5 rounded-xl shadow-lg transition-colors text-sm"
                  >
                    {isSubmitting ? 'جاري الإضافة...' : 'حفظ ونشر الإنجاز'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
