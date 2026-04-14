import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../core/types';
import { getPage6Copy } from '../../core/Copywriter';

export const Page5_Superlatives: React.FC<{stats: CalculatedStats}> = ({ stats }) => {
  const { ratioCopy, aptsCopy, ratio } = getPage6Copy(stats);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col justify-center h-full w-full p-8 bg-gradient-to-tl from-fuchsia-950 via-slate-900 to-slate-900 text-white"
    >
      <h2 className="text-4xl font-black mb-10 text-fuchsia-400">My Logbook Superlatives.</h2>
      <div className="space-y-10">
        <div>
          <p className="text-fuchsia-300 text-sm font-bold uppercase tracking-widest mb-1">Landings to Hours</p>
          <p className="text-4xl font-bold mb-2">{stats.totalLandings} Landings</p>
          <p className="text-fuchsia-200/50 text-sm font-mono mb-2">Ratio: {ratio} Ldg/Hr</p>
        </div>
        <div>
          <p className="text-pink-300 text-sm font-bold uppercase tracking-widest mb-1">The Stamp Collector</p>
          <p className="text-4xl font-bold mb-2">{stats.uniqueAirports} Airports Visited</p>
          <p className="text-fuchsia-200/50 text-sm font-mono mb-2">Most Frequented: {stats.homeBase}</p>
        </div>
      </div>
    </motion.div>
  );
};