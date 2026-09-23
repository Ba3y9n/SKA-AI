import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ambition } from '../types/ambition';
import { Plus, Share2, Trash2, Sparkles, User } from 'lucide-react';
import { ShareAmbitionModal } from './ShareAmbitionModal';

interface FutureVisionBoardProps {
  ambitions: Ambition[];
  onAddClick: () => void;
}

const DEFAULT_AMBITIONS: Ambition[] = [
  {
    id: 'def-1',
    text: 'طموحي أن أساهم في تأسيس أول منصة وطنية ذكية لتمكين رائدات الأعمال في المملكة وصولاً للريادة العالمية.',
    name: 'سارة التميمي',
    role: 'خريجة - نظم معلومات إدارية',
    department: 'كلية الأعمال والاقتصاد',
    created_at: '2026-09-23',
    status: 'approved',
    is_approved: true
  },
  {
    id: 'def-2',
    text: 'نطمح إلى قيادة التحول المالي الرقمي ودعم المنشآت الصغيرة والمتوسطة لتحقيق مستهدفات رؤية 2030.',
    name: 'نورة المطيري',
    role: 'طالبة - مالية ومصرفية',
    department: 'كلية الأعمال والاقتصاد',
    created_at: '2026-09-23',
    status: 'approved',
    is_approved: true
  },
  {
    id: 'def-3',
    text: 'أن تكون كلية الأعمال والاقتصاد بجامعة القصيم بيت الخبرة الأول في أبحاث الاقتصاد الدائري المستدام.',
    name: 'د. حصة الشمري',
    role: 'عضو هيئة تدريس - اقتصاد',
    department: 'كلية الأعمال والاقتصاد',
    created_at: '2026-09-23',
    status: 'approved',
    is_approved: true
  },
  {
    id: 'def-4',
    text: 'بناء جيل قيادي من بنات الكلية ينافس في كبرى المحافل الاقتصادية والابتكارية العالمية.',
    name: 'ريم القحطاني',
    role: 'طالبة - إدارة أعمال',
    department: 'كلية الأعمال والاقتصاد',
    created_at: '2026-09-23',
    status: 'approved',
    is_approved: true
  }
];

