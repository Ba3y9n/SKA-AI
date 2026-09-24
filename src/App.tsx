import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RewaaSection } from './components/RewaaSection';
import { NationalVisualSection } from './components/NationalVisualSection';
import { InteractiveStorytelling } from './components/InteractiveStorytelling';
import { FutureVisionBoard } from './components/FutureVisionBoard';
import { AchievementsTimeline } from './components/AchievementsTimeline';
import { UserGallery } from './components/UserGallery';
import { Footer } from './components/Footer';
import { AmbitionModal } from './components/AmbitionModal';
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

  // Fetch ambitions from Supabase on mount and listen to realtime updates
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

  const handleAmbitionSubmitted = (newAmbition: Ambition) => {
    setAmbitions(prev => [newAmbition, ...prev.filter(a => a.id !== newAmbition.id)]);
  };

  // If in Admin view, render AdminGalleryReview directly
  if (isAdminView) {
    return <AdminGalleryReview onBackToSite={navigateToHome} />;
  }

  return (
    <div className="relative w-full bg-[#FAFBFB] text-[#004B37] font-arabic selection:bg-[#006C4F] selection:text-white overflow-hidden min-h-screen flex flex-col">
      
      {/* 1. Header with Logo & Nav */}
      <Header 
        isAutoVoiceEnabled={isAutoVoiceEnabled}
        onToggleVoice={() => setIsAutoVoiceEnabled(!isAutoVoiceEnabled)}
        onOpenAmbitionModal={() => setIsAmbitionModalOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Section & Rewaa AI Voice Character */}
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

        {/* 3. National Visual Section ("عزنا بطبعنا") */}
        <NationalVisualSection />

        {/* 4. Interactive Storytelling: 01 المعنى -> 02 الرسالة -> 03 الهدف */}
        <InteractiveStorytelling />

        {/* 5. Future Ambitions Wall ("صوتنا يصنع المستقبل") */}
        <FutureVisionBoard 
          ambitions={ambitions} 
          onAddClick={() => setIsAmbitionModalOpen(true)} 
        />

        {/* 6. College Students & Faculty Achievements */}
        <AchievementsTimeline />

        {/* 7. National Day Moments Gallery */}
        <UserGallery onOpenAdmin={navigateToAdmin} />
      </main>

      {/* 8. Final Clean Footer */}
      <Footer />

      {/* Add Ambition Modal */}
      <AmbitionModal
        isOpen={isAmbitionModalOpen}
        onClose={() => setIsAmbitionModalOpen(false)}
        onSuccess={handleAmbitionSubmitted}
      />

    </div>
  );
};

export default App;
