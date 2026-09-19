import https from 'https';

export function cleanTextForArabicTTS(rawText: string): string {
  return rawText
    .replace(/[*_#`~[\]()><{}|\\]/g, ' ') // remove markdown syntax
    .replace(/https?:\/\/\S+/g, 'رابط')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // remove emojis for cleaner voice
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

  // Split into chunks if text is long to prevent truncation (max 180 chars per chunk)
  const chunks: string[] = [];
  const sentences = cleaned.split(/([.!؟?\n]+)/).filter(Boolean);
  let currentChunk = '';

  for (const part of sentences) {
    if ((currentChunk + part).length < 180) {
      currentChunk += part;
    } else {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = part;
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());

  // If no chunks, return null
  if (chunks.length === 0) return null;

  // Limit to first 3 chunks to ensure fast real-time conversational streaming (approx 45 seconds of speech)
  const activeChunks = chunks.slice(0, 3);

  try {
    const audioBuffers: Buffer[] = await Promise.all(
      activeChunks.map((chunk) => {
        return new Promise<Buffer>((resolve, reject) => {
          const encoded = encodeURIComponent(chunk);
          const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=ar&client=tw-ob`;

          https
            .get(url, (res) => {
              if (res.statusCode !== 200) {
                return reject(new Error(`TTS service returned status ${res.statusCode}`));
              }
              const data: Buffer[] = [];
              res.on('data', (d) => data.push(d));
              res.on('end', () => resolve(Buffer.concat(data)));
            })
            .on('error', (err) => reject(err));
        });
      })
    );

    return Buffer.concat(audioBuffers);
  } catch (err) {
    console.error('TTS synthesis error:', err);
    return null;
  }
}
