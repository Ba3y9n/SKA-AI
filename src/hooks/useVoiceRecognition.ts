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

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);

      if (event.results[0].isFinal) {
        onResult(currentTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        onError('ما قدرت أوصل للميكروفون. تقدر تستخدم الكتابة بدل الصوت.');
      } else if (event.error === 'no-speech') {
        // user didn't speak, no harsh error needed
        if (onEnd) onEnd();
      } else {
        onError('تعذر التقاط الصوت بوضوح، يرجى إعادة المحاولة أو الكتابة.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (onEnd) onEnd();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [onResult, onError, onEnd]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      onError('المتصفح الحالي لا يدعم التعرف الصوتي المباشر. يمكنك استخدام لوحة المفاتيح للكتابة.');
      return;
    }

    if (recognitionRef.current) {
      try {
        setTranscript('');
        recognitionRef.current.start();
      } catch (e: any) {
        console.warn('Error starting speech recognition:', e);
      }
    }
  }, [isSupported, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  };
}
