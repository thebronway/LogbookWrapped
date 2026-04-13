import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Coffee, Printer } from 'lucide-react';
import { CalculatedStats } from '../../core/types';
import { exportAsImage } from '../../utils/canvasExporter';

export const Page8_Summary: React.FC<{stats: CalculatedStats}> = ({ stats }) => {
  const [isExporting, setIsExporting] = useState(false);

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
        className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl mb-8 relative"
      >
        <div className="absolute top-4 right-4 text-slate-500 font-mono text-xs">LOGBOOK WRAPPED</div>
        <h3 className="text-2xl font-black mb-6 text-blue-400">The Flight Line</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-700/50 pb-2">
            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total Time</span>
            <span className="text-xl font-bold">{stats.totalHours} hrs</span>
          </div>
          <div className="flex justify-between items-end border-b border-slate-700/50 pb-2">
            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Distance</span>
            <span className="text-xl font-bold">{stats.totalDistanceNm.toLocaleString()} NM</span>
          </div>
          <div className="flex justify-between items-end border-b border-slate-700/50 pb-2">
            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Landings</span>
            <span className="text-xl font-bold">{stats.totalLandings}</span>
          </div>
          <div className="flex justify-between items-end border-b border-slate-700/50 pb-2">
            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Home Base</span>
            <span className="text-xl font-bold">{stats.homeBase}</span>
          </div>
        </div>
      </div>

      {/* THE CALLS TO ACTION */}
      <div className="space-y-3 pb-12">
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Download size={20} />
          {isExporting ? 'Generating Image...' : 'Save for Instagram Story'}
        </button>

        <a 
          href="https://buymeacoffee.com/yourlink" 
          target="_blank" 
          rel="noreferrer"
          className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Coffee size={20} />
          Buy the Dev a Gallon of 100LL ($6)
        </a>

        {/* Future Printful Hook */}
        <button 
          className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
        >
          <Printer size={20} />
          Order this as a 24x36 Poster
        </button>
      </div>
    </motion.div>
  );
};