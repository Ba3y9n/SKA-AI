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
        return <Sparkles className="w-3.5 h-3.5 text-saudi-700 shrink-0" />;
      case 'MapPin':
        return <MapPin className="w-3.5 h-3.5 text-saudi-700 shrink-0" />;
      case 'Landmark':
        return <Landmark className="w-3.5 h-3.5 text-saudi-700 shrink-0" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5 text-saudi-700 shrink-0" />;
      case 'HelpCircle':
        return <HelpCircle className="w-3.5 h-3.5 text-saudi-700 shrink-0" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5 text-saudi-700 shrink-0" />;
      default:
        return <MessageSquareQuote className="w-3.5 h-3.5 text-saudi-700 shrink-0" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Sparkles className="w-4 h-4 text-saudi-700" />
        <span className="text-xs font-bold text-gray-700">
          أسئلة مقترحة للحوار مع رِواء:
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q.id}
            onClick={() => onSelectQuestion(q.title)}
            disabled={disabled}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-2xl text-right text-xs sm:text-sm font-semibold bg-white hover:bg-saudi-50/60 border border-saudi-100 hover:border-gold-light text-gray-800 hover:text-saudi-900 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            {getIcon(q.icon)}
            <span className="truncate group-hover:text-emerald-800 transition-colors">
              {q.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
