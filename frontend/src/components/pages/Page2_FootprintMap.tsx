import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../core/types';
import { getPage2Copy } from '../../core/Copywriter';

export const Page2_FootprintMap: React.FC<{stats: CalculatedStats}> = ({ stats }) => {
  const mapCopy = getPage2Copy(stats);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col h-full w-full bg-slate-900 text-white"
    >
      <div className="h-1/2 w-full bg-slate-800 relative overflow-hidden flex items-center justify-center border-b border-slate-700">
        {/* Placeholder for Mapbox/Leaflet */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-black"></div>
        <p className="z-10 text-slate-400 font-mono text-sm tracking-widest">[ MAP VISUALIZATION ENGINE ]</p>
      </div>
      <div className="h-1/2 p-8 flex flex-col justify-center bg-gradient-to-b from-slate-900 to-blue-950">
        <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-1">Coverage Area</p>
        <p className="text-4xl font-black mb-4">The Footprint.</p>
        <p className="text-slate-300 text-lg leading-relaxed">{mapCopy}</p>
      </div>
    </motion.div>
  );
};