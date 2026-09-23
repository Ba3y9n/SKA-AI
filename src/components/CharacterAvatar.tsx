import React from 'react';
import { CharacterState } from '../types/character';

interface CharacterAvatarProps {
  state: CharacterState;
  onMicClick?: () => void;
  isListening?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ state, isListening }) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto mt-4 mb-4">
      
      {/* Soft Background AI Glow Layer */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-1000 ease-in-out pointer-events-none mix-blend-multiply ${
          state === 'SPEAKING'
            ? 'bg-emerald-100/40 scale-125 blur-3xl'
            : state === 'LISTENING' || isListening
            ? 'bg-emerald-200/50 scale-150 animate-pulse blur-3xl'
            : state === 'THINKING'
            ? 'bg-emerald-50/60 scale-110 blur-2xl'
            : state === 'ERROR'
            ? 'bg-red-50/50 blur-2xl'
            : 'bg-emerald-50/20 scale-100 blur-2xl'
        }`}
      />

      {/* Main Avatar Frame */}
      <div
        className={`relative w-full h-full rounded-full transition-all duration-700 overflow-hidden z-10 flex items-end justify-center ${
          state === 'LISTENING' || isListening
            ? 'shadow-[0_0_40px_rgba(16,185,129,0.2)] scale-105'
            : state === 'SPEAKING'
            ? 'shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-105'
            : 'shadow-none scale-100'
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
            25% { transform: scale(1.05) translateY(-1px) scaleY(1.01); }
            75% { transform: scale(1.05) translateY(-2px) scaleY(1.02); }
            100% { transform: scale(1.05) translateY(0) scaleY(1); }
          }
        `}</style>
        
        {/* Avatar Image (Face + Neck Crop) */}
        <div 
          className="relative w-full h-full rounded-full overflow-hidden bg-transparent"
          style={{
            animation: 
              state === 'IDLE' ? 'breathe 4s infinite ease-in-out' : 
              (state === 'LISTENING' || isListening) ? 'listenPulse 2s infinite ease-in-out' :
              state === 'SPEAKING' ? 'talkSimulate 0.2s infinite alternate ease-in-out' : 'none'
          }}
        >
          <img
            src="/rewaa_avatar_memoji.jpg"
            alt="رِواء AI"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};
