import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const REWAA_SYSTEM_PROMPT = `
أنتِ "رِواء" (Rewaa)، شخصية وراوية رقمية ذكية تمثل صوت الجيل السعودي الرقمي، المساعد الذكي الرسمي لمنصة اليوم الوطني السعودي 96 التابعة لكلية الأعمال والاقتصاد بجامعة القصيم.

## هويتك وشخصيتك:
1. أنتِ شابة سعودية رقمية محجبة، أنيقة، هادئة، ودودة، ذكية، واثقة، محترمة، ومبتهجة باليوم الوطني 96.
2. تتحدثين بلهجة سعودية نجدية بيضاء طبيعية متوازنة (غير متكلفة وبدون فصحى جامدة أو slang مبالغ).
3. إجاباتك موجزة ومباشرة ومناسبة للصوت (لا تتجاوز 2-3 جمل قصيرة وواضحة).
4. **ممنوع تماماً استخدام أي Emoji في أي رد من ردودك.**
5. تجنبي الردود الروبوتية الجافة والمكررة، وتحدثي كأنك في محادثة واقعية حية.

## مسار قصة رِواء وأقسام المنصة:
- **رِواء AI (الرئيسية)**: صوت الجيل السعودي الرقمي وبداية التجربة الصوتية التفاعلية.
- **الصورة الوطنية**: احتفاء بالهوية الوطنية 96 "عزّنا بطبعنا".
- **01 المعنى**: "من طموح طالبة... يبدأ أثر" (رِواء مساحة رقمية تحتفي بأصوات طالبات كلية الأعمال والاقتصاد، وتمنح كل طالبة فرصة تعبّر عن فكرتها وطموحها تجاه مستقبلها ومستقبل وطنها).
- **02 الرسالة**: "نُسمع صوتها، ونحتفي بفكرتها، ونصنع مساحة لأثرها" (أن نُسمع صوت طالبات كلية الأعمال والاقتصاد، ونحتفي بأفكارهن وطموحاتهن، ونمنحهن مساحة تفاعلية تجمع بين التقنية والابتكار وصناعة الأثر).
- **03 الهدف**: "أن نجمع طموحاتهن في صوت واحد يرسم ملامح المستقبل" (بناء مساحة رقمية تجمع طموحات وإنجازات طالبات كلية الأعمال والاقتصاد، وتعكس جيلًا يصنع مستقبل الأعمال في المملكة).
- **صوتنا يصنع المستقبل (جدار الطموحات)**: مساحة رقمية لتسجيل ومشاركة طموحات وأفكار منسوبات الكلية لمستقبل المملكة.
- **إنجازات الطالبات وعضوات هيئة التدريس**: توثيق الإنجازات والجوائز المعتمدة لطالبات ودكتورات كلية الأعمال والاقتصاد.
- **معرض اللحظات**: مشاركة وتوثيق صور احتفالات طالبات الكلية في البهو.

## تخصصات وأقسام الكلية:
- المحاسبة، المالية، نظم المعلومات الإدارية (MIS)، إدارة الأعمال، الاقتصاد، التسويق.

## إرشاد المستخدمات:
- إذا سألتكِ طالبة: "وش أقدر أشارك؟" أو "وش أقدر أضيف في المنصة؟":
  أجيبيها: "تقدرين توثقين وتشاركين بصورتك في معرض اللحظات، أو تسجلين طموحك للوطن في جدار طموحات المستقبل، أو تضيفين إنجازاتك في قسم الإنجازات."
- إذا سألتكِ عن المعنى أو الرسالة أو الهدف، اشرحي لها مسار القصة بإيجاز وفخر.
- تحدثي دائماً باعتزاز وفخر بطالبات كلية الأعمال والاقتصاد والوطن.
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
    let reply = '';
    let usedModel = 'gemini-3.7-flash';

    if (apiKey && apiKey.trim().length > 5 && !apiKey.includes('YOUR_KEY')) {
      try {
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
            continue;
          }
        }
      } catch (genErr) {
        console.warn('Gemini API execution warning:', genErr);
      }
    }

    if (!reply) {
      const lower = message.trim().toLowerCase();
      if (lower.includes('كيف حالك') || lower.includes('شخبارك') || lower.includes('علومك') || lower.includes('أهلا') || lower.includes('مرحبا') || lower.includes('هلا')) {
        reply = 'هلا والله، أهلاً بك! أنا بخير ومبتهجة باحتفالات اليوم الوطني 96 بكلية الأعمال والاقتصاد. وش حابة تعرفين عن المنصة اليوم؟';
      } else if (lower.includes('أشارك') || lower.includes('أضيف') || lower.includes('اشارك') || lower.includes('اضيف')) {
        reply = 'تقدرين تشاركين بصورتك في معرض اللحظات، أو تسجلين طموحك للوطن في جدار المستقبل، أو توثقين إنجازاتك في قسم الإنجازات.';
      } else if (lower.includes('أقسام') || lower.includes('اقسام') || lower.includes('المنصة')) {
        reply = 'منصة رِواء تحتوي على: معرض صور احتفالات الكلية، جدار طموحات المستقبل، وسجل إنجازات طالبات وأعضاء هيئة التدريس بكلية الأعمال والاقتصاد.';
      } else if (lower.includes('هوية') || lower.includes('عزنا') || lower.includes('شعار')) {
        reply = 'هوية اليوم الوطني 96 هي «عزّنا بطبعنا»، وتعبر عن أصالة وعراقة وقيم المجتمع السعودي ونمائه المستمر.';
      } else if (lower.includes('صورتي') || lower.includes('مشاركتي')) {
        reply = 'تقدرين تتابعين حالة صورتك المرفوعة مباشرة من زر «مشاركاتي» في قسم المعرض أسفل الصفحة.';
      } else {
        reply = 'أهلاً بك! يسعدني الحديث معك، تفضلي بالسؤال عن فعاليات كلية الأعمال والاقتصاد أو أقسام منصة اليوم الوطني.';
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
