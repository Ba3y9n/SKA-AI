import React, { useState } from 'react';
import { AmbitionCard } from '../types/ambition';
import {
  Sparkles,
  PlusCircle,
  GraduationCap,
  Leaf,
  Cpu,
  HeartPulse,
  Building,
  Rocket,
  Shield,
  Tag,
} from 'lucide-react';

interface FutureVisionBoardProps {
  ambitions: AmbitionCard[];
  onOpenAddModal: () => void;
}

export const FutureVisionBoard: React.FC<FutureVisionBoardProps> = ({
  ambitions,
  onOpenAddModal,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(ambitions.map((a) => a.category)))];

  const filtered =
    selectedFilter === 'all'
      ? ambitions
      : ambitions.filter((a) => a.category === selectedFilter);

  const getCardIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-emerald-300" />;
      case 'Leaf':
        return <Leaf className="w-5 h-5 text-emerald-300" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-emerald-300" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-emerald-300" />;
      case 'Building':
        return <Building className="w-5 h-5 text-emerald-300" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-emerald-300" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-emerald-300" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-300" />;
    }
  };

  return (
    <section className="w-full mt-12 py-10 px-4 sm:px-6 rounded-3xl bg-gradient-to-b from-[#09170f] via-[#060f0a] to-[#040906] border border-emerald-900/60 shadow-2xl relative overflow-hidden">
      
      {/* Background Subtle Geometric Pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-emerald-900/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>تجربة تفاعلية لليوم الوطني 96</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            صوتنا يصنع المستقبل 🇸🇦
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            طموحات وأفكار شباب وشابات الوطن ملخصة بالذكاء الاصطناعي (Gemini 3.7 Flash)
          </p>
        </div>

        {/* Add Ambition CTA */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg shadow-emerald-950/50 transition transform hover:scale-105 active:scale-95 border border-emerald-400/40"
        >
          <PlusCircle className="w-4 h-4" />
          <span>أضف طموحك للوطن</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <Tag className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedFilter === cat
                  ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-900/30'
                  : 'bg-emerald-950/40 text-gray-400 hover:text-gray-200 border border-emerald-900/40'
              }`}
            >
              {cat === 'all' ? 'جميع الطموحات' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Ambition Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((ambition) => (
          <div
            key={ambition.id}
            className="group relative rounded-2xl bg-gradient-to-br from-[#0e2417]/80 to-[#07140c]/90 border border-emerald-800/40 hover:border-emerald-500/60 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/50"
          >
            <div>
              {/* Header: Icon & Category */}
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-600/30">
                  {getCardIcon(ambition.iconName)}
                </div>
                <div className="flex items-center gap-1.5">
                  {ambition.isDemo && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800/80 text-gray-400 border border-gray-700/50">
                      Demo Data
                    </span>
                  )}
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700/40">
                    {ambition.category}
                  </span>
                </div>
              </div>

              {/* Highlight Phrase */}
              <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                {ambition.highlightPhrase}
              </h4>

              {/* Full Idea */}
              <p className="text-xs text-gray-300/80 mt-2 line-clamp-3 leading-relaxed font-light">
                "{ambition.fullIdea}"
              </p>
            </div>

            {/* Footer / Stamp */}
            <div className="mt-4 pt-3 border-t border-emerald-900/30 flex items-center justify-between text-[10px] text-emerald-400/60">
              <span>{ambition.dateStr || 'اليوم الوطني 96'}</span>
              <span className="font-mono">🇸🇦 Vision 2030</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
