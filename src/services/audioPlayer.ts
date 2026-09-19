class AudioPlayerService {
  private audioCtx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private isPlayingAudio: boolean = false;

  private initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch((err) => {
        console.warn('AudioContext resume error:', err);
      });
    }
  }

  /**
   * Stop any currently playing audio immediately
   */
  public stop() {
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
        this.currentAudioElement.currentTime = 0;
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

    try {
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Try AudioContext decode first
      if (this.audioCtx) {
        try {
          const audioBuffer = await this.audioCtx.decodeAudioData(bytes.buffer.slice(0));
          const source = this.audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(this.audioCtx.destination);

          this.currentSource = source;
          this.isPlayingAudio = true;

          console.log('Audio playback started');
          if (onStart) onStart();

          source.onended = () => {
            this.isPlayingAudio = false;
            this.currentSource = null;
            if (onEnd) onEnd();
          };

          source.start(0);
          return true;
        } catch (decodeErr) {
          console.warn('AudioContext decode failed, falling back to Blob Audio Element:', decodeErr);
        }
      }

      // Fallback: HTML5 Audio with Blob URL
      const blob = new Blob([bytes], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const audio = new Audio(blobUrl);
      this.currentAudioElement = audio;

      audio.onplay = () => {
        this.isPlayingAudio = true;
        console.log('Audio playback started');
        if (onStart) onStart();
      };

      audio.onended = () => {
        this.isPlayingAudio = false;
        this.currentAudioElement = null;
        URL.revokeObjectURL(blobUrl);
        if (onEnd) onEnd();
      };

      audio.onerror = (e) => {
        this.isPlayingAudio = false;
        this.currentAudioElement = null;
        URL.revokeObjectURL(blobUrl);
        console.error('Voice error:', e);
        if (onError) onError(e);
      };

      await audio.play();
      return true;
    } catch (error: any) {
      this.isPlayingAudio = false;
      console.error('Voice error:', error);
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

    try {
      const cleanText = text
        .replace(/[*_#`~[\]()><{}|\\]/g, ' ')
        .replace(/https?:\/\/\S+/g, 'رابط')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(
        (v) => v.lang.startsWith('ar') || v.lang.includes('SA') || v.lang.includes('XA')
      );
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onstart = () => {
        this.isPlayingAudio = true;
        console.log('Audio playback started');
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.isPlayingAudio = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.isPlayingAudio = false;
        console.error('Voice error:', e);
        if (onError) onError(e);
      };

      // Workaround for Chrome garbage collection bug
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      this.isPlayingAudio = false;
      console.error('Voice error:', err);
      if (onError) onError(err);
    }
  }
}

export const audioPlayer = new AudioPlayerService();
