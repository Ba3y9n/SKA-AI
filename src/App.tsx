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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col selection:bg-emerald-700 selection:text-white font-arabic overflow-x-hidden">
      <Header
        isAutoVoiceEnabled={isAutoVoiceEnabled}
        onToggleVoice={() => setIsAutoVoiceEnabled(!isAutoVoiceEnabled)}
        onOpenAmbitionModal={() => setIsAmbitionModalOpen(true)}
      />

      {/* Main Character Experience Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-center min-h-[75vh]">
        
        {/* Character Title - Minimal */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">رِواء</h2>
          <p className="text-sm font-medium text-emerald-700 mt-1">صوت الجيل السعودي الرقمي</p>
        </div>

        {/* 3D Character Avatar */}
        <div className="relative z-10 mb-8 transform transition-transform duration-700">
          <CharacterAvatar
            state={characterState}
            onMicClick={handleToggleListening}
            isListening={isListening}
          />
        </div>

        {/* Interactive Status & Subtitles */}
        <div className="w-full max-w-2xl text-center min-h-[90px] mb-8 flex flex-col items-center justify-center">
          {characterState === 'THINKING' ? (
            <div className="flex flex-col items-center gap-2 text-emerald-600 animate-pulse">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold">لحظة، أفكر...</span>
              </div>
              <p className="text-xs text-gray-500">جاري صياغة الرد وتجهيز الصوت</p>
            </div>
          ) : characterState === 'SPEAKING' ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                رِواء تتحدث...
              </span>
              <p className="text-base sm:text-lg md:text-xl font-medium leading-relaxed text-gray-800">
                {displaySubtitle}
              </p>
            </div>
          ) : characterState === 'LISTENING' ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                أستمع إليك الآن...
              </span>
              <p className="text-base sm:text-lg md:text-xl font-medium leading-relaxed text-emerald-800">
                {transcript || 'تفضل بالحديث...'}
              </p>
            </div>
          ) : characterState === 'ERROR' ? (
            <div className="text-center">
              <p className="text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-full border border-red-200 inline-block">
                {errorMessage || 'حدث خطأ في الاتصال، تفضل بإعادة المحاولة.'}
              </p>
            </div>
          ) : (
            <p className="text-base sm:text-lg md:text-xl font-medium leading-relaxed text-gray-800">
              {displaySubtitle || 'جاهزة أسمعك، تفضل بالضغط على الميكروفون.'}
            </p>
          )}
        </div>

        {/* Primary Voice Action Button */}
        <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-md">
          <button
            onClick={handleToggleListening}
            className={`group relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-all duration-300 shadow-xl active:scale-95 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 shadow-red-200/50 scale-105'
                : characterState === 'THINKING'
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200/50 animate-pulse'
                : characterState === 'SPEAKING'
                ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-200/50 scale-105 ring-4 ring-emerald-100'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/50 hover:scale-105'
            }`}
            aria-label={
              isListening
                ? 'إيقاف الاستماع'
                : characterState === 'SPEAKING'
                ? 'إيقاف صوت رِواء'
                : 'تحدث مع رِواء'
            }
          >
            {isListening ? (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-20"></div>
                <MicOff className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
              </>
            ) : characterState === 'THINKING' ? (
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" />
            ) : characterState === 'SPEAKING' ? (
              <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce" />
            ) : (
              <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:scale-110 transition-transform" />
            )}
          </button>
          
          {/* Animated Arrow Pointing to Mic (Only in IDLE) */}
          {!isListening && characterState === 'IDLE' && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-emerald-500">
              <span className="text-[10px] font-bold mb-1">اضغطي وتحدثي</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          )}
          <span className={`text-sm font-bold ${
            isListening
              ? 'text-red-600 animate-pulse'
              : characterState === 'THINKING'
              ? 'text-emerald-600'
              : characterState === 'SPEAKING'
              ? 'text-emerald-700'
              : 'text-emerald-800'
          }`}>
            {isListening
              ? 'أستمع لك... (اضغط للإيقاف)'
              : characterState === 'THINKING'
              ? 'أفكر في الرد... (اضغط للإلغاء)'
              : characterState === 'SPEAKING'
              ? 'رِواء تتحدث... (اضغط للإيقاف)'
              : 'تحدث مع رواء'}
          </span>

          {/* Text Fallback Input */}
          <form onSubmit={handleTextSubmit} className="w-full mt-2 flex items-center gap-2 bg-gray-50/80 p-2 rounded-2xl border border-gray-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-50 transition-all">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="أو اكتب رسالتك هنا..."
              className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>

      </main>

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
  );
};

export default App;
