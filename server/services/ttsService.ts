export function cleanTextForArabicTTS(rawText: string): string {
  return rawText
    .replace(/[*_#`~[\]()><{}|\\]/g, ' ') // remove markdown syntax
    .replace(/https?:\/\/\S+/g, 'رابط')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // remove emojis
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Synthesizes Arabic speech using Google's Neural TTS service.
 * Returns MP3 audio buffer.
 */
export async function synthesizeArabicAudio(text: string): Promise<Buffer | null> {
  const cleaned = cleanTextForArabicTTS(text);
  if (!cleaned) return null;

  // Split into chunks if text is long to prevent truncation (max 150 chars per chunk)
  const chunks: string[] = [];
  const sentences = cleaned.split(/([.!؟?\n]+)/).filter(Boolean);
  let currentChunk = '';

  for (const part of sentences) {
    if ((currentChunk + part).length < 150) {
      currentChunk += part;
    } else {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = part;
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());

  if (chunks.length === 0) return null;

  // Limit to first 3 chunks for fast conversational response
  const activeChunks = chunks.slice(0, 3);

  try {
    const audioBuffers: Buffer[] = [];

    for (const chunk of activeChunks) {
      const encoded = encodeURIComponent(chunk);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=ar&client=tw-ob`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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

    if (audioBuffers.length === 0) return null;
    return Buffer.concat(audioBuffers);
  } catch (err) {
    console.error('TTS synthesis error:', err);
    return null;
  }
}

