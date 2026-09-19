import React, { useState } from 'react';
import { Header } from './components/Header';
import { CharacterAvatar } from './components/CharacterAvatar';
import { ChatInterface } from './components/ChatInterface';
import { SuggestedQuestions } from './components/SuggestedQuestions';
import { FutureVisionBoard } from './components/FutureVisionBoard';
import { AmbitionModal } from './components/AmbitionModal';
import { Footer } from './components/Footer';
import { useGeminiChat } from './hooks/useGeminiChat';
import { INITIAL_DEMO_AMBITIONS } from './config/saudiKnowledge';
import { AmbitionCard } from './types/ambition';
import { Mic, MicOff, Sparkles, Flag, Volume2 } from 'lucide-react';

export const App: React.FC = () => {
  const {
    messages,
    characterState,
    errorMessage,
    audioNotice,
    isListening,
    transcript,
    isMicSupported,
    isAutoVoiceEnabled,
    setIsAutoVoiceEnabled,
    sendMessage,
    handleToggleListening,
    replayMessageVoice,
  } = useGeminiChat();

  const [ambitions, setAmbitions] = useState<AmbitionCard[]>(INITIAL_DEMO_AMBITIONS);
  const [isAmbitionModalOpen, setIsAmbitionModalOpen] = useState(false);

  const handleAmbitionAdded = (newAmbition: AmbitionCard) => {
    setAmbitions((prev) => [newAmbition, ...prev]);
  };

  const handleQuestionSelect = (questionText: string) => {
    sendMessage(questionText);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col selection:bg-emerald-700 selection:text-white font-arabic">
      {/* Top Navigation Bar */}
      <Header
        isAutoVoiceEnabled={isAutoVoiceEnabled}
        onToggleVoice={() => setIsAutoVoiceEnabled(!isAutoVoiceEnabled)}
        onOpenAmbitionModal={() => setIsAmbitionModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        
        {/* Hero: 3D Character Front and Center */}
        <section className="relative rounded-3xl bg-white border border-emerald-50 p-6 sm:p-10 shadow-sm text-center flex flex-col items-center">


          {/* Event Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-6">
            <Flag className="w-3.5 h-3.5 text-emerald-600" />
            <span>اليوم الوطني السعودي 96 | كلية الأعمال والاقتصاد</span>
          </div>

          {/* 3D Realistic Character Component */}
          <div className="relative z-10 mb-4">
            <CharacterAvatar
              state={characterState}
              onMicClick={handleToggleListening}
              isListening={isListening}
            />
          </div>

          {/* Character Title & Bio */}
          <div className="relative z-10 max-w-xl space-y-2 mt-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              رِواء <span className="text-emerald-700 font-mono text-2xl sm:text-3xl">AI</span>
            </h2>
            <p className="text-base sm:text-lg font-bold text-emerald-800">
              صوت سعودي من جيل المستقبل
            </p>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              تحدث معي مباشرة بالصوت عن تاريخ المملكة، تنوع مناطقها الـ 13، تراثنا العريق، وطموحات جيلنا نحو رؤية السعودية 2030.
            </p>
          </div>

          {/* Primary Voice Action Button right beneath the character */}
          <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleToggleListening}
              disabled={characterState === 'THINKING'}
              className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base shadow-md transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 text-white ring-4 ring-red-100'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-100 border border-emerald-600'
              }`}
              aria-label={isListening ? 'إيقاف التحدث' : 'تحدث صوتياً مع رِواء'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5 animate-pulse" />
                  <span>أستمع إليك الآن... (اضغط للإيقاف)</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>تحدث صوتياً مع رِواء</span>
                </>
              )}
            </button>

            {/* Optional Ambition Button */}
            <button
              onClick={() => setIsAmbitionModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 transition shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>أضف طموحك</span>
            </button>
          </div>

        </section>

        {/* Conversation Stream Section */}
        <section className="space-y-6">
          
          {/* Suggested Questions */}
          <SuggestedQuestions
            onSelectQuestion={handleQuestionSelect}
            disabled={characterState === 'THINKING'}
          />

          {/* Interactive Chat Window */}
          <ChatInterface
            messages={messages}
            characterState={characterState}
            audioNotice={audioNotice}
            onSendMessage={sendMessage}
            onToggleMic={handleToggleListening}
            isListening={isListening}
            transcript={transcript}
            onReplayVoice={replayMessageVoice}
            isMicSupported={isMicSupported}
          />

        </section>

        {/* Optional Future Vision Board below */}
        <FutureVisionBoard
          ambitions={ambitions}
          onOpenAddModal={() => setIsAmbitionModalOpen(true)}
        />

      </main>

      {/* Ambition Modal (ONLY opens when user clicks button) */}
      <AmbitionModal
        isOpen={isAmbitionModalOpen}
        onClose={() => setIsAmbitionModalOpen(false)}
        onAmbitionAdded={handleAmbitionAdded}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
