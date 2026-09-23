import React, { useState, useEffect, useRef } from 'react';
import { NationalHero } from './components/NationalHero';
import { ScrollQuote } from './components/ScrollQuote';
import { StorySections } from './components/StorySections';
import { CharacterAvatar } from './components/CharacterAvatar';
import { FutureVisionBoard } from './components/FutureVisionBoard';
import { AchievementsTimeline } from './components/AchievementsTimeline';
import { AmbitionModal } from './components/AmbitionModal';
import { Footer } from './components/Footer';
import { Mic, MicOff, Sparkles, Volume2 } from 'lucide-react';
import { CharacterState } from './types/character';
import { useGeminiChat } from './hooks/useGeminiChat';
import { fetchAmbitions } from './services/apiService';
import { isSupabaseConfigured } from './lib/supabase';
import { Ambition } from './types/ambition';
import { Header } from './components/Header';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [isAmbitionModalOpen, setIsAmbitionModalOpen] = useState(false);
  const [ambitions, setAmbitions] = useState<Ambition[]>([]);

  const {
    messages,
    characterState,
    errorMessage,
    isListening,
    transcript,
    isAutoVoiceEnabled,
    setIsAutoVoiceEnabled,
    handleToggleListening,
    stopSpeaking
  } = useGeminiChat();

  const lastRewaaMessage = messages.slice().reverse().find(m => m.sender === 'rewaa');
  const displaySubtitle = transcript ? transcript : (characterState === 'SPEAKING' || characterState === 'IDLE' ? lastRewaaMessage?.text : '');

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  useEffect(() => {
    const loadData = async () => {
      if (isSupabaseConfigured()) {
        try {
          const data = await fetchAmbitions();
          setAmbitions(data);
        } catch (error) {
          console.error("Error loading ambitions:", error);
        }
      }
    };
    loadData();
  }, []);

  const handleAmbitionAdded = (newAmbition: Ambition) => {
    setAmbitions(prev => [newAmbition, ...prev]);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-emerald-200 selection:text-emerald-900 bg-white overflow-x-hidden">
      
      {/* Global Fixed Header */}
      <div className="fixed top-0 inset-x-0 z-50">
        <Header 
          isAutoVoiceEnabled={isAutoVoiceEnabled}
          onToggleVoice={() => setIsAutoVoiceEnabled(!isAutoVoiceEnabled)}
          onOpenAmbitionModal={() => setIsAmbitionModalOpen(true)}
        />
      </div>

      {/* 1. Immersive Hero Section */}
      <NationalHero />

      {/* 2. Scroll Quote Section */}
      <ScrollQuote />

      {/* 3. The Voice AI Experience (Rewaa) */}
      <section className="relative w-full py-20 bg-gradient-to-b from-[#e8f5e9] to-white overflow-hidden flex flex-col items-center z-10 border-t border-emerald-100">
        
        {/* Title */}
        <div className="text-center mb-2 z-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3D2E] tracking-tight">رِواء</h2>
          <p className="text-sm sm:text-base font-semibold text-emerald-600 mt-2 tracking-wide">صوت الجيل السعودي الرقمي</p>
        </div>

        {/* 3D Character Avatar & Orbits */}
        <CharacterAvatar
          state={characterState}
          isListening={isListening}
        />

        {/* Interactive Status & Mic */}
        <div className="relative z-20 w-full max-w-2xl text-center flex flex-col items-center justify-center">
          
          <button
            onClick={handleToggleListening}
            className={`group relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-all duration-300 shadow-2xl border-4 outline-none ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 border-red-200 scale-105 shadow-red-200/50'
                : characterState === 'THINKING'
                ? 'bg-emerald-100 border-emerald-200 opacity-70 cursor-not-allowed'
                : characterState === 'SPEAKING'
                ? 'bg-[#0B3D2E] border-emerald-500 scale-105 shadow-emerald-500/50'
                : 'bg-emerald-600 border-emerald-100 hover:border-white hover:scale-105 hover:bg-emerald-500 shadow-emerald-200/50'
            }`}
            disabled={characterState === 'THINKING'}
            aria-label="الميكروفون"
          >
            {isListening ? (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-40"></div>
                <MicOff className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </>
            ) : characterState === 'THINKING' ? (
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 animate-spin" />
            ) : characterState === 'SPEAKING' ? (
              <div className="flex items-center justify-center gap-1 h-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-1.5 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${Math.random() * 24 + 8}px`, animationDuration: '0.4s' }}></div>
                ))}
              </div>
            ) : (
              <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Transcript Subtitles Area */}
          <div className="w-full min-h-[120px] flex flex-col items-center justify-start text-center px-4 mt-8">
            <AnimatePresence mode="wait">
              {characterState === 'THINKING' ? (
                <motion.div key="thinking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-emerald-600 animate-pulse font-bold text-sm">
                  جاري التفكير...
                </motion.div>
              ) : isListening ? (
                <motion.div key="listening" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 font-bold text-sm">
                  {transcript ? `"${transcript}"` : "أستمع إليك الآن..."}
                </motion.div>
              ) : characterState === 'ERROR' ? (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-full border border-red-200">
                  {errorMessage}
                </motion.div>
              ) : displaySubtitle ? (
                <motion.div key="speaking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-emerald-50 shadow-sm">
                  <p className="text-lg sm:text-xl font-medium leading-relaxed text-[#0B3D2E]">
                    {displaySubtitle}
                  </p>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 font-medium text-sm">
                  اضغط على الميكروفون للبدء
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 4. Story Sections (Meaning, Message, Goal) */}
      <StorySections />

      {/* 5. Future Vision Board (Ambitions Orbits) */}
      <FutureVisionBoard
        ambitions={ambitions}
        onOpenAddModal={() => setIsAmbitionModalOpen(true)}
      />

      {/* 6. Achievements Timeline */}
      <AchievementsTimeline />

      <AmbitionModal
        isOpen={isAmbitionModalOpen}
        onClose={() => setIsAmbitionModalOpen(false)}
        onAmbitionAdded={handleAmbitionAdded}
      />

      {/* 7. Footer */}
      <Footer />
    </div>
  );
};

export default App;
