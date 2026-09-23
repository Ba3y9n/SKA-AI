export type Classification = 'طالبة' | 'خريجة' | 'دكتورة' | 'عضو هيئة تدريس';

export interface AchievementSource {
  sourceType: string;
  sourceName: string;
  sourceUrl?: string;
  verified: boolean;
  dateVerified: string;
}

export interface PersonAchievement {
  id: string;
  nameAr: string;
  nameEn?: string;
  classification: Classification;
  major: string;
  achievementTitle: string;
  year: string;
  description: string;
  linkedIn?: string;
  officialSource?: string;
  originalPost?: string;
  imageUrl?: string;
  source: AchievementSource;
  type: string;
}

export interface StudentProject {
  id: string;
  projectName: string;
  team: string[];
  idea: string;
  field: string;
  year: string;
  sourceName: string;
  sourceUrl?: string;
}

// 1. People Data
export const peopleData: PersonAchievement[] = [
  {
    id: 'p1',
    nameAr: 'ليان العمري',
    nameEn: 'Layan Alamri',
    classification: 'طالبة',
    major: 'المالية',
    achievementTitle: 'قيادة العلاقات العامة والمشاركة المجتمعية',
    year: '2024',
    description: 'قادت قسم العلاقات العامة في النادي الطلابي بكلية الأعمال والاقتصاد (ديسمبر 2022 - أبريل 2025). أشرفت على التخطيط، التنسيق الإعلامي، وبناء الصورة المهنية للنادي. شاركت كمتطوعة في المؤتمر الدولي الثاني لاستدامة الموارد الطبيعية، وكُرمت في ختام الأنشطة 1446هـ.',
    linkedIn: 'https://sa.linkedin.com/in/layan-alamri-271309332',
    source: {
      sourceType: 'LinkedIn',
      sourceName: 'حساب LinkedIn الشخصي',
      verified: true,
      dateVerified: '2026-09-23'
    },
    type: 'قيادة'
  },
  {
    id: 'p2',
    nameAr: 'مرام الحربي',
    nameEn: 'Maram Alharbi',
    classification: 'خريجة',
    major: 'نظم المعلومات الإدارية',
    achievementTitle: 'المركز الأول في مسابقة رؤية 2030',
    year: '2024',
    description: 'حصلت على المركز الأول في مسابقة رؤية 2030 عن مشروع "صون" برعاية وكيلة الكلية لعام 1445هـ. كما أتمت معسكر AI ERA لتطوير مهاراتها في الذكاء الاصطناعي التوليدي.',
    linkedIn: 'https://sa.linkedin.com/in/maram-alharbi7',
    source: {
      sourceType: 'LinkedIn',
      sourceName: 'حساب LinkedIn الشخصي',
      verified: true,
      dateVerified: '2026-09-23'
    },
    type: 'مراكز متقدمة'
  },
  {
    id: 'p3',
    nameAr: 'د. بشاير البليهي',
    nameEn: 'Bashayr Albulayhi',
    classification: 'عضو هيئة تدريس',
    major: 'الاقتصاد والمالية',
    achievementTitle: 'قيادة أكاديمية ومشاركات تحكيمية رائدة',
    year: '2025',
    description: 'مشرفة مقر الطالبات بالرس في كلية الأعمال والاقتصاد. تعمل بمجالات الاستشارات والتخطيط. شاركت كعضو تحكيم في حاضنة الابتكار 5 بجامعة القصيم، وجائزة شقائق الرجال (مسار كفاءة الأداء). عضو الجمعية الاقتصادية السعودية.',
    linkedIn: 'https://sa.linkedin.com/in/bashayr-albulayhi2030',
    officialSource: 'https://www.qu.edu.sa/colleges/cbe/contact/',
    source: {
      sourceType: 'Official Website',
      sourceName: 'الموقع الرسمي للكلية وLinkedIn',
      verified: true,
      dateVerified: '2026-09-23'
    },
    type: 'قيادة'
  },
  {
    id: 'p4',
    nameAr: 'فدوى المانعي ولولو الراشد',
    classification: 'طالبة',
    major: 'المحاسبة',
    achievementTitle: 'المركز الثاني - ملتقى الابتكار المحاسبي',
    year: '2024',
    description: 'حققتا المركز الثاني في مسار الحلول بملتقى الابتكار المحاسبي، في منافسة شملت 40 فريقاً يمثلون 18 جامعة.',
    source: {
      sourceType: 'Official Post',
      sourceName: 'جامعة القصيم',
      verified: true,
      dateVerified: '2026-09-23'
    },
    type: 'مراكز متقدمة'
  }
];

// 2. Projects Data
export const projectsData: StudentProject[] = [
  {
    id: 'proj1',
    projectName: 'رواء',
    team: ['رندا', 'أمل', 'شهد', 'بشرى', 'ليان'],
    idea: 'مشروع يعتمد على أفكار التقنية والاستدامة والحلول البيئية الذكية.',
    field: 'التقنية والاستدامة',
    year: '2024',
    sourceName: 'معرض مبدعون - كلية الأعمال والاقتصاد',
  },
  {
    id: 'proj2',
    projectName: 'منيع',
    team: ['مسرى', 'رند', 'هياء', 'أفراح', 'ليان'],
    idea: 'مشاركة ابتكارية طلابية.',
    field: 'الابتكار الطلابي',
    year: '2024',
    sourceName: 'معرض مبدعون - كلية الأعمال والاقتصاد',
  }
];
