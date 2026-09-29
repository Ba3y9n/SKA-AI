export function cleanTextForArabicTTS(rawText: string): string {
  return rawText
    .replace(/[*_#`~[\]()><{}|\\]/g, ' ') // remove markdown syntax
    .replace(/https?:\/\/\S+/g, 'رابط')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // remove emojis
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Synthesizes complete Arabic speech using Google's Neural TTS service.
 * Returns seamless, continuous MP3 audio buffer for the entire text.
 */
export async function synthesizeArabicAudio(text: string): Promise<Buffer | null> {
  const cleaned = cleanTextForArabicTTS(text);
  if (!cleaned) return null;

  // Split into chunks if text is long to prevent truncation (max 130 chars per chunk)
  const chunks: string[] = [];
  const sentences = cleaned.split(/([.!؟?\n،]+)/).filter(Boolean);
  let currentChunk = '';

  for (const part of sentences) {
    if ((currentChunk + part).length < 130) {
      currentChunk += part;
    } else {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = part;
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());

  if (chunks.length === 0) return null;

  try {
    // Process all chunks in parallel preserving order
    const fetchPromises = chunks.map(async (chunk, idx) => {
      const encoded = encodeURIComponent(chunk);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=ar&client=tw-ob`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/'
        },
        signal: AbortSignal.timeout(8000)
      });

      if (response.ok) {
        const arrayBuf = await response.arrayBuffer();
        if (arrayBuf.byteLength > 0) {
          return { idx, buf: Buffer.from(arrayBuf) };
        }
      }
      return { idx, buf: null };
    });

    const results = await Promise.all(fetchPromises);
    results.sort((a, b) => a.idx - b.idx);

    const validBuffers = results
      .map(r => r.buf)
      .filter((buf): buf is Buffer => buf !== null && buf.length > 0);

    if (validBuffers.length === 0) return null;
    return Buffer.concat(validBuffers);
  } catch (err) {
    console.error('TTS synthesis error:', err);
    return null;
  }
}

