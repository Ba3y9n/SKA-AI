import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title = 'تأكيد الحذف',
  message = 'هل تريد حذف هذا العنصر؟',
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 text-center relative overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onCancel}
              className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Danger Icon */}
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 border border-red-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Trash2 className="w-8 h-8" />
            </div>

            {/* Title & Message */}
            <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
            <p className="text-sm font-bold text-gray-500 mb-6 leading-relaxed">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>حذف</span>
                )}
              </button>

              <button
                onClick={onCancel}
                disabled={isDeleting}
                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
