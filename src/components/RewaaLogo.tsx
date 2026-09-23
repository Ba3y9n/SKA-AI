import React from 'react';

export const RewaaLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background shape - subtle AI circular motion */}
      <circle cx="50" cy="50" r="48" fill="url(#gradient-bg)" className="opacity-10" />
      <circle cx="50" cy="50" r="48" stroke="url(#gradient-bg)" strokeWidth="1" strokeDasharray="4 8" className="animate-[spin_20s_linear_infinite]" />
      
      {/* Voice Waves / AI Signal */}
      <path d="M75 40 Q85 50 75 60" stroke="#10B981" strokeWidth="3" strokeLinecap="round" className="opacity-60" />
      <path d="M82 35 Q95 50 82 65" stroke="#10B981" strokeWidth="2" strokeLinecap="round" className="opacity-40" />
      <path d="M68 45 Q75 50 68 55" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />

      {/* The letter 'ر' (Arabic Identity) */}
      <path 
        d="M 55 35 
           L 55 50 
           C 55 75, 25 80, 20 80" 
        stroke="currentColor" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Gradient Defs */}
      <defs>
        <linearGradient id="gradient-bg" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#0B3D2E" />
        </linearGradient>
      </defs>
    </svg>
  );
};
