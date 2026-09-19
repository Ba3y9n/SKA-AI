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

  // Helper icons for states
  const renderStateIcon = () => {
    switch (state) {
      case 'LISTENING':
        return <Mic className="w-4 h-4 text-emerald-300 animate-pulse" />;
      case 'THINKING':
        return <BrainCircuit className="w-4 h-4 text-teal-300 animate-spin" />;
      case 'SPEAKING':
        return <Volume2 className="w-4 h-4 text-emerald-200 animate-bounce" />;
      case 'ERROR':
        return <AlertCircle className="w-4 h-4 text-red-300" />;
      case 'IDLE':
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Outer Ambient Glowing Rings */}
      <div
        className={`absolute -inset-4 md:-inset-8 rounded-full filter blur-2xl opacity-60 transition-all duration-700 pointer-events-none ${
          state === 'SPEAKING'
            ? 'bg-emerald-500/40 scale-110'
            : state === 'LISTENING'
            ? 'bg-emerald-400/50 scale-105 animate-pulse'
            : state === 'THINKING'
            ? 'bg-teal-500/40 animate-pulse'
            : state === 'ERROR'
            ? 'bg-red-600/30'
            : 'bg-emerald-800/20'
        }`}
      />

      {/* Outer Halo Rings */}
      <div
        className={`relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full p-1.5 transition-all duration-500 border ${
          state === 'LISTENING'
            ? 'border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.5)] ring-4 ring-emerald-500/20'
            : state === 'SPEAKING'
            ? 'border-emerald-400 shadow-[0_0_40px_rgba(0,108,53,0.6)] ring-4 ring-emerald-400/20'
            : state === 'THINKING'
            ? 'border-teal-400/70 shadow-[0_0_25px_rgba(45,212,191,0.3)] animate-pulse'
            : state === 'ERROR'
            ? 'border-red-500/70 shadow-[0_0_25px_rgba(239,68,68,0.4)]'
            : 'border-emerald-700/40 shadow-[0_0_20px_rgba(0,108,53,0.2)]'
        } bg-gradient-to-b from-[#0e2417] via-[#09170f] to-[#040b07] flex items-center justify-center overflow-hidden`}
      >
        {/* Modern Vector Representation of Saudi Digital Persona */}
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full object-cover transition-transform duration-500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Background Gradient */}
            <radialGradient id="bgSphere" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#143e26" />
              <stop offset="70%" stopColor="#071a10" />
              <stop offset="100%" stopColor="#030b07" />
            </radialGradient>

            {/* Saudi Scarf / Modest Modern Abaya Gradient */}
            <linearGradient id="abayaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d281a" />
              <stop offset="50%" stopColor="#091c12" />
              <stop offset="100%" stopColor="#040f09" />
            </linearGradient>

            {/* Emerald Digital Accents */}
            <linearGradient id="accentGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#006C35" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Face Skin Tone Gradient */}
            <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#eed0b3" />
              <stop offset="100%" stopColor="#dcba96" />
            </linearGradient>

            {/* Glowing Digital Particles */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Canvas Background */}
          <rect width="240" height="240" fill="url(#bgSphere)" />

          {/* Ambient Digital Grid / Constellation in background */}
          <g opacity="0.25" stroke="#34D399" strokeWidth="0.6">
            <line x1="30" y1="50" x2="70" y2="30" />
            <line x1="70" y1="30" x2="110" y2="60" />
            <line x1="170" y1="40" x2="210" y2="70" />
            <line x1="130" y1="30" x2="170" y2="40" />
            <circle cx="70" cy="30" r="1.5" fill="#34D399" />
            <circle cx="170" cy="40" r="1.5" fill="#34D399" />
            <circle cx="210" cy="70" r="1.5" fill="#34D399" />
          </g>

          {/* Shoulders & Elegant Saudi Modest Attire */}
          <path
            d="M25 240 C35 190, 80 170, 120 170 C160 170, 205 190, 215 240 Z"
            fill="url(#abayaGrad)"
            stroke="#10B981"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />

          {/* Elegant Green Trim on Modern Abaya */}
          <path
            d="M95 174 C110 185, 130 185, 145 174 L142 240 L98 240 Z"
            fill="none"
            stroke="url(#accentGreen)"
            strokeWidth="2"
            opacity="0.8"
          />

          {/* Neck */}
          <rect x="108" y="142" width="24" height="32" rx="4" fill="url(#skinTone)" />

          {/* Contemporary Hijab / Modest Framing */}
          <path
            d="M65 110 C65 60, 90 40, 120 40 C150 40, 175 60, 175 110 C175 155, 160 175, 120 175 C80 175, 65 155, 65 110 Z"
            fill="url(#abayaGrad)"
            stroke="#10B981"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />

          {/* Face Oval */}
          <path
            d="M86 102 C86 76, 101 64, 120 64 C139 64, 154 76, 154 102 C154 130, 138 148, 120 148 C102 148, 86 130, 86 102 Z"
            fill="url(#skinTone)"
          />

          {/* Subtle Hair Flow peeking elegantly */}
          <path
            d="M87 90 C96 75, 110 70, 120 70 C130 70, 144 75, 153 90 C146 80, 134 76, 120 76 C106 76, 94 80, 87 90 Z"
            fill="#2c1a11"
            opacity="0.85"
          />

          {/* Eyebrows */}
          <path d="M96 95 Q106 91 113 95" stroke="#3b2314" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M127 95 Q134 91 144 95" stroke="#3b2314" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Eyes (Arabian / Natural Almond) */}
          <g>
            {/* Left Eye */}
            <path d="M96 104 Q105 99 113 104 Q105 108 96 104 Z" fill="#ffffff" />
            <circle cx="105" cy="103.5" r="3" fill="#321e14" />
            <circle cx="106" cy="102.5" r="1" fill="#ffffff" />
            
            {/* Right Eye */}
            <path d="M127 104 Q135 99 144 104 Q135 108 127 104 Z" fill="#ffffff" />
            <circle cx="135" cy="103.5" r="3" fill="#321e14" />
            <circle cx="136" cy="102.5" r="1" fill="#ffffff" />
          </g>

          {/* Soft Nose */}
          <path d="M120 102 L118 116 Q120 119 123 117" stroke="#caa580" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Mouth (Responsive to SPEAKING State) */}
          {state === 'SPEAKING' ? (
            <g>
              {/* Animated Speaking Mouth */}
              <ellipse cx="120" cy="131" rx="6.5" ry="4.5" fill="#a8434a" />
              <path d="M115 130 Q120 128 125 130" stroke="#fce7ea" strokeWidth="1" fill="none" />
            </g>
          ) : (
            /* Gentle Smile */
            <path
              d="M114 130 Q120 135 126 130"
              stroke="#b3545b"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Digital Smart Pin / Earring / Brooch Accent */}
          <circle cx="120" cy="170" r="3.5" fill="#34D399" filter="url(#softGlow)" />
          <circle cx="120" cy="170" r="1.5" fill="#FFFFFF" />

          {/* Visual Digital Aura when Active */}
          {(state === 'LISTENING' || state === 'SPEAKING') && (
            <circle
              cx="120"
              cy="120"
              r="90"
              fill="none"
              stroke="#34D399"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              opacity="0.6"
              className="animate-spin"
              style={{ animationDuration: '12s' }}
            />
          )}
        </svg>

        {/* Pulse ripple waves when listening */}
        {state === 'LISTENING' && (
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-30 pointer-events-none" />
        )}
      </div>

      {/* Dynamic Status Badge */}
      <div className="mt-4 flex flex-col items-center">
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border backdrop-blur-md shadow-lg transition-all duration-300 ${stateConfig.badgeBg} ${stateConfig.badgeBorder}`}
        >
          {renderStateIcon()}
          <span className="text-gray-100 font-semibold">{stateConfig.statusTextArabic}</span>
        </div>

        {/* Subtitle / Helper hint */}
        <p className="text-xs text-emerald-300/70 mt-1.5 text-center max-w-xs font-light">
          {stateConfig.subTextArabic}
        </p>

        {/* Real-time Frequency Wave Visualizer */}
        <div className="mt-2">
          <Visualizer state={state} />
        </div>
      </div>
    </div>
  );
};
