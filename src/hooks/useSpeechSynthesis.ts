import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechSynthesisOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: string) => void;
}

export function useSpeechSynthesis({ onStart, onEnd, onError }: SpeechSynthesisOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setIsSupported(true);

      const updateVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        setVoices(availableVoices);

        // Find female Arabic voice or standard Arabic voice
        const arabicVoices = availableVoices.filter(
          (v) => v.lang.startsWith('ar') || v.lang.includes('SA') || v.lang.includes('XA')
        );

        // Prefer female Arabic voices like (Laila, Zeina, Salma, Maryam, Google العربية)
        const preferredFemaleArabic = arabicVoices.find(
          (v) =>
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('laila') ||
            v.name.toLowerCase().includes('zeina') ||
            v.name.toLowerCase().includes('salma') ||
            v.name.toLowerCase().includes('maryam') ||
            v.name.toLowerCase().includes('zariyah') ||
            v.name.toLowerCase().includes('noura')
        );

        const chosenVoice = preferredFemaleArabic || arabicVoices[0] || null;
        setSelectedVoice(chosenVoice);
      };

      updateVoices();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }, []);

  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/[*_#`~[\]()><]/g, ' ') // Remove markdown symbols
      .replace(/https?:\/\/\S+/g, 'رابط') // Replace urls
      .replace(/[\n\r]+/g, '. ') // Turn newlines into pauses
      .replace(/\s+/g, ' ')
      .trim();
  };

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !synthRef.current) {
        if (onError) onError('المتصفح لا يدعم ميزة نطق الصوت');
        return;
      }

      // Stop any existing speech
      synthRef.current.cancel();

      const cleaned = cleanTextForSpeech(text);
      if (!cleaned) return;

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.98; // Natural, clear conversational pace
      utterance.pitch = 1.05; // Gentle pleasant tone

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (onStart) onStart();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };

      synthRef.current.speak(utterance);
    },
    [isSupported, selectedVoice, onStart, onEnd, onError]
  );

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    hasArabicVoice: Boolean(selectedVoice),
  };
}
