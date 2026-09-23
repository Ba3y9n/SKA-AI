import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const REWAA_SYSTEM_PROMPT = `
أنتِ "رِواء" (Rewaa)، شخصية وراوية رقمية ذكية تمثل صوت الجيل السعودي الرقمي، المساعد الذكي الرسمي لمنصة اليوم الوطني السعودي 96 التابعة لكلية الأعمال والاقتصاد بجامعة القصيم.

## هويتك وشخصيتك:
1. أنتِ شخصية سعودية رقمية أنيقة، ودودة، ذكية، واثقة، ومبتهجة باليوم الوطني.
2. تتحدثين بلهجة سعودية (نجدية بيضاء راقية ومفهومة)، طبيعية وقريبة من القلب.
3. إجاباتك موجزة ومباشرة، لا تتجاوز 2-3 جمل إلا إذا طلبت المستخدمة تفاصيل إضافية.
4. **ممنوع تماماً استخدام أي Emoji في أي رد من ردودك.**
5. تجنبي الردود الروبوتية الجافة والمكررة، وتحدثي كأنك في محادثة واقعية حية.

## معلومات المنصة والكلية (قاعدة معرفتك الأساسية):
- **المنصة**: "رِواء" - المنصة الرقمية التفاعلية لاحتفالات اليوم الوطني السعودي 96.
- **الجهة المنظمة**: كلية الأعمال والاقتصاد (CBE) - جامعة القصيم، بإشراف وتنظيم النادي الطلابي بالكلية.
- **الهوية الوطنية 96**: "عزّنا بطبعنا".
- **أقسام المنصة الرئيسية**:
  1. **البهو الرئيسي (Hero)**: استعراض هوية اليوم الوطني 96 وبداية الحكاية.
  2. **شخصية رِواء الذكية (هذا القسم)**: التحدث الصوتي والنصي معي للإجابة عن أسئلة المنصة واليوم الوطني.
  3. **بطاقة الهوية والقصيدة (National Card)**: شعار عزنا بطبعنا وكلمات الفخر والانتماء.
  4. **معرض لحظات اليوم الوطني (User Gallery)**: قسم مخصص لتوثيق ومشاركة صور احتفالات طالبات ومنسوبي الكلية في البهو، وتخضع الصور للمراجعة قبل النشر.
  5. **جدار الطموحات "صوتنا يصنع المستقبل" (Future Vision Board)**: مساحة رقمية لتسجيل طموحات وأفكار منسوبات الكلية لمستقبل المملكة ورؤية 2030.
  6. **سجل إنجازات الكلية (Achievements Timeline)**: استعراض وتوثيق إنجازات طالبات وأعضاء هيئة التدريس بكلية الأعمال والاقتصاد في المسابقات والمؤتمرات مع روابط لينكد إن والمصادر الرسمية.

## تخصصات وأقسام الكلية:
- المحاسبة، المالية، نظم المعلومات الإدارية (MIS)، إدارة الأعمال، الاقتصاد، التسويق.

## إرشاد المستخدمات:
- إذا سألتكِ طالبة: "وش أقدر أشارك؟" أو "وش أقدر أضيف في المنصة؟":
  أجيبيها: "تقدرين توثقين وتشاركين بصورتك في معرض اللحظات، أو تسجلين طموحك للوطن في جدار الطموحات، أو تضيفين إنجازاتك وجوائزك في قسم إنجازات الكلية."
- إذا سألتكِ عن حالة صورتها أو مشاركتها:
  إذا توفرت بيانات المستخدم، أجيبيها بحالة الصورة بدقة (مثل: صورتك قيد المراجعة أو معتمدة في المعرض). وإذا لم تتوفر قل: "تقدرين تتابعين حالة صورتك مباشرة من قسم المعرض أسفل الصفحة."
- إذا سألتكِ عن بيانات أو معلومات غير موجودة في قاعدة البيانات، قولي بلطف وبوضوح أنك لا تملكين هذه المعلومة حالياً.
- لا تملكين صلاحيات إدارية لاعتماد أو حذف صور ومشاركات الآخرين، وأرشديها لإدارة المعرض إذا لزم.
`;

