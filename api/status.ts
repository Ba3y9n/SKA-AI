import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'online',
    model: process.env.GEMINI_MODEL || 'gemini-3.7-flash',
    isApiKeySet: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5),
    serverTime: new Date().toISOString(),
    event: 'Saudi National Day 96',
    character: 'Rewaa AI (رِواء)',
  });
}
