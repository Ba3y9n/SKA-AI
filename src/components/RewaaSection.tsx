import React from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

interface RewaaSectionProps {
  onTalk: () => void;
  isListening: boolean;
}

export const RewaaSection: React.FC<RewaaSectionProps> = ({ onTalk, isListening }) => {
  return (
    <section className="relative w-full min-h-screen py-24 bg-saudi-100 flex flex-col items-center justify-center overflow-hidden z-20">
      
      {/* Subtle Green Light Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[#DDF5EA]/50 rounded-full blur-[100px] pointer-events-none" />

      {/* Rewaa Character Image */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mx-auto flex justify-center mb-12"
      >
        <img 
          src="/rewaa_avatar_real_transparent.png" 
          alt="رِواء" 
          className="w-72 md:w-[450px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-700"
        />
      </motion.div>

      {/* Text Content Below Character */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 text-center px-6 max-w-2xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-black text-saudi-700 mb-4">
          أهلًا بك، أنا رِواء.
        </h2>
        <p className="text-xl md:text-2xl text-saudi-600 font-bold mb-6">
          صوت الجيل السعودي الرقمي في اليوم الوطني 96.
        </p>
        <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-12">
          لست مجرد مساعد افتراضي،<br />
          بل راوية رقمية لحكاية وطن، وأصوات جيل يصنع مستقبله.
        </p>

        {/* Action Button */}
        <button 
          onClick={onTalk}
          className={`group relative inline-flex items-center gap-4 px-10 py-5 rounded-full font-black text-lg transition-all duration-300 ${
            isListening 
              ? 'bg-red-50 text-red-600 border border-red-200 shadow-[0_0_30px_rgba(239,68,68,0.3)] scale-105' 
              : 'bg-saudi-600 text-white hover:bg-saudi-700 shadow-lg hover:shadow-xl hover:-translate-y-1'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-saudi-600'}`}>
            <Mic className="w-6 h-6" />
          </div>
          <span className="tracking-wide">
            {isListening ? 'أستمع إليك الآن...' : 'تحدث مع رِواء'}
          </span>
        </button>
      </motion.div>

    </section>
  );
};
