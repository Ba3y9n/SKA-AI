import React, { useState, useEffect } from 'react';
import { CinematicHero } from './components/CinematicHero';
import { RewaaSection } from './components/RewaaSection';
import { CinematicVoice } from './components/CinematicVoice';
import { NationalCardSection } from './components/NationalCardSection';
import { UserGallery } from './components/UserGallery';
import { FutureVisionBoard } from './components/FutureVisionBoard';
import { AchievementsTimeline } from './components/AchievementsTimeline';
import { Footer } from './components/Footer';
import { AmbitionModal } from './components/AmbitionModal';
import { Header } from './components/Header';
import { FloatingVoiceWidget } from './components/FloatingVoiceWidget';
import { useGeminiChat } from './hooks/useGeminiChat';
import { fetchAmbitions, subscribeToAmbitions } from './services/apiService';
import { Ambition } from './types/ambition';

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
      
      {/* 1. Header */}
      <Header 
        isAutoVoiceEnabled={isAutoVoiceEnabled}
        onToggleVoice={() => setIsAutoVoiceEnabled(!isAutoVoiceEnabled)}
        onOpenAmbitionModal={() => setIsAmbitionModalOpen(true)}
      />

      {/* 2. Hero Image with change photo & big discover title */}
      <CinematicHero />

      {/* 3. Rewaa Character Section */}
      <RewaaSection 
        onTalk={handleToggleListening} 
        isListening={isListening} 
      />

      {/* 4. Cinematic Voice ("صوت يروي... وصوت يُسمع" & "فكرة") */}
      <CinematicVoice />

      {/* 5. National Identity Section (Clean & Big) */}
      <NationalCardSection />

      {/* 6. CBE National Day Photos ("عدسة كلية الأعمال والاقتصاد") */}
      <UserGallery />

      {/* 7. Future Ambitions Wall ("صوتنا يصنع المستقبل") */}
      <FutureVisionBoard 
        ambitions={ambitions} 
        onAddClick={() => setIsAmbitionModalOpen(true)} 
      />

      {/* 8. College Students & Faculty Achievements ("طالبات كلية الأعمال والاقتصاد ودكتوراتها") */}
      <AchievementsTimeline />

      {/* 9. Final Clean Footer */}
      <Footer />

      {/* Discreet Floating Voice Assistant Widget */}
      <FloatingVoiceWidget
        isListening={isListening}
        transcript={transcript}
        rewaaMessage={characterState === 'SPEAKING' || characterState === 'IDLE' ? lastRewaaMessage?.text : undefined}
        onToggleListening={handleToggleListening}
      />

      {/* Add Ambition Modal */}
      <AmbitionModal
        isOpen={isAmbitionModalOpen}
        onClose={() => setIsAmbitionModalOpen(false)}
      />

    </div>
  );
};

export default App;
