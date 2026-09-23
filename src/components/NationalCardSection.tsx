import React from 'react';
import { motion } from 'framer-motion';

export const NationalCardSection: React.FC = () => {
  return (
    <section className="relative w-full py-28 bg-[#F8FBF8] overflow-hidden z-20">
      
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="lg:col-span-6 text-right"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-[#006C4F] text-sm font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#008F68]" />
              اليوم الوطني السعودي 96
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#064C3B] leading-[1.25] mb-6 tracking-tight">
              عزّنا برؤيتنا،<br />
              وهمّتنا،<br />
              <span className="text-[#008F68]">وأصالتنا التي لا تتغير.</span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-xl">
              نحتفي برحلة وطن طموح، وبصمات طالبات ودكتورات كلية الأعمال والاقتصاد اللاتي يرسمن ملامح المستقبل بالعلم والريادة والابتكار.
            </p>

            <div className="mt-8 pt-8 border-t border-gray-200/70 flex items-center gap-6">
              <div>
                <p className="text-2xl font-black text-[#064C3B]">96 عاماً</p>
                <p className="text-sm font-bold text-gray-500">من المجد والنماء</p>
              </div>
              <div className="w-[1px] h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-black text-[#008F68]">طموح 2030</p>
                <p className="text-sm font-bold text-gray-500">بأيدي أبناء وبنات الوطن</p>
              </div>
            </div>
          </motion.div>

          {/* Large Visual Showcase Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-6 w-full"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,108,79,0.12)] border border-emerald-100 group">
              <img 
                src="/media_1790129786646.jpg" 
                alt="الهوية الوطنية السعودية 96" 
                className="w-full h-auto max-h-[600px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#064C3B]/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
