import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative w-full bg-[#004A24] text-saudi-50 pt-24 pb-12 overflow-hidden mt-10">
      
      {/* Animated Wave Top Border */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 text-[#004A24]" style={{ transform: 'translateY(-99%)' }}>
        <svg className="relative block w-full h-[50px] md:h-[100px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.78,197.83,109.91c70.3-10.37,131.7-39.81,195.42-61.91Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* Massive Background Text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden select-none">
         <span className="text-[12rem] md:text-[25rem] font-black text-white whitespace-nowrap">رِواء</span>
      </div>

      {/* Glowing Orbs Background Effect */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#006C35] rounded-full blur-[150px] pointer-events-none"
      />

      <div className="relative z-20 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Identity with Hover Effect */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={scrollToTop}
          >
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="شعار المنصة" 
                className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:rotate-[15deg]" 
              />
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-black tracking-widest mb-1 text-transparent bg-clip-text bg-gradient-to-l from-gold-light to-gold drop-shadow-md">رِواء</h3>
              <p className="text-saudi-200 text-sm md:text-base font-bold tracking-wider opacity-90 group-hover:opacity-100 transition-opacity">
                صوت الجيل السعودي الرقمي
              </p>
            </div>
          </motion.div>

          {/* Links with Fun Underline Hover Effect */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-base font-bold text-gray-300">
            {['عن رِواء', 'رؤيتنا', 'الخصوصية', 'شروط الاستخدام'].map((link) => (
              <motion.span 
                key={link}
                whileHover={{ y: -5, color: '#C9A227' }}
                className="cursor-pointer relative group transition-colors"
              >
                {link}
                <span className="absolute -bottom-2 left-1/2 w-1 h-1 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1/2 group-hover:w-full group-hover:h-[2px]" />
              </motion.span>
            ))}
          </div>

        </div>

        {/* Back to Top Floating Button */}
        <div className="flex justify-center mt-16 mb-8 relative z-30">
          <motion.button
            whileHover={{ scale: 1.1, y: -5, boxShadow: "0 0 25px rgba(201,162,39,0.6)" }}
            whileTap={{ scale: 0.9 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
            onClick={scrollToTop}
            className="w-14 h-14 rounded-full bg-saudi-600 border border-gold/40 flex items-center justify-center text-gold shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all"
            title="العودة للأعلى"
          >
            <ChevronUp className="w-8 h-8" />
          </motion.button>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-saudi-600 to-transparent my-8" />

        {/* Copyright & Dev Credit */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs md:text-sm font-medium space-y-6 md:space-y-0 text-gray-400">
          <p>© {new Date().getFullYear()} رِواء AI. صُنع بشغف لجامعة القصيم.</p>
          
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <motion.p 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 text-saudi-100 bg-[#00381B] px-5 py-2.5 rounded-full border border-saudi-600/50 shadow-inner"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              مبادرة كلية الأعمال والاقتصاد
            </motion.p>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 mt-2 md:mt-0 text-saudi-50 bg-[#002B15] px-5 py-2.5 rounded-full border border-gold/30 hover:border-gold/60 transition-colors group shadow-[0_0_10px_rgba(201,162,39,0.1)] hover:shadow-[0_0_20px_rgba(201,162,39,0.3)]"
            >
              <span className="text-gray-300">فريق التطوير:</span>
              <a 
                href="https://www.linkedin.com/in/bayan-almutairi-93a872333?utm_source=share_via&utm_content=profile&utm_medium=member_ios" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold-light hover:text-gold font-bold flex items-center gap-1.5 transition-colors"
              >
                بيان المطيري
                <Heart className="w-4 h-4 text-red-500 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};
