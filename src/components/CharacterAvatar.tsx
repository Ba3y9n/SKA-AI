import React from 'react';
import { CharacterState, CHARACTER_STATES } from '../types/character';
import { Visualizer } from './Visualizer';
import { Sparkles, Mic, BrainCircuit, Volume2, AlertCircle } from 'lucide-react';

interface CharacterAvatarProps {
  state: CharacterState;
  onMicClick?: () => void;
  isListening?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  state,
  onMicClick,
  isListening = false,
}) => {
  const stateConfig = CHARACTER_STATES[state];

  const renderStateIcon = () => {
    switch (state) {
      case 'LISTENING':
        return <Mic className="w-4 h-4 text-emerald-600 animate-pulse" />;
      case 'THINKING':
        return <BrainCircuit className="w-4 h-4 text-emerald-600 animate-spin" />;
      case 'SPEAKING':
        return <Volume2 className="w-4 h-4 text-emerald-700 animate-bounce" />;
      case 'ERROR':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'IDLE':
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      
      {/* Outer Halo */}
      <div
        className={`absolute -inset-4 sm:-inset-6 rounded-full transition-all duration-700 pointer-events-none ${
          state === 'SPEAKING'
            ? 'bg-emerald-100/50 scale-110 blur-xl'
            : state === 'LISTENING'
            ? 'bg-emerald-100/50 scale-105 animate-pulse blur-xl'
            : state === 'THINKING'
            ? 'bg-emerald-50/50 animate-pulse blur-lg'
            : state === 'ERROR'
            ? 'bg-red-50/50 blur-lg'
            : 'bg-transparent'
        }`}
      />

      {/* Main Avatar Frame */}
      <div
        className={`relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full p-1.5 transition-all duration-500 bg-white ${
          state === 'LISTENING'
            ? 'border-4 border-emerald-500 shadow-lg'
            : state === 'SPEAKING'
            ? 'border-4 border-emerald-600 shadow-xl'
            : state === 'THINKING'
            ? 'border-4 border-emerald-300 animate-pulse'
            : state === 'ERROR'
            ? 'border-4 border-red-500'
            : 'border-2 border-emerald-100 shadow-sm'
        } flex items-center justify-center overflow-hidden`}
        style={{
          // Simple breathing animation for IDLE state
          animation: state === 'IDLE' ? 'breathe 4s infinite ease-in-out' : 'none'
        }}
      >
        <style>{`
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
        `}</style>
        
        {/* Avatar Image */}
        <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
          <img
            src="/rewaa_avatar.jpg"
            alt="رِواء AI"
            className={`w-full h-full object-cover object-top transition-transform duration-700 ${
              state === 'SPEAKING'
                ? 'scale-105'
                : state === 'LISTENING'
                ? 'scale-102'
                : 'scale-100'
            }`}
          />
        </div>
      </div>

      {/* Character State Badge */}
      <div className="mt-5 flex flex-col items-center">
        <div
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold border bg-white transition-all duration-300 ${
            state === 'LISTENING'
              ? 'border-emerald-400 text-emerald-800 shadow-sm'
              : state === 'SPEAKING'
              ? 'border-emerald-500 text-emerald-900 shadow-sm'
              : state === 'THINKING'
              ? 'border-emerald-300 text-emerald-700'
              : state === 'ERROR'
              ? 'border-red-300 text-red-800'
              : 'border-emerald-100 text-emerald-900'
          }`}
        >
          {renderStateIcon()}
          <span>{stateConfig.statusTextArabic}</span>
        </div>

        {/* Real-time Frequency Wave Visualizer */}
        <div className="mt-2.5">
          <Visualizer state={state} />
        </div>
      </div>
    </div>
  );
};
