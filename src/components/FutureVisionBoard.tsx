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
  }, []);

  // Merge remote ambitions, local storage ambitions and defaults (clean filter)
  const allAmbitions = React.useMemo(() => {
    const list = [...localList.filter(l => !l.text?.includes('CBE_GALLERY') && !l.text?.startsWith('{') && l.text !== 'test 1' && l.text !== 'test 3' && l.text !== 'انا بيان')];
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
    DEFAULT_AMBITIONS.forEach(d => {
      if (!list.some(item => item.id === d.id || item.text === d.text)) {
        list.push(d);
      }
    });
    return list;
  }, [ambitions, localList]);

  const handleDeleteAmbition = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('هل تريد حذف طموحك؟')) {
      const updated = localList.filter(item => item.id !== id);
      setLocalList(updated);
      localStorage.setItem('user_local_ambitions', JSON.stringify(updated));
    }
  };

  return (
    <section className="relative w-full py-32 bg-[#F8FBF8] overflow-hidden z-20 border-t border-gray-100" id="ambitions">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-100/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#008F68]/10 text-[#006C4F] text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4 text-[#008F68]" />
              جدار المستقبل
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#064C3B] leading-tight mb-4">
              صوتنا يصنع المستقبل
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl leading-relaxed">
              وش طموحك للسعودية؟ شاركي رؤيتك وأفكارك التي تصنع الغد.
            </p>
          </div>

          <button
            onClick={onAddClick}
            className="self-start lg:self-auto inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#008F68] hover:bg-[#064C3B] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>+ أضف طموحك</span>
          </button>
        </div>

        {/* Multi-Card Interactive Grid */}
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
                  className="group bg-white rounded-[2rem] p-7 border border-emerald-100/80 shadow-[0_10px_30px_rgba(0,108,79,0.04)] hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-[3rem] -z-0 group-hover:scale-110 transition-transform" />

                  <div className="relative z-10">
                    {/* Header: Author Info & Actions */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#F8FBF8] border border-emerald-200 flex items-center justify-center text-[#008F68] font-black text-base shadow-sm">
                          {authorName.charAt(0) || <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#064C3B] text-base leading-snug">{authorName}</h4>
                          <p className="text-xs text-gray-500 font-medium">{authorRole}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isOwner && (
                          <button
                            onClick={(e) => handleDeleteAmbition(ambition.id, e)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="حذف طموحي"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedAmbitionForShare(ambition)}
                          className="p-2 text-gray-400 hover:text-[#008F68] hover:bg-emerald-50 rounded-full transition-colors flex items-center gap-1"
                          title="مشاركة الطموح"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Ambition Optional Image */}
                    {ambitionImg && (
                      <div className="mb-4 rounded-xl overflow-hidden h-36 w-full border border-gray-100">
                        <img src={ambitionImg} alt="مرفق الطموح" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Ambition Quote */}
                    <p className="text-gray-700 text-base sm:text-lg font-medium leading-relaxed mb-6">
                      "{ambition.text}"
                    </p>
                  </div>

                  {/* Card Bottom Footer */}
                  <div className="relative z-10 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span className="text-[#008F68] font-bold">اليوم الوطني 96</span>
                    <button
                      onClick={() => setSelectedAmbitionForShare(ambition)}
                      className="inline-flex items-center gap-1 text-[#006C4F] hover:text-[#008F68] font-bold text-xs group-hover:translate-x-[-2px] transition-transform"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>مشاركة كبطاقة</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

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
