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
      console.log('USER_TRANSCRIPT', text);
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
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
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
      let fullText = '';
      let isFinalResult = false;

      for (let i = 0; i < event.results.length; i++) {
        const item = event.results[i];
        fullText += item[0].transcript + ' ';
        if (item.isFinal) {
          isFinalResult = true;
        }
      }

      fullText = fullText.trim();
      latestTranscriptRef.current = fullText;
      setTranscript(fullText);

      // Reset silence timer on every new speech token
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      // If marked final or silence pause detected, trigger automatic send!
      if (fullText.length > 0) {
        silenceTimerRef.current = setTimeout(() => {
          triggerFinalResult();
        }, isFinalResult ? 400 : 1000);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setIsListening(false);
        onErrorRef.current('ما قدرت أوصل للميكروفون. يرجى إعطاء الصلاحية في المتصفح.');
      } else if (event.error === 'no-speech') {
        // If user didn't speak, check if we have text
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

    if (recognitionRef.current) {
      try {
        hasTriggeredResultRef.current = false;
        latestTranscriptRef.current = '';
        setTranscript('');
        recognitionRef.current.start();
      } catch (e: any) {
        // If already started, ignore or restart
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current?.start();
          }, 100);
        } catch {
          // ignore
        }
      }
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (latestTranscriptRef.current.trim()) {
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
