import React from 'react';
import { motion } from 'framer-motion';
import { RewaaLogo } from './RewaaLogo';

export const StorySections: React.FC = () => {
  return (
    <section className="relative w-full py-24 bg-white overflow-hidden z-10 border-t border-emerald-50">
      
      {/* 1. Meaning Section */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-2xl sm:text-4xl font-bold text-gray-800"
        >
          <span className="text-emerald-700">صوت</span>
          <motion.div 
            className="w-1 h-12 sm:w-16 sm:h-px bg-emerald-300"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          <span className="text-emerald-600">فكرة</span>
          <motion.div 
            className="w-1 h-12 sm:w-16 sm:h-px bg-emerald-300"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
          <span className="text-emerald-500">مستقبل</span>
        </motion.div>
      </div>

      {/* 2. Message Section */}
      <div className="max-w-3xl mx-auto px-6 text-center mb-32 relative">
        <motion.div 
          className="absolute left-1/2 -top-16 bottom-0 w-px bg-emerald-100 -translate-x-1/2 -z-10"
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          transition={{ duration: 1.5 }}
        />
        <motion.h3 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="text-xl sm:text-3xl font-medium leading-loose text-gray-700 bg-white py-8"
        >
          رِواء ليست مجرد مساعد افتراضي، بل هي تجسيد رقمي لطموحات وأصوات بنات الكلية، تعكس فخرنا بإنجازاتنا ورؤيتنا المستقبلية لوطننا.
        </motion.h3>
      </div>

      {/* 3. Goals Orbit System */}
      <div className="max-w-5xl mx-auto px-4 relative h-[600px] flex items-center justify-center">
        {/* Center */}
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="relative z-20 flex flex-col items-center bg-white p-6 rounded-full shadow-2xl shadow-emerald-100 border border-emerald-50"
        >
          <RewaaLogo className="w-16 h-16 text-emerald-700" />
          <span className="mt-2 text-sm font-bold text-gray-800 tracking-wider">رِواء</span>
        </motion.div>

        {/* Orbit Path */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border border-dashed border-emerald-200 animate-[spin_40s_linear_infinite]"
          />
        </div>

        {/* Orbiting Goals */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Goal 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute -left-4 sm:left-10 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-emerald-50 text-center w-40 sm:w-48 cursor-pointer hover:scale-110 transition-transform"
          >
            <span className="block text-emerald-600 font-bold mb-1">التمكين</span>
            <span className="text-xs text-gray-500">إبراز دور المرأة السعودية</span>
          </motion.div>

          {/* Goal 2 */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -right-4 sm:right-10 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-emerald-50 text-center w-40 sm:w-48 cursor-pointer hover:scale-110 transition-transform"
          >
            <span className="block text-emerald-600 font-bold mb-1">الابتكار</span>
            <span className="text-xs text-gray-500">توظيف الذكاء الاصطناعي</span>
          </motion.div>

          {/* Goal 3 */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute top-10 sm:top-20 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-emerald-50 text-center w-40 sm:w-48 cursor-pointer hover:scale-110 transition-transform"
          >
            <span className="block text-emerald-600 font-bold mb-1">الإلهام</span>
            <span className="text-xs text-gray-500">توثيق الإنجازات</span>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
