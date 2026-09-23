import React from 'react';
import { CharacterState } from '../types/character';

interface CharacterAvatarProps {
  state: CharacterState;
  onMicClick?: () => void;
  isListening?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ state, isListening }) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto mt-4 mb-4">
      
      {/* Soft Background AI Glow Layer */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-1000 ease-in-out pointer-events-none mix-blend-overlay ${
          state === 'SPEAKING'
            ? 'bg-emerald-300/40 scale-125 blur-3xl'
            : state === 'LISTENING' || isListening
            ? 'bg-emerald-400/50 scale-150 animate-pulse blur-3xl'
            : state === 'THINKING'
            ? 'bg-emerald-200/60 scale-110 blur-2xl'
            : state === 'ERROR'
            ? 'bg-red-200/50 blur-2xl'
            : 'bg-emerald-200/20 scale-100 blur-2xl'
        }`}
      />

      {/* Main Avatar Frame (No Borders, No Mask) */}
      <div
        className={`relative w-full h-full transition-all duration-700 z-10 flex items-end justify-center ${
          state === 'LISTENING' || isListening
            ? 'scale-105'
            : state === 'SPEAKING'
            ? 'scale-105'
            : 'scale-100'
        }`}
      >
        <style>{`
          @keyframes breathe {
            0%, 100% { transform: scale(1) translateY(0); }
            50% { transform: scale(1.01) translateY(-2px); }
          }
          @keyframes listenPulse {
            0%, 100% { transform: scale(1.05) translateY(0); }
            50% { transform: scale(1.06) translateY(-1px); }
          }
          @keyframes talkSimulate {
            0% { transform: scale(1.05) translateY(0) scaleY(1); }
            25% { transform: scale(1.05) translateY(-2px) scaleY(1.01); }
            75% { transform: scale(1.05) translateY(-4px) scaleY(1.02); }
            100% { transform: scale(1.05) translateY(0) scaleY(1); }
          }
        `}</style>
        
        {/* Avatar Image (True Transparent PNG) */}
        <div 
          className="relative w-full h-full bg-transparent"
          style={{
            animation: 
              state === 'IDLE' ? 'breathe 4s infinite ease-in-out' : 
              (state === 'LISTENING' || isListening) ? 'listenPulse 2s infinite ease-in-out' :
              state === 'SPEAKING' ? 'talkSimulate 0.2s infinite alternate ease-in-out' : 'none'
          }}
        >
          <img
            src="/rewaa_avatar_real_transparent.png"
            alt="رِواء AI"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};
