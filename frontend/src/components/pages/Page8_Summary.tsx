import React from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Heart } from 'lucide-react';
import { CalculatedStats } from '../../core/types';

interface Props {
  stats: CalculatedStats;
  onOpenExport?: () => void;
  onOpenDonation?: () => void;
  onOpenPoster?: () => void;
  isExportMode?: boolean;
}

export const Page8_Summary: React.FC<Props> = ({ stats, onOpenExport, onOpenDonation, onOpenPoster, isExportMode }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col h-full w-full p-6 bg-slate-950 text-white overflow-y-auto"
    >
      <h2 className="text-4xl font-black mt-8 mb-6 text-center text-white">My LogbookWrapped.</h2>

      {/* THE EXPORTABLE CARD */}
      <div 
        id="export-card" 
        className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl mb-8 relative w-fit mx-auto min-w-[320px]"
      >        
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
      {!isExportMode && (
        <div className="flex flex-col items-center gap-4 pb-12 w-full max-w-md mx-auto">
          <button 
            onClick={onOpenExport}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
          >
            <Download size={20} />
            Export to Social Media / Device
          </button>

          <button 
            onClick={onOpenDonation}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-yellow-900/20"
          >
            <Heart size={20} />
            Donate to Help Cover Server Costs
          </button>

          <div className="flex flex-col items-center gap-2 w-full">
            <button 
              onClick={onOpenPoster}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-900/20"
            >
              <Printer size={20} />
              Order this as a 24x36 Poster *
            </button>
            <span className="text-xs text-slate-500 text-center">
              * Your data will be sent to a 3rd-party service to print.
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};