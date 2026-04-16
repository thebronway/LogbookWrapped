import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Heart, Share, Bug, Check } from 'lucide-react';
import { CalculatedStats } from '../../core/types';
import { useLogbookStore } from '../../store/useLogbookStore';

interface Props {
  stats: CalculatedStats;
  onOpenExport?: () => void;
  onOpenDonation?: () => void;
  isExportMode?: boolean;
}

export const Page9_Export: React.FC<Props> = ({ stats, onOpenExport, onOpenDonation, isExportMode }) => {
  const dateFilter = useLogbookStore((state) => state.dateFilter);
  const [copied, setCopied] = useState(false);

  const handleShareApp = async () => {
    const shareUrl = 'https://logbookwrapped.conway.im';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LogbookWrapped',
          text: 'See your pilot logbook visualized! Check out LogbookWrapped:',
          url: shareUrl
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
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
  } else if (dateFilter?.type === 'custom' && dateFilter.start && dateFilter.end) {
    if (dateFilter.start.endsWith('-01-01') && dateFilter.end.endsWith('-12-31')) {
      const startYear = dateFilter.start.substring(0, 4);
      const endYear = dateFilter.end.substring(0, 4);
      if (startYear === endYear) {
        titleX = `${startYear} `;
      }
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col h-full w-full p-6 bg-slate-950 text-white overflow-y-auto"
    >
      <h2 className="text-4xl font-black mt-8 mb-12 text-center text-white">
        And that's your {titleX}LogbookWrapped.
      </h2>

      {!isExportMode && (
        <div className="flex flex-col items-center gap-3 pb-12 w-full max-w-md mx-auto">
          
          <button 
            onClick={onOpenExport}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
          >
            <Download size={18} />
            Share your Wrapped to Social Media
          </button>

          <button 
            onClick={onOpenDonation}
            className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-yellow-500/20 mt-2"
          >
            <Heart size={18} />
            Donate to Cover Server Costs
          </button>

          <button 
            onClick={handleShareApp}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            {copied ? <Check size={18} className="text-emerald-400" /> : <Share size={18} className="text-emerald-400" />}
            {copied ? 'Link Copied!' : 'Send App Link to a Pilot'}
          </button>

          <a 
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-transparent hover:bg-slate-800/50 text-slate-400 py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-slate-800"
          >
            <Bug size={18} />
            Report an Issue
          </a>

        </div>
      )}
    </motion.div>
  );
};