import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const NationalCardSection: React.FC = () => {
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const savedImage = localStorage.getItem('national_card_custom_image');
    if (savedImage) {
      setCustomImage(savedImage);
    }
  }, []);

  const submitToGallery = () => {
    setIsSubmitting(true);
    // Simulate an API call to submit the image for review
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCustomImage(base64String);
        localStorage.setItem('national_card_custom_image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

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

          {/* Large Visual Showcase Column - Upload Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-6 w-full flex flex-col items-center justify-center min-h-[400px]"
          >
            {customImage ? (
              <div className="relative w-full group flex flex-col items-center gap-4">
                <img 
                  src={customImage} 
                  alt="مشاركة المستخدم" 
                  className="w-full h-auto max-h-[700px] object-contain rounded-2xl"
                />
                
                {/* Image Actions */}
                <div className="flex flex-wrap justify-center gap-3 w-full">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors text-saudi-700 text-sm font-bold shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>استبدال</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  
                  <button onClick={() => submitToGallery()} disabled={isSubmitting} className="inline-flex items-center gap-2 px-4 py-2 bg-saudi-600 border border-saudi-600 rounded-xl cursor-pointer hover:bg-saudi-700 transition-colors text-white text-sm font-bold shadow-sm disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال للمراجعة'}</span>
                  </button>

                  <button onClick={() => { setCustomImage(null); localStorage.removeItem('national_card_custom_image'); }} className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl cursor-pointer hover:bg-red-100 transition-colors text-red-600 text-sm font-bold shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    <span>حذف</span>
                  </button>
                </div>
                {submitSuccess && (
                  <p className="text-sm font-bold text-saudi-600 mt-2 bg-saudi-50 px-4 py-2 rounded-lg">تم إرسال صورتك للمراجعة بنجاح!</p>
                )}
              </div>
            ) : (
              <label className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-saudi-600 hover:bg-saudi-700 text-white font-black text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>أضف صورتك</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </label>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
