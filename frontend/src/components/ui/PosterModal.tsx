import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Download, Loader2, Info, Share2 } from 'lucide-react';
import { toBlob } from 'html-to-image';
import { CalculatedStats } from '../../core/types';
import { PosterPrintLayout } from '../layout/PosterPrintLayout';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: CalculatedStats;
}

export const PosterModal: React.FC<Props> = ({ isOpen, onClose, stats }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [posterBlob, setPosterBlob] = useState<Blob | null>(null);
  const generationAttempted = useRef(false);

  // Background Blob Generation for iOS Share Sheet Support
  useEffect(() => {
    if (!isOpen || generationAttempted.current) return;
    
    let isMounted = true;
    const generateHighResBlob = async () => {
      // Give the DOM a tiny fraction of a second to render the hidden node first
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const node = document.getElementById('hidden-poster-node');
      if (!node) return;

      try {
        const blob = await toBlob(node, {
          quality: 1.0,
          pixelRatio: 1, // Native 1200x1800 is already high res enough
          skipFonts: false,
        });

        if (isMounted && blob) {
          setPosterBlob(blob);
          setIsGenerating(false);
          generationAttempted.current = true;
        }
      } catch (err) {
        console.error('Failed to generate poster blob', err);
        if (isMounted) setIsGenerating(false);
      }
    };

    generateHighResBlob();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleDownloadOrShare = async () => {
    if (!posterBlob) return;

    const file = new File([posterBlob], 'LogbookWrapped-Poster.png', { type: 'image/png' });

    // Try iOS/Android Native Share Sheet First
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'My LogbookWrapped Poster',
        });
        return; // Success!
      } catch (err: any) {
        // If user cancelled, just return. Otherwise, fall through to direct download.
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: Direct Download (Desktop / Unsupported Browsers)
    const url = URL.createObjectURL(posterBlob);
    const link = document.createElement('a');
    link.download = 'LogbookWrapped-Poster.png';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        
        {/* Hidden High-Res Node for html-to-image */}
        <div className="absolute top-0 left-0 pointer-events-none opacity-0 -z-50 overflow-hidden">
          <div id="hidden-poster-node" className="w-[1200px] h-[1800px] bg-[#020617]">
            <PosterPrintLayout stats={stats} />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-slate-800">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <ShoppingCart size={20} className="text-indigo-400" />
              Order Poster
            </h3>
            <button 
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center gap-5">
            
            {/* 1. Primary Action: Order Print */}
            <button 
              onClick={() => console.log('Open 3rd Party Print Partner Flow')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingCart size={20} />
              Send to Print Partner
            </button>

            {/* 2. Support Note */}
            <p className="text-sm text-indigo-300/80 text-center px-4 bg-indigo-950/30 py-3 rounded-lg border border-indigo-900/50 w-full">
              Ordering your high-res print through our partner site helps support LogbookWrapped and keeps the servers running!
            </p>

            {/* 3. Scaled Down Preview */}
            <div className="w-full aspect-[2/3] max-h-[40vh] bg-black rounded-lg border border-slate-700 shadow-inner overflow-hidden relative flex items-center justify-center">
               <div className="absolute top-1/2 left-1/2 origin-center -translate-x-1/2 -translate-y-1/2 transform scale-[0.20] sm:scale-[0.25] pointer-events-none w-[1200px] h-[1800px]">
                  <PosterPrintLayout stats={stats} />
               </div>
               {isGenerating && (
                 <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10 gap-3">
                   <Loader2 size={32} className="animate-spin text-indigo-500" />
                   <span className="text-sm font-medium animate-pulse">Rendering high-res...</span>
                 </div>
               )}
            </div>

            {/* 4. Privacy Note */}
            <div className="flex items-start gap-3 w-full text-xs text-slate-400 bg-slate-950/50 p-4 rounded-xl">
              <Info size={16} className="text-slate-500 shrink-0 mt-0.5" />
              <p>
                <strong>Privacy Promise:</strong> Your logbook data never leaves your device. It is only sent to the printing service if you explicitly click the order button and proceed to checkout.
              </p>
            </div>

            {/* 5. Download/Share Button */}
            <button 
              onClick={handleDownloadOrShare}
              disabled={isGenerating || !posterBlob}
              className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border ${
                isGenerating || !posterBlob
                  ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {isGenerating ? (
                <><Loader2 size={18} className="animate-spin" /> Preparing File...</>
              ) : (
                <><Share2 size={18} /> Share / Download Full Resolution</>
              )}
            </button>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};