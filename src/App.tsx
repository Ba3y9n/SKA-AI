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
import { motion } from 'framer-motion';

// Cinematic Fade-Up & Unblur Reveal Wrapper
const SectionReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 120, filter: 'blur(10px)', scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

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

    // Multi-user real-time polling every 6s for 500+ students
    const interval = setInterval(async () => {
      try {
        const fresh = await fetchAmbitions();
        setAmbitions(fresh);
      } catch (e) {}
    }, 6000);

    return () => { 
      if (unsubscribe) unsubscribe(); 
      clearInterval(interval);
    };
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

      {/* 2. Hero Section ("اكتشف الحكاية") */}
      <CinematicHero />

      {/* 3. National Identity & Particle Orbit Section ("عزنا بطبعنا") */}
      <SectionReveal>
        <NationalCardSection />
      </SectionReveal>

      {/* 4. Rewaa AI Character & Gemini 3.7 Flash Voice Chat */}
      <SectionReveal>
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
      </SectionReveal>

      {/* 5. Cinematic Voice & National Poem ("صوت يروي... وصوت يُسمع") */}
      <SectionReveal>
        <CinematicVoice />
      </SectionReveal>

      {/* 6. Interactive Gallery ("شارك لحظتك… واجعلها جزءًا من الحكاية") */}
      <SectionReveal>
        <UserGallery onOpenAdmin={navigateToAdmin} />
      </SectionReveal>

      {/* 7. Future Ambitions Wall ("جدار المستقبل - من هنا يبدأ أثر الجيل القادم") */}
      <SectionReveal>
        <FutureVisionBoard 
          ambitions={ambitions} 
          onAddClick={() => setIsAmbitionModalOpen(true)} 
          onDelete={(id) => setAmbitions(prev => prev.filter(a => a.id !== id))}
        />
      </SectionReveal>

      {/* 8. College Students & Faculty Achievements ("أصوات تحكي أثرًا لا يُنسى") */}
      <SectionReveal>
        <AchievementsTimeline />
      </SectionReveal>

      {/* 9. Final Luxury Footer */}
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
