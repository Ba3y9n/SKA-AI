class AudioPlayerService {
  private isPlayingAudio: boolean = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private stopRequested: boolean = false;

  public initAudioContext() {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
        window.speechSynthesis.getVoices();
      }
    } catch {}
  }

  public stop() {
    this.stopRequested = true;
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
   * Speak Arabic text using backend TTS endpoint (/api/tts) with fallback to SpeechSynthesis
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
    this.stopRequested = false;
    this.initAudioContext();

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

    // 1. If base64 data was supplied by server
    if (audioBase64 && audioBase64.length > 50) {
      try {
        const binaryString = window.atob(audioBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType || 'audio/mpeg' });
        const blobUrl = URL.createObjectURL(blob);
        const audio = new Audio(blobUrl);
        this.currentAudioElement = audio;

        audio.onplay = () => {
          this.isPlayingAudio = true;
          if (onStart) onStart();
        };

        audio.onended = () => {
          URL.revokeObjectURL(blobUrl);
          this.isPlayingAudio = false;
          this.currentAudioElement = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          this.playViaTtsEndpoint(clean, onStart, onEnd, onError);
        };

        audio.play().catch(() => {
          this.playViaTtsEndpoint(clean, onStart, onEnd, onError);
        });
        return;
      } catch {
        // Fallback to endpoint
      }
    }

    // 2. Play via same-origin TTS endpoint
    this.playViaTtsEndpoint(clean, onStart, onEnd, onError);
  }

  private playViaTtsEndpoint(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    try {
      const endpointUrl = `/api/tts?text=${encodeURIComponent(text.slice(0, 400))}`;
      const audio = new Audio(endpointUrl);
      this.currentAudioElement = audio;

      audio.onplay = () => {
        this.isPlayingAudio = true;
        console.log('TTS_AUDIO_PLAYING');
        if (onStart) onStart();
      };

      audio.onended = () => {
        this.isPlayingAudio = false;
        this.currentAudioElement = null;
        if (onEnd) onEnd();
      };

      audio.onerror = (e) => {
        console.warn('TTS endpoint failed, trying SpeechSynthesis fallback:', e);
        this.fallbackSpeechSynthesis(text, onStart, onEnd, onError);
      };

      const p = audio.play();
      if (p !== undefined) {
        p.catch((err) => {
          console.warn('Audio play catch:', err);
          this.fallbackSpeechSynthesis(text, onStart, onEnd, onError);
        });
      }
    } catch {
      this.fallbackSpeechSynthesis(text, onStart, onEnd, onError);
    }
  }

  private fallbackSpeechSynthesis(
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
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices() || [];
      const arVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('ar') ||
          v.name.toLowerCase().includes('arabic') ||
          v.name.toLowerCase().includes('salma') ||
          v.name.toLowerCase().includes('maged') ||
          v.name.toLowerCase().includes('laila') ||
          v.name.toLowerCase().includes('tarik')
      );

      if (arVoice) utterance.voice = arVoice;

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

      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }
}

export const audioPlayer = new AudioPlayerService();
