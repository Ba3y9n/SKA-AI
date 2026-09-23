import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ScrollytellingSequence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // We make the container very tall (e.g., 500vh) to allow a long scroll journey.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // -------------------------------------------------------------
  // ANIMATION CHOREOGRAPHY
  // -------------------------------------------------------------

  // 0% -> 20%: Riwa Appears and slightly scales up
  const riwaOpacity = useTransform(scrollYProgress, [0, 0.05, 0.75, 0.85], [0, 1, 1, 0]);
  const riwaScale = useTransform(scrollYProgress, [0, 0.2, 0.4], [0.9, 1, 1.05]);
  
  // 20% -> 40%: Riwa moves to the left
  const riwaX = useTransform(scrollYProgress, [0.2, 0.4], ['0%', '-25%']);
  
  // 20% -> 40%: Background transforms
  const primaryBgOpacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  
  // 40%: Text enters from the right
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.55, 0.65], [0, 1, 1, 0]);
  const textX = useTransform(scrollYProgress, [0.3, 0.4], ['50%', '0%']);

  // 60%: Scene transforms into Heritage (التراث)
  const heritageOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.75, 0.85], [0, 1, 1, 0]);
  const heritageScale = useTransform(scrollYProgress, [0.5, 0.8], [1.1, 1]);

  // 80%: Heritage disappears. Students' achievements appear
  const achievementsOpacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 0]);
  const achievementsY = useTransform(scrollYProgress, [0.75, 0.85], ['20%', '0%']);

  // 100%: New character / Future appears
  const newCharacterOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const newCharacterScale = useTransform(scrollYProgress, [0.9, 1], [0.8, 1]);

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-[#0A1F16]">
      {/* Sticky Container that holds the visual scene */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Layer 1: Primary Background (0% - 25%) */}
        <motion.div 
          className="absolute inset-0 z-0 bg-[#0A1F16]"
          style={{ opacity: primaryBgOpacity }}
        >
          <img src="/national_hero.jpg" alt="National Hero" className="w-full h-full object-cover object-top opacity-60" />
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] bg-[size:32px_32px]"></div>
        </motion.div>

        {/* Layer 2: Heritage Transformation (60% - 85%) */}
        <motion.div 
          className="absolute inset-0 z-0 flex items-center justify-center bg-[#1A1A10]"
          style={{ opacity: heritageOpacity, scale: heritageScale }}
        >
          {/* A traditional Saudi Sadu / geometric pattern representation using CSS */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `repeating-linear-gradient(45deg, #d4af37 25%, transparent 25%, transparent 75%, #d4af37 75%, #d4af37), repeating-linear-gradient(45deg, #d4af37 25%, transparent 25%, transparent 75%, #d4af37 75%, #d4af37)`,
            backgroundPosition: `0 0, 20px 20px`,
            backgroundSize: `40px 40px`
          }}></div>
          <h2 className="text-4xl md:text-6xl font-black text-[#d4af37] tracking-widest drop-shadow-2xl">
            أصالتنا وتراثنا
          </h2>
        </motion.div>

        {/* Riwa Character (0% - 85%) */}
        <motion.div 
          className="absolute z-20 flex flex-col items-center justify-center h-full max-w-md"
          style={{ opacity: riwaOpacity, scale: riwaScale, x: riwaX }}
        >
          <img 
            src="/rewaa_avatar_real_transparent.png" 
            alt="رِواء" 
            className="w-64 h-64 md:w-96 md:h-96 object-contain filter drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          />
        </motion.div>

        {/* Text entering from right (40% - 65%) */}
        <motion.div 
          className="absolute right-4 md:right-32 z-30 max-w-md text-right px-6"
          style={{ opacity: textOpacity, x: textX }}
        >
          <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            صوتكِ يُسمع، <br/>
            <span className="text-emerald-400">وأثركِ يمتد</span>
          </h3>
          <p className="text-lg md:text-xl text-emerald-100/80 font-medium leading-relaxed">
            من هنا، من كلية الأعمال والاقتصاد، ننطلق برؤية طموحة تواكب المستقبل، ونكتب قصة نجاح جديدة كل يوم.
          </p>
        </motion.div>

        {/* Students' Achievements Appears (80% - 100%) */}
        <motion.div 
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-emerald-900 text-white px-6"
          style={{ opacity: achievementsOpacity, y: achievementsY }}
        >
          <h3 className="text-4xl md:text-6xl font-black mb-6 text-emerald-300">
            إنجازات الطالبات
          </h3>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
            <span className="px-6 py-3 bg-white/10 rounded-full font-bold border border-white/20">ابتكار</span>
            <span className="px-6 py-3 bg-white/10 rounded-full font-bold border border-white/20">قيادة</span>
            <span className="px-6 py-3 bg-white/10 rounded-full font-bold border border-white/20">مراكز متقدمة</span>
            <span className="px-6 py-3 bg-white/10 rounded-full font-bold border border-white/20">مشاريع تقنية</span>
          </div>
        </motion.div>

        {/* New Character / Future Appears (100%) */}
        <motion.div 
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white"
          style={{ opacity: newCharacterOpacity, scale: newCharacterScale }}
        >
          <div className="w-48 h-48 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mb-8 shadow-2xl">
             <span className="text-6xl font-black text-emerald-700">أنتِ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0B3D2E] mb-4">
            الشخصية القادمة
          </h2>
          <p className="text-xl text-gray-500 font-bold">
            رحلة الإنجاز مستمرة...
          </p>
        </motion.div>

      </div>
    </div>
  );
};
