import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  ImagePlus, 
  X, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  ExternalLink, 
  ArrowLeft, 
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  DatabaseAchievement, 
  fetchDatabaseAchievements, 
  submitDatabaseAchievement, 
  deleteDatabaseAchievement, 
  getAchievementUserToken 
} from '../services/achievementsService';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface AchievementsTimelineProps {
  onViewAllClick?: () => void;
}

const PREVIEW_LIMIT = 6;

export const AchievementsTimeline: React.FC<AchievementsTimelineProps> = ({ onViewAllClick }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'faculty'>('all');
  const [dbAchievements, setDbAchievements] = useState<DatabaseAchievement[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [myUserToken, setMyUserToken] = useState<string>('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeletingRecord, setIsDeletingRecord] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New Achievement Form State
  const [newName, setNewName] = useState('');
  const [newClassification, setNewClassification] = useState<'طالبة' | 'خريجة' | 'عضو هيئة تدريس'>('طالبة');
  const [newMajor, setNewMajor] = useState('نظم المعلومات الإدارية');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('ابتكار ومنافسات');
  const [newDesc, setNewDesc] = useState('');
  const [newLinkedIn, setNewLinkedIn] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await fetchDatabaseAchievements();
      setDbAchievements(data);
    } catch (e) {
      console.error('Failed to load achievements in timeline', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = getAchievementUserToken();
    setMyUserToken(token);
    loadData();

    // Poll every 6 seconds for multi-user real-time sync across devices
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, []);

  const students = useMemo(() => dbAchievements.filter(p => p.classification === 'طالبة' || p.classification === 'خريجة'), [dbAchievements]);
  const faculty = useMemo(() => dbAchievements.filter(p => p.classification === 'دكتورة' || p.classification === 'عضو هيئة تدريس'), [dbAchievements]);
  
  const filteredList = useMemo(() => {
    if (activeTab === 'students') return students;
    if (activeTab === 'faculty') return faculty;
    return dbAchievements;
  }, [activeTab, students, faculty, dbAchievements]);

  const previewList = useMemo(() => {
    return filteredList.slice(0, PREVIEW_LIMIT);
  }, [filteredList]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTitle.trim() || !newDesc.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const created = await submitDatabaseAchievement({
        nameAr: newName.trim(),
        nameEn: '',
        classification: newClassification,
        major: newMajor,
        achievementTitle: newTitle.trim(),
        type: newType,
        year: new Date().getFullYear().toString(),
        description: newDesc.trim(),
        linkedIn: newLinkedIn.trim() || undefined,
        officialSource: newSource.trim() || undefined,
        imageUrl: newImage || undefined
      });

      setDbAchievements(prev => [created, ...prev]);
      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
        setIsAddModalOpen(false);
        setNewName('');
        setNewTitle('');
        setNewDesc('');
        setNewLinkedIn('');
        setNewSource('');
        setNewImage(null);
      }, 1400);
    } catch (err: any) {
      console.error('Failed to submit achievement:', err);
      setSubmitError('تعذر حفظ الإنجاز حالياً، يرجى المحاولة مرة ثانية.');
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
    <section className="relative w-full py-28 bg-white overflow-hidden z-20 border-t border-gray-100" id="achievements">
      
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
          className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto"
        >
          مساحة نحتفي فيها بإنجازات طالبات وأعضاء هيئة التدريس في كلية الأعمال والاقتصاد.
        </motion.p>
      </div>

      {/* Dynamic Counters Based on Real Data */}
      <div className="max-w-5xl mx-auto px-6 mb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 sm:p-8 rounded-[2rem] bg-saudi-50/70 border border-saudi-200/60 shadow-sm">
          {[
            { label: 'طالبات وخريجات الكلية', value: students.length, icon: GraduationCap },
            { label: 'أعضاء هيئة التدريس', value: faculty.length, icon: Briefcase },
            { label: 'إجمالي الإنجازات الموثقة', value: dbAchievements.length, icon: Award },
            { label: 'التخصصات والأقسام', value: new Set(dbAchievements.map(a => a.major)).size, icon: Sparkles }
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
                <span className="text-3xl sm:text-4xl font-black text-saudi-700 mb-1">{stat.value}</span>
                <span className="text-xs sm:text-sm font-bold text-gray-500">{stat.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Segmented Switch Tabs & Actions */}
      <div className="max-w-6xl mx-auto px-6 mb-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        <div className="flex flex-wrap bg-gray-100/80 p-1.5 rounded-full border border-gray-200/80 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'all' 
                ? 'bg-white text-saudi-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            جميع الإنجازات ({dbAchievements.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'students' 
                ? 'bg-white text-saudi-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            الطالبات والخريجات ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'faculty' 
                ? 'bg-white text-saudi-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            أعضاء هيئة التدريس ({faculty.length})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {dbAchievements.length > 0 && onViewAllClick && (
            <button
              onClick={onViewAllClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-saudi-50 hover:bg-saudi-100 text-saudi-700 border border-saudi-200 font-bold text-sm shadow-sm transition-all"
            >
              <Layers className="w-4 h-4 text-gold-dark" />
              <span>عرض جميع الإنجازات ({dbAchievements.length})</span>
            </button>
          )}

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-saudi-600 hover:bg-saudi-700 text-white rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة إنجاز جديد</span>
          </button>
        </div>

      </div>

      {/* Grid List or Empty State */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 min-h-[300px]">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-saudi-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-bold">جاري تحميل الإنجازات المعتمدة...</p>
          </div>
        ) : dbAchievements.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-[2.5rem] bg-saudi-50/50 border border-saudi-100 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-saudi-100 text-saudi-600 flex items-center justify-center mb-5 shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-saudi-800 mb-2">هنا تُخلد إنجازات طالبات وأعضاء الكلية ✨</h3>
            <p className="text-base text-gray-600 font-medium mb-8">كوني أول من يوثق إنجازه في سجل الكلية الذهبي.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-saudi-600 hover:bg-saudi-700 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة إنجاز جديد</span>
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {previewList.map((person, index) => {
                  const isOwner = person.isUserAdded && (person.userToken === myUserToken || !person.userToken);

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-5%" }}
                      transition={{ duration: 0.35, delay: (index % 6) * 0.06 }}
                      key={person.id}
                      className="group relative bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,108,79,0.04)] hover:shadow-xl hover:border-gold/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full text-right overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <div className="relative z-10 flex-1">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center gap-3.5">
                            <div className="w-14 h-14 shrink-0 rounded-2xl bg-saudi-50 border border-saudi-100 flex items-center justify-center overflow-hidden shadow-sm">
                              {person.imageUrl ? (
                                <img src={person.imageUrl} alt={person.nameAr} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              ) : (
                                <span className="text-saudi-600 font-black text-xl">{person.nameAr.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-black text-lg text-saudi-800 mb-0.5 group-hover:text-saudi-600 transition-colors">
                                {person.nameAr}
                              </h3>
                              <span className="text-xs text-gray-500 font-bold">{person.classification || 'طالبة'}</span>
                            </div>
                          </div>
                          
                          {/* Owner Deletion Button */}
                          {isOwner && (
                            <button 
                              onClick={() => setDeleteTargetId(person.id)}
                              className="p-2 rounded-full text-red-400 hover:text-white hover:bg-red-500 border border-red-100 transition-all shadow-sm"
                              title="حذف هذا الإنجاز"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 font-medium mb-4">
                          <span className="text-saudi-700 font-bold px-2.5 py-1 bg-saudi-50 rounded-lg border border-saudi-100">{person.major}</span>
                          <span className="text-gold-dark font-bold px-2.5 py-1 bg-gold/10 rounded-lg border border-gold/20">{person.type || person.achievementTitle}</span>
                        </div>

                        <h4 className="text-base font-bold text-gray-900 mb-2">{person.achievementTitle}</h4>
                        <p className="text-gray-600 leading-relaxed text-sm font-medium mb-6 line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                          {person.description}
                        </p>
                      </div>

                      {/* Footer links */}
                      <div className="relative z-10 pt-4 border-t border-gray-100 flex items-center justify-between mt-auto text-xs text-gray-500">
                        <div className="flex items-center gap-1.5 font-bold text-gray-400">
                          <Calendar className="w-3.5 h-3.5 text-saudi-600" />
                          <span>{person.year || '2026'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {person.linkedIn && (
                            <a href={person.linkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] font-bold transition-colors">
                              <ExternalLink className="w-3 h-3" /> LinkedIn
                            </a>
                          )}
                          {person.officialSource && (
                            <a href={person.officialSource} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors">
                              <ExternalLink className="w-3 h-3" /> توثيق
                            </a>
                          )}
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Bottom CTA to View All Achievements */}
            {dbAchievements.length > PREVIEW_LIMIT && onViewAllClick && (
              <div className="mt-14 text-center">
                <button
                  onClick={onViewAllClick}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-saudi-600 hover:bg-saudi-700 text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <span>عرض جميع الإنجازات ({dbAchievements.length})</span>
                  <ArrowLeft className="w-5 h-5 text-gold-light" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Achievement Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-saudi-950/80 backdrop-blur-md"
              onClick={() => setIsAddModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white text-saudi-900 w-full max-w-xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto z-10 text-right"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 left-5 text-gray-400 hover:text-saudi-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-saudi-50 text-saudi-600 flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-saudi-600" />
                </div>
                <h3 className="text-2xl font-black text-saudi-900 mb-1">توثيق إنجاز جديد</h3>
                <p className="text-sm font-bold text-gray-500">شاركينا إنجازكِ الأكاديمي أو المهني ليكون فخرًا للكلية والوطن.</p>
              </div>

              {submitSuccess ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black text-saudi-900 mb-2">تم توثيق الإنجاز بنجاح!</h4>
                  <p className="text-gray-600 text-sm">إنجازكِ متاح الآن في سجل الإنجازات المعتمد.</p>
                </div>
              ) : (
                <form onSubmit={handleAddSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل *</label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="مثال: سارة العتيبي"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">الفئة *</label>
                      <select
                        value={newClassification}
                        onChange={(e) => setNewClassification(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      >
                        <option value="طالبة">طالبة</option>
                        <option value="خريجة">خريجة</option>
                        <option value="عضو هيئة تدريس">عضو هيئة تدريس</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">التخصص *</label>
                      <select
                        value={newMajor}
                        onChange={(e) => setNewMajor(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      >
                        <option value="نظم المعلومات الإدارية">نظم المعلومات الإدارية</option>
                        <option value="المحاسبة">المحاسبة</option>
                        <option value="المالية">المالية</option>
                        <option value="إدارة الأعمال">إدارة الأعمال</option>
                        <option value="الاقتصاد">الاقتصاد</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">نوع الإنجاز *</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      >
                        <option value="ابتكار ومنافسات">ابتكار ومنافسات</option>
                        <option value="بحث ونشر علمي">بحث ونشر علمي</option>
                        <option value="مراكز متقدمة">مراكز متقدمة</option>
                        <option value="ريادة وابتكار">ريادة وابتكار</option>
                        <option value="قيادة وتطوع">قيادة وتطوع</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">عنوان الإنجاز *</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="مثال: المركز الأول في هاكاثون الابتكار المالي"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">تفاصيل ووصف الإنجاز *</label>
                    <textarea
                      required
                      rows={3}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="اشرحي نبذة عن الإنجاز والأثر المحقق..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">رابط LinkedIn (اختياري)</label>
                      <input
                        type="url"
                        value={newLinkedIn}
                        onChange={(e) => setNewLinkedIn(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">رابط توثيق رسمي (اختياري)</label>
                      <input
                        type="url"
                        value={newSource}
                        onChange={(e) => setNewSource(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saudi-600"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">صورة الإنجاز أو الشعار (اختياري)</label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all border border-gray-200">
                        <ImagePlus className="w-4 h-4" />
                        <span>اختيار صورة</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      {newImage && (
                        <div className="flex items-center gap-2 text-xs text-green-600 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تم تجهيز الصورة</span>
                          <button type="button" onClick={() => setNewImage(null)} className="text-red-500 hover:underline">إلغاء</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-saudi-600 hover:bg-saudi-700 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Award className="w-5 h-5" />
                        <span>حفظ وتوثيق الإنجاز</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        title="تأكيد حذف الإنجاز"
        message="هل أنتِ متأكدة من حذف هذا الإنجاز؟"
        isDeleting={isDeletingRecord}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

    </section>
  );
};
