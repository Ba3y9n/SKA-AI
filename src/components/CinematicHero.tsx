import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus } from 'lucide-react';

export const CinematicHero: React.FC = () => {
  const [heroImage, setHeroImage] = useState<string>('/national_hero.jpg');

  useEffect(() => {
    const savedImage = localStorage.getItem('custom_hero_image');
    if (savedImage) {
      setHeroImage(savedImage);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setHeroImage(base64String);
        localStorage.setItem('custom_hero_image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-white">
      
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={heroImage} 
          alt="Hero" 
          className="w-full h-full object-cover object-center"
        />
        {/* Very Subtle Overlay just to ensure text readability if needed */}
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Image Upload Button (Floating) */}
      <div className="absolute top-24 left-6 z-50">
        <label className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 rounded-full cursor-pointer transition-all text-white shadow-lg text-sm font-bold group">
          <ImagePlus className="w-4 h-4" />
          <span className="hidden group-hover:inline">تغيير الصورة الرئيسية</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="hidden" 
          />
        </label>
      </div>

      {/* Framed Identity Logo in Hero */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none mt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative inline-flex items-center justify-center px-10 py-6"
        >
          {/* Top/Bottom Borders */}
          <div className="absolute inset-x-0 top-0 h-px bg-gold/60" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gold/60" />
          
          {/* Side Patterns */}
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-8 bg-contain bg-no-repeat bg-left" style={{ backgroundImage: "url('/gold-border.png')" }} />
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-8 bg-contain bg-no-repeat bg-left rotate-180" style={{ backgroundImage: "url('/gold-border.png')" }} />
          
          <img src="/identity-logo.webp" alt="عزنا بطبعنا" className="h-32 md:h-48 object-contain drop-shadow-2xl" />
        </motion.div>
      </div>

      {/* Discover Section (Massive & Interactive at the bottom) */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-20 z-20 bg-gradient-to-t from-saudi-100 via-saudi-100/80 to-transparent pt-40">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer group flex flex-col items-center"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-saudi-700 mb-2 tracking-tight drop-shadow-sm transition-transform duration-500 group-hover:-translate-y-2">
            اكتشف الحكاية
          </h1>
          <div className="w-12 h-12 rounded-full bg-gold text-saudi-700 text-white flex items-center justify-center animate-bounce shadow-lg mt-4 group-hover:bg-gold-light transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </div>

    </section>
  );
};
