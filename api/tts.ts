import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const rawText = (req.query.text as string) || '';
    const cleanText = rawText
      .replace(/[*_#`~[\]()><{}|\\]/g, ' ')
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      return res.status(400).send('Text parameter required');
    }

    // Sentence split (max 150 chars per chunk)
    const sentences = cleanText.split(/([.!؟?\n]+)/).filter(Boolean);
    const chunks: string[] = [];
    let current = '';

    for (const s of sentences) {
      if ((current + ' ' + s).length < 140) {
        current += (current ? ' ' : '') + s;
      } else {
        if (current.trim()) chunks.push(current.trim());
        current = s;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    if (chunks.length === 0) chunks.push(cleanText.slice(0, 140));

    // Fetch MP3 chunks from Google Translate TTS with proper spoofed headers
    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks.slice(0, 4)) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=ar&client=tw-ob`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const arrayBuf = await response.arrayBuffer();
        if (arrayBuf.byteLength > 0) {
          audioBuffers.push(Buffer.from(arrayBuf));
        }
      }
    }

    if (audioBuffers.length === 0) {
      return res.status(500).send('TTS synthesis failed');
    }

    const combined = Buffer.concat(audioBuffers);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(combined);

  } catch (error: any) {
    console.error('TTS endpoint error:', error);
    return res.status(500).send('TTS error: ' + (error.message || 'Unknown error'));
  }
}
