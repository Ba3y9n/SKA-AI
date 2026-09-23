import React, { useState, useEffect } from 'react';
import { CinematicHero } from './components/CinematicHero';
import { CinematicVoice } from './components/CinematicVoice';
import { NationalCardSection } from './components/NationalCardSection';
import { AchievementsTimeline } from './components/AchievementsTimeline';
import { FutureVisionBoard } from './components/FutureVisionBoard';
import { CinematicOutro } from './components/CinematicOutro';
import { AmbitionModal } from './components/AmbitionModal';
import { Header } from './components/Header';
import { useGeminiChat } from './hooks/useGeminiChat';
import { fetchAmbitions, subscribeToAmbitions } from './services/apiService';
import { Ambition } from './types/ambition';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [isAmbitionModalOpen, setIsAmbitionModalOpen] = useState(false);
  const [ambitions, setAmbitions] = useState<Ambition[]>([]);

  const {
    messages,
    characterState,
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
    return () => { stopSpeaking(); };
  }, [stopSpeaking]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const initAmbitions = async () => {
      try {
        const initialData = await fetchAmbitions();
        setAmbitions(initialData);
        unsubscribe = subscribeToAmbitions((newAmbition) => {
          setAmbitions(prev => {
            if (prev.find(a => a.id === newAmbition.id)) return prev;
            return [newAmbition, ...prev];
          });
        });
      } catch (error) {
        console.error('Failed to initialize ambitions:', error);
      }
    };
    initAmbitions();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#05110a] text-white font-arabic selection:bg-emerald-600 selection:text-white">
      
      {/* Cinematic Header (Transparent, non-intrusive) */}
      <Header 
        isAutoVoiceEnabled={isAutoVoiceEnabled}
        onToggleVoice={() => setIsAutoVoiceEnabled(!isAutoVoiceEnabled)}
        onOpenAmbitionModal={() => setIsAmbitionModalOpen(true)}
      />

      {/* 1. Cinematic Hero & Rewaa Intro */}
      <CinematicHero 
        onTalk={handleToggleListening} 
        isListening={isListening} 
      />

      {/* 2. Voice & Idea Section */}
      <CinematicVoice />

      {/* 3. National Identity Card Section */}
      <NationalCardSection />

      {/* 4. Achievements Gallery (Dark Glassmorphism) */}
      <AchievementsTimeline />

      {/* 5. Impact Section (Small Transition) */}
      <section className="relative w-full py-40 bg-[#05110a] text-center px-6 z-20">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-white mb-10"
        >
          الأثر لا يتوقف عند الإنجاز.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-4xl font-bold text-gray-400 leading-relaxed"
        >
          خلف كل إنجاز معرفة،<br/>
          وخلف كل معرفة إنسان،<br/>
          وخلف كل إنسان طموح.
        </motion.p>
      </section>

      {/* 6. Future Ambitions Wall */}
      <FutureVisionBoard 
        ambitions={ambitions} 
        onAddClick={() => setIsAmbitionModalOpen(true)} 
      />

      {/* 7. Cinematic Outro */}
      <CinematicOutro />

      {/* Global Floating Subtitle for Rewaa's Voice */}
      <AnimatePresence>
        {(displaySubtitle || isListening) && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4 pointer-events-none"
          >
            <div className="bg-[#0A1F16]/90 backdrop-blur-xl border border-emerald-500/30 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center">
              {isListening ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white font-bold text-lg">تحدث الآن، رِواء تستمع...</span>
                </div>
              ) : (
                <p className="text-xl font-bold leading-relaxed text-emerald-50">
                  {displaySubtitle}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AmbitionModal
        isOpen={isAmbitionModalOpen}
        onClose={() => setIsAmbitionModalOpen(false)}
      />

    </div>
  );
};

export default App;
