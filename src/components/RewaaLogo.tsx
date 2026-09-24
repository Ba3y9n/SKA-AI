import React from 'react';

export const RewaaLogo: React.FC<{ className?: string; color?: string }> = ({ 
  className = "w-10 h-10", 
  color = "currentColor" 
}) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="شعار رِواء"
    >
      {/* Outer Subtle Circular Pulse / Waveform Orbit */}
      <circle 
        cx="50" 
        cy="50" 
        r="44" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeDasharray="4 6" 
        className="opacity-30" 
      />

      {/* AI Waveform Signal Bars */}
      <path d="M78 38 Q88 50 78 62" stroke={color} strokeWidth="2.5" strokeLinecap="round" className="opacity-70" />
      <path d="M85 32 Q97 50 85 68" stroke={color} strokeWidth="1.8" strokeLinecap="round" className="opacity-40" />

      {/* Modern Arabic Calligraphic Letter 'ر' */}
      <path 
        d="M 54 28 
           L 54 48 
           C 54 74, 26 80, 18 80" 
        stroke={color} 
        strokeWidth="9" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Digital Energy Dot */}
      <circle cx="54" cy="22" r="4.5" fill={color} />
    </svg>
  );
};
