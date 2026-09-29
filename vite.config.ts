import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function ttsDevPlugin() {
  return {
    name: 'tts-dev-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url && (req.url.startsWith('/api/tts') || req.url.startsWith('/api/tts-stream'))) {
          try {
            const parsedUrl = new URL(req.url, 'http://localhost:5173');
            const text = parsedUrl.searchParams.get('text');
            if (!text || !text.trim()) {
              res.statusCode = 400;
              res.end('Text parameter required');
              return;
            }

            const cleanText = text
              .replace(/[*_#`~[\]()><{}|\\]/g, ' ')
              .replace(/https?:\/\/\S+/g, 'رابط')
              .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
              .replace(/\s+/g, ' ')
              .trim();

            const sentences = cleanText.split(/([.!؟?\n،]+)/).filter(Boolean);
            const chunks: string[] = [];
            let currentChunk = '';
            for (const part of sentences) {
              if ((currentChunk + part).length < 140) {
                currentChunk += part;
              } else {
                if (currentChunk.trim()) chunks.push(currentChunk.trim());
                currentChunk = part;
              }
            }
            if (currentChunk.trim()) chunks.push(currentChunk.trim());

            const activeChunks = chunks.slice(0, 4);
            const audioBuffers: Buffer[] = [];

            for (const chunk of activeChunks) {
              const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=ar&client=tw-ob`;
              const ttsRes = await fetch(googleUrl, {
                headers: {
                  'Referer': 'https://translate.google.com/',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                },
                signal: AbortSignal.timeout(6000),
              });

              if (ttsRes.ok) {
                const arrayBuf = await ttsRes.arrayBuffer();
                if (arrayBuf.byteLength > 0) {
                  audioBuffers.push(Buffer.from(arrayBuf));
                }
              }
            }

            if (audioBuffers.length > 0) {
              const combined = Buffer.concat(audioBuffers);
              res.setHeader('Content-Type', 'audio/mpeg');
              res.setHeader('Content-Length', combined.length);
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Cache-Control', 'public, max-age=86400');
              res.statusCode = 200;
              res.end(combined);
              return;
            } else {
              res.statusCode = 502;
              res.end('Failed to synthesize TTS');
              return;
            }
          } catch (err: any) {
            console.error('Vite TTS Middleware error:', err);
            res.statusCode = 500;
            res.end('TTS synthesis error');
            return;
          }
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ttsDevPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api/chat': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/api/ambition': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/api/status': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
