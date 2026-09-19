import React from 'react';
import { SuggestedQuestion } from '../types/chat';
import { SUGGESTED_QUESTIONS } from '../config/saudiKnowledge';
import { Sparkles, MapPin, Landmark, Cpu, HelpCircle, Zap, MessageSquareQuote } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelectQuestion: (text: string) => void;
  disabled?: boolean;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelectQuestion,
  disabled = false,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'MapPin':
        return <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'Landmark':
        return <Landmark className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'HelpCircle':
        return <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      default:
        return <MessageSquareQuote className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2.5 px-1">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-semibold text-gray-300">
          أسئلة مقترحة لبدء الحوار:
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q.id}
            onClick={() => onSelectQuestion(q.title)}
            disabled={disabled}
            className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-right text-xs sm:text-sm font-medium bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-800/40 hover:border-emerald-600/60 text-gray-200 hover:text-white transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
          >
            {getIcon(q.icon)}
            <span className="truncate group-hover:text-emerald-300 transition-colors">
              {q.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
