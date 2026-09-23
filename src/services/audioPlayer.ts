class AudioPlayerService {
  private isPlayingAudio: boolean = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private stopRequested: boolean = false;

  public initAudioContext() {
    // Unblock audio on user interaction
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
   * Speak Arabic text using direct high-fidelity TTS audio stream + SpeechSynthesis backup
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

    // Split into conversational sentences for smooth streaming
    const rawChunks = clean.match(/[^.!؟?\n]+[.!?؟\n]*/g) || [clean];
    const chunks: string[] = [];
    let current = '';

    for (const piece of rawChunks) {
      const p = piece.trim();
      if (!p) continue;
      if ((current + ' ' + p).length < 130) {
        current += (current ? ' ' : '') + p;
      } else {
        if (current) chunks.push(current);
        current = p;
      }
    }
    if (current) chunks.push(current);
    if (chunks.length === 0) chunks.push(clean.slice(0, 120));

    let index = 0;
    this.isPlayingAudio = true;

    const playNextChunk = () => {
      if (this.stopRequested || index >= chunks.length) {
        this.isPlayingAudio = false;
        this.currentAudioElement = null;
        if (onEnd) onEnd();
        return;
      }

      const chunkText = chunks[index];
      index++;

      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunkText)}&tl=ar&client=tw-ob`;
      const audio = new Audio(ttsUrl);
      this.currentAudioElement = audio;

      let started = false;
      const markStart = () => {
        if (!started) {
          started = true;
          if (index === 1 && onStart) onStart();
        }
      };

      audio.onplay = markStart;

      audio.onended = () => {
        if (!this.stopRequested) {
          playNextChunk();
        }
      };

      audio.onerror = () => {
        console.warn('Audio tag failed, falling back to Web Speech API for chunk:', chunkText);
        this.fallbackSpeechSynthesis(chunkText, markStart, playNextChunk, playNextChunk);
      };

      audio.play().catch((err) => {
        console.warn('Audio play prevented by browser, falling back to Web Speech API:', err);
        this.fallbackSpeechSynthesis(chunkText, markStart, playNextChunk, playNextChunk);
      });
    };

    playNextChunk();
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
        if (onStart) onStart();
      };
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = (e) => {
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
