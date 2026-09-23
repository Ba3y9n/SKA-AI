import { useState, useCallback, useRef } from 'react';
import { ChatMessage } from '../types/chat';
import { CharacterState } from '../types/character';
import { sendChatMessage } from '../services/apiService';
import { audioPlayer } from '../services/audioPlayer';
import { useVoiceRecognition } from './useVoiceRecognition';

export function useGeminiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'rewaa',
      text: 'أهلاً بك، أنا رِواء. صوت الجيل السعودي الرقمي في اليوم الوطني 96. تفضلي بالحديث معي صوتياً أو كتابةً، أو اسأليني عن أقسام المنصة وفعاليات كلية الأعمال والاقتصاد.',
      timestamp: new Date(),
    },
  ]);
  const [characterState, setCharacterState] = useState<CharacterState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);
  const [isAutoVoiceEnabled, setIsAutoVoiceEnabled] = useState<boolean>(true);
  const [isVoiceSessionActive, setIsVoiceSessionActive] = useState<boolean>(false);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const isVoiceSessionActiveRef = useRef(isVoiceSessionActive);
  isVoiceSessionActiveRef.current = isVoiceSessionActive;

  const getUserContext = useCallback(() => {
    try {
      const achievements = JSON.parse(localStorage.getItem('user_achievements') || '[]');
      const userToken = localStorage.getItem('rewaa_user_token') || '';
      return {
        achievementsCount: achievements.length,
        ambitionsCount: 0,
        galleryCount: 0,
        galleryStatus: 'جاهز للاستفسار'
      };
    } catch {
      return undefined;
    }
  }, []);

  // Forward ref for startListening
  const startListeningRef = useRef<() => void>(() => {});

  // Function to play audio response with proper state and fallback
  const playAudio = useCallback(
    (replyText: string, audioBase64?: string | null, mimeType?: string) => {
      setAudioNotice(null);

      const onAudioEnd = () => {
        setCharacterState('IDLE');
        // If the user is in continuous voice mode, automatically resume listening!
        if (isVoiceSessionActiveRef.current) {
          setTimeout(() => {
            if (isVoiceSessionActiveRef.current) {
              setCharacterState('LISTENING');
              startListeningRef.current();
            }
          }, 350);
        }
      };

      if (audioBase64) {
        console.log('AUDIO_RECEIVED_PLAYING_BASE64');
        audioPlayer
          .playBase64Audio(
            audioBase64,
            mimeType || 'audio/mpeg',
            () => setCharacterState('SPEAKING'),
            onAudioEnd,
            (err) => {
              console.warn('Base64 playback error, using Stream fallback:', err);
              audioPlayer.playArabicStream(
                replyText,
                () => setCharacterState('SPEAKING'),
                onAudioEnd,
                () => {
                  setCharacterState('IDLE');
                  setAudioNotice('تعذر تشغيل الصوت، يمكنك قراءة الرد.');
                }
              );
            }
          )
          .catch(() => {
            audioPlayer.playArabicStream(
              replyText,
              () => setCharacterState('SPEAKING'),
              onAudioEnd,
              () => setCharacterState('IDLE')
            );
          });
      } else {
        // Play direct Arabic audio stream fallback
        audioPlayer.playArabicStream(
          replyText,
          () => setCharacterState('SPEAKING'),
          onAudioEnd,
          (err) => {
            console.error('AUDIO_PLAYBACK_ERROR', err);
            setCharacterState('IDLE');
            setAudioNotice('تعذر تشغيل الصوت، يمكنك قراءة الرد.');
          }
        );
      }
    },
    []
  );

  // Send message to Gemini via backend proxy
  const sendMessage = useCallback(
    async (text: string, isVoice: boolean = false) => {
      if (!text || text.trim().length === 0) return;

      const userText = text.trim();
      setErrorMessage(null);
      setAudioNotice(null);
      audioPlayer.stop();

      console.log('GEMINI_REQUEST_SENT', { userText, isVoice });

      // Append user message
      const userMessage: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'user',
        text: userText,
        timestamp: new Date(),
        isVoiceInput: isVoice,
      };

      setMessages((prev) => [...prev, userMessage]);
      setCharacterState('THINKING');

      try {
        const userCtx = getUserContext();
        const response = await sendChatMessage(userText, messagesRef.current, userCtx);
        console.log('GEMINI_RESPONSE_RECEIVED');

        const replyText = response.reply;

        const rewaaMessage: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'rewaa',
          text: replyText,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, rewaaMessage]);

        // If auto voice is enabled, play audio
        if (isAutoVoiceEnabled) {
          playAudio(replyText, response.audioBase64, response.mimeType);
        } else {
          setCharacterState('IDLE');
        }
      } catch (err: any) {
        console.error('AUDIO_PLAYBACK_ERROR', err);
        let errorText = err.message || 'عذراً، حدث خطأ أثناء معالجة السؤال.';
        if (errorText.includes('429') || errorText.includes('quota') || errorText.includes('Too Many Requests')) {
          errorText = 'هناك ضغط مؤقت على الخدمة، يرجى إعادة المحاولة بعد ثوانٍ بسيطة.';
        }
        setErrorMessage(errorText);

        const errorChatMessage: ChatMessage = {
          id: 'msg-err-' + Date.now(),
          sender: 'system',
          text: `⚠️ ${errorText}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorChatMessage]);

        // Revert to IDLE after timeout
        setTimeout(() => {
          setCharacterState((curr) => (curr === 'ERROR' ? 'IDLE' : curr));
        }, 5000);
      }
    },
    [isAutoVoiceEnabled, playAudio]
  );

  // Voice Recognition Hook
  const {
    isListening,
    transcript,
    isSupported: isMicSupported,
    startListening,
    stopListening,
  } = useVoiceRecognition({
    onResult: (resultText) => {
      if (resultText && resultText.trim().length > 0) {
        sendMessage(resultText, true);
      }
    },
    onError: (errMsg) => {
      console.error('AUDIO_PLAYBACK_ERROR', errMsg);
      setErrorMessage(errMsg);
      setIsVoiceSessionActive(false);
      setCharacterState('ERROR');
      setTimeout(() => {
        setCharacterState((curr) => (curr === 'ERROR' ? 'IDLE' : curr));
      }, 4000);
    },
    onEnd: () => {
      if (characterState === 'LISTENING') {
        setCharacterState('IDLE');
      }
    },
  });

  startListeningRef.current = startListening;

  const handleToggleListening = useCallback(() => {
    // Unlock AudioContext immediately upon user click
    audioPlayer.initAudioContext();

    if (isListening || isVoiceSessionActive || characterState === 'THINKING' || characterState === 'SPEAKING') {
      setIsVoiceSessionActive(false);
      stopListening();
      audioPlayer.stop();
      setCharacterState('IDLE');
    } else {
      setIsVoiceSessionActive(true);
      audioPlayer.stop();
      setErrorMessage(null);
      setAudioNotice(null);
      setCharacterState('LISTENING');
      startListening();
    }
  }, [isListening, isVoiceSessionActive, characterState, startListening, stopListening]);

  const replayMessageVoice = useCallback(
    async (text: string) => {
      audioPlayer.stop();
      setCharacterState('THINKING');
      try {
        const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
        if (res.ok) {
          const blob = await res.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = (reader.result as string).split(',')[1];
            playAudio(text, base64data, 'audio/mpeg');
          };
          reader.readAsDataURL(blob);
        } else {
          playAudio(text);
        }
      } catch {
        playAudio(text);
      }
    },
    [playAudio]
  );

  return {
    messages,
    characterState,
    errorMessage,
    audioNotice,
    isListening,
    isVoiceSessionActive,
    transcript,
    isMicSupported,
    isAutoVoiceEnabled,
    setIsAutoVoiceEnabled,
    sendMessage,
    handleToggleListening,
    replayMessageVoice,
    stopSpeaking: () => audioPlayer.stop(),
    clearError: () => setErrorMessage(null),
  };
}
