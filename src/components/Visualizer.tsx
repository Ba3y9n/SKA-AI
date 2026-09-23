import React from 'react';
import { CharacterState } from '../types/character';

interface VisualizerProps {
  state: CharacterState;
}

export const Visualizer: React.FC<VisualizerProps> = ({ state }) => {
  const isActive = state === 'LISTENING' || state === 'SPEAKING';
  const isThinking = state === 'THINKING';

  return (
    <div className="flex items-center justify-center gap-1.5 h-8 px-4" aria-hidden="true">
      {[...Array(16)].map((_, i) => {
        const delay = (i * 0.08).toFixed(2);
        const heights = [
          'h-1.5',
          'h-3',
          'h-5',
          'h-7',
          'h-4',
          'h-6',
          'h-2.5',
          'h-7',
          'h-5',
          'h-3',
          'h-6',
          'h-4',
          'h-7',
          'h-3',
          'h-5',
          'h-2',
        ];
        const barHeight = heights[i % heights.length];

        return (
          <div
            key={i}
            style={{
              animationDelay: `${delay}s`,
              animationDuration: state === 'SPEAKING' ? '0.7s' : '1.1s',
            }}
            className={`w-1 rounded-full transition-all duration-300 ${
              isActive
                ? `bg-saudi-600 animate-pulse ${barHeight}`
                : isThinking
                ? 'bg-teal-500/70 animate-bounce h-2'
                : state === 'ERROR'
                ? 'bg-red-500/60 h-1.5'
                : 'bg-saudi-200 h-1'
            }`}
          />
        );
      })}
    </div>
  );
};
