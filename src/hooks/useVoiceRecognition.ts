import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceRecognitionOptions {
  onResult: (transcript: string) => void;
  onError: (errorMessage: string) => void;
  onEnd?: () => void;
}

export function useVoiceRecognition({ onResult, onError, onEnd }: VoiceRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const latestTranscriptRef = useRef<string>('');
  const hasTriggeredResultRef = useRef<boolean>(false);

  // Keep references fresh
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  const triggerFinalResult = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    const text = latestTranscriptRef.current.trim();
    if (text && !hasTriggeredResultRef.current) {
      hasTriggeredResultRef.current = true;
      console.log('USER_TRANSCRIPT_SUBMITTED:', text);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      onResultRef.current(text);
    }
  }, []);

  useEffect(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = 'ar-SA';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      latestTranscriptRef.current = '';
      hasTriggeredResultRef.current = false;
      console.log('MIC_STARTED');
    };

    recognition.onresult = (event: any) => {
      console.log('USER_AUDIO_RECEIVED');
      let interim = '';
      let final = '';

      for (let i = 0; i < event.results.length; i++) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript + ' ';
        } else {
          interim += item[0].transcript + ' ';
        }
      }

      const fullText = (final + interim).trim();
      if (!fullText) return;

      latestTranscriptRef.current = fullText;
      setTranscript(fullText);

      // Reset silence timer on every new word
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      // If pause detected after speaking, automatically trigger submission
      silenceTimerRef.current = setTimeout(() => {
        triggerFinalResult();
      }, final.length > 0 ? 500 : 900);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition event error:', event.error);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setIsListening(false);
        onErrorRef.current('ما قدرت أوصل للميكروفون. يرجى إعطاء الصلاحية في المتصفح.');
      } else if (event.error === 'no-speech') {
        if (latestTranscriptRef.current.trim()) {
          triggerFinalResult();
        } else {
          setIsListening(false);
          if (onEndRef.current) onEndRef.current();
        }
      } else if (event.error !== 'aborted') {
        setIsListening(false);
        onErrorRef.current('تعذر التقاط الصوت بوضوح، يرجى إعادة المحاولة.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (latestTranscriptRef.current.trim() && !hasTriggeredResultRef.current) {
        triggerFinalResult();
      } else {
        if (onEndRef.current) onEndRef.current();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [triggerFinalResult]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      onErrorRef.current('المتصفح لا يدعم التعرف الصوتي المباشر.');
      return;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    hasTriggeredResultRef.current = false;
    latestTranscriptRef.current = '';
    setTranscript('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      setTimeout(() => {
        try {
          recognitionRef.current?.start();
        } catch (e: any) {
          console.warn('Recognition start caught:', e);
        }
      }, 50);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (latestTranscriptRef.current.trim() && !hasTriggeredResultRef.current) {
      triggerFinalResult();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, [triggerFinalResult]);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  };
}

