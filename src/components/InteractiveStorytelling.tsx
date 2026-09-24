import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquareHeart, Target, ArrowDown, CheckCircle2 } from 'lucide-react';

export const InteractiveStorytelling: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: '01',
      title: 'المعنى',
      heading: 'من طموح طالبة... يبدأ أثر.',
      text: 'رِواء مساحة رقمية تحتفي بأصوات طالبات كلية الأعمال والاقتصاد، وتمنح كل طالبة فرصة تعبّر عن فكرتها وطموحها تجاه مستقبلها ومستقبل وطنها.',
      icon: Sparkles,
      tag: '01 المعنى'
    },
    {
      id: '02',
      title: 'الرسالة',
      heading: 'نُسمع صوتها، ونحتفي بفكرتها، ونصنع مساحة لأثرها.',
      text: 'أن نُسمع صوت طالبات كلية الأعمال والاقتصاد، ونحتفي بأفكارهن وطموحاتهن، ونمنحهن مساحة تفاعلية تجمع بين التقنية والابتكار وصناعة الأثر.',
      icon: MessageSquareHeart,
      tag: '02 الرسالة'
    },
    {
      id: '03',
      title: 'الهدف',
      heading: 'أن نجمع طموحاتهن في صوت واحد يرسم ملامح المستقبل.',
      text: 'بناء مساحة رقمية تجمع طموحات وإنجازات طالبات كلية الأعمال والاقتصاد، وتعكس جيلًا يصنع مستقبل الأعمال في المملكة.',
      icon: Target,
      tag: '03 الهدف'
    }
  ];

  const scrollToAmbitions = () => {
    const el = document.getElementById('ambitions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full py-28 bg-[#FAFBFB] text-[#004B37] overflow-hidden z-20 border-t border-gray-100" id="storytelling">
      
      {/* Background Subtle Wave Accents */}
      <div className="absolute -top-32 right-1/2 translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Story Flow Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#006C4F] text-xs sm:text-sm font-bold mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#006C4F] animate-pulse" />
            <span>مسار حكاية رِواء</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#004B37] leading-tight mb-3 tracking-tight">
            قصةٌ تُروى... وأثرٌ يتجدد
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            رحلة رقمية متصلة من فكرة كل طالبة إلى صناعة مستقبل الأعمال لوطننا.
          </p>
        </div>

        {/* Interactive Stepper Navigation (Desktop & Tablet) */}
        <div className="hidden md:flex items-center justify-center gap-4 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-[#004B37] text-white shadow-lg scale-105'
                      : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-[#006C4F]'}`} />
                  <span>{step.tag}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className="w-10 h-0.5 bg-emerald-200" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Narrative Cards Connected via Vertical Flow */}
        <div className="space-y-12 relative">
          
          {/* Subtle Vertical Connector Line for mobile & desktop */}
          <div className="absolute right-8 md:right-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-300 -translate-x-1/2 -z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;

            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`relative z-10 bg-white rounded-[2rem] p-7 sm:p-10 border transition-all duration-500 cursor-pointer text-right ${
                  isSelected 
                    ? 'border-[#006C4F] shadow-2xl ring-2 ring-emerald-500/20' 
                    : 'border-gray-100 shadow-md hover:shadow-xl hover:border-emerald-200'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-[#006C4F] text-xs font-black mb-3 border border-emerald-100">
                      <span>{step.tag}</span>
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl font-black text-[#004B37] leading-snug mb-3">
                      {step.heading}
                    </h3>

                    <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
                      {step.text}
                    </p>
                  </div>

                  {/* Visual Node & Number */}
                  <div className="shrink-0 flex items-center gap-4 self-end md:self-auto">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-[#004B37] text-white shadow-md' 
                        : 'bg-emerald-50 text-[#006C4F]'
                    }`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-4xl font-black text-gray-200 select-none">
                      {step.id}
                    </span>
                  </div>

                </div>
              </motion.div>
            );
          })}

        </div>

        {/* Narrative Path Outro pointing directly to Ambitions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center flex flex-col items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-[#006C4F] flex items-center justify-center mb-4 animate-bounce">
            <ArrowDown className="w-5 h-5" />
          </div>
          <button
            onClick={scrollToAmbitions}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#004B37] hover:bg-[#003828] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all"
          >
            <span>انتقلي إلى صوتنا يصنع المستقبل</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
