import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<Props> = ({ isOpen, onClose }) => {
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Support the Project</h2>
              <button 
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full text-white transition-all shrink-0 ml-4"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body Container */}
            <div className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto pr-2 pb-24">
              <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl mb-8">
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  LogbookWrapped is built by a fellow pilot and is 100% free and open-source. 
                  If you enjoyed your logbook wrapped, consider chipping in! Your support directly covers 
                  <strong className="text-white"> API fees</strong>, <strong className="text-white">server hosting</strong>, and keeps this tool ad-free for everyone.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <a 
                  href="https://buymeacoffee.com/YOUR_BMC_LINK_HERE" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-[#FFDD00] hover:bg-[#FFEA4D] text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-lg"
                >
                  <Coffee size={24} className="text-black" />
                  Buy Me a Coffee (or 100LL)
                </a>
                
                <a 
                  href="https://paypal.me/YOUR_PAYPAL_LINK_HERE" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-[#00457C] hover:bg-[#005a9e] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-lg"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.98 5.04-4.345 6.788-8.637 6.788h-2.19c-.522 0-.966.382-1.048.9l-1.12 7.105c-.062.395.244.75.645.75h3.63c.43 0 .798-.31.865-.736l.732-4.646c.067-.426.435-.736.865-.736h.813c3.812 0 6.845-1.556 7.685-5.88.23-1.182.21-2.22-.057-3.088l-.535-.17z" />
                  </svg>
                  Donate via PayPal
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};