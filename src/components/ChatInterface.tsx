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
} from 'lucide-react';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  characterState: CharacterState;
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
  onSendMessage,
  onToggleMic,
  isListening,
  transcript,
  onReplayVoice,
  isMicSupported,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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
    <div className="flex flex-col h-[520px] sm:h-[580px] w-full rounded-2xl bg-[#09140e]/90 border border-emerald-900/50 backdrop-blur-md shadow-2xl overflow-hidden">
      
      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scroll-smooth">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-xs text-center">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
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
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isUser
                    ? 'bg-emerald-700/60 border-emerald-500/40 text-emerald-100'
                    : 'bg-emerald-950 border-emerald-600/50 text-emerald-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all shadow-sm ${
                  isUser
                    ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-bl-sm'
                    : 'bg-emerald-950/70 border border-emerald-800/50 text-gray-100 rounded-br-sm'
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
                        className="p-1 hover:text-emerald-300 rounded transition"
                        title="استماع للرد صوتياً"
                        aria-label="استمع للرد صوتياً"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="p-1 hover:text-emerald-300 rounded transition"
                      title="نسخ النص"
                      aria-label="نسخ نص الرسالة"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
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
            <div className="w-7 h-7 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-100 flex items-center justify-center shrink-0">
              <Mic className="w-4 h-4 text-emerald-200" />
            </div>
            <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm bg-emerald-800/40 border border-emerald-600/50 text-emerald-100 italic">
              {transcript}...
            </div>
          </div>
        )}

        {/* Thinking Indicator */}
        {characterState === 'THINKING' && (
          <div className="flex items-center gap-2.5 flex-row">
            <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-600/50 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-emerald-950/60 border border-emerald-800/40 flex items-center gap-1.5">
              <span className="text-xs text-emerald-300 font-medium ml-1">رِواء تصيغ الإجابة</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 bg-[#060c08]/90 border-t border-emerald-900/50 flex items-center gap-2"
      >
        {/* Voice Microphone Button */}
        <button
          type="button"
          onClick={onToggleMic}
          disabled={characterState === 'THINKING'}
          className={`relative p-3 rounded-xl flex items-center justify-center transition-all transform active:scale-95 disabled:opacity-50 ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40 ring-4 ring-red-500/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/40'
          }`}
          title={isListening ? 'إيقاف الاستماع' : 'تحدث صوتياً بالميكروفون'}
          aria-label={isListening ? 'إيقاف الاستماع الصوتي' : 'بدء التحدث بالصوت'}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping" />
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
                : 'اسأل رِواء عن تاريخ المملكة، التراث، أو المستقبل...'
            }
            className="w-full bg-emerald-950/30 border border-emerald-800/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-400 outline-none transition-all disabled:opacity-50"
            aria-label="اكتب سؤالك للشخصية الافتراضية"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || characterState === 'THINKING'}
          className="p-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:bg-emerald-950/50 disabled:text-gray-500 text-white transition-all transform active:scale-95 border border-emerald-600/30"
          title="إرسال الرسالة"
          aria-label="إرسال الرسالة"
        >
          <Send className="w-5 h-5 rtl:rotate-180" />
        </button>
      </form>
    </div>
  );
};
