class AudioPlayerService {
  private isPlayingAudio: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private resumeTimer: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        this.voices = window.speechSynthesis.getVoices() || [];
      } catch {
        this.voices = [];
      }
    }
  }

  /**
   * Unlock audio permissions on any user click
   */
  public initAudioContext() {
    if (typeof window === 'undefined') return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
        this.initVoices();
      }
    } catch (e) {
      console.warn('Audio init warning:', e);
    }
  }

  /**
   * Stop any current speech or audio
   */
  public stop() {
    if (this.resumeTimer) {
      clearInterval(this.resumeTimer);
      this.resumeTimer = null;
    }

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.src = '';
      } catch {}
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }
      } catch {}
    }

    this.isPlayingAudio = false;
  }

  public isPlaying(): boolean {
    return this.isPlayingAudio;
  }

  /**
   * Play speech using Web Speech API with full Arabic dialect support
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
    this.initAudioContext();

    if (typeof window === 'undefined') {
      if (onEnd) onEnd();
      return;
    }

    const cleanText = text
      .replace(/[*_#`~[\]()><{}|\\]/g, ' ')
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    // Try HTML5 Audio if base64 data is present
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
        this.currentAudio = audio;

        audio.onplay = () => {
          this.isPlayingAudio = true;
          if (onStart) onStart();
        };

        audio.onended = () => {
          URL.revokeObjectURL(blobUrl);
          this.isPlayingAudio = false;
          this.currentAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          this.currentAudio = null;
          // Fallback to SpeechSynthesis
          this.speakWithSpeechSynthesis(cleanText, onStart, onEnd, onError);
        };

        audio.play().catch(() => {
          this.speakWithSpeechSynthesis(cleanText, onStart, onEnd, onError);
        });
        return;
      } catch {
        // Fallback to SpeechSynthesis
      }
    }

    this.speakWithSpeechSynthesis(cleanText, onStart, onEnd, onError);
  }

  private speakWithSpeechSynthesis(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!('speechSynthesis' in window)) {
      if (onError) onError(new Error('SpeechSynthesis not supported'));
      if (onEnd) onEnd();
      return;
    }

    this.initVoices();

    let hasEnded = false;
    const triggerEnd = () => {
      if (hasEnded) return;
      hasEnded = true;
      if (this.resumeTimer) {
        clearInterval(this.resumeTimer);
        this.resumeTimer = null;
      }
      this.isPlayingAudio = false;
      if (onEnd) onEnd();
    };

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      // Select Arabic voice
      const currentVoices = this.voices.length > 0 ? this.voices : window.speechSynthesis.getVoices();
      const arabicVoice = currentVoices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('ar') ||
          v.lang.toLowerCase().includes('sa') ||
          v.name.toLowerCase().includes('arabic') ||
          v.name.toLowerCase().includes('salma') ||
          v.name.toLowerCase().includes('laila') ||
          v.name.toLowerCase().includes('maged') ||
          v.name.toLowerCase().includes('tarik') ||
          v.name.toLowerCase().includes('hoda') ||
          v.name.toLowerCase().includes('naayf')
      );

      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onstart = () => {
        this.isPlayingAudio = true;
        console.log('AUDIO_SPEECH_STARTED');
        if (onStart) onStart();
      };

      utterance.onend = () => {
        triggerEnd();
      };

      utterance.onerror = (e) => {
        console.warn('Speech error:', e);
        triggerEnd();
      };

      // Workaround for Chrome / Edge pausing after 10-15 seconds
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);

      this.resumeTimer = setInterval(() => {
        if (!hasEnded && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else {
          clearInterval(this.resumeTimer);
          this.resumeTimer = null;
        }
      }, 4000);

      // Safety timeout: max 25 seconds
      setTimeout(() => {
        if (!hasEnded && !window.speechSynthesis.speaking) {
          triggerEnd();
        }
      }, Math.max(4000, text.length * 90));

    } catch (e: any) {
      console.error('SpeechSynthesis exception:', e);
      triggerEnd();
      if (onError) onError(e);
    }
  }
}

export const audioPlayer = new AudioPlayerService();
