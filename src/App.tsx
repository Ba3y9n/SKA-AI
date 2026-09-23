import React, { useState } from 'react';
import { Header } from './components/Header';
import { CharacterAvatar } from './components/CharacterAvatar';
import { ChatInterface } from './components/ChatInterface';
import { SuggestedQuestions } from './components/SuggestedQuestions';
import { FutureVisionBoard } from './components/FutureVisionBoard';
import { AmbitionModal } from './components/AmbitionModal';
import { Footer } from './components/Footer';
import { AchievementsTimeline } from './components/AchievementsTimeline';
import { useGeminiChat } from './hooks/useGeminiChat';
import { Ambition } from './types/ambition';
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

  const [ambitions, setAmbitions] = useState<Ambition[]>([]);
  const [isAmbitionModalOpen, setIsAmbitionModalOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  React.useEffect(() => {
    import('./services/apiService').then(({ fetchAmbitions }) => {
      fetchAmbitions().then(data => {
        setAmbitions(data);
      }).catch(err => console.error('Failed to fetch ambitions:', err));
    });
  }, []);

  const handleAmbitionAdded = (newAmbition: Ambition) => {
    setAmbitions((prev) => [newAmbition, ...prev]);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && characterState !== 'THINKING') {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  // Get only the last message from Rewaa to display as subtitles
  const lastRewaaMessage = messages.slice().reverse().find(m => m.sender === 'rewaa');
  const displaySubtitle = transcript ? transcript : (characterState === 'SPEAKING' || characterState === 'IDLE' ? lastRewaaMessage?.text : '');

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-emerald-200 selection:text-emerald-900 relative">
      
      {/* Dynamic Animated Gradient Background for the Entire App */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#dcfce7] via-[#f1f8e9] to-[#c8e6c9] bg-[length:200%_200%]"
        style={{
          animation: 'gradientMove 15s ease infinite'
        }}
      ></div>

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          isAutoVoiceEnabled={isAutoVoiceEnabled}
          onToggleVoice={() => setIsAutoVoiceEnabled(!isAutoVoiceEnabled)}
          onOpenAmbitionModal={() => setIsAmbitionModalOpen(true)}
        />

        {/* Main Character Experience Area */}
        <main className="flex-1 w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-center min-h-[85vh]">

        <div className="relative z-10 flex flex-col items-center w-full">
          {/* 1. Character Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">رِواء</h2>
            <p className="text-xs sm:text-sm font-semibold text-emerald-700 mt-1">صوت الجيل السعودي الرقمي</p>
          </div>

          {/* 2. 3D Character Avatar (Face) */}
          <div className="mb-6">
            <CharacterAvatar
              state={characterState}
              onMicClick={handleToggleListening}
              isListening={isListening}
            />
          </div>

          {/* 3. Small Status Area */}
          <div className="h-6 mb-4 flex items-center justify-center">
            {characterState === 'THINKING' ? (
              <span className="text-xs font-bold text-emerald-600 animate-pulse flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> جاري التفكير...
              </span>
            ) : isListening ? (
              <span className="text-xs font-bold text-emerald-600 animate-pulse flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> أستمع إليك...
              </span>
            ) : characterState === 'SPEAKING' ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <Volume2 className="w-3 h-3 animate-bounce" /> رِواء تتحدث
              </span>
            ) : characterState === 'ERROR' ? (
              <span className="text-xs font-medium text-red-500">{errorMessage}</span>
            ) : (
              <span className="text-xs font-medium text-gray-400">جاهزة للاستماع</span>
            )}
          </div>

          {/* 4. The Microphone Button */}
          <div className="relative flex flex-col items-center mb-8">
            <button
              onClick={handleToggleListening}
              className={`group relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-all duration-300 shadow-xl border-4 ${
                isListening
                  ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-200 scale-105 shadow-emerald-200/50'
                  : characterState === 'THINKING'
                  ? 'bg-gray-100 border-gray-200 opacity-70 cursor-not-allowed'
                  : characterState === 'SPEAKING'
                  ? 'bg-emerald-700 border-emerald-100 scale-105 shadow-emerald-200/50'
                  : 'bg-white border-emerald-50 hover:border-emerald-100 hover:scale-105 shadow-gray-100'
              }`}
              disabled={characterState === 'THINKING'}
              aria-label="الميكروفون"
            >
              {isListening ? (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-40"></div>
                  <MicOff className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </>
              ) : characterState === 'THINKING' ? (
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 animate-spin" />
              ) : characterState === 'SPEAKING' ? (
                <div className="flex items-center justify-center gap-1 h-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-1.5 bg-white rounded-full animate-pulse" style={{ height: `${Math.random() * 24 + 8}px`, animationDuration: '0.4s' }}></div>
                  ))}
                </div>
              ) : (
                <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-700 group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

          {/* 5. Transcript / Subtitle Box (Accessibility & Context) */}
          <div className="w-full max-w-2xl min-h-[80px] flex flex-col items-center justify-center text-center px-4">
            {transcript && (
              <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed animate-fadeIn">
                "{transcript}"
              </p>
            )}
            
            {characterState === 'SPEAKING' && displaySubtitle && (
              <div className="mt-4 p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-emerald-50 rounded-3xl shadow-sm animate-fadeIn w-full">
                <p className="text-base sm:text-lg md:text-xl font-medium leading-relaxed text-gray-900">
                  {displaySubtitle}
                </p>
              </div>
            )}

            {characterState === 'IDLE' && lastRewaaMessage && !transcript && (
              <div className="mt-4 p-4 bg-gray-50/50 rounded-2xl w-full max-w-lg mx-auto opacity-70">
                <p className="text-sm font-medium text-gray-600 line-clamp-2">
                  {lastRewaaMessage.text}
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* National Quote Section (96 & Emblem) */}
      <section className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-white to-emerald-50/30 overflow-hidden border-t border-emerald-50/50">
        
        {/* Subtle Watermarks (96 & Emblem) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <img src="/nd96_logo.webp" alt="" className="w-[800px] h-[800px] object-contain rotate-12 scale-150" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block mb-6">
            <span className="text-4xl sm:text-5xl font-serif text-emerald-800">"</span>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-loose text-gray-800">
            عزّنا برؤيتنا، وشجاعتنا، وهمتنا، وأصالتنا، وكرمنا، وجودنا..
            <br className="hidden sm:block" />
            <span className="text-emerald-700">96 عاماً</span> من المجد والتاريخ والشموخ.
            <br className="hidden sm:block" />
            دمت يا وطني عزيزاً شامخاً، ودام عزك بطبعك الأصيل الذي لا يتغير!
          </h3>
          <div className="inline-block mt-6">
            <span className="text-4xl sm:text-5xl font-serif text-emerald-800">"</span>
          </div>
        </div>
      </section>

      {/* Future Vision Board (Independent Section) */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-8">
        <FutureVisionBoard
          ambitions={ambitions}
          onOpenAddModal={() => setIsAmbitionModalOpen(true)}
        />
      </div>

      <AchievementsTimeline />

      <AmbitionModal
        isOpen={isAmbitionModalOpen}
        onClose={() => setIsAmbitionModalOpen(false)}
        onAmbitionAdded={handleAmbitionAdded}
      />

      <Footer />
      </div>
    </div>
  );
};

export default App;
