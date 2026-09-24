import React from 'react';
import { motion } from 'framer-motion';

export const NationalVisualSection: React.FC = () => {
  return (
    <section className="relative w-full py-24 bg-white overflow-hidden z-20 border-t border-gray-100" id="national-visual">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Text & Identity Context */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#006C4F] text-xs sm:text-sm font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#006C4F]" />
              <span>الهوية الوطنية 96 • عزّنا بطبعنا</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#004B37] leading-tight mb-4 tracking-tight">
              عزّنا برؤيتنا، وشجاعتنا، وهمتنا،<br />
              وأصالتنا، وكرمنا، وجودنا.
            </h2>

            <div className="w-20 h-1.5 bg-[#006C4F] mb-6 rounded-full" />

            <p className="text-base sm:text-xl text-gray-700 font-bold leading-relaxed mb-6">
              96 عاماً من المجد والنماء والشموخ.<br />
              <span className="text-[#006C4F]">دمت يا وطني عزيزاً شامخاً،</span><br />
              ودام عزك بطبعك الأصيل الذي لا يتغير!
            </p>

            <div className="pt-6 border-t border-gray-100 flex items-center gap-8 text-right">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#004B37]">96 عاماً</p>
                <p className="text-xs sm:text-sm font-bold text-gray-500">من المجد والتاريخ</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#006C4F]">رؤية 2030</p>
                <p className="text-xs sm:text-sm font-bold text-gray-500">بأيدي بنات وأبناء الوطن</p>
              </div>
            </div>
          </motion.div>

          {/* National Visual Image Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 w-full flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-emerald-50">
              <img
                src="/identity-logo.png"
                alt="شعار الهوية الوطنية 96 - عزنا بطبعنا"
                className="w-full h-auto object-contain p-6 sm:p-10 hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
