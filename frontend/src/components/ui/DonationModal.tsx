import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, X, Heart } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModalInner: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Lock background scroll while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-slate-800/80 hover:bg-slate-700 p-2 rounded-full text-white/70 hover:text-white transition-all border border-yellow-400/30 hover:border-yellow-400/60"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-yellow-400/15 border border-yellow-400/40 rounded-xl">
            <Heart size={20} className="text-yellow-400" />
          </div>
          <h2 className="text-xl font-black text-white">Support the Project</h2>
        </div>

        {/* Body */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          LogbookWrapped is a labor of love built by a fellow pilot and it's 100% free with no ads.
          If you enjoyed the app, consider{' '}
          <strong className="text-white">fueling the mission.</strong> Your support goes directly
          toward hosting costs, keeping this tool{' '}
          <strong className="text-white">airborne and ad-free</strong> for everyone.
        </p>

        {/* Donation Buttons */}
        <div className="flex flex-col gap-3">
          <a
            href="https://buymeacoffee.com/brianconway"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => window.umami?.track('Donation Clicked', { platform: 'bmc' })}
            className="w-full bg-[#FFDD00] hover:bg-[#FFEA4D] text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-yellow-500/20 text-sm"
          >
            <Coffee size={18} />
            Buy Me a Coffee (or 100LL)
          </a>

          <a
            href="https://paypal.me/brconway"
            target="_blank"
            rel="noreferrer"
            onClick={() => window.umami?.track('Donation Clicked', { platform: 'paypal' })}
            className="w-full bg-[#00457C] hover:bg-[#005a9e] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg text-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.98 5.04-4.345 6.788-8.637 6.788h-2.19c-.522 0-.966.382-1.048.9l-1.12 7.105c-.062.395.244.75.645.75h3.63c.43 0 .798-.31.865-.736l.732-4.646c.067-.426.435-.736.865-.736h.813c3.812 0 6.845-1.556 7.685-5.88.23-1.182.21-2.22-.057-3.088l-.535-.17z" />
            </svg>
            Donate via PayPal
          </a>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white/70 hover:text-white transition-all"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const DonationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && <DonationModalInner onClose={onClose} />}
    </AnimatePresence>
  );
};