export const FutureVisionBoard: React.FC<FutureVisionBoardProps> = ({ ambitions, onAddClick }) => {
  const [selectedAmbitionForShare, setSelectedAmbitionForShare] = useState<Ambition | null>(null);
  const [localList, setLocalList] = useState<Ambition[]>([]);
  const [myUserToken, setMyUserToken] = useState<string>('');
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  useEffect(() => {
    let token = localStorage.getItem('rewaa_user_token');
    if (!token) {
      token = 'usr_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('rewaa_user_token', token);
    }
    setMyUserToken(token);

    const savedLocal = localStorage.getItem('user_local_ambitions');
    if (savedLocal) {
      try {
        setLocalList(JSON.parse(savedLocal));
      } catch (e) {
        console.error(e);
      }
    }

    const savedDeleted = localStorage.getItem('deleted_ambitions');
    if (savedDeleted) {
      try {
        setDeletedIds(JSON.parse(savedDeleted));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Merge remote ambitions, local storage ambitions (clean filter)
  const allAmbitions = React.useMemo(() => {
    const list = [...localList.filter(l => !l.text?.includes('CBE_GALLERY') && !l.text?.startsWith('{'))];
    ambitions.forEach(a => {
      if (
        !list.some(item => item.id === a.id || item.text === a.text) &&
        !a.text?.includes('CBE_GALLERY') &&
        !a.text?.startsWith('{') &&
        !a.department?.startsWith('CBE_GALLERY') &&
        a.text !== 'test 1' &&
        a.text !== 'test 3' &&
        a.text !== 'انا بيان'
      ) {
        list.push(a);
      }
    });

    // Filter out deleted ones
    return list.filter(item => !deletedIds.includes(item.id));
  }, [ambitions, localList, deletedIds]);

  const handleDeleteAmbition = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف طموحك؟')) {
      const updatedLocal = localList.filter(item => item.id !== id);
      setLocalList(updatedLocal);
      localStorage.setItem('user_local_ambitions', JSON.stringify(updatedLocal));

      const updatedDeleted = [...deletedIds, id];
      setDeletedIds(updatedDeleted);
      localStorage.setItem('deleted_ambitions', JSON.stringify(updatedDeleted));

      // Attempt to delete from backend (will fail silently if RLS prevents it)
      if (typeof window !== 'undefined') {
        import('../services/apiService').then(({ deleteAmbition }) => {
          deleteAmbition(id);
        });
      }
    }
  };

  return (
    <section className="relative w-full py-32 bg-saudi-700 text-saudi-50 overflow-hidden z-20 border-t border-saudi-600" id="ambitions">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-saudi-600/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saudi-50/10 border border-gold/30 text-gold-light text-sm font-bold mb-4 shadow-lg">
              <Sparkles className="w-4 h-4 text-gold" />
              جدار المستقبل
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-4 drop-shadow-md">
              طالباتنا يصنعن <span className="text-gold">المستقبل</span>
            </h2>
            <p className="text-lg md:text-xl text-saudi-100 font-medium max-w-3xl leading-relaxed">
              يا بنات كلية الأعمال والاقتصاد بجامعة القصيم.. أنتنّ صانعات الأثر وقادة الغد.
              <br />شاركِي طموحكِ ورسالتكِ في مسيرة النماء لوطننا الغالي في هذا اليوم الاستثنائي.
            </p>
          </div>

          <button
            onClick={onAddClick}
            className="self-start lg:self-auto inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gold hover:bg-gold-light text-saudi-700 font-black text-lg shadow-[0_0_20px_rgba(198,161,91,0.4)] hover:shadow-[0_0_30px_rgba(198,161,91,0.6)] hover:-translate-y-1 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>+ أضف طموحك</span>
          </button>
        </div>

        {/* Multi-Card Interactive Grid */}
        {allAmbitions.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-saudi-600/30 backdrop-blur-md rounded-3xl border border-gold/20">
            <div className="w-20 h-20 bg-saudi-700 rounded-full flex items-center justify-center mb-6 shadow-inner border border-saudi-600">
              <Sparkles className="w-10 h-10 text-gold-light/50" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">كوني أول من يشارك طموحها!</h3>
            <p className="text-saudi-200">هذه المساحة مخصصة لطموحاتكم وأفكاركم التي ستصنع المستقبل.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {allAmbitions.map((ambition, i) => {
                const isOwner = (ambition as any).isUserAdded && (ambition as any).userToken === myUserToken;
                const authorName = ambition.name || ambition.department || 'طالبة طموحة';
                const authorRole = ambition.role || 'كلية الأعمال والاقتصاد';
                const ambitionImg = (ambition as any).imageUrl;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-5%" }}
                    transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
                    key={ambition.id || `amb-${i}`}
                    className="group bg-saudi-600/30 backdrop-blur-xl rounded-[2.5rem] p-8 border border-gold/20 shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(198,161,91,0.15)] hover:border-gold-light/50 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/10 to-transparent rounded-bl-[4rem] -z-0 group-hover:scale-110 transition-transform duration-700" />
                    
                    {/* Gold line accent */}
                    <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      {/* Header: Author Info & Actions */}
                      <div className="flex items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-saudi-700 border border-gold/40 flex items-center justify-center text-gold-light font-black text-xl shadow-lg">
                            {authorName.charAt(0) || <User className="w-6 h-6" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-lg leading-snug">{authorName}</h4>
                            <p className="text-sm text-gold-light/80 font-medium">{authorRole}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-saudi-700/50 rounded-full p-1 border border-saudi-600">
                          {isOwner && (
                            <button
                              onClick={(e) => handleDeleteAmbition(ambition.id, e)}
                              className="p-2 text-red-400 hover:text-white hover:bg-red-500/80 rounded-full transition-all"
                              title="حذف طموحي"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedAmbitionForShare(ambition)}
                            className="p-2 text-saudi-200 hover:text-gold hover:bg-saudi-600 rounded-full transition-all flex items-center gap-1"
                            title="مشاركة الطموح"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Ambition Optional Image */}
                      {ambitionImg && (
                        <div className="mb-6 rounded-2xl overflow-hidden h-40 w-full border border-gold/20 shadow-inner">
                          <img src={ambitionImg} alt="مرفق الطموح" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Ambition Quote */}
                      <p className="text-saudi-50 text-lg sm:text-xl font-medium leading-loose mb-8">
                        "{ambition.text}"
                      </p>
                    </div>

                    {/* Card Bottom Footer */}
                    <div className="relative z-10 pt-5 border-t border-saudi-500/50 flex items-center justify-between text-xs font-medium">
                      <span className="text-gold-light/70 font-bold tracking-wider">اليوم الوطني 96</span>
                      <button
                        onClick={() => setSelectedAmbitionForShare(ambition)}
                        className="inline-flex items-center gap-1.5 text-white hover:text-gold font-bold text-sm group-hover:-translate-x-1 transition-all"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>مشاركة البطاقة</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* Share Modal */}
      <ShareAmbitionModal
        isOpen={Boolean(selectedAmbitionForShare)}
        onClose={() => setSelectedAmbitionForShare(null)}
        ambition={selectedAmbitionForShare}
      />

    </section>
  );
};
