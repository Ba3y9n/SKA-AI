class AudioPlayerService {
  private audioCtx: AudioContext | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isPlayingAudio: boolean = false;
  private safetyTimer: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  public loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        this.voices = window.speechSynthesis.getVoices() || [];
      } catch {
        this.voices = [];
      }
    }
  }

  public initAudioContext() {
    try {
      if (!this.audioCtx && typeof window !== 'undefined') {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
        this.loadVoices();
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  public stop() {
    if (this.safetyTimer) {
      clearTimeout(this.safetyTimer);
      this.safetyTimer = null;
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

    this.isPlayingAudio = false;
  }

  public isPlaying(): boolean {
    return this.isPlayingAudio;
  }

  /**
   * Play base64 audio with graceful fallback
   */
  public async playBase64Audio(
    base64Data: string,
    mimeType: string = 'audio/mpeg',
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): Promise<boolean> {
    this.stop();
    this.initAudioContext();

    let hasEnded = false;
    const triggerEnd = () => {
      if (hasEnded) return;
      hasEnded = true;
      if (this.safetyTimer) {
        clearTimeout(this.safetyTimer);
        this.safetyTimer = null;
      }
      this.isPlayingAudio = false;
      this.currentAudioElement = null;
      if (onEnd) onEnd();
    };

    try {
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const audio = new Audio(blobUrl);
      this.currentAudioElement = audio;

      audio.onplay = () => {
        this.isPlayingAudio = true;
        console.log('AUDIO_PLAYBACK_STARTED');
        if (onStart) onStart();
      };

      audio.onended = () => {
        URL.revokeObjectURL(blobUrl);
        triggerEnd();
      };

      audio.onerror = (e) => {
        URL.revokeObjectURL(blobUrl);
        this.isPlayingAudio = false;
        this.currentAudioElement = null;
        console.warn('Base64 audio playback failed:', e);
        if (onError) onError(e);
        triggerEnd();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      return true;
    } catch (error: any) {
      this.isPlayingAudio = false;
      if (onError) onError(error);
      triggerEnd();
      return false;
    }
  }

  /**
   * Synthesize speech via Web SpeechSynthesis API with full Arabic voice support
   */
  public playSpeechSynthesis(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    this.stop();
    this.initAudioContext();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onError) onError(new Error('SpeechSynthesis not supported'));
      if (onEnd) onEnd();
      return;
    }

    const cleanText = text
      .replace(/[*_#`~[\]()><{}|\\]/g, ' ')
      .replace(/https?:\/\/\S+/g, 'رابط')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    this.loadVoices();

    let hasEnded = false;
    const triggerEnd = () => {
      if (hasEnded) return;
      hasEnded = true;
      if (this.safetyTimer) {
        clearTimeout(this.safetyTimer);
        this.safetyTimer = null;
      }
      this.isPlayingAudio = false;
      if (onEnd) onEnd();
    };

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Match best Arabic voice available on this platform (iOS, Android, Windows, macOS)
      const arabicVoice = this.voices.find(
        (v) =>
          v.lang.startsWith('ar') ||
          v.lang.includes('SA') ||
          v.lang.includes('XA') ||
          v.lang.includes('EG') ||
          v.name.toLowerCase().includes('arabic') ||
          v.name.toLowerCase().includes('maged') ||
          v.name.toLowerCase().includes('laila') ||
          v.name.toLowerCase().includes('tarik') ||
          v.name.toLowerCase().includes('salma') ||
          v.name.toLowerCase().includes('naayf') ||
          v.name.toLowerCase().includes('hoda') ||
          v.name.toLowerCase().includes('zayd')
      );

      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onstart = () => {
        this.isPlayingAudio = true;
        console.log('AUDIO_PLAYBACK_STARTED (SpeechSynthesis)');
        if (onStart) onStart();
      };

      utterance.onend = () => {
        triggerEnd();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis utterance error:', e);
        triggerEnd();
      };

      // Safety fallback timer for speech synthesis
      const wordsCount = cleanText.split(' ').length;
      const estimatedMs = Math.max(3000, wordsCount * 400 + 2500);
      this.safetyTimer = setTimeout(() => {
        triggerEnd();
      }, estimatedMs);

      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);

      // Workaround for Chrome bug where long utterance gets paused after 15 seconds
      const resumeCheck = setInterval(() => {
        if (!hasEnded && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else {
          clearInterval(resumeCheck);
        }
      }, 3500);
    } catch (err: any) {
      this.isPlayingAudio = false;
      console.error('SpeechSynthesis error:', err);
      if (onError) onError(err);
      triggerEnd();
    }
  }

  /**
   * General speak function that tries Base64 first, then SpeechSynthesis
   */
  public speak(
    text: string,
    audioBase64?: string | null,
    mimeType?: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (audioBase64 && audioBase64.length > 50) {
      this.playBase64Audio(
        audioBase64,
        mimeType || 'audio/mpeg',
        onStart,
        onEnd,
        () => {
          // Fallback to SpeechSynthesis if base64 fails
          this.playSpeechSynthesis(text, onStart, onEnd, onError);
        }
      );
    } else {
      this.playSpeechSynthesis(text, onStart, onEnd, onError);
    }
  }
}

export const audioPlayer = new AudioPlayerService();
