import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateChatResponse, analyzeAmbition, isApiKeyConfigured, getGeminiModel } from './services/geminiService.js';

// Load .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// API Status & Configuration Info
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    model: getGeminiModel(),
    isApiKeySet: isApiKeyConfigured(),
    serverTime: new Date().toISOString(),
    event: 'Saudi National Day 96',
    character: 'Rewaa AI (رِواء)',
  });
});

// Chat API Route (Proxies to Gemini securely)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'الرسالة مطلوبة ولا يمكن أن تكون فارغة.' });
    }

    const reply = await generateChatResponse(message.trim(), history || []);
    res.json({
      reply,
      model: getGeminiModel(),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('API /api/chat error:', error.message);
    res.status(500).json({
      error: error.message || 'حدث خطأ أثناء معالجة الطلب الذكي.',
    });
  }
});

// Future Ambition Analyzer API Route ("صوتنا يصنع المستقبل")
app.post('/api/ambition', async (req: Request, res: Response) => {
  try {
    const { idea } = req.body;

    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return res.status(400).json({ error: 'يرجى كتابة فكرتك أو طموحك للمستقبل.' });
    }

    const analyzed = await analyzeAmbition(idea.trim());
    res.json({
      ...analyzed,
      fullIdea: idea.trim(),
      id: 'ambition-' + Date.now(),
      dateStr: 'اليوم الوطني 96',
    });
  } catch (error: any) {
    console.error('API /api/ambition error:', error.message);
    res.status(500).json({
      error: error.message || 'تعذر تحليل الطموح.',
    });
  }
});

// Serve frontend static build files if in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req: Request, res: Response) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'مسار API غير موجود' });
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.send('رِواء AI Backend Server is Running.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🇸🇦 خادم رِواء AI يعمل بنجاح على المنفذ: http://localhost:${PORT}`);
  console.log(`⚙️ النموذج المستخدم: ${getGeminiModel()}`);
  console.log(`🔑 حالة مفتاح API: ${isApiKeyConfigured() ? 'مفعل ✅' : 'غير معين ⚠️ (يرجى إضافته في .env)'}`);
});
