import { useState, useCallback, useRef } from 'react';
import { ChatMessage } from '../types/chat';
import { CharacterState } from '../types/character';
import { sendChatMessage } from '../services/apiService';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useVoiceRecognition } from './useVoiceRecognition';

export function useGeminiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'rewaa',
      text: 'أهلاً بك! أنا "رِواء AI"، صوت الجيل السعودي الرقمي في اليوم الوطني 96 🇸🇦. يسعدني أحاورك عن تاريخ وطننا الغالي، تراث مناطقه، وإنجازاتنا نحو المستقبل. تفضل، وش حاب نتحدث عنه؟',
      timestamp: new Date(),
    },
  ]);
  const [characterState, setCharacterState] = useState<CharacterState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAutoVoiceEnabled, setIsAutoVoiceEnabled] = useState<boolean>(true);

  // Speech Synthesis Hook
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis({
    onStart: () => setCharacterState('SPEAKING'),
    onEnd: () => setCharacterState('IDLE'),
    onError: (err) => {
      console.warn('TTS error:', err);
      setCharacterState('IDLE');
    },
  });

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Send message to Gemini via backend proxy
  const sendMessage = useCallback(
    async (text: string, isVoice: boolean = false) => {
      if (!text || text.trim().length === 0) return;

      const userText = text.trim();
      setErrorMessage(null);
      stopSpeaking();

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
        const response = await sendChatMessage(userText, messagesRef.current);
        const replyText = response.reply;

        const rewaaMessage: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'rewaa',
          text: replyText,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, rewaaMessage]);

        // Speak aloud if voice enabled
        if (isAutoVoiceEnabled) {
          speak(replyText);
        } else {
          setCharacterState('IDLE');
        }
      } catch (err: any) {
        console.error('Chat error:', err);
        setCharacterState('ERROR');
        const errorText =
          err.message ||
          'عذراً، حدث خطأ أثناء معالجة السؤال. تأكد من إعداد مفتاح GEMINI_API_KEY بالخادم.';
        setErrorMessage(errorText);

        const errorChatMessage: ChatMessage = {
          id: 'msg-err-' + Date.now(),
          sender: 'system',
          text: `⚠️ ${errorText}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorChatMessage]);

        // Revert to IDLE after a brief timeout
        setTimeout(() => {
          setCharacterState((curr) => (curr === 'ERROR' ? 'IDLE' : curr));
        }, 5000);
      }
    },
    [isAutoVoiceEnabled, speak, stopSpeaking]
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
      setErrorMessage(errMsg);
      setCharacterState('ERROR');
      setTimeout(() => {
        setCharacterState((curr) => (curr === 'ERROR' ? 'IDLE' : curr));
      }, 4000);
    },
    onEnd: () => {
      // If was listening, switch to idle if not thinking
      setCharacterState((curr) => (curr === 'LISTENING' ? 'IDLE' : curr));
    },
  });

  const handleToggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      setCharacterState('IDLE');
    } else {
      stopSpeaking();
      setErrorMessage(null);
      setCharacterState('LISTENING');
      startListening();
    }
  }, [isListening, startListening, stopListening, stopSpeaking]);

  const replayMessageVoice = useCallback(
    (text: string) => {
      stopSpeaking();
      speak(text);
    },
    [speak, stopSpeaking]
  );

  return {
    messages,
    characterState,
    errorMessage,
    isListening,
    isSpeaking,
    transcript,
    isMicSupported,
    isAutoVoiceEnabled,
    setIsAutoVoiceEnabled,
    sendMessage,
    handleToggleListening,
    replayMessageVoice,
    stopSpeaking,
    clearError: () => setErrorMessage(null),
  };
}
