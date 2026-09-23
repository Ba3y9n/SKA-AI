import { GoogleGenerativeAI } from '@google/generative-ai';
import { REWAA_SYSTEM_PROMPT, AMBITION_ANALYZER_PROMPT } from '../prompts.js';

const DEFAULT_MODELS = [
  'gemini-3.7-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-pro'
];

export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL || 'gemini-3.7-flash';
}

export function isApiKeyConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim().length > 5 && !key.includes('YOUR_KEY'));
}

export async function generateChatResponse(
  message: string,
  history: Array<{ sender: 'user' | 'rewaa' | 'system'; text: string }> = [],
  userContext?: {
    ambitionsCount?: number;
    achievementsCount?: number;
    galleryCount?: number;
    galleryStatus?: string;
  }
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !isApiKeyConfigured()) {
    throw new Error('الخدمة الذكية غير مفعلة حاليًا. أضف GEMINI_API_KEY في ملف .env أو إعدادات Vercel للبدء.');
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

  // Prepare formatted history for Gemini API (must start with 'user')
  const validHistory = history.filter((h) => h.sender === 'user' || h.sender === 'rewaa');
  const firstUserIndex = validHistory.findIndex((h) => h.sender === 'user');
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

  // Model list to try in order
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const modelsToTry = [primaryModel, ...DEFAULT_MODELS.filter(m => m !== primaryModel)];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[Gemini] Attempting with model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: dynamicSystemInstruction,
      });

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const replyText = response.text();
      if (replyText && replyText.trim().length > 0) {
        return replyText;
      }
    } catch (error: any) {
      lastError = error;
      console.warn(`[Gemini] Model ${modelName} failed:`, error.message || error);
      // Continue to next fallback model
      continue;
    }
  }

  // If all models failed, provide a graceful, polite Arabic message instead of raw JSON dump
  console.error('[Gemini] All models failed. Last error:', lastError);
  if (lastError?.message && (lastError.message.includes('429') || lastError.message.includes('quota') || lastError.status === 429)) {
    return 'هلا بك! يبدو أن هناك ضغطاً مؤقتاً على الخدمة بسبب تجاوز الحد المجاني للطلبات. جرب تتحدث معي بعد ثوانٍ بسيطة.';
  }
  
  return 'هلا بك! يسعدني الحديث معك، ولكن حدث ضغط بسيط في الاتصال. تفضل بالسؤال مرة ثانية.';
}

export async function analyzeAmbition(idea: string): Promise<{
  category: string;
  highlightPhrase: string;
  iconName: string;
  colorGradient: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !isApiKeyConfigured()) {
    // Graceful fallback for offline demo
    return {
      category: 'طموح وطني',
      highlightPhrase: `طموحك: ${idea.slice(0, 25)}...`,
      iconName: 'Sparkles',
      colorGradient: 'from-emerald-500/20 to-green-600/30',
    };
  }

  const modelName = getGeminiModel();
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: AMBITION_ANALYZER_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  try {
    const result = await model.generateContent(`فكرة المستخدم:\n"${idea}"`);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return {
      category: parsed.category || 'طموح وطني',
      highlightPhrase: parsed.highlightPhrase || `طموحك: ${idea.slice(0, 20)}`,
      iconName: parsed.iconName || 'Sparkles',
      colorGradient: parsed.colorGradient || 'from-emerald-500/20 to-green-600/30',
    };
  } catch (err) {
    console.error('Ambition analysis fallback:', err);
    return {
      category: 'طموح وطني',
      highlightPhrase: `طموحك: مستقبل واعد`,
      iconName: 'Sparkles',
      colorGradient: 'from-emerald-500/20 to-green-600/30',
    };
  }
}
