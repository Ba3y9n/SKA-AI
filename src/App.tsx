import React, { useState, useEffect } from 'react';
import { CinematicHero } from './components/CinematicHero';
import { RewaaSection } from './components/RewaaSection';
import { CinematicVoice } from './components/CinematicVoice';
import { NationalCardSection } from './components/NationalCardSection';
import { UserGallery } from './components/UserGallery';
import { AchievementsTimeline } from './components/AchievementsTimeline';
import { FutureVisionBoard } from './components/FutureVisionBoard';
import { Footer } from './components/Footer';
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
    <div className="relative w-full bg-[#F8FBF8] text-[#064C3B] font-arabic selection:bg-[#008F68] selection:text-white overflow-hidden">
      
      {/* Header */}
      <Header 
        isAutoVoiceEnabled={isAutoVoiceEnabled}
        onToggleVoice={() => setIsAutoVoiceEnabled(!isAutoVoiceEnabled)}
        onOpenAmbitionModal={() => setIsAmbitionModalOpen(true)}
      />

      {/* 1. Hero Image */}
      <CinematicHero />

      {/* 2. Rewaa Character Section */}
      <RewaaSection 
        onTalk={handleToggleListening} 
        isListening={isListening} 
      />

      {/* 3. Voice & Idea Section */}
      <CinematicVoice />

      {/* 4. National Identity Card Section */}
      <NationalCardSection />

      {/* 5. User Uploaded Gallery */}
      <UserGallery />

      {/* 6. Achievements Gallery */}
      <AchievementsTimeline />

      {/* 7. Future Ambitions Wall */}
      <FutureVisionBoard 
        ambitions={ambitions} 
        onAddClick={() => setIsAmbitionModalOpen(true)} 
      />

      {/* 8. Footer */}
      <Footer />

      {/* Global Floating Subtitle for Rewaa's Voice */}
      <AnimatePresence>
        {(displaySubtitle || isListening) && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4 pointer-events-none"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,143,104,0.15)] text-center">
              {isListening ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[#064C3B] font-bold text-lg">تحدث الآن، رِواء تستمع...</span>
                </div>
              ) : (
                <p className="text-xl font-bold leading-relaxed text-[#008F68]">
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
