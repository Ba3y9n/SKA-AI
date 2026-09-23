import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, X } from 'lucide-react';

interface FloatingVoiceWidgetProps {
  isListening: boolean;
  transcript: string;
  rewaaMessage?: string;
  onToggleListening: () => void;
}

export const FloatingVoiceWidget: React.FC<FloatingVoiceWidgetProps> = ({
  isListening,
  transcript,
  rewaaMessage,
  onToggleListening,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeText = transcript || rewaaMessage;

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start gap-2 select-none">
      
      {/* Expanded mini-bubble (only when active or expanded by user) */}
      <AnimatePresence>
        {(isListening || (isExpanded && activeText)) && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white/95 backdrop-blur-xl border border-saudi-200/80 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,108,79,0.15)] max-w-xs text-right mb-1"
          >
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-saudi-600'}`} />
                <span className="text-xs font-bold text-saudi-700">
                  {isListening ? 'أستمع إليك...' : 'رِواء AI'}
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs font-medium text-gray-700 leading-relaxed max-h-24 overflow-y-auto">
              {isListening ? (transcript || 'تحدثِ الآن، صوتكِ مسموع...') : activeText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small floating button (does not obstruct content) */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          if (!isListening && !isExpanded && activeText) {
            setIsExpanded(true);
          }
          onToggleListening();
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(0,108,79,0.25)] border transition-all duration-300 relative ${
          isListening
            ? 'bg-red-500 text-white border-red-300 ring-4 ring-red-400/30'
            : 'bg-saudi-600 hover:bg-saudi-700 text-white border-gold-light/40'
        }`}
        title={isListening ? 'إيقاف الاستماع' : 'تحدث مع رِواء'}
      >
        {isListening ? (
          <MicOff className="w-6 h-6 animate-pulse" />
        ) : (
          <Mic className="w-6 h-6" />
        )}

        {/* Pulsing ring for aesthetic badge */}
        {!isListening && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold-light border-2 border-white rounded-full" />
        )}
      </motion.button>

    </div>
  );
};
