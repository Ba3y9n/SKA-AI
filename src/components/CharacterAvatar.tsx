import React from 'react';
import { CharacterState } from '../types/character';
import { Visualizer } from './Visualizer';

interface CharacterAvatarProps {
  state: CharacterState;
  onMicClick?: () => void;
  isListening?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ state }) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto mt-4 mb-4">
      
      {/* Outer Glow / Aura */}
      <div
        className={`absolute -inset-4 rounded-full transition-all duration-1000 pointer-events-none ${
          state === 'SPEAKING'
            ? 'bg-emerald-100/60 scale-110 blur-xl'
            : state === 'LISTENING'
            ? 'bg-emerald-200/50 scale-110 animate-pulse blur-2xl'
            : state === 'THINKING'
            ? 'bg-emerald-50/60 animate-pulse blur-lg'
            : state === 'ERROR'
            ? 'bg-red-50/50 blur-lg'
            : 'bg-transparent scale-100'
        }`}
      />

      {/* Main Avatar Frame */}
      <div
        className={`relative w-full h-full rounded-full p-2 transition-all duration-500 bg-white ${
          state === 'LISTENING'
            ? 'border-4 border-emerald-400 shadow-xl shadow-emerald-100'
            : state === 'SPEAKING'
            ? 'border-4 border-emerald-500 shadow-2xl shadow-emerald-100'
            : state === 'THINKING'
            ? 'border-4 border-emerald-200 border-dashed animate-pulse'
            : state === 'ERROR'
            ? 'border-4 border-red-400'
            : 'border border-gray-100 shadow-md'
        } flex items-center justify-center overflow-hidden z-10`}
        style={{
          // Character states animations via CSS
          animation: 
            state === 'IDLE' ? 'breathe 4s infinite ease-in-out' : 
            state === 'LISTENING' ? 'breathe 2s infinite ease-in-out' :
            state === 'SPEAKING' ? 'talkBounce 1.5s infinite alternate ease-in-out' : 'none'
        }}
      >
        <style>{`
          @keyframes breathe {
            0%, 100% { transform: scale(1) translateY(0); }
            50% { transform: scale(1.02) translateY(-2px); }
          }
          @keyframes talkBounce {
            0% { transform: scale(1) translateY(0) rotate(0deg); }
            25% { transform: scale(1.01) translateY(-1px) rotate(0.5deg); }
            75% { transform: scale(1.01) translateY(-2px) rotate(-0.5deg); }
            100% { transform: scale(1.02) translateY(0) rotate(0deg); }
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

      {/* Embedded Visualizer when speaking or listening */}
      <div className={`absolute bottom-6 z-20 transition-opacity duration-300 ${state === 'SPEAKING' || state === 'LISTENING' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-100/50 shadow-sm">
          <Visualizer state={state} />
        </div>
      </div>
    </div>
  );
};
