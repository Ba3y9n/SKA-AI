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
import { AdminGalleryReview } from './components/AdminGalleryReview';
import { useGeminiChat } from './hooks/useGeminiChat';
import { fetchAmbitions, subscribeToAmbitions } from './services/apiService';
import { Ambition } from './types/ambition';

const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(false);
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
    sendMessage,
    handleToggleListening,
    replayMessageVoice,
    stopSpeaking
  } = useGeminiChat();

  useEffect(() => {
    return () => { stopSpeaking(); };
  }, [stopSpeaking]);

  // Check URL pathname or hash for admin route
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin/gallery' || hash === '#admin/gallery' || hash === '#/admin/gallery') {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState(null, '', '/admin/gallery');
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.history.pushState(null, '', '/');
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // If in Admin view, render AdminGalleryReview directly
  if (isAdminView) {
    return <AdminGalleryReview onBackToSite={navigateToHome} />;
  }

  return (
    <div className="relative w-full bg-saudi-100 text-saudi-700 font-arabic selection:bg-saudi-600 selection:text-white overflow-hidden">
      
      {/* 1. Header */}
      <Header 
        isAutoVoiceEnabled={isAutoVoiceEnabled}
        onToggleVoice={() => setIsAutoVoiceEnabled(!isAutoVoiceEnabled)}
        onOpenAmbitionModal={() => setIsAmbitionModalOpen(true)}
      />

      {/* 2. Hero Image with change photo & big discover title */}
      <CinematicHero />

      {/* Decorative Golden Divider */}
      <div className="w-full bg-saudi-100 py-6 sm:py-10 flex justify-center">
        <div 
          className="w-[80%] max-w-2xl h-12 sm:h-20 bg-contain bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: "url('/gold-border.png')" }}
        />
      </div>

      {/* 3. Rewaa Character Section */}
      <RewaaSection 
        messages={messages}
        characterState={characterState}
        isListening={isListening}
        transcript={transcript}
        errorMessage={errorMessage}
        isAutoVoiceEnabled={isAutoVoiceEnabled}
        onToggleVoice={() => setIsAutoVoiceEnabled(!isAutoVoiceEnabled)}
        onToggleListening={handleToggleListening}
        onSendMessage={(text) => sendMessage(text, false)}
        onReplayVoice={(text) => replayMessageVoice(text)}
      />

      {/* 4. Cinematic Voice ("صوت يروي... وصوت يُسمع" & "فكرة") */}
      <CinematicVoice />

      {/* 5. National Identity Section (Clean & Big) */}
      <NationalCardSection />

      {/* 6. CBE National Day Photos ("شاركنا لحظات اليوم الوطني في كلية الأعمال والاقتصاد") */}
      <UserGallery onOpenAdmin={navigateToAdmin} />

      {/* 7. Future Ambitions Wall ("صوتنا يصنع المستقبل") */}
      <FutureVisionBoard 
        ambitions={ambitions} 
        onAddClick={() => setIsAmbitionModalOpen(true)} 
      />

      {/* 8. College Students & Faculty Achievements ("طالبات كلية الأعمال والاقتصاد ودكتوراتها") */}
      <AchievementsTimeline />

      {/* 9. Final Clean Footer */}
      <Footer />

      {/* Add Ambition Modal */}
      <AmbitionModal
        isOpen={isAmbitionModalOpen}
        onClose={() => setIsAmbitionModalOpen(false)}
        onSuccess={(newAmbition) => {
          setAmbitions(prev => [newAmbition, ...prev]);
        }}
      />

    </div>
  );
};

export default App;
