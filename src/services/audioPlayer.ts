class AudioPlayerService {
  private isPlayingAudio: boolean = false;
  private isUnlocked: boolean = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private reusableAudio: HTMLAudioElement | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private currentQueue: string[] = [];
  private currentQueueIndex: number = 0;
  private onQueueEndCallback: (() => void) | null = null;
  private onQueueStartCallback: (() => void) | null = null;
  private onQueueErrorCallback: ((err: any) => void) | null = null;
  private resumeInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        // Create pre-allocated reusable audio element
        this.reusableAudio = new Audio();
        this.reusableAudio.preload = 'auto';
      } catch (e) {}

      // Global user interaction listener to proactively unlock AudioContext & reusable Audio
      const unlockHandler = () => {
        this.unlockAudio();
      };
      window.addEventListener('pointerdown', unlockHandler, { passive: true, once: false });
      window.addEventListener('touchstart', unlockHandler, { passive: true, once: false });
      window.addEventListener('click', unlockHandler, { passive: true, once: false });

      if ('speechSynthesis' in window) {
        this.loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
      }
    }
  }

  private loadVoices() {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.availableVoices = window.speechSynthesis.getVoices() || [];
        const arVoices = this.availableVoices.filter(v => v.lang.toLowerCase().startsWith('ar') || v.name.toLowerCase().includes('arabic'));
        if (arVoices.length > 0) {
          console.log(`[TTS] Detected ${arVoices.length} native Arabic system voice(s):`, arVoices.map(v => v.name));
        } else {
          console.log('[TTS] No native Arabic system voices in OS. Using high-quality Online Neural Audio Stream.');
        }
      }
    } catch (e) {
      console.warn('[TTS] Voice loading note:', e);
    }
  }

  /**
   * Unlock AudioContext and reusable Audio on first user gesture (touch / click / mic)
   */
  public initAudioContext() {
    this.unlockAudio();
  }

  public unlockAudio() {
    if (typeof window === 'undefined') return;

    if (!this.isUnlocked) {
      try {
        // 1. Unlock HTMLAudioElement with silent 1ms wav
        if (!this.reusableAudio) {
          this.reusableAudio = new Audio();
        }
        this.reusableAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        this.reusableAudio.volume = 0.01;
        this.reusableAudio.play().then(() => {
          this.isUnlocked = true;
          console.log('[TTS] 🔊 Audio output successfully unlocked on user device.');
        }).catch(() => {
          // Will retry on next interaction
        });

        // 2. Prime SpeechSynthesis
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const silentUtterance = new SpeechSynthesisUtterance(' ');
          silentUtterance.volume = 0;
          silentUtterance.rate = 2;
          window.speechSynthesis.speak(silentUtterance);
        }
      } catch {}
    }
  }

  public stop() {
    this.isPlayingAudio = false;
    this.currentQueue = [];
    this.currentQueueIndex = 0;

    if (this.resumeInterval) {
      clearInterval(this.resumeInterval);
      this.resumeInterval = null;
    }

    if (this.reusableAudio) {
      try {
        this.reusableAudio.pause();
        this.reusableAudio.onended = null;
        this.reusableAudio.onerror = null;
        this.reusableAudio.onplay = null;
        this.reusableAudio.src = '';
      } catch {}
    }

    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.onended = null;
        this.currentAudioElement.onerror = null;
        this.currentAudioElement.onplay = null;
        this.currentAudioElement.src = '';
      } catch {}
      this.currentAudioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  public isPlaying(): boolean {
    return this.isPlayingAudio;
  }

  /**
   * Clean text for natural Arabic speech without symbols or markdown
   */
  public cleanText(rawText: string): string {
    return rawText
      .replace(/[*_#`~[\]()><{}|\\\/]/g, ' ')
      .replace(/https?:\/\/\S+/g, 'رابط المنصة')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // remove emojis
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Split Arabic text into natural phrasing chunks for fluid audio streaming (max 130 chars)
   */
  private splitArabicSentences(text: string, maxLen = 130): string[] {
    const parts = text.split(/([.!؟?\n،]+)/).filter(Boolean);
    const chunks: string[] = [];
    let current = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if ((current + part).length <= maxLen) {
        current += part;
      } else {
        if (current.trim()) chunks.push(current.trim());
        current = part;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks.filter(c => c.trim().length > 0);
  }

  /**
   * Generate Google Neural Arabic Audio URL for a text chunk
   */
  private getGoogleTtsUrl(text: string): string {
    return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ar&client=tw-ob`;
  }

  /**
   * Speak Arabic text using crystal-clear natural female voice
   */
  public speak(
    text: string,
    audioBase64?: string | null,
    mimeType?: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    this.stop();

    if (typeof window === 'undefined') {
      if (onEnd) onEnd();
      return;
    }

    const clean = this.cleanText(text);
    if (!clean) {
      if (onEnd) onEnd();
      return;
    }

    console.log(`[TTS] 🎙️ Processing speech for "${clean.slice(0, 60)}..." (Total ${clean.length} chars)`);

    // 1. If Base64 Audio is returned from server
    if (audioBase64) {
      try {
        console.log('[TTS] 🔊 Playing high-definition audio stream from Base64...');
        const audioSrc = `data:${mimeType || 'audio/mpeg'};base64,${audioBase64}`;
        const audio = this.reusableAudio || new Audio();
        this.currentAudioElement = audio;

        audio.src = audioSrc;
        audio.volume = 1.0;

        audio.onplay = () => {
          this.isPlayingAudio = true;
          console.log('[TTS] ▶️ Base64 Audio playback started.');
          if (onStart) onStart();
        };

        audio.onended = () => {
          this.isPlayingAudio = false;
          console.log('[TTS] ⏹️ Base64 Audio playback finished.');
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.warn('[TTS] Base64 playback error, falling back to direct stream...', e);
          this.playDirectAudioStream(clean, onStart, onEnd, onError);
        };

        audio.play().catch((playErr) => {
          console.warn('[TTS] Audio play caught autoplay block, trying direct stream:', playErr);
          this.playDirectAudioStream(clean, onStart, onEnd, onError);
        });
        return;
      } catch (err) {
        console.warn('[TTS] Error initializing Base64 audio, trying direct stream:', err);
      }
    }

    // 2. Play via Direct Neural Audio Stream Queue (Primary guaranteed method)
    this.playDirectAudioStream(clean, onStart, onEnd, onError);
  }

  /**
   * Play multiple chunks using fluid Online Neural Arabic Audio Stream
   */
  private playDirectAudioStream(
    cleanText: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    const chunks = this.splitArabicSentences(cleanText);
    if (chunks.length === 0) {
      if (onEnd) onEnd();
      return;
    }

    // Limit to first 4 chunks for conversational speed
    this.currentQueue = chunks.slice(0, 4);
    this.currentQueueIndex = 0;
    this.onQueueStartCallback = onStart || null;
    this.onQueueEndCallback = onEnd || null;
    this.onQueueErrorCallback = onError || null;

    console.log(`[TTS] 🚀 Starting Neural Arabic Audio stream queue (${this.currentQueue.length} chunks)...`);
    this.playNextInQueue();
  }

  private playNextInQueue() {
    if (this.currentQueueIndex >= this.currentQueue.length) {
      this.isPlayingAudio = false;
      console.log('[TTS] ✅ Finished speaking all audio chunks.');
      if (this.onQueueEndCallback) this.onQueueEndCallback();
      return;
    }

    const chunkText = this.currentQueue[this.currentQueueIndex];
    const streamUrl = this.getGoogleTtsUrl(chunkText);

    try {
      const audio = this.reusableAudio || new Audio();
      this.currentAudioElement = audio;

      audio.src = streamUrl;
      audio.volume = 1.0;
      audio.playbackRate = 1.02; // Pleasant natural speaking rate

      let hasTriggeredStart = false;

      audio.onplay = () => {
        this.isPlayingAudio = true;
        if (!hasTriggeredStart && this.currentQueueIndex === 0) {
          hasTriggeredStart = true;
          console.log('[TTS] 🔊 Rewaa voice is now playing through speakers!');
          if (this.onQueueStartCallback) this.onQueueStartCallback();
        }
      };

      audio.onended = () => {
        this.currentQueueIndex++;
        this.playNextInQueue();
      };

      audio.onerror = (e) => {
        console.warn(`[TTS] Audio chunk ${this.currentQueueIndex} stream failed, checking system Web Speech fallback...`, e);
        // Fall back to Web Speech API for remaining text if stream fails
        this.fallbackFemaleSpeech(
          this.currentQueue.slice(this.currentQueueIndex).join(' '),
          this.onQueueStartCallback || undefined,
          this.onQueueEndCallback || undefined,
          this.onQueueErrorCallback || undefined
        );
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[TTS] Autoplay restriction on audio stream, trying system speech...', err);
          this.fallbackFemaleSpeech(
            this.currentQueue.slice(this.currentQueueIndex).join(' '),
            this.onQueueStartCallback || undefined,
            this.onQueueEndCallback || undefined,
            this.onQueueErrorCallback || undefined
          );
        });
      }
    } catch (e) {
      console.error('[TTS ERROR] Exception during audio stream queue:', e);
      this.fallbackFemaleSpeech(
        this.currentQueue.slice(this.currentQueueIndex).join(' '),
        this.onQueueStartCallback || undefined,
        this.onQueueEndCallback || undefined,
        this.onQueueErrorCallback || undefined
      );
    }
  }

  /**
   * Universal Web Speech API Female Arabic Voice Fallback
   */
  public fallbackFemaleSpeech(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.error('[TTS ERROR] SpeechSynthesis API is not supported in this browser.');
      if (onError) onError(new Error('SpeechSynthesis not supported'));
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      utterance.pitch = 1.15;

      if (this.availableVoices.length === 0) {
        this.availableVoices = window.speechSynthesis.getVoices() || [];
      }

      // Prioritize natural female Arabic voices across OS platforms
      const femaleArVoice = this.availableVoices.find(
        (v) =>
          (v.lang.toLowerCase().startsWith('ar') || v.name.toLowerCase().includes('arabic')) &&
          (v.name.toLowerCase().includes('salma') ||
            v.name.toLowerCase().includes('laila') ||
            v.name.toLowerCase().includes('hoda') ||
            v.name.toLowerCase().includes('zeina') ||
            v.name.toLowerCase().includes('fatima') ||
            v.name.toLowerCase().includes('zariyah') ||
            v.name.toLowerCase().includes('mariam') ||
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('natural'))
      ) || 
      this.availableVoices.find(v => v.lang.toLowerCase().startsWith('ar')) ||
      this.availableVoices.find(v => v.name.toLowerCase().includes('arabic'));

      if (femaleArVoice) {
        utterance.voice = femaleArVoice;
        console.log(`[TTS] Voice selected: "${femaleArVoice.name}" (${femaleArVoice.lang})`);
      }

      utterance.onstart = () => {
        this.isPlayingAudio = true;
        console.log('[TTS] Audio started speaking via Web Speech API.');
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.isPlayingAudio = false;
        if (this.resumeInterval) {
          clearInterval(this.resumeInterval);
          this.resumeInterval = null;
        }
        console.log('[TTS] Web Speech ended successfully.');
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.isPlayingAudio = false;
        if (this.resumeInterval) {
          clearInterval(this.resumeInterval);
          this.resumeInterval = null;
        }
        console.error('[TTS ERROR] Web Speech utterance error:', e);
        if (onError) onError(e);
        if (onEnd) onEnd();
      };

      // Watchdog interval to avoid Chromium long-utterance pause bug
      if (this.resumeInterval) clearInterval(this.resumeInterval);
      this.resumeInterval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(this.resumeInterval);
          this.resumeInterval = null;
        } else {
          window.speechSynthesis.resume();
        }
      }, 4000);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('[TTS ERROR] Exception while calling window.speechSynthesis.speak():', e);
      if (onError) onError(e);
      if (onEnd) onEnd();
    }
  }

  /**
   * Direct Real Sound Test: "مرحباً بكِ، أنا رِواء. الصوت يعمل الآن بنجاح ووضوح."
   */
  public testRewaaVoice(
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    this.unlockAudio();
    const testText = 'أهلاً بكِ، أنا رِواء. صوت الجيل الرقمي بكلية الأعمال والاقتصاد. الصوت يعمل الآن بنجاح ووضوح تام.';
    console.log('[TTS] 🔊 Running direct Rewaa voice test through speakers...');
    this.speak(testText, null, undefined, onStart, onEnd, onError);
  }
}

export const audioPlayer = new AudioPlayerService();
