import React from 'react';
import { motion } from 'framer-motion';
import { ParticleEmblemCanvas } from './ParticleEmblemCanvas';
import { Sparkles } from 'lucide-react';

export const NationalCardSection: React.FC = () => {
  return (
    <section id="identity-section" className="relative w-full py-28 bg-white overflow-hidden z-20">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#E9F8F1]/80 via-[#F7FCF9]/60 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Interactive Emblem Showcase with Particles and Orbit System */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-6 w-full flex items-center justify-center min-h-[420px] sm:min-h-[480px] relative order-2 lg:order-1"
          >
            {/* Particle Canvas Behind Emblem */}
            <ParticleEmblemCanvas />

            {/* Emblem / Logo with Soft Floating Animation and Glow */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 p-8 sm:p-12 flex flex-col items-center justify-center"
            >
              <div className="relative group cursor-pointer">
                {/* Subtle outer gold ring */}
                <div className="absolute -inset-4 rounded-full border border-gold/30 opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none" />
                
                <img 
                  src="/identity-logo.png" 
                  alt="عزنا بطبعنا" 
                  className="w-full max-w-[320px] sm:max-w-[380px] object-contain drop-shadow-[0_15px_35px_rgba(0,108,53,0.12)] group-hover:scale-105 transition-transform duration-700 select-none"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Text Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="lg:col-span-6 text-right order-1 lg:order-2"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saudi-50 border border-saudi-200/60 text-saudi-700 text-sm font-bold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-gold-dark" />
              <span>اليوم الوطني السعودي 96</span>
            </div>

            {/* Title with Blur Reveal Animation */}
            <motion.h2 
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-saudi-700 leading-tight mb-3 tracking-tight"
            >
              عزنا بطبعنا
            </motion.h2>

            {/* Subtitle */}
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl font-bold text-gold-dark mb-4"
            >
              هوية تُروى... وحكاية تستمر
            </motion.h3>
            
            {/* Animated Moving Golden Line Underneath */}
            <div className="relative w-48 h-1.5 bg-gold/20 rounded-full overflow-hidden mb-6">
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-gold to-transparent"
              />
            </div>

            <p className="text-lg sm:text-xl text-saudi-600 font-medium leading-relaxed max-w-xl mb-8">
              عزّنا برؤيتنا، وشجاعتنا، وهمتنا، وأصالتنا، وكرمنا، وجودنا.. 
              96 عاماً من المجد والتاريخ والشموخ، ودام عزك يا وطن بطبعك الأصيل الذي لا يتغير.
            </p>

            {/* Stat highlights */}
            <div className="pt-6 border-t border-saudi-200/50 flex flex-wrap items-center gap-8">
              <div>
                <p className="text-3xl font-black text-saudi-700">96 عاماً</p>
                <p className="text-xs sm:text-sm font-bold text-saudi-600/80">من المجد والنماء</p>
              </div>

              <div className="w-px h-10 bg-gold/30" />

              <div>
                <p className="text-3xl font-black text-gold-dark">رؤية 2030</p>
                <p className="text-xs sm:text-sm font-bold text-saudi-600/80">بسواعد جيل المستقبل</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
