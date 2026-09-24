import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles, RotateCcw, Bot } from 'lucide-react';
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
  const [isBlinking, setIsBlinking] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom when messages update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, transcript, characterState]);

  // Natural Eye Blinking effect simulation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

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
    'حدثيني عن هوية عزنا بطبعنا',
    'كيف أشارك بصورتي في المعرض؟',
    'وش إنجازات طالبات الكلية؟',
  ];

  // Helper function for message timestamps
  const getMessageTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className="relative w-full py-24 bg-saudi-100 overflow-hidden z-20" id="rewaa-ai">
      
      {/* Background Subtle Lighting & Depth */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[900px] h-[900px] bg-gradient-to-b from-[#E2F7ED]/70 via-[#F6FCF9]/50 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saudi-50 border border-saudi-200/60 text-saudi-700 text-sm font-bold shadow-sm mb-3">
            <Bot className="w-4 h-4 text-gold-dark" />
            <span>المساعد الذكي • Gemini 3.7 Flash</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-saudi-700 mt-2 mb-2 tracking-tight">
            أهلًا بك، أنا رِواء
          </h2>
          <p className="text-base sm:text-lg text-saudi-600 font-bold max-w-xl mx-auto">
            صوت الجيل الرقمي بكلية الأعمال والاقتصاد... راوية الحكاية ودليلكِ في المنصة.
          </p>
        </div>

        {/* Character Visual Showcase with Lifelike Animation */}
        <div className="flex flex-col items-center justify-center mb-8">
          
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 aspect-square rounded-full flex items-center justify-center mx-auto">
            
            {/* Animated Dynamic Aura Rings based on state */}
            <AnimatePresence>
              {characterState === 'LISTENING' && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border-3 border-gold shadow-[0_0_50px_rgba(201,162,39,0.5)] pointer-events-none"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {characterState === 'THINKING' && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.9, 0.4] }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-saudi-500/15 blur-2xl pointer-events-none border border-saudi-500/30"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {characterState === 'SPEAKING' && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.95, 0.5] }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border-2 border-saudi-500 shadow-[0_0_40px_rgba(0,108,79,0.35)] pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Avatar Image with Breathing, Head Tilt, and Eye Blinking Overlay */}
            <motion.div
              animate={
                characterState === 'THINKING'
                  ? { y: [0, -5, 0], rotate: [-1, 1, -1], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } }
                  : characterState === 'SPEAKING'
                  ? { scale: [1, 1.02, 1], y: [0, -2, 0], transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } }
                  : { y: [0, -4, 0], rotate: [-0.5, 0.5, -0.5], transition: { repeat: Infinity, duration: 4.5, ease: "easeInOut" } }
              }
              className="w-full h-full flex items-center justify-center p-2 relative z-10 select-none"
            >
              <img 
                src="/rewaa_avatar_real_transparent.png" 
                alt="رِواء AI" 
                className="w-full h-full object-contain rounded-full drop-shadow-2xl"
              />
              
              {/* Subtle Natural Blink Filter */}
              {isBlinking && (
                <motion.div 
                  initial={{ opacity: 0.8 }} 
                  animate={{ opacity: 0 }} 
                  transition={{ duration: 0.15 }}
                  className="absolute top-[32%] w-16 h-1 bg-saudi-800/40 rounded-full blur-[1px] pointer-events-none"
                />
              )}
            </motion.div>

          </div>

          {/* Interactive State Badge */}
          <div className="mt-5 flex items-center justify-center">
            <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm ${
              characterState === 'LISTENING'
                ? 'bg-gold/20 text-gold-dark border border-gold/40 animate-pulse'
                : characterState === 'THINKING'
                ? 'bg-saudi-100 text-saudi-700 border border-saudi-200 animate-pulse'
                : characterState === 'SPEAKING'
                ? 'bg-saudi-600 text-white shadow-md'
                : 'bg-white text-saudi-700 border border-saudi-200/60'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                characterState === 'LISTENING' ? 'bg-gold animate-ping' : characterState === 'SPEAKING' ? 'bg-white' : characterState === 'THINKING' ? 'bg-saudi-600' : 'bg-green-500'
              }`} />
              {characterState === 'LISTENING' && 'رِواء تستمع...'}
              {characterState === 'THINKING' && 'رِواء تفكر...'}
              {characterState === 'SPEAKING' && 'رِواء تجيب...'}
              {characterState === 'IDLE' && 'أنا جاهزة للاستماع'}
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
        <div className="w-full bg-white/95 backdrop-blur-xl border border-saudi-200/80 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,108,79,0.06)] overflow-hidden flex flex-col">
          
          {/* Chat Header Bar */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-saudi-50/70 via-white to-saudi-50/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-saudi-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                ر
              </div>
              <div>
                <h4 className="text-sm font-black text-saudi-700">محادثة رِواء المباشرة</h4>
                <p className="text-[11px] font-bold text-gray-400">Gemini 3.7 Flash</p>
              </div>
            </div>
            <span className="text-xs font-bold text-saudi-600 bg-saudi-50 px-3 py-1 rounded-full border border-saudi-200/50">
              صوت الجيل الرقمي
            </span>
          </div>

          {/* Chat Thread Messages Area */}
          <div 
            ref={chatScrollRef}
            className="p-4 sm:p-6 h-[350px] sm:h-[400px] overflow-y-auto space-y-4 text-right scroll-smooth bg-[#fafcfb]"
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
                    <span className="text-[10px] text-gray-400">
                      {getMessageTime()}
                    </span>
                  </div>

                  {/* User = Soft White Card / Rewaa = Saudi Green Card */}
                  <div className={`relative max-w-[92%] sm:max-w-[80%] px-5 py-3.5 rounded-2xl text-sm sm:text-base font-medium leading-relaxed shadow-sm break-words ${
                    isUser 
                      ? 'bg-white text-saudi-900 border border-gray-200/90 rounded-tr-none shadow-md' 
                      : 'bg-saudi-600 text-white rounded-tl-none shadow-md'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    {!isUser && onReplayVoice && (
                      <button 
                        onClick={() => onReplayVoice(msg.text)}
                        className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-saudi-100 hover:text-white transition-colors pt-1 border-t border-saudi-500/60 w-full"
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
                <span className="text-[11px] font-bold text-gold-dark mb-1 px-1">صوتكِ الآن...</span>
                <div className="max-w-[90%] sm:max-w-[75%] px-5 py-3 rounded-2xl bg-gold/10 border border-gold/30 text-saudi-700 text-sm font-bold shadow-sm rounded-tr-none animate-pulse">
                  {transcript}
                </div>
              </motion.div>
            )}

            {/* Typing Indicator */}
            {characterState === 'THINKING' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex flex-col items-end"
              >
                <div className="px-5 py-3 rounded-2xl bg-saudi-50 border border-saudi-200 text-saudi-700 text-xs font-bold shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-saudi-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-saudi-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-saudi-600 animate-bounce [animation-delay:0.4s]" />
                  <span>رِواء تكتب...</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Questions Suggestions */}
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
                className="shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full bg-saudi-50/80 hover:bg-saudi-100 text-saudi-700 border border-saudi-200/50 transition-colors disabled:opacity-50"
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