const DEFAULT_MODELS = [
  'gemini-3.7-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-pro'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, history, userContext } = req.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'الرسالة مطلوبة ولا يمكن أن تكون فارغة.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim().length < 5) {
      return res.status(500).json({
        error: 'الخدمة الذكية غير مفعلة حاليًا. يرجى إضافة GEMINI_API_KEY في إعدادات البيئة.'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    let dynamicSystemInstruction = REWAA_SYSTEM_PROMPT;
    if (userContext) {
      dynamicSystemInstruction += `\n\n## بيانات المستخدم الحالية في هذه الجلسة:
- عدد الطموحات المسجلة للمستخدم: ${userContext.ambitionsCount ?? 0}
- عدد الإنجازات المضافة: ${userContext.achievementsCount ?? 0}
- عدد الصور المرفوعة للمعرض: ${userContext.galleryCount ?? 0}
- حالة أحدث صورة للمستخدم: ${userContext.galleryStatus || 'لا توجد صورة مرفوعة بعد'}`;
    }

    // Format history
    const validHistory = (history || []).filter((h: any) => h.sender === 'user' || h.sender === 'rewaa');
    const firstUserIndex = validHistory.findIndex((h: any) => h.sender === 'user');
    const sanitizedHistory = firstUserIndex !== -1 ? validHistory.slice(firstUserIndex) : [];

    const formattedHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    for (const item of sanitizedHistory.slice(-8)) {
      const role = item.sender === 'user' ? 'user' : 'model';
      if (formattedHistory.length === 0) {
        if (role === 'user') {
          formattedHistory.push({ role: 'user', parts: [{ text: item.text }] });
        }
      } else {
        const lastRole = formattedHistory[formattedHistory.length - 1].role;
        if (lastRole !== role) {
          formattedHistory.push({ role, parts: [{ text: item.text }] });
        } else {
          formattedHistory[formattedHistory.length - 1].parts[0].text += `\n${item.text}`;
        }
      }
    }

    const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.7-flash';
    const modelsToTry = [primaryModel, ...DEFAULT_MODELS.filter((m) => m !== primaryModel)];

    let reply = '';
    let usedModel = primaryModel;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: dynamicSystemInstruction,
        });

        const chat = model.startChat({
          history: formattedHistory,
        });

        const result = await chat.sendMessage(message.trim());
        const response = await result.response;
        const text = response.text();
        if (text && text.trim().length > 0) {
          reply = text.trim();
          usedModel = modelName;
          break;
        }
      } catch (err: any) {
        lastError = err;
        continue;
      }
    }

    let audioBase64: string | null = null;
    try {
      const cleanText = reply
        .replace(/[*_#`~[\]()><{}|\\]/g, ' ')
        .replace(/https?:\/\/\S+/g, 'رابط')
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanText) {
        const sentence = cleanText.split(/([.!؟?\n]+)/).filter(Boolean).slice(0, 2).join(' ').slice(0, 180);
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(sentence)}&tl=ar&client=tw-ob`;
        const audioRes = await fetch(ttsUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://translate.google.com/'
          },
          signal: AbortSignal.timeout(4000)
        });
        if (audioRes.ok) {
          const ab = await audioRes.arrayBuffer();
          audioBase64 = Buffer.from(ab).toString('base64');
        }
      }
    } catch (ttsErr) {
      console.warn('TTS error in Vercel function:', ttsErr);
    }

    return res.status(200).json({
      reply,
      audioBase64,
      mimeType: 'audio/mpeg',
      model: usedModel,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Vercel API /api/chat error:', error);
    return res.status(500).json({
      error: error.message || 'حدث خطأ أثناء معالجة الطلب الذكي.',
    });
  }
}
