import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X, Download, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { CalculatedStats } from '../../core/types';
import { PosterPrintLayout } from '../layout/PosterPrintLayout';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: CalculatedStats;
}

export const PosterModal: React.FC<Props> = ({ isOpen, onClose, stats }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const el = document.getElementById('poster-print-target');
      if (!el) throw new Error('Poster element not found');

      const dataUrl = await toPng(el, {
        pixelRatio: 2, 
        backgroundColor: '#020617',
        skipFonts: true, 
      });

      const link = document.createElement('a');
      link.download = `LogbookWrapped_Poster.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export poster:', error);
      alert('Failed to generate poster. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  };
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
              {/* Dynamic Preview Container */}
              <div 
                className="w-full aspect-[2/3] bg-[#020617] rounded-2xl overflow-hidden mb-6 border border-slate-700 shadow-xl relative"
                style={{ containerType: 'inline-size' }}
              >
                {/* Using 100cqi (Container Query Inline) ensures the 1200px width layout
                  perfectly scales down to fit the parent container's width, no matter 
                  if the user is on mobile or a giant desktop screen. 
                */}
                <div 
                  className="absolute top-0 left-0 origin-top-left pointer-events-none" 
                  style={{ 
                    width: '1200px', 
                    height: '1800px', 
                    transform: 'scale(calc(100cqi / 1200))' 
                  }}
                >
                  <PosterPrintLayout stats={stats} />
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/50 rounded-xl p-5 mb-8">
                <p className="text-amber-200 text-sm sm:text-base leading-relaxed">
                  <strong>Privacy Notice:</strong> Up until now, 100% of your logbook processing has remained securely on your device. 
                  By proceeding to order a physical print, <strong>your footprint map data and summary stats will be securely transmitted to a third-party server</strong> to fulfill your order. Your raw logbook entries are never shared.
                </p>
              </div>

              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:opacity-70 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-900/20 text-lg"
              >
                {isExporting ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />}
                {isExporting ? 'Generating High-Res Art...' : 'Download Test Print (24x36)'}
              </button>

              {/* Hidden Export Target (Rendered securely off-screen for a pixel-perfect 1200x1800 image capture) */}
              <div className="fixed top-0 left-[9999px] pointer-events-none z-[-1]">
                <PosterPrintLayout id="poster-print-target" stats={stats} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};