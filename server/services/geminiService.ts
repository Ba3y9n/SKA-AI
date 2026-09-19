import { GoogleGenerativeAI } from '@google/generative-ai';
import { REWAA_SYSTEM_PROMPT, AMBITION_ANALYZER_PROMPT } from '../prompts.js';

export function getGeminiModel() {
  return process.env.GEMINI_MODEL || 'gemini-3.7-flash';
}

export function isApiKeyConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim().length > 5 && !key.includes('YOUR_KEY'));
}

export async function generateChatResponse(
  message: string,
  history: Array<{ sender: 'user' | 'rewaa' | 'system'; text: string }> = []
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !isApiKeyConfigured()) {
    throw new Error('الخدمة الذكية غير مفعلة حاليًا. أضف GEMINI_API_KEY في ملف .env بالخادم للبدء.');
  }

  const modelName = getGeminiModel();
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: REWAA_SYSTEM_PROMPT,
  });

  // Prepare formatted history for Gemini API (must start with 'user')
  const validHistory = history.filter((h) => h.sender === 'user' || h.sender === 'rewaa');
  
  // Find index of first user message
  const firstUserIndex = validHistory.findIndex((h) => h.sender === 'user');
  const sanitizedHistory = firstUserIndex !== -1 ? validHistory.slice(firstUserIndex) : [];

  const formattedHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
  
  for (const item of sanitizedHistory.slice(-8)) {
    const role = item.sender === 'user' ? 'user' : 'model';
    // Ensure strict turn alternation for Gemini
    if (formattedHistory.length === 0) {
      if (role === 'user') {
        formattedHistory.push({ role: 'user', parts: [{ text: item.text }] });
      }
    } else {
      const lastRole = formattedHistory[formattedHistory.length - 1].role;
      if (lastRole !== role) {
        formattedHistory.push({ role, parts: [{ text: item.text }] });
      } else {
        // Merge adjacent messages of the same role
        formattedHistory[formattedHistory.length - 1].parts[0].text += `\n${item.text}`;
      }
    }
  }

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.warn(`Gemini attempt ${attempts} failed:`, error.message);
      if (attempts < maxAttempts && (error.status === 503 || error.status === 429 || (error.message && error.message.includes('503')))) {
        await new Promise((res) => setTimeout(res, 800 * attempts));
        continue;
      }
      console.error('Gemini API Final Error:', error);
      if (error.message && error.message.includes('not found')) {
        throw new Error(`النموذج المحدد (${modelName}) غير متوفر حالياً في مفتاح API. يُرجى مراجعة GEMINI_MODEL في .env`);
      }
      throw new Error(error.message || 'حدث خطأ أثناء التواصل مع نموذج الذكاء الاصطناعي.');
    }
  }

  throw new Error('تعذر الحصول على رد من النموذج بعد عدة محاولات.');
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
