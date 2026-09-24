import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { peopleData, PersonAchievement } from '../data/achievementsData';
import { Plus, Trash2, ImagePlus, X, Award, GraduationCap, Briefcase, Sparkles, ExternalLink, Link2, AlertCircle } from 'lucide-react';
import { 
  DatabaseAchievement, 
  fetchDatabaseAchievements, 
  submitDatabaseAchievement, 
  deleteDatabaseAchievement, 
  getAchievementUserToken 
} from '../services/achievementsService';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const AchievementsTimeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'faculty'>('students');
  const [dbAchievements, setDbAchievements] = useState<DatabaseAchievement[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [myUserToken, setMyUserToken] = useState<string>('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeletingRecord, setIsDeletingRecord] = useState(false);

  // New Achievement Form State
  const [newName, setNewName] = useState('');
  const [newMajor, setNewMajor] = useState('');
  const [newType, setNewType] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLinkedIn, setNewLinkedIn] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await fetchDatabaseAchievements();
      setDbAchievements(data);
    } catch (e) {
      console.error('Failed to load achievements', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = getAchievementUserToken();
    setMyUserToken(token);
    loadData();

    // Poll every 8 seconds for multi-user real-time sync
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  const allAchievements = useMemo(() => {
    const base: DatabaseAchievement[] = peopleData.filter(p => p.source.verified).map(p => ({ 
      ...p, 
      isUserAdded: false 
    }));
    return [...dbAchievements, ...base];
  }, [dbAchievements]);

  const students = useMemo(() => allAchievements.filter(p => p.classification === 'طالبة' || p.classification === 'خريجة'), [allAchievements]);
  const faculty = useMemo(() => allAchievements.filter(p => p.classification === 'دكتورة' || p.classification === 'عضو هيئة تدريس'), [allAchievements]);
  
  const currentList = activeTab === 'students' ? students : faculty;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newMajor || !newDesc) return;

    setIsSubmitting(true);
    try {
      const created = await submitDatabaseAchievement({
        nameAr: newName.trim(),
        nameEn: '',
        classification: activeTab === 'students' ? 'طالبة' : 'عضو هيئة تدريس',
        major: newMajor.trim(),
        type: newType.trim() || 'إنجاز متميز',
        achievementTitle: newType.trim() || 'إنجاز أكاديمي/مهني',
        year: new Date().getFullYear().toString(),
        description: newDesc.trim(),
        linkedIn: newLinkedIn.trim() || undefined,
        officialSource: newSource.trim() || undefined,
        imageUrl: newImage || undefined
      });

      setDbAchievements(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      setNewName('');
      setNewMajor('');
      setNewType('');
      setNewDesc('');
      setNewLinkedIn('');
      setNewSource('');
      setNewImage(null);
    } catch (err) {
      console.error('Failed to submit achievement:', err);
      alert('حدث خطأ أثناء حفظ الإنجاز، يرجى المحاولة مرة ثانية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeletingRecord(true);
    try {
      const success = await deleteDatabaseAchievement(deleteTargetId);
      if (success) {
        setDbAchievements(prev => prev.filter(a => a.id !== deleteTargetId));
        setDeleteTargetId(null);
      } else {
        alert('تعذر حذف الإنجاز حالياً.');
      }
    } catch (err) {
      console.error('Error deleting achievement:', err);
    } finally {
      setIsDeletingRecord(false);
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saudi-50 border border-saudi-200/60 text-saudi-700 text-sm font-bold mb-4 shadow-sm">
          <Award className="w-4 h-4 text-gold-dark" />
          <span>إنجازات كلية الأعمال والاقتصاد</span>
        </div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-black text-saudi-700 mb-4 leading-tight"
        >
          أصوات تحكي أثرًا لا يُنسى
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed"
        >
          مساحة نحتفي فيها بإنجازات طالبات وأعضاء هيئة التدريس في كلية الأعمال والاقتصاد.
        </motion.p>
      </div>

      {/* Interactive Dynamic Counters */}
      <div className="max-w-5xl mx-auto px-6 mb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 sm:p-8 rounded-[2rem] bg-saudi-50/70 border border-saudi-200/60 shadow-sm">
          {[
            { label: 'طالبات وخريجات الكلية', value: students.length, icon: GraduationCap },
            { label: 'أعضاء هيئة التدريس', value: faculty.length, icon: Briefcase },
            { label: 'إجمالي الإنجازات الموثقة', value: allAchievements.length, icon: Award },
            { label: 'التخصصات والأقسام', value: new Set(allAchievements.map(a => a.major)).size, icon: Sparkles }
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
                <div className="w-12 h-12 rounded-full bg-white text-saudi-600 border border-saudi-200/60 flex items-center justify-center mb-3 shadow-sm">
                  <Icon className="w-6 h-6 text-saudi-600" />
                </div>
                <span className="text-3xl sm:text-4xl font-black text-saudi-700 mb-1">+{stat.value}</span>
                <span className="text-xs sm:text-sm font-bold text-gray-500">{stat.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Segmented Switch Tabs */}
      <div className="max-w-5xl mx-auto px-6 mb-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        
        <div className="flex flex-col sm:flex-row bg-gray-100/80 p-1.5 rounded-[2rem] sm:rounded-full border border-gray-200/80 w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 px-4 sm:px-8 py-3 rounded-full text-sm sm:text-base md:text-lg font-bold transition-all duration-300 ${
              activeTab === 'students' 
                ? 'bg-white text-saudi-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            طالبات كلية الأعمال والاقتصاد
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`flex-1 px-4 sm:px-8 py-3 rounded-full text-sm sm:text-base md:text-lg font-bold transition-all duration-300 ${
              activeTab === 'faculty' 
                ? 'bg-white text-saudi-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            أعضاء هيئة التدريس بكلية الأعمال والاقتصاد
          </button>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-saudi-600 hover:bg-saudi-700 text-white rounded-full font-bold text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap w-full lg:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة إنجاز جديد</span>
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
              const isOwner = person.isUserAdded && (person.userToken === myUserToken || !person.userToken);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{ duration: 0.4, delay: (index % 6) * 0.08 }}
                  key={person.id}
                  className="group relative bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,108,79,0.04)] hover:shadow-xl hover:border-gold/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full text-right overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-14 h-14 shrink-0 rounded-full bg-saudi-50 border border-saudi-100 flex items-center justify-center overflow-hidden shadow-sm">
                        {person.imageUrl ? (
                          <img src={person.imageUrl} alt={person.nameAr} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <span className="text-saudi-600 font-black text-xl">{person.nameAr.charAt(0)}</span>
                        )}
                      </div>
                      
                      {/* Deletion Button for Added Achievements */}
                      <div className="flex items-center gap-2">
                        {isOwner && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTargetId(person.id);
                            }}
                            className="p-2 rounded-full transition-all duration-300 text-red-400 hover:text-white hover:bg-red-500 border border-transparent hover:border-red-500 shadow-sm"
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
        </AnimatePresence>
      </div>

      {/* Add Achievement Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[125] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-saudi-700/60 backdrop-blur-md" 
              onClick={() => setIsAddModalOpen(false)} 
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-right"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-saudi-700">إضافة إنجاز جديد</h3>
                  <Award className="w-6 h-6 text-gold-dark" />
                </div>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">الاسم الكامل *</label>
                  <input 
                    type="text" 
                    required 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)} 
                    placeholder="مثال: سارة العتيبي" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saudi-600 focus:ring-1 focus:ring-saudi-600 outline-none text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">القسم / التخصص *</label>
                  <input 
                    type="text" 
                    required 
                    value={newMajor} 
                    onChange={e => setNewMajor(e.target.value)} 
                    placeholder="مثال: إدارة الأعمال / نظم المعلومات الإدارية" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saudi-600 focus:ring-1 focus:ring-saudi-600 outline-none text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">نوع الإنجاز / عنوانه</label>
                  <input 
                    type="text" 
                    value={newType} 
                    onChange={e => setNewType(e.target.value)} 
                    placeholder="مثال: المركز الأول في هاكاثون الابتكار" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saudi-600 focus:ring-1 focus:ring-saudi-600 outline-none text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">تفاصيل الإنجاز *</label>
                  <textarea 
                    required 
                    rows={3} 
                    value={newDesc} 
                    onChange={e => setNewDesc(e.target.value)} 
                    placeholder="صفي إنجازكِ وأثره وكيف ساهم في رفع اسم الكلية والوطن..." 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saudi-600 focus:ring-1 focus:ring-saudi-600 outline-none text-right resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">رابط حساب LinkedIn (اختياري)</label>
                  <input 
                    type="url" 
                    value={newLinkedIn} 
                    onChange={e => setNewLinkedIn(e.target.value)} 
                    placeholder="https://linkedin.com/in/username" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saudi-600 focus:ring-1 focus:ring-saudi-600 outline-none text-right text-ltr"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)} 
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="flex-1 py-3 px-4 rounded-xl bg-saudi-600 hover:bg-saudi-700 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'جاري الحفظ في قاعدة البيانات...' : 'حفظ ونشر الإنجاز'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        title="تأكيد حذف الإنجاز"
        message="هل أنتِ متأكدة من رغبتك في حذف هذا الإنجاز من السجل العام؟"
        isDeleting={isDeletingRecord}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

    </section>
  );
};
