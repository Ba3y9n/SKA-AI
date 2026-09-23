import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, Trash2 } from 'lucide-react';

interface UserImage {
  id: string;
  dataUrl: string;
}

export const UserGallery: React.FC = () => {
  const [images, setImages] = useState<UserImage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('user_gallery_images');
    if (saved) {
      try {
        setImages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load gallery images');
      }
    }
  }, []);

  const saveImages = (newImages: UserImage[]) => {
    setImages(newImages);
    try {
      localStorage.setItem('user_gallery_images', JSON.stringify(newImages));
    } catch (e) {
      alert('عذراً، مساحة التخزين ممتلئة. لا يمكن إضافة المزيد من الصور ذات الحجم الكبير.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Process multiple files
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newImage: UserImage = {
          id: 'img_' + Date.now() + Math.random().toString(36).substr(2, 9),
          dataUrl: base64String
        };
        setImages(prev => {
          const updated = [newImage, ...prev];
          // Try to save, if it fails due to quota, we catch it inside saveImages
          try {
            localStorage.setItem('user_gallery_images', JSON.stringify(updated));
            return updated;
          } catch (err) {
            alert('حجم الصور كبير جداً على الذاكرة المؤقتة للمتصفح. حاول استخدام صور بحجم أصغر.');
            return prev; // Revert if full
          }
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (id: string) => {
    const updated = images.filter(img => img.id !== id);
    saveImages(updated);
  };

  return (
    <section className="relative w-full py-32 bg-white overflow-hidden z-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header & Upload Button */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 text-center md:text-right">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-[#064C3B] mb-2">عدسة الوطن</h2>
            <p className="text-xl text-gray-500 font-medium">شاركنا لحظاتك وصورك لليوم الوطني</p>
          </div>
          
          <label className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#008F68] text-white font-bold text-lg cursor-pointer hover:bg-[#064C3B] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            <ImagePlus className="w-5 h-5" />
            <span>أضف صورك</span>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleImageUpload} 
              className="hidden" 
            />
          </label>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {images.map(img => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={img.id}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-gray-50 border border-gray-100"
              >
                <img 
                  src={img.dataUrl} 
                  alt="مشاركة المستخدم" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay & Delete Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all shadow-lg"
                    title="حذف الصورة"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {images.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
              <ImagePlus className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-xl font-bold text-gray-500">لا توجد صور مضافة بعد</p>
              <p className="text-sm mt-2">كن أول من يشارك صوره هنا.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
