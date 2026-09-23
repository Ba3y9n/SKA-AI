class AudioPlayerService {
  private isPlayingAudio: boolean = false;
  private currentAudioElement: HTMLAudioElement | null = null;

  public initAudioContext() {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {}
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
   * Speak Arabic text using single unified crystal-clear female voice
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

    const clean = text
      .replace(/[*_#`~[\]()><{}|\\]/g, ' ')
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) {
      if (onEnd) onEnd();
      return;
    }

    // Single source: Backend TTS MP3 endpoint
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
      // If endpoint completely fails, fallback to female SpeechSynthesis only
      if (!hasStarted) {
        this.fallbackFemaleSpeech(clean, onStart, onEnd, onError);
      } else {
        this.isPlayingAudio = false;
        this.currentAudioElement = null;
        if (onEnd) onEnd();
      }
    };

    audio.play().catch(() => {
      // Browser prevented autoplay without interaction
      if (!hasStarted) {
        this.fallbackFemaleSpeech(clean, onStart, onEnd, onError);
      }
    });
  }

  private fallbackFemaleSpeech(
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
      utterance.pitch = 1.1; // Slightly higher pitch for female character

      const voices = window.speechSynthesis.getVoices() || [];
      // Prefer female Arabic voices only
      const femaleArVoice = voices.find(
        (v) =>
          (v.lang.toLowerCase().startsWith('ar') || v.name.toLowerCase().includes('arabic')) &&
          (v.name.toLowerCase().includes('salma') ||
            v.name.toLowerCase().includes('laila') ||
            v.name.toLowerCase().includes('hoda') ||
            v.name.toLowerCase().includes('zeina') ||
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('natural'))
      ) || voices.find(v => v.lang.toLowerCase().startsWith('ar'));

      if (femaleArVoice) utterance.voice = femaleArVoice;

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

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }
}

export const audioPlayer = new AudioPlayerService();
