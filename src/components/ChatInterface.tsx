import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/chat';
import { CharacterState } from '../types/character';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Copy,
  Check,
  User,
  Sparkles,
  AlertCircle,
  Clock,
  VolumeX,
} from 'lucide-react';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  characterState: CharacterState;
  audioNotice?: string | null;
  onSendMessage: (text: string) => void;
  onToggleMic: () => void;
  isListening: boolean;
  transcript: string;
  onReplayVoice: (text: string) => void;
  isMicSupported: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  characterState,
  audioNotice,
  onSendMessage,
  onToggleMic,
  isListening,
  transcript,
  onReplayVoice,
  isMicSupported,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll ONLY within the chat box
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, characterState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && characterState !== 'THINKING') {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[460px] sm:h-[520px] w-full rounded-3xl bg-white border border-saudi-100 shadow-lg overflow-hidden">
      
      {/* Audio Notice Banner if audio failed */}
      {audioNotice && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <VolumeX className="w-4 h-4 text-amber-600" />
            <span>{audioNotice}</span>
          </div>
        </div>
      )}

      {/* Chat Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth bg-white"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isUser
                    ? 'bg-saudi-700 border-emerald-800 text-white'
                    : 'bg-white border-saudi-200 text-saudi-700 shadow-sm'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all shadow-sm ${
                  isUser
                    ? 'bg-saudi-700 text-white rounded-bl-sm'
                    : 'bg-white border border-saudi-100 text-gray-800 rounded-br-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Message Meta & Action Bar */}
                <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] opacity-70">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(msg.timestamp).toLocaleTimeString('ar-SA', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  {/* Actions (Replay Audio / Copy) */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isUser && (
                      <button
                        onClick={() => onReplayVoice(msg.text)}
                        className="p-1 hover:text-saudi-700 rounded transition flex items-center gap-1"
                        title="استماع للرد صوتياً"
                        aria-label="استمع للرد صوتياً"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-saudi-700" />
                        <span className="text-[10px]">استماع</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="p-1 hover:text-saudi-700 rounded transition"
                      title="نسخ النص"
                      aria-label="نسخ نص الرسالة"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-saudi-700" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Real-time speech transcript preview while listening */}
        {isListening && transcript && (
          <div className="flex items-end gap-2.5 flex-row-reverse animate-pulse">
            <div className="w-8 h-8 rounded-full bg-saudi-700 border border-emerald-800 text-white flex items-center justify-center shrink-0">
              <Mic className="w-4 h-4 text-saudi-200" />
            </div>
            <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm bg-saudi-50 border border-saudi-200 text-saudi-900 italic">
              {transcript}...
            </div>
          </div>
        )}

        {/* Thinking Indicator */}
        {characterState === 'THINKING' && (
          <div className="flex items-center gap-2.5 flex-row">
            <div className="w-8 h-8 rounded-full bg-white border border-saudi-200 text-saudi-700 flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4 animate-spin text-saudi-700" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-white border border-saudi-100 flex items-center gap-2 shadow-sm">
              <span className="text-xs text-emerald-800 font-semibold ml-1">رِواء تفكر وتستحضر الرد</span>
              <span className="w-1.5 h-1.5 rounded-full bg-saudi-600 animate-bounce" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-saudi-600 animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-saudi-600 animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Input Bar Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 bg-white border-t border-saudi-100 flex items-center gap-2.5"
      >
        {/* Voice Microphone Button */}
        <button
          type="button"
          onClick={onToggleMic}
          disabled={characterState === 'THINKING'}
          className={`relative p-3.5 rounded-2xl flex items-center justify-center transition-all transform active:scale-95 disabled:opacity-50 ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 ring-4 ring-red-100'
              : 'bg-saudi-700 hover:bg-emerald-800 text-white shadow-md shadow-saudi-100'
          }`}
          title={isListening ? 'إيقاف الاستماع' : 'تحدث صوتياً بالميكروفون'}
          aria-label={isListening ? 'إيقاف الاستماع الصوتي' : 'بدء التحدث بالصوت'}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
            </>
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        {/* Text Input Field */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={characterState === 'THINKING'}
            placeholder={
              isListening
                ? 'جاري الاستماع لصوتك...'
                : 'اكتب سؤالك أو تحدث صوتياً بالميكروفون...'
            }
            className="w-full bg-slate-50 border border-saudi-100 focus:border-saudi-600 focus:bg-white focus:ring-2 focus:ring-saudi-100 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all disabled:opacity-50"
            aria-label="اكتب سؤالك للشخصية الافتراضية"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || characterState === 'THINKING'}
          className="p-3.5 rounded-2xl bg-saudi-700 hover:bg-emerald-800 disabled:bg-gray-100 disabled:text-gray-400 text-white transition-all transform active:scale-95 shadow-sm"
          title="إرسال الرسالة"
          aria-label="إرسال الرسالة"
        >
          <Send className="w-5 h-5 rtl:rotate-180" />
        </button>
      </form>
    </div>
  );
};
