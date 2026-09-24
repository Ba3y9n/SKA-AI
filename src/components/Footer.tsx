import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Sparkles, ChevronUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative w-full bg-[#001a0c] text-saudi-50 pt-16 pb-8 overflow-hidden border-t border-[#003318]">
      
      {/* Interactive moving sparkle / glow background */}
      <motion.div 
        animate={{ 
          x: [-100, 100, -100],
          y: [-50, 50, -50],
          opacity: [0.1, 0.3, 0.1],
        }} 
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold rounded-[100%] blur-[120px] pointer-events-none"
      />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

      <div className="relative z-20 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Back to Top Floating Button (Top Center) */}
        <motion.button
          whileHover={{ scale: 1.1, y: -3, boxShadow: "0 0 20px rgba(201,162,39,0.4)" }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full bg-[#002b15] border border-gold/30 flex items-center justify-center text-gold shadow-lg transition-all mb-8"
          title="العودة للأعلى"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm md:text-base font-bold text-gray-300 mb-12">
          {['الرئيسية', 'المعرض الرقمي', 'سجل الإنجازات', 'لوحة الطموحات'].map((link) => (
            <motion.span 
              key={link}
              whileHover={{ y: -3, color: '#C9A227' }}
              className="cursor-pointer transition-colors"
            >
              {link}
            </motion.span>
          ))}
        </div>

        {/* Developer Icon Badge (Centered) */}
        <div className="flex justify-center mb-12">
          <motion.a 
            href="https://www.linkedin.com/in/bayan-almutairi-93a872333?utm_source=share_via&utm_content=profile&utm_medium=member_ios" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(201,162,39,0.3)" }}
            className="group relative flex items-center gap-3 bg-[#002411] px-8 py-4 rounded-full border border-gold/30 cursor-pointer overflow-hidden"
          >
            {/* Shimmer effect inside the button */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-45deg]"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            />
            
            <div className="w-10 h-10 rounded-full bg-[#00150a] border border-gold/50 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-gold group-hover:text-white transition-colors" />
            </div>
            
            <div className="text-right">
              <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">تطوير وبرمجة</span>
              <span className="block text-sm md:text-base font-bold text-gold-light group-hover:text-gold transition-colors">
                بيان المطيري
              </span>
            </div>
          </motion.a>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#004a24] to-transparent mb-8" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full text-xs md:text-sm font-medium text-gray-500 gap-4">
          <p className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-saudi-400" />
            مبادرة كلية الأعمال والاقتصاد - جامعة القصيم
          </p>
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة.</p>
        </div>

      </div>
    </footer>
  );
};
