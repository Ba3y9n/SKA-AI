import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus } from 'lucide-react';

export const CinematicHero: React.FC = () => {
  const [heroImage, setHeroImage] = useState<string | null>(null);

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
    <section className="relative w-full h-screen overflow-hidden bg-saudi-100">
      
      {/* Background Image (If Uploaded) */}
      {heroImage && (
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        >
          <img 
            src={heroImage} 
            alt="Hero" 
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      )}

      {/* Subtle Gold Geometric Pattern */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #C6A15B 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Image Upload Button (Floating) */}
      <div className="absolute top-24 left-6 z-50">
        <label className="flex items-center gap-2 px-4 py-2 bg-saudi-700/80 hover:bg-saudi-600 backdrop-blur-md border border-gold/30 rounded-full cursor-pointer transition-all text-saudi-50 shadow-lg text-sm font-bold group">
          <ImagePlus className="w-4 h-4 text-gold-light" />
          <span className="hidden group-hover:inline">تغيير الخلفية</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="hidden" 
          />
        </label>
      </div>

      {/* Center Logo */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <motion.img
          src="/logo.png"
          alt="الشعار الرسمي"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
          className="w-64 md:w-96 lg:w-[32rem] object-contain drop-shadow-2xl"
        />
      </div>

      {/* Discover Section */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-20 z-20 bg-gradient-to-t from-saudi-100 via-saudi-100/80 to-transparent pt-40">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer group flex flex-col items-center"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-saudi-700 mb-2 tracking-tight drop-shadow-sm transition-transform duration-500 group-hover:-translate-y-2 relative">
            اكتشف الحكاية
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-gold group-hover:w-full transition-all duration-500 rounded-full" />
          </h1>
          <div className="w-12 h-12 rounded-full bg-gold text-saudi-700 flex items-center justify-center animate-bounce shadow-[0_0_15px_rgba(198,161,91,0.5)] mt-6 group-hover:bg-gold-light transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </div>

    </section>
  );
};
