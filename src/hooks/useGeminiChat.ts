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
      text: 'أهلاً بك! أنا "رِواء AI"، صوت الجيل السعودي الرقمي في اليوم الوطني 96 🇸🇦. يسعدني أحاورك عن تاريخ وطننا الغالي، تراث مناطقه، وإنجازاتنا نحو المستقبل. تفضل، وش حاب نتحدث عنه؟',
      timestamp: new Date(),
    },
  ]);
  const [characterState, setCharacterState] = useState<CharacterState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);
  const [isAutoVoiceEnabled, setIsAutoVoiceEnabled] = useState<boolean>(true);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Function to play audio response with proper state and fallback
  const playAudio = useCallback(
    (replyText: string, audioBase64?: string | null, mimeType?: string) => {
      setAudioNotice(null);

      if (audioBase64) {
        console.log('Gemini audio received');
        audioPlayer
          .playBase64Audio(
            audioBase64,
            mimeType || 'audio/mpeg',
            () => setCharacterState('SPEAKING'),
            () => setCharacterState('IDLE'),
            (err) => {
              console.warn('Base64 playback failed, falling back to Web Speech Synthesis:', err);
              // Fallback to browser SpeechSynthesis
              audioPlayer.playSpeechSynthesis(
                replyText,
                () => setCharacterState('SPEAKING'),
                () => setCharacterState('IDLE'),
                () => {
                  setCharacterState('IDLE');
                  setAudioNotice('تعذر تشغيل الصوت، يمكنك قراءة الرد.');
                }
              );
            }
          )
          .catch(() => {
            setCharacterState('IDLE');
            setAudioNotice('تعذر تشغيل الصوت، يمكنك قراءة الرد.');
          });
      } else {
        // Use browser SpeechSynthesis if no backend audio buffer
        audioPlayer.playSpeechSynthesis(
          replyText,
          () => setCharacterState('SPEAKING'),
          () => setCharacterState('IDLE'),
          (err) => {
            console.error('Voice error:', err);
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

      console.log('User audio sent', { text: userText, isVoice });

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
        console.log('Gemini response received');

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
        console.error('Voice error:', err);
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
      console.error('Voice error:', errMsg);
      setErrorMessage(errMsg);
      setCharacterState('ERROR');
      setTimeout(() => {
        setCharacterState((curr) => (curr === 'ERROR' ? 'IDLE' : curr));
      }, 4000);
    },
    onEnd: () => {
      setCharacterState((curr) => (curr === 'LISTENING' ? 'IDLE' : curr));
    },
  });

  const handleToggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      setCharacterState('IDLE');
    } else {
      console.log('Voice session started');
      audioPlayer.stop();
      setErrorMessage(null);
      setAudioNotice(null);
      setCharacterState('LISTENING');
      startListening();
    }
  }, [isListening, startListening, stopListening]);

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
