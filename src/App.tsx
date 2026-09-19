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
import { Mic, MessageSquare, Sparkles, Flag, ArrowDown } from 'lucide-react';

export const App: React.FC = () => {
  const {
    messages,
    characterState,
    errorMessage,
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
    <div className="min-h-screen bg-[#050b07] text-gray-100 flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Top Navigation Bar */}
      <Header
        isAutoVoiceEnabled={isAutoVoiceEnabled}
        onToggleVoice={() => setIsAutoVoiceEnabled(!isAutoVoiceEnabled)}
        onOpenAmbitionModal={() => setIsAmbitionModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        
        {/* Hero & Interactive Character Section */}
        <section className="relative rounded-3xl bg-gradient-to-b from-[#091b11]/80 via-[#06120b]/90 to-[#040a06] border border-emerald-800/40 p-6 sm:p-10 shadow-2xl backdrop-blur-md overflow-hidden">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left/Center on mobile: Interactive Character Avatar */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <CharacterAvatar
                state={characterState}
                onMicClick={handleToggleListening}
                isListening={isListening}
              />
            </div>

            {/* Right: Intro, Concept, and Quick Actions */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-right space-y-5">
              
              {/* Event Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-600/50 shadow-sm">
                <Flag className="w-3.5 h-3.5 text-emerald-400" />
                <span>اليوم الوطني السعودي 96 | كلية الأعمال والاقتصاد</span>
              </div>

              {/* Title & Slogan */}
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  رِواء <span className="text-emerald-400 font-mono">AI</span>
                </h2>
                <p className="text-lg sm:text-xl font-medium text-emerald-300/90 mt-1">
                  صوت سعودي من جيل المستقبل
                </p>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl font-light">
                تحدث معي صوتياً أو كتابياً عن المملكة، تنوع مناطقها الـ 13، تراثنا العريق،
                منجزات الحاضر، وطموحات جيلنا الواعد تحت مظلة رؤية السعودية 2030.
              </p>

              {/* Primary Call-to-Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full sm:w-auto pt-2">
                
                {/* Voice Action Button */}
                <button
                  onClick={handleToggleListening}
                  disabled={characterState === 'THINKING'}
                  className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 ${
                    isListening
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-950/60 ring-4 ring-red-500/20'
                      : 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white shadow-emerald-950/60 border border-emerald-400/40'
                  }`}
                  aria-label={isListening ? 'إيقاف التحدث' : 'تحدث صوتياً مع رِواء'}
                >
                  <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
                  <span>{isListening ? 'جارٍ الاستماع... (اضغط للإيقاف)' : 'تحدث صوتياً مع رِواء'}</span>
                </button>

                {/* Ambition Button */}
                <button
                  onClick={() => setIsAmbitionModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-sm bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 transition transform hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>شارك طموحك لمستقبل الوطن</span>
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* Conversation & Exploration Section */}
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
            onSendMessage={sendMessage}
            onToggleMic={handleToggleListening}
            isListening={isListening}
            transcript={transcript}
            onReplayVoice={replayMessageVoice}
            isMicSupported={isMicSupported}
          />

        </section>

        {/* Feature Experience: صوتنا يصنع المستقبل */}
        <FutureVisionBoard
          ambitions={ambitions}
          onOpenAddModal={() => setIsAmbitionModalOpen(true)}
        />

      </main>

      {/* Modal: Share Ambition for Saudi Future */}
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
