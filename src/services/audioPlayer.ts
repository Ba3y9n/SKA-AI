class AudioPlayerService {
  private isPlayingAudio: boolean = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private isUnlocked: boolean = false;
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.availableVoices = window.speechSynthesis.getVoices() || [];
      }
    } catch {}
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
        }).catch(() => {
          // Will unlock on next interaction
        });
      } catch {}
    }
  }

  public stop() {
    this.isPlayingAudio = false;

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

    // 1. If Base64 Audio is returned from backend
    if (audioBase64) {
      try {
        const audioSrc = `data:${mimeType || 'audio/mpeg'};base64,${audioBase64}`;
        const audio = new Audio(audioSrc);
        this.currentAudioElement = audio;

        audio.onplay = () => {
          this.isPlayingAudio = true;
          if (onStart) onStart();
        };

        audio.onended = () => {
          this.isPlayingAudio = false;
          this.currentAudioElement = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          this.fallbackFemaleSpeech(clean, onStart, onEnd, onError);
        };

        audio.play().catch(() => {
          this.fallbackFemaleSpeech(clean, onStart, onEnd, onError);
        });
        return;
      } catch {
        this.fallbackFemaleSpeech(clean, onStart, onEnd, onError);
        return;
      }
    }

    // 2. Try backend TTS endpoint
    const endpointUrl = `/api/tts?text=${encodeURIComponent(clean.slice(0, 350))}`;
    const audio = new Audio(endpointUrl);
    this.currentAudioElement = audio;

    let hasStarted = false;
    audio.onplay = () => {
      this.isPlayingAudio = true;
      hasStarted = true;
      if (onStart) onStart();
    };

    audio.onended = () => {
      this.isPlayingAudio = false;
      this.currentAudioElement = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      if (!hasStarted) {
        this.fallbackFemaleSpeech(clean, onStart, onEnd, onError);
      } else {
        this.isPlayingAudio = false;
        this.currentAudioElement = null;
        if (onEnd) onEnd();
      }
    };

    audio.play().catch(() => {
      if (!hasStarted) {
        this.fallbackFemaleSpeech(clean, onStart, onEnd, onError);
      }
    });
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
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      utterance.pitch = 1.15; // Pleasant, natural female tone

      if (this.availableVoices.length === 0) {
        this.availableVoices = window.speechSynthesis.getVoices() || [];
      }

      // Prioritize natural female Arabic voices
      const femaleArVoice = this.availableVoices.find(
        (v) =>
          (v.lang.toLowerCase().startsWith('ar') || v.name.toLowerCase().includes('arabic')) &&
          (v.name.toLowerCase().includes('salma') ||
            v.name.toLowerCase().includes('laila') ||
            v.name.toLowerCase().includes('hoda') ||
            v.name.toLowerCase().includes('zeina') ||
            v.name.toLowerCase().includes('fatima') ||
            v.name.toLowerCase().includes('zariyah') ||
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('natural'))
      ) || this.availableVoices.find(v => v.lang.toLowerCase().startsWith('ar'));

      if (femaleArVoice) {
        utterance.voice = femaleArVoice;
      }

      utterance.onstart = () => {
        this.isPlayingAudio = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.isPlayingAudio = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.isPlayingAudio = false;
        if (onError) onError(e);
        if (onEnd) onEnd();
      };

      // Watchdog interval to avoid Chrome SpeechSynthesis pause glitch
      const resumeInterval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(resumeInterval);
        } else {
          window.speechSynthesis.resume();
        }
      }, 5000);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      if (onError) onError(e);
      if (onEnd) onEnd();
    }
  }
}

export const audioPlayer = new AudioPlayerService();
