import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Coffee, Printer, Heart, X } from 'lucide-react';
import { CalculatedStats } from '../../core/types';
import { exportAsImage } from '../../utils/canvasExporter';

export const Page8_Summary: React.FC<{stats: CalculatedStats}> = ({ stats }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    await exportAsImage('export-card', 'My_Logbook_Wrapped');
    setIsExporting(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col h-full w-full p-6 bg-slate-950 text-white overflow-y-auto"
    >
      <h2 className="text-3xl font-black mt-8 mb-6 text-center text-white">Your Logbook, Wrapped.</h2>

      {/* THE EXPORTABLE CARD */}
      <div 
        id="export-card" 
        className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl mb-8 relative w-fit mx-auto min-w-[320px]"
      >
        <h3 className="text-2xl font-black mb-6 pr-32 text-blue-400">Your Stats</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-end gap-12 border-b border-slate-700/50 pb-2">
            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total Time</span>
            <span className="text-xl font-bold">{stats.totalHours} hrs</span>
          </div>
          <div className="flex justify-between items-end gap-12 border-b border-slate-700/50 pb-2">
            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Distance</span>
            <span className="text-xl font-bold">{stats.totalDistanceNm.toLocaleString()} NM</span>
          </div>
          <div className="flex justify-between items-end gap-12 border-b border-slate-700/50 pb-2">
            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Landings</span>
            <span className="text-xl font-bold">{stats.totalLandings}</span>
          </div>
          <div className="flex justify-between items-end gap-12 border-b border-slate-700/50 pb-2">
            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Home Base</span>
            <span className="text-xl font-bold">{stats.homeBase}</span>
          </div>
        </div>
      </div>

      {/* THE CALLS TO ACTION */}
      <div className="flex flex-col items-center gap-4 pb-12 w-full max-w-md mx-auto">
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Download size={20} />
          {isExporting ? 'Generating Image...' : 'Save for Instagram Story'}
        </button>

        <button 
          onClick={() => setShowDonation(true)}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-yellow-900/20"
        >
          <Heart size={20} />
          Donate to Help Cover Server Costs
        </button>

        {/* Future Printful Hook */}
        <div className="flex flex-col items-center gap-2 w-full">
          <button 
            onClick={() => setShowPosterModal(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-900/20"
          >
            <Printer size={20} />
            Order this as a 24x36 Poster *
          </button>
          <span className="text-xs text-slate-500 text-center">
            * Your data will be sent to a 3rd-party service to generate the print.
          </span>
        </div>
      </div>

      {/* DONATION MODAL OVERLAY */}
      <AnimatePresence>
        {showDonation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowDonation(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-black text-white mb-4 pr-8">Support the Project</h3>
              
              <p className="text-slate-300 leading-relaxed mb-8">
                Logbook Wrapped is built by a fellow pilot and is 100% free and open-source. 
                If you enjoyed your logbook wrapped, consider chipping in! Your support directly covers 
                <strong> Mapbox API fees</strong>, <strong>server hosting</strong>, and keeps this tool ad-free for everyone.
              </p>

              <div className="flex flex-col gap-3">
                <a 
                  href="https://buymeacoffee.com/YOUR_BMC_LINK_HERE" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-[#FFDD00] hover:bg-[#FFEA4D] text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Coffee size={20} className="text-black" />
                  Buy Me a Coffee (or 100LL)
                </a>
                
                <a 
                  href="https://paypal.me/YOUR_PAYPAL_LINK_HERE" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-[#00457C] hover:bg-[#005a9e] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.98 5.04-4.345 6.788-8.637 6.788h-2.19c-.522 0-.966.382-1.048.9l-1.12 7.105c-.062.395.244.75.645.75h3.63c.43 0 .798-.31.865-.736l.732-4.646c.067-.426.435-.736.865-.736h.813c3.812 0 6.845-1.556 7.685-5.88.23-1.182.21-2.22-.057-3.088l-.535-.17z" />
                  </svg>
                  Donate via PayPal
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POSTER PRINT MODAL OVERLAY */}
      <AnimatePresence>
        {showPosterModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setShowPosterModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-black text-white mb-4 pr-8">Get Your Footprint on Canvas</h3>
              
              {/* Placeholder Image for the Poster */}
              <div className="w-full aspect-[2/3] bg-slate-800 rounded-xl overflow-hidden mb-6 border border-slate-700 shadow-inner">
                 <img 
                    src="https://placehold.co/600x900/0f172a/3b82f6?text=Poster+Preview+Graphic" 
                    alt="Poster Preview" 
                    className="w-full h-full object-cover" 
                 />
              </div>

              {/* Explicit Privacy Warning */}
              <div className="bg-amber-500/10 border border-amber-500/50 rounded-xl p-4 mb-6">
                <p className="text-amber-200 text-sm leading-relaxed">
                  <strong>Privacy Notice:</strong> Up until now, 100% of your logbook processing has remained securely on your device. 
                  By proceeding to order a physical print, <strong>your footprint map data and summary stats will be securely transmitted to a third-party server</strong> to fulfill your order. Your raw logbook entries are never shared.
                </p>
              </div>

              <a 
                href="https://printful.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-900/20"
              >
                <Printer size={20} />
                Continue to Print Partner
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};