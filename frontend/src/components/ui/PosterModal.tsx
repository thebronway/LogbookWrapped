import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PosterModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] overflow-hidden flex flex-col touch-auto"
        >
          {/* Solid Immersive Background */}
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl z-[2]" />

          {/* Foreground Content */}
          <div className="relative z-[10] flex flex-col h-full w-full p-4 sm:p-8">
            
            {/* Header */}
            <div className="flex justify-between items-center w-full max-w-2xl mx-auto mb-6 sm:mb-8 mt-4 sm:mt-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Get Your Footprint on Canvas</h2>
              <button 
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full text-white transition-all shrink-0 ml-4"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body Container */}
            <div className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto pr-2 pb-24">
              <div className="w-full aspect-[2/3] bg-slate-900 rounded-2xl overflow-hidden mb-6 border border-slate-700 shadow-xl">
                 <img 
                    src="https://placehold.co/600x900/0f172a/3b82f6?text=Poster+Preview+Graphic" 
                    alt="Poster Preview" 
                    className="w-full h-full object-cover" 
                 />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/50 rounded-xl p-5 mb-8">
                <p className="text-amber-200 text-sm sm:text-base leading-relaxed">
                  <strong>Privacy Notice:</strong> Up until now, 100% of your logbook processing has remained securely on your device. 
                  By proceeding to order a physical print, <strong>your footprint map data and summary stats will be securely transmitted to a third-party server</strong> to fulfill your order. Your raw logbook entries are never shared.
                </p>
              </div>

              <a 
                href="https://printful.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-900/20 text-lg"
              >
                <Printer size={24} />
                Continue to Print Partner
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};