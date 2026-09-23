import React from 'react';
import { motion } from 'framer-motion';

export const NationalCardSection: React.FC = () => {
  return (
    <section className="relative w-full py-28 bg-saudi-100 overflow-hidden z-20">
      
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-saudi-100/40 rounded-full blur-[120px] pointer-events-none" />

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
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-saudi-50 border border-saudi-200/60 text-saudi-700 text-sm font-bold mb-8">
              <span className="w-2 h-2 rounded-full bg-saudi-600" />
              اليوم الوطني السعودي 96
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-saudi-700 leading-tight mb-4 tracking-tight">
              عزّنا برؤيتنا، وشجاعتنا، وهمتنا،<br />
              وأصالتنا، وكرمنا، وجودنا..
            </h2>
            
            <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent mb-6 rounded-full" />

            <p className="text-lg md:text-2xl text-saudi-600 font-bold leading-relaxed max-w-xl mb-6">
              96 عاماً من المجد والتاريخ والشموخ.<br />
              <span className="text-gold-dark">دمت يا وطني عزيزاً شامخاً،</span><br />
              ودام عزك بطبعك الأصيل الذي لا يتغير!
            </p>

            <div className="mt-10 pt-10 border-t border-saudi-200/50 flex flex-col sm:flex-row items-center gap-8 group">
              
              <div className="text-center sm:text-right transition-transform duration-300 group-hover:-translate-x-2">
                <p className="text-3xl font-black text-saudi-700 mb-1">96 عاماً</p>
                <p className="text-sm font-bold text-saudi-600/80">من المجد والنماء</p>
              </div>

              {/* Interactive Golden Divider */}
              <div className="relative flex items-center justify-center mx-4 group/line">
                {/* Core Line */}
                <div className="w-0.5 h-16 bg-gradient-to-b from-transparent via-gold-dark to-transparent" />
                
                {/* Glow that appears on hover */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-16 bg-gold/30 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              <div className="text-center sm:text-right transition-transform duration-300 group-hover:translate-x-2">
                <p className="text-3xl font-black text-gold-dark mb-1">طموح 2030</p>
                <p className="text-sm font-bold text-saudi-600/80">بأيدي أبناء وبنات الوطن</p>
              </div>

            </div>
          </motion.div>

          {/* Large Visual Showcase Column - Logo Presentation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-6 w-full h-full flex items-center justify-center"
          >
            <div className="relative w-full aspect-square max-w-[500px] rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(198,161,91,0.2)] border border-gold/40 group flex items-center justify-center">
              
              {/* White to Gold Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gold/30 group-hover:to-gold/50 transition-colors duration-700" />
              
              {/* Optional Carpet as a very faint watermark */}
              <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700" style={{ backgroundImage: "url('/carpet.webp')", backgroundSize: "cover", backgroundPosition: "center" }} />
              
              {/* Floating Identity Logo */}
              <img 
                src="/identity-logo.webp" 
                alt="عزنا بطبعنا" 
                className="relative z-10 w-3/4 max-w-[300px] object-contain group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-2xl"
              />
              
              {/* Interactive Glow */}
              <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
