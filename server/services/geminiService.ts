import { GoogleGenerativeAI } from '@google/generative-ai';
import { REWAA_SYSTEM_PROMPT, AMBITION_ANALYZER_PROMPT } from '../prompts.js';

export function getGeminiModel() {
  return process.env.GEMINI_MODEL || 'gemini-2.5-flash';
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

  // Prepare formatted history for Gemini API
  const formattedHistory = history
    .filter((h) => h.sender === 'user' || h.sender === 'rewaa')
    .slice(-8) // keep recent context
    .map((h) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

  try {
    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    // If specific model wasn't available, provide helpful message
    if (error.message && error.message.includes('not found')) {
      throw new Error(`النموذج المحدد (${modelName}) غير متوفر حالياً في مفتاح API. يُرجى مراجعة GEMINI_MODEL في .env`);
    }
    throw new Error(error.message || 'حدث خطأ أثناء التواصل مع نموذج الذكاء الاصطناعي.');
  }
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
