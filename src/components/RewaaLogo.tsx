import React from 'react';

export const RewaaLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" rx="24" fill="#0B3D2E"/>
      
      {/* Geometric 'ر' */}
      <path 
        d="M 65 30 
           L 65 50 
           C 65 65, 55 75, 40 75
           L 30 75" 
        stroke="white" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Waveform accent / dot representing AI/Audio */}
      <circle cx="72" cy="22" r="5" fill="#10B981" />
      <path 
        d="M 40 40 L 40 60 M 30 45 L 30 55" 
        stroke="#10B981" 
        strokeWidth="6" 
        strokeLinecap="round" 
        className="animate-pulse"
      />
    </svg>
  );
};
