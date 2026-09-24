import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles, RotateCcw } from 'lucide-react';
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
    <section className="relative w-full py-24 bg-saudi-100 overflow-hidden z-20" id="rewaa-ai">
      
      {/* Background Subtle Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[900px] h-[900px] bg-gradient-to-b from-[#E2F7ED]/70 via-[#F6FCF9]/50 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Badge */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-5xl font-black text-saudi-700 mt-4 mb-2 tracking-tight">
            أهلًا بك، أنا رِواء
          </h2>
          <p className="text-base sm:text-lg text-saudi-600 font-bold max-w-xl mx-auto">
            صوت الجيل الرقمي بكلية الأعمال والاقتصاد... راوية الحكاية ودليلكِ في المنصة.
          </p>
        </div>

        {/* Character Visual Showcase */}
        <div className="flex flex-col items-center justify-center mb-8">
          
          <div className="relative w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 aspect-square rounded-full flex items-center justify-center mx-auto">
            
            {/* Animated Glow Rings based on state */}
            <AnimatePresence>
              {characterState === 'LISTENING' && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border-3 border-gold shadow-[0_0_40px_rgba(198,161,91,0.5)] pointer-events-none"
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
                  className="absolute inset-0 rounded-full bg-saudi-500/10 blur-xl pointer-events-none"
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
                  className="absolute inset-0 rounded-full border-2 border-saudi-500 shadow-[0_0_35px_rgba(0,108,79,0.3)] pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Avatar Image (Centered and Perfectly Symmetrical) */}
            <motion.div
              animate={
                characterState === 'THINKING'
                  ? { y: [0, -4, 0], transition: { repeat: Infinity, duration: 1.6 } }
                  : characterState === 'SPEAKING'
                  ? { scale: [1, 1.015, 1], transition: { repeat: Infinity, duration: 1.2 } }
                  : { y: [0, -3, 0], transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } }
              }
              className="w-full h-full flex items-center justify-center p-1 relative z-10"
            >
              <img 
                src="/rewaa_avatar_real_transparent.png" 
                alt="رِواء AI" 
                className="w-full h-full object-contain rounded-full drop-shadow-xl select-none"
              />
            </motion.div>

          </div>

          {/* Interactive State Badge (Well spaced below circle) */}
          <div className="mt-5 flex items-center justify-center">
            <span className={`inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm ${
              characterState === 'LISTENING'
                ? 'bg-gold/20 text-gold-dark border border-gold/40 animate-pulse'
                : characterState === 'THINKING'
                ? 'bg-saudi-100 text-saudi-700 border border-saudi-200 animate-pulse'
                : characterState === 'SPEAKING'
                ? 'bg-saudi-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                characterState === 'LISTENING' ? 'bg-gold' : characterState === 'SPEAKING' ? 'bg-white' : characterState === 'THINKING' ? 'bg-saudi-600' : 'bg-green-500'
              }`} />
              {characterState === 'LISTENING' && 'جاري الاستماع إليكِ...'}
              {characterState === 'THINKING' && 'جاري التفكير في الإجابة...'}
              {characterState === 'SPEAKING' && 'رِواء تتحدث الآن...'}
              {characterState === 'ERROR' && 'حدث انقطاع بسيط'}
            </span>
          </div>

          {/* Primary Voice Action Buttons */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={onToggleListening}
              className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-black text-base sm:text-lg transition-all duration-300 shadow-lg min-h-[48px] ${
                isListening 
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_25px_rgba(239,68,68,0.4)] scale-105' 
                  : 'bg-saudi-600 text-white hover:bg-saudi-700 hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isListening ? 'bg-white text-red-500 animate-pulse' : 'bg-white/20 text-white'}`}>
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
              className={`p-4 min-h-[48px] min-w-[48px] rounded-full border transition-all shadow-sm flex items-center justify-center ${
                isAutoVoiceEnabled 
                  ? 'bg-white text-saudi-700 border-saudi-200 hover:bg-saudi-50' 
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

        {/* Modern In-Section Conversation Container */}
        <div className="w-full bg-white/90 backdrop-blur-xl border border-saudi-200/70 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,108,79,0.06)] overflow-hidden flex flex-col">
          
          {/* Chat Header Bar */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-saudi-50/50 via-white to-saudi-50/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-saudi-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                ر
              </div>
              <div>
                <h4 className="text-sm font-black text-saudi-700">محادثة رِواء المباشرة</h4>
              </div>
            </div>
          </div>

          {/* Chat Thread Messages Area */}
          <div 
            ref={chatScrollRef}
            className="p-4 sm:p-6 h-[340px] sm:h-[380px] overflow-y-auto space-y-4 text-right scroll-smooth bg-[#fafcfb]"
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
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-bold text-gray-400">
                      {isUser ? 'أنتِ' : 'رِواء'}
                    </span>
                  </div>

                  <div className={`relative max-w-[90%] sm:max-w-[75%] px-4 sm:px-5 py-3.5 rounded-2xl text-sm sm:text-base font-medium leading-relaxed shadow-sm break-words whitespace-pre-wrap ${
                    isUser 
                      ? 'bg-saudi-600 text-white rounded-tr-none' 
                      : 'bg-white text-saudi-700 border border-saudi-100/90 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    {!isUser && onReplayVoice && (
                      <button 
                        onClick={() => onReplayVoice(msg.text)}
                        className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-saudi-600 hover:text-saudi-700 transition-colors pt-1 border-t border-gray-100 w-full"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>استماع مجددًا</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Live Listening Live Transcript Bubble */}
            {isListening && transcript && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start"
              >
                <span className="text-[11px] font-bold text-gold-dark mb-1 px-1">صوتك الآن...</span>
                <div className="max-w-[85%] sm:max-w-[75%] px-5 py-3 rounded-2xl bg-gold/10 border border-gold/30 text-saudi-700 text-sm font-bold shadow-sm rounded-tr-none animate-pulse">
                  {transcript}
                </div>
              </motion.div>
            )}

            {/* Thinking Indicator */}
            {characterState === 'THINKING' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex flex-col items-end"
              >
                <div className="px-5 py-3 rounded-2xl bg-white border border-saudi-100 text-saudi-600 text-xs font-bold shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-saudi-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-saudi-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-saudi-600 animate-bounce [animation-delay:0.4s]" />
                  <span>رِواء تفكّر في الإجابة...</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Questions Chips */}
          <div className="px-4 sm:px-6 py-2.5 bg-white border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-gray-400 shrink-0">اقتراحات:</span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  audioPlayer.initAudioContext();
                  onSendMessage(q);
                }}
                disabled={characterState === 'THINKING'}
                className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-saudi-50/80 hover:bg-saudi-100 text-saudi-700 border border-saudi-200/50 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input & Form Area */}
          <form onSubmit={handleFormSubmit} className="p-3 sm:p-4 bg-white border-t border-gray-100 flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleListening}
              className={`p-3 rounded-2xl transition-all shadow-sm shrink-0 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-saudi-50 hover:bg-saudi-100 text-saudi-700 border border-saudi-200/60'
              }`}
              title="تحدثي عبر المايك"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتبي رسالتكِ لرِواء..."
              disabled={characterState === 'THINKING'}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm sm:text-base text-gray-900 focus:border-saudi-600 focus:bg-white outline-none transition-all placeholder:text-gray-400"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || characterState === 'THINKING'}
              className="px-5 py-3 rounded-2xl bg-saudi-600 hover:bg-saudi-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-1.5"
            >
              <span>إرسال</span>
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>

        </div>

      </div>

    </section>
  );
};
