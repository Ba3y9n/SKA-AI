class AudioPlayerService {
  private audioCtx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private safetyTimer: any = null;
  private isPlayingAudio: boolean = false;

  public initAudioContext() {
    try {
      if (!this.audioCtx && typeof window !== 'undefined') {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch((err) => {
          console.warn('AudioContext resume warning:', err);
        });
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  /**
   * Stop any currently playing audio immediately
   */
  public stop() {
    if (this.safetyTimer) {
      clearTimeout(this.safetyTimer);
      this.safetyTimer = null;
    }

    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch {
        // ignore if already stopped
      }
      this.currentSource = null;
    }

    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.src = '';
      } catch {
        // ignore
      }
      this.currentAudioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    this.isPlayingAudio = false;
  }

  public isPlaying(): boolean {
    return this.isPlayingAudio;
  }

  /**
   * Plays audio from base64 string using AudioContext or HTML5 Audio
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
      this.currentSource = null;
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
        console.error('AUDIO_PLAYBACK_ERROR', e);
        if (onError) onError(e);
        triggerEnd();
      };

      await audio.play();
      return true;
    } catch (error: any) {
      this.isPlayingAudio = false;
      console.error('AUDIO_PLAYBACK_ERROR', error);
      if (onError) onError(error);
      triggerEnd();
      return false;
    }
  }

  /**
   * Direct high-compatibility audio stream
   */
  public async playArabicStream(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    this.stop();
    this.initAudioContext();

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

    const sentence = cleanText.split(/([.!؟?\n]+)/).filter(Boolean).slice(0, 2).join(' ').slice(0, 180);
    const streamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(sentence)}&tl=ar&client=tw-ob`;

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
      const audio = new Audio(streamUrl);
      this.currentAudioElement = audio;

      audio.onplay = () => {
        this.isPlayingAudio = true;
        if (onStart) onStart();
      };

      audio.onended = () => {
        triggerEnd();
      };

      audio.onerror = () => {
        // Fallback to SpeechSynthesis
        this.playSpeechSynthesis(cleanText, onStart, onEnd, onError);
      };

      await audio.play();
    } catch {
      this.playSpeechSynthesis(cleanText, onStart, onEnd, onError);
    }
  }

  /**
   * Synthesize via Web SpeechSynthesis API as reliable browser fallback
   */
  public playSpeechSynthesis(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    this.stop();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onError) onError(new Error('SpeechSynthesis not supported'));
      if (onEnd) onEnd();
      return;
    }

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
      window.speechSynthesis.cancel();

      const cleanText = text
        .replace(/[*_#`~[\]()><{}|\\]/g, ' ')
        .replace(/https?:\/\/\S+/g, 'رابط')
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) {
        triggerEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(
        (v) => v.lang.startsWith('ar') || v.lang.includes('SA') || v.lang.includes('XA')
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
        console.error('SpeechSynthesis error:', e);
        triggerEnd();
      };

      // Safety timer for SpeechSynthesis (approx 150ms per word + 2s baseline)
      const estimatedWords = cleanText.split(' ').length;
      const estimatedMs = Math.max(3000, estimatedWords * 350 + 2000);
      this.safetyTimer = setTimeout(() => {
        triggerEnd();
      }, estimatedMs);

      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      this.isPlayingAudio = false;
      console.error('AUDIO_PLAYBACK_ERROR', err);
      if (onError) onError(err);
      triggerEnd();
    }
  }
}

export const audioPlayer = new AudioPlayerService();

