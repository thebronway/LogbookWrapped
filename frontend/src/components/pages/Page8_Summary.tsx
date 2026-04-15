import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Heart, Share, Bug, Check } from 'lucide-react';
import { CalculatedStats } from '../../core/types';
import { useLogbookStore } from '../../store/useLogbookStore';

interface Props {
  stats: CalculatedStats;
  onOpenExport?: () => void;
  onOpenDonation?: () => void;
  onOpenPoster?: () => void;
  isExportMode?: boolean;
}

export const Page8_Summary: React.FC<Props> = ({ stats, onOpenExport, onOpenDonation, onOpenPoster, isExportMode }) => {
  const dateFilter = useLogbookStore((state) => state.dateFilter);
  const [copied, setCopied] = useState(false);

  const handleShareApp = async () => {
    const shareUrl = 'https://logbookwrapped.conway.im';
    
    // 1. Try Native Mobile Share Sheet
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LogbookWrapped',
          text: 'See your pilot logbook visualized! Check out LogbookWrapped:',
          url: shareUrl
        });
      } catch (err: any) {
        // If the user closed the share sheet without sharing, do nothing. 
        // Otherwise, fall back to clipboard.
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      // 2. Fallback to Clipboard (Desktop)
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  // Dynamic Title Logic
  let titleX = '';
  if (dateFilter?.type === 'this_year') {
    titleX = `${new Date().getFullYear()} `;
  } else if (dateFilter?.type === 'last_year') {
    titleX = `${new Date().getFullYear() - 1} `;
  } else if (dateFilter?.type === 'all_time') {
    titleX = 'All-Time ';
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col h-full w-full p-6 bg-slate-950 text-white overflow-y-auto"
    >
      <h2 className="text-4xl font-black mt-8 mb-12 text-center text-white">
        And that's your {titleX}LogbookWrapped.
      </h2>

      {/* THE CALLS TO ACTION */}
      {!isExportMode && (
        <div className="flex flex-col items-center gap-3 pb-12 w-full max-w-md mx-auto">
          
          {/* 1. Export (Primary CTA) */}
          <button 
            onClick={onOpenExport}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
          >
            <Download size={18} />
            Share your Wrapped to Social Media
          </button>

          {/* 2. Order Poster */}
          <div className="flex flex-col items-center gap-1.5 w-full mt-2">
            <button 
              onClick={onOpenPoster}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-900/20"
            >
              <Printer size={18} />
              Order as a 24x36 Poster *
            </button>
            <span className="text-[11px] text-slate-500 text-center mb-2">
              * Your data will be sent to a 3rd-party service to print.
            </span>
          </div>

          {/* 3. Donate */}
          <button 
            onClick={onOpenDonation}
            className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-yellow-500/20"
          >
            <Heart size={18} />
            Donate to Cover Server Costs
          </button>

          {/* 4. Share App Link (Secondary) */}
          <button 
            onClick={handleShareApp}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            {copied ? <Check size={18} className="text-emerald-400" /> : <Share size={18} className="text-emerald-400" />}
            {copied ? 'Link Copied!' : 'Send App Link to a Pilot'}
          </button>

          {/* 5. Report Issue */}
          <button 
            onClick={() => console.log('Open Report Modal')}
            className="w-full bg-transparent hover:bg-slate-800/50 text-slate-400 py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-slate-800"
          >
            <Bug size={18} />
            Report an Issue
          </button>

        </div>
      )}
    </motion.div>
  );
};