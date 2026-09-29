class AudioPlayerService {
  private isPlayingAudio: boolean = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private isUnlocked: boolean = false;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private resumeInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Global user interaction listener to proactively unlock AudioContext & Web Speech
      const unlockHandler = () => {
        this.unlockAudio();
      };
      window.addEventListener('pointerdown', unlockHandler, { passive: true });
      window.addEventListener('touchstart', unlockHandler, { passive: true });
      window.addEventListener('click', unlockHandler, { passive: true });

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
        if (this.availableVoices.length > 0) {
          console.log(`[TTS] Loaded ${this.availableVoices.length} speech synthesis voices.`);
        }
      }
    } catch (e) {
      console.warn('[TTS] Failed to query speech synthesis voices:', e);
    }
  }

  /**
   * Unlock AudioContext and Web Speech API on first user gesture (touch / click / mic)
   */
  public initAudioContext() {
    this.unlockAudio();
  }

  public unlockAudio() {
    if (typeof window === 'undefined') return;

    if (!this.isUnlocked) {
      try {
        // 1. Prime SpeechSynthesis
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const silentUtterance = new SpeechSynthesisUtterance('');
          silentUtterance.volume = 0;
          silentUtterance.rate = 2;
          window.speechSynthesis.speak(silentUtterance);
        }

        // 2. Prime HTMLAudioElement with silent 1ms wav
        const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
        silentAudio.volume = 0.01;
        silentAudio.play().then(() => {
          this.isUnlocked = true;
          console.log('[TTS] Audio playback unlocked successfully via user gesture.');
        }).catch(() => {
          // Will unlock on next interaction
        });
      } catch {}
    }
  }

  public stop() {
    this.isPlayingAudio = false;

    if (this.resumeInterval) {
      clearInterval(this.resumeInterval);
      this.resumeInterval = null;
    }

    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
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
   * Clean text for clean, natural Arabic speech without symbols or markdown
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

    console.log(`[TTS] Response received for speech synthesis. Text length: ${clean.length} chars.`);

    // 1. If Base64 Audio is returned from backend / Gemini
    if (audioBase64) {
      try {
        console.log('[TTS] Playing high-definition audio stream from server...');
        const audioSrc = `data:${mimeType || 'audio/mpeg'};base64,${audioBase64}`;
        const audio = new Audio(audioSrc);
        this.currentAudioElement = audio;

        audio.onplay = () => {
          this.isPlayingAudio = true;
          console.log('[TTS] Audio started playing from Base64 stream.');
          if (onStart) onStart();
        };

        audio.onended = () => {
          this.isPlayingAudio = false;
          this.currentAudioElement = null;
          console.log('[TTS] Audio ended successfully.');
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.warn('[TTS] Base64 audio stream playback failed, falling back to Web Speech Synthesis...', e);
          this.fallbackFemaleSpeech(clean, onStart, onEnd, onError);
        };

        audio.play().catch((playErr) => {
          console.warn('[TTS] Audio.play() caught error (autoplay restriction or decode), falling back:', playErr);
          this.fallbackFemaleSpeech(clean, onStart, onEnd, onError);
        });
        return;
      } catch (err) {
        console.warn('[TTS] Audio initialization error, falling back:', err);
        this.fallbackFemaleSpeech(clean, onStart, onEnd, onError);
        return;
      }
    }

    // 2. Direct Web Speech Synthesis with female Arabic voice
    this.fallbackFemaleSpeech(clean, onStart, onEnd, onError);
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
      console.error('[TTS ERROR] SpeechSynthesis API is not supported in this browser environment.');
      if (onError) onError(new Error('SpeechSynthesis not supported'));
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      utterance.pitch = 1.15; // Natural, friendly female tone

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
      } else {
        console.log('[TTS] Voice selected: Default system Arabic synthesizer (ar-SA)');
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
        console.log('[TTS] Audio ended successfully.');
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
   * Direct Real Sound Test: "مرحباً، أنا رِواء، الصوت يعمل الآن بنجاح"
   */
  public testRewaaVoice(
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    this.unlockAudio();
    const testText = 'أهلاً بكِ، أنا رِواء. الصوت يعمل الآن بنجاح ووضوح.';
    console.log('[TTS] 🔊 Running direct Rewaa voice test...');
    this.fallbackFemaleSpeech(testText, onStart, onEnd, onError);
  }
}

export const audioPlayer = new AudioPlayerService();
