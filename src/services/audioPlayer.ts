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

      // Method 1: Web Audio API (AudioContext)
      if (this.audioCtx) {
        try {
          if (this.audioCtx.state === 'suspended') {
            await this.audioCtx.resume();
          }

          const audioBuffer = await this.audioCtx.decodeAudioData(bytes.buffer.slice(0));
          const source = this.audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(this.audioCtx.destination);

          this.currentSource = source;
          this.isPlayingAudio = true;

          console.log('AUDIO_PLAYBACK_STARTED (AudioContext)');
          if (onStart) onStart();

          source.onended = () => {
            triggerEnd();
          };

          // Safety timeout in case onended doesn't fire
          const durationMs = Math.max(1000, (audioBuffer.duration + 0.4) * 1000);
          this.safetyTimer = setTimeout(() => {
            triggerEnd();
          }, durationMs);

          source.start(0);
          return true;
        } catch (decodeErr) {
          console.warn('AudioContext playback failed, trying HTML5 Audio fallback:', decodeErr);
        }
      }

      // Method 2: HTML5 Audio Element with Blob URL
      const blob = new Blob([bytes], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const audio = new Audio(blobUrl);
      this.currentAudioElement = audio;

      audio.onplay = () => {
        this.isPlayingAudio = true;
        console.log('AUDIO_PLAYBACK_STARTED (HTML5 Audio)');
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
        console.error('AUDIO_PLAYBACK_ERROR (HTML5 Audio)', e);
        if (onError) onError(e);
      };

      await audio.play();

      // Estimate safety timeout for HTML5 audio
      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          const durationMs = (audio.duration + 0.5) * 1000;
          this.safetyTimer = setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            triggerEnd();
          }, durationMs);
        }
      };

      return true;
    } catch (error: any) {
      this.isPlayingAudio = false;
      console.error('AUDIO_PLAYBACK_ERROR', error);
      if (onError) onError(error);
      return false;
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
      utterance.rate = 1.0;
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

