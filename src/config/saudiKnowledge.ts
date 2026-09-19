import { SuggestedQuestion } from '../types/chat';
import { AmbitionCard } from '../types/ambition';

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    id: '1',
    title: 'وش يميز اليوم الوطني 96 وطموح جيلنا؟',
    category: 'identity',
    icon: 'Sparkles',
  },
  {
    id: '2',
    title: 'حدثيني عن القصيم وتراثها الزراعي والثقافي',
    category: 'regions',
    icon: 'MapPin',
  },
  {
    id: '3',
    title: 'وش تعرفين عن عمارة وتراث نجد الأصيل؟',
    category: 'heritage',
    icon: 'Landmark',
  },
  {
    id: '4',
    title: 'كيف يخدم الذكاء الاصطناعي مستقبل ورؤية 2030؟',
    category: 'future',
    icon: 'Cpu',
  },
  {
    id: '5',
    title: 'اختبريني بسؤال سريع عن تاريخ وإنجازات المملكة',
    category: 'quiz',
    icon: 'HelpCircle',
  },
  {
    id: '6',
    title: 'وش ممكن يصنع جيلنا من الشباب لمستقبل الوطن؟',
    category: 'future',
    icon: 'Zap',
  },
];

export const INITIAL_DEMO_AMBITIONS: AmbitionCard[] = [
  {
    id: 'demo-1',
    category: 'التعليم والابتكار',
    highlightPhrase: 'طموحك: تعليم أذكى ومدارس تفاعلية',
    fullIdea: 'تطوير منصات ذكاء اصطناعي تدعم التعليم المخصص لطلاب الجامعات والمدارس بالمملكة.',
    colorGradient: 'from-emerald-500/20 to-green-600/30',
    iconName: 'GraduationCap',
    dateStr: 'اليوم الوطني 96',
    isDemo: true,
  },
  {
    id: 'demo-2',
    category: 'البيئة والاستدامة',
    highlightPhrase: 'طموحك: مدن خضراء وطاقة نظيفة',
    fullIdea: 'تحقيق أهداف مبادرة السعودية الخضراء عبر تقنيات إدارة الطاقة الذكية والتشجير الرقمي.',
    colorGradient: 'from-teal-500/20 to-emerald-600/30',
    iconName: 'Leaf',
    dateStr: 'اليوم الوطني 96',
    isDemo: true,
  },
  {
    id: 'demo-3',
    category: 'التقنية والذكاء الاصطناعي',
    highlightPhrase: 'طموحك: ريادة سعودية عالمية في AI',
    fullIdea: 'أن تكون المملكة المركز الأول عالمياً في أبحاث ونماذج الذكاء الاصطناعي التوليدي باللغة العربية.',
    colorGradient: 'from-cyan-500/20 to-emerald-600/30',
    iconName: 'Cpu',
    dateStr: 'اليوم الوطني 96',
    isDemo: true,
  },
  {
    id: 'demo-4',
    category: 'الصحة والرفاهية',
    highlightPhrase: 'طموحك: رعاية صحية تنبؤية للجميع',
    fullIdea: 'استخدام البيانات الضخمة للتنبؤ بالأمراض وتقديم رعاية صحية استباقية لكل مواطن ومقيم.',
    colorGradient: 'from-emerald-600/20 to-teal-700/30',
    iconName: 'HeartPulse',
    dateStr: 'اليوم الوطني 96',
    isDemo: true,
  }
];
