import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Bug, Check, Forward, HandCoins, Calendar, Globe } from 'lucide-react';

interface Props {
  nameA: string;
  nameB: string;
  copied: boolean;
  onOpenExport: () => void;
  onOpenDonation: () => void;
  onShareApp: () => void;
  handleViewWrapped: (yearOrType: string) => void;
  isDesktop?: boolean;
}

export const GrowthPage2_Export: React.FC<Props> = ({ 
  nameA, nameB, copied, onOpenExport, onOpenDonation, onShareApp, handleViewWrapped, isDesktop 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className={`flex flex-col h-full w-full ${isDesktop ? 'justify-center items-center' : 'justify-start items-center px-6 pt-24 pb-24 bg-slate-950 text-white overflow-y-auto'}`}
    >
      <div className={`relative flex flex-col w-full shrink-0 bg-slate-900 shadow-2xl border border-slate-800 overflow-hidden ${isDesktop ? 'max-w-md h-full rounded-3xl' : 'max-w-sm h-auto rounded-2xl mb-12'}`}>
        
        <div className="p-8 pb-8 text-center bg-slate-800/50">
          <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
            Growth Analyzed.<br />
            <span className="text-purple-400">Keep climbing.</span>
          </h2>
          <p className="text-slate-400 text-[11px] mt-4 font-bold uppercase tracking-widest">
            {nameA} vs {nameB} Complete
          </p>
        </div>

        <div className="relative flex items-center justify-between w-full h-0">
          <div className="absolute -left-4 w-8 h-8 bg-slate-950 rounded-full shadow-[inset_-2px_0_4px_rgba(0,0,0,0.5)] z-10"></div>
          <div className="w-full border-t-2 border-dashed border-slate-700 z-0 mx-2"></div>
          <div className="absolute -right-4 w-8 h-8 bg-slate-950 rounded-full shadow-[inset_2px_0_4px_rgba(0,0,0,0.5)] z-10"></div>
        </div>

        <div className="p-6 pt-8 flex flex-col flex-1 justify-center gap-3">
          <button onClick={onOpenExport} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20">
            <Share2 size={18} /> Share or Download
          </button>
          <button onClick={onOpenDonation} className="w-full bg-slate-800 hover:bg-slate-700 text-yellow-400 py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700">
            <HandCoins size={18} /> Help Keep the App Airborne
          </button>
          <button onClick={onShareApp} className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700">
            {copied ? <Check size={18} /> : <Forward size={18} />}
            {copied ? 'Link Copied!' : 'Share App with a Wingman'}
          </button>

          <hr className="border-slate-800/60 w-full my-1" />

          <div className="flex flex-row gap-2 w-full">
             <button onClick={() => { (window as any).umami?.track('Growth View Wrapped Clicked', { type: 'year_1' }); handleViewWrapped(nameA); }} className="flex-1 bg-slate-800/50 hover:bg-slate-700 text-slate-300 py-3 px-2 sm:px-4 rounded-xl font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-colors border border-slate-700/50 text-xs sm:text-sm">
              <Calendar size={14} className="text-purple-400 shrink-0" /> <span className="truncate">{nameA} Wrapped</span>
            </button>
            <button onClick={() => { (window as any).umami?.track('Growth View Wrapped Clicked', { type: 'year_2' }); handleViewWrapped(nameB); }} className="flex-1 bg-slate-800/50 hover:bg-slate-700 text-slate-300 py-3 px-2 sm:px-4 rounded-xl font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-colors border border-slate-700/50 text-xs sm:text-sm">
              <Calendar size={14} className="text-sky-400 shrink-0" /> <span className="truncate">{nameB} Wrapped</span>
            </button>
          </div>

          <button onClick={() => { (window as any).umami?.track('Growth View Wrapped Clicked', { type: 'all_time' }); handleViewWrapped('all_time'); }} className="w-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700/50 text-sm mb-2">
            <Globe size={16} /> View All-Time Career Wrapped
          </button>

          <a href="/contact" target="_blank" rel="noopener noreferrer" className="w-full text-slate-500 hover:text-slate-300 py-2 font-bold text-[13px] flex items-center justify-center gap-2 transition-colors">
            <Bug size={14} /> Report an Issue
          </a>
        </div>
      </div>
    </motion.div>
  );
};