import React from 'react';
import { motion } from 'framer-motion';
import { CharacterState } from '../types/character';

interface CharacterAvatarProps {
  state: CharacterState;
  isListening?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ state, isListening }) => {
  const isSpeaking = state === 'SPEAKING';
  const isThinking = state === 'THINKING';
  const isActivelyListening = state === 'LISTENING' || isListening;
  const isIdle = state === 'IDLE';

  // Determine orbit speeds based on state
  const orbitDuration1 = isSpeaking ? 3 : isActivelyListening ? 4 : isThinking ? 15 : 10;
  const orbitDuration2 = isSpeaking ? 4 : isActivelyListening ? 5 : isThinking ? 20 : 15;
  const orbitDuration3 = isSpeaking ? 5 : isActivelyListening ? 6 : isThinking ? 25 : 20;

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto my-12">
      
      {/* 1. Base Core Glow */}
      <motion.div
        animate={{ 
          scale: isSpeaking ? [1, 1.2, 1] : isActivelyListening ? [1, 1.3, 1] : 1,
          opacity: isThinking ? 0.3 : 0.6
        }}
        transition={{ duration: isSpeaking ? 0.4 : 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-emerald-300/30 blur-3xl"
      />

      {/* 2. Interactive AI Orbits (SVG) */}
      <div className="absolute inset-[-40%] pointer-events-none z-0">
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          {/* Orbit 1 (Inner) */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: orbitDuration1, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="100" cy="100" r="70" fill="none" stroke="url(#orbit-grad)" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.5" />
            <circle cx="170" cy="100" r="3" fill="#10B981" />
          </motion.g>

          {/* Orbit 2 (Middle) */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: orbitDuration2, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="100" cy="100" r="85" fill="none" stroke="#34D399" strokeWidth="0.5" opacity="0.3" />
            <circle cx="100" cy="15" r="4" fill="#059669" />
          </motion.g>

          {/* Orbit 3 (Outer Audio Ring - reacts heavily to SPEAKING) */}
          <motion.g
            animate={{ 
              rotate: 360,
              scale: isSpeaking ? [1, 1.05, 1] : 1 
            }}
            transition={{ 
              rotate: { duration: orbitDuration3, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <circle cx="100" cy="100" r="100" fill="none" stroke="#10B981" strokeWidth={isSpeaking ? "1.5" : "0.5"} strokeDasharray={isSpeaking ? "2 8" : "1 4"} opacity={isSpeaking ? 0.8 : 0.2} />
            <circle cx="0" cy="100" r="2" fill="#10B981" />
          </motion.g>

          {/* Definitions */}
          <defs>
            <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
              <stop offset="100%" stopColor="#0B3D2E" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 3. The Character Face */}
      <motion.div
        animate={{ 
          y: isIdle ? [-5, 5, -5] : isActivelyListening ? [-2, 2, -2] : 0,
          scale: isSpeaking ? [1, 1.02, 1] : 1
        }}
        transition={{ 
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative w-full h-full z-10 flex items-center justify-center"
      >
        <img
          src="/rewaa_avatar_real_transparent.png"
          alt="رِواء AI"
          className="w-[80%] h-[80%] object-contain drop-shadow-2xl"
        />
      </motion.div>
    </div>
  );
};
