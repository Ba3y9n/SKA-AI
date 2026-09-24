import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles, MessageSquare, RotateCcw } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import { CharacterState } from '../types/character';
import { audioPlayer } from '../services/audioPlayer';

interface RewaaSectionProps {
  messages: ChatMessage[];
  characterState: CharacterState;
  isListening: boolean;
  transcript: string;
  errorMessage: string | null;
  isAutoVoiceEnabled: boolean;
  onToggleVoice: () => void;
  onToggleListening: () => void;
  onSendMessage: (text: string) => void;
  onReplayVoice?: (text: string) => void;
}

export const RewaaSection: React.FC<RewaaSectionProps> = ({
  messages,
  characterState,
  isListening,
  transcript,
  errorMessage,
  isAutoVoiceEnabled,
  onToggleVoice,
  onToggleListening,
  onSendMessage,
  onReplayVoice,
}) => {
  const [inputText, setInputText] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom when messages update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, transcript, characterState]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      audioPlayer.initAudioContext();
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const sampleQuestions = [
    'وش أقدر أضيف في المنصة؟',
    'وش أقسام المنصة؟',
    'كيف أشارك بصورتي في المعرض؟',
    'حدثيني عن هوية عزنا بطبعنا',
  ];

  return (
    <section className="relative w-full py-20 bg-[#FAFBFB] overflow-hidden z-20" id="rewaa-hero">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[800px] h-[800px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Hero Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-[#006C4F] text-xs sm:text-sm font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-[#006C4F]" />
            <span>رِواء AI • صوت الجيل السعودي الرقمي</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#004B37] mt-4 mb-3 tracking-tight">
            أهلًا بك، أنا رِواء
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 font-medium max-w-xl mx-auto leading-relaxed">
            راوية الحكاية ودليلكِ في منصة احتفالات كلية الأعمال والاقتصاد باليوم الوطني السعودي 96.
          </p>
        </div>

        {/* Character Avatar Showcase */}
        <div className="flex flex-col items-center justify-center mb-8">
          
          <div className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 aspect-square rounded-full flex items-center justify-center mx-auto">
            
            {/* Glow Rings based on state */}
            <AnimatePresence>
              {characterState === 'LISTENING' && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border-2 border-[#006C4F] shadow-[0_0_35px_rgba(0,108,79,0.4)] pointer-events-none"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {characterState === 'THINKING' && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.8, 0.4] }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-emerald-500/15 blur-xl pointer-events-none"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {characterState === 'SPEAKING' && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.9, 0.5] }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Avatar Image (Head & Face Saudi Woman Digital Character) */}
            <motion.div
              animate={
                characterState === 'THINKING'
                  ? { y: [0, -4, 0], transition: { repeat: Infinity, duration: 1.6 } }
                  : characterState === 'SPEAKING'
                  ? { scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 1.2 } }
                  : { y: [0, -3, 0], transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } }
              }
              className="w-full h-full flex items-center justify-center p-1 relative z-10"
            >
              <img 
                src="/rewaa_avatar_real_transparent.png" 
                alt="شخصية رِواء الرقمية" 
                className="w-full h-full object-contain rounded-full drop-shadow-lg select-none"
              />
            </motion.div>

          </div>

          {/* Interactive State Badge */}
          <div className="mt-5 flex items-center justify-center">
            <span className={`inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm ${
              characterState === 'LISTENING'
                ? 'bg-emerald-100 text-[#004B37] border border-emerald-300 animate-pulse'
                : characterState === 'THINKING'
                ? 'bg-gray-100 text-gray-700 border border-gray-300 animate-pulse'
                : characterState === 'SPEAKING'
                ? 'bg-[#006C4F] text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                characterState === 'LISTENING' ? 'bg-[#006C4F]' : characterState === 'SPEAKING' ? 'bg-white' : characterState === 'THINKING' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              {characterState === 'LISTENING' && 'جاري الاستماع إليكِ...'}
              {characterState === 'THINKING' && 'جاري التفكير في الإجابة...'}
              {characterState === 'SPEAKING' && 'رِواء تتحدث الآن...'}
              {characterState === 'IDLE' && 'رِواء جاهزة للاستماع'}
              {characterState === 'ERROR' && 'حدث انقطاع بسيط'}
            </span>
          </div>

          {/* Primary Voice Action Buttons */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={onToggleListening}
              className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-black text-base sm:text-lg transition-all duration-300 shadow-md min-h-[48px] ${
                isListening 
                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-500/30 scale-105' 
                  : 'bg-[#004B37] text-white hover:bg-[#003828] hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isListening ? 'bg-white text-rose-600 animate-pulse' : 'bg-white/20 text-white'}`}>
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </div>
              <span>
                {isListening ? 'إيقاف الاستماع' : 'تحدثي معي'}
              </span>
            </button>

            {/* Voice Audio Toggle */}
            <button
              onClick={onToggleVoice}
              title={isAutoVoiceEnabled ? 'كتم الصوت التلقائي' : 'تفعيل الرد الصوتي'}
              aria-label={isAutoVoiceEnabled ? 'كتم الصوت التلقائي' : 'تفعيل الرد الصوتي'}
              className={`p-4 min-h-[48px] min-w-[48px] rounded-full border transition-all shadow-sm flex items-center justify-center ${
                isAutoVoiceEnabled 
                  ? 'bg-white text-[#006C4F] border-emerald-200 hover:bg-emerald-50' 
                  : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200'
              }`}
            >
              {isAutoVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          {/* Error / Alert notice */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 px-5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-bold text-center max-w-md shadow-sm"
            >
              {errorMessage}
            </motion.div>
          )}

        </div>

        {/* Conversation Thread Container */}
        <div className="w-full bg-white border border-gray-200/80 rounded-[2rem] shadow-xl overflow-hidden flex flex-col">
          
          {/* Chat Header Bar */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#F8FAF9]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#006C4F] text-white flex items-center justify-center font-black text-xs shadow-sm">
                ر
              </div>
              <div>
                <h4 className="text-sm font-black text-[#004B37]">محادثة رِواء المباشرة</h4>
                <p className="text-[11px] font-bold text-gray-400">Gemini 3.7 Flash</p>
              </div>
            </div>
            <div className="text-xs font-bold text-[#006C4F] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
              اليوم الوطني 96
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={chatScrollRef}
            className="p-4 sm:p-6 h-[320px] sm:h-[360px] overflow-y-auto space-y-4 text-right scroll-smooth bg-white"
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                >
                  <span className="text-[11px] text-gray-400 font-bold mb-1 px-1">
                    {isUser ? 'أنتِ' : 'رِواء'}
                  </span>
                  
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-5 py-3.5 text-sm sm:text-base leading-relaxed font-medium shadow-sm ${
                      isUser
                        ? 'bg-[#004B37] text-white rounded-tr-none'
                        : 'bg-[#F4F7F5] text-gray-800 border border-gray-200/70 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    
                    {/* Replay Voice button for Rewaa messages */}
                    {!isUser && onReplayVoice && (
                      <div className="mt-2.5 pt-2 border-t border-gray-200/50 flex justify-end">
                        <button
                          onClick={() => {
                            audioPlayer.initAudioContext();
                            onReplayVoice(msg.text);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-[#006C4F] hover:text-[#004B37] font-bold transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>استماع مجددًا</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Live Transcript / Thinking Bubble */}
            {characterState === 'THINKING' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 max-w-xs text-xs font-bold text-[#006C4F]"
              >
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#006C4F] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#006C4F] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#006C4F] animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>رِواء تفكر في الإجابة...</span>
              </motion.div>
            )}

            {isListening && transcript && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 text-xs font-bold text-[#006C4F]">
                <span className="text-gray-400 block mb-1">أستمع إليكِ الآن:</span>
                "{transcript}"
              </div>
            )}
          </div>

          {/* Quick Questions Chips */}
          <div className="px-4 sm:px-6 py-2.5 bg-[#F8FAF9] border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-gray-400 shrink-0">اقتراحات:</span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  audioPlayer.initAudioContext();
                  onSendMessage(q);
                }}
                disabled={characterState === 'THINKING'}
                className="shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-[#004B37] border border-gray-200 transition-colors disabled:opacity-50 shadow-xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleFormSubmit} className="p-3.5 sm:p-4 bg-white border-t border-gray-100 flex items-center gap-2">
            <button
              type="submit"
              disabled={!inputText.trim() || characterState === 'THINKING'}
              className="px-5 py-2.5 rounded-xl bg-[#004B37] hover:bg-[#003828] text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50 flex items-center gap-2 shrink-0 min-h-[44px]"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span className="hidden sm:inline">إرسال</span>
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتبي رسالتكِ لرِواء..."
              className="flex-1 bg-[#F8FAF9] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#006C4F] transition-colors text-right"
            />

            <button
              type="button"
              onClick={onToggleListening}
              className={`p-2.5 rounded-xl border transition-all shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isListening
                  ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                  : 'bg-[#F8FAF9] text-gray-500 hover:text-[#006C4F] hover:bg-emerald-50 border-gray-200'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </form>

        </div>

      </div>
    </section>
  );
};
