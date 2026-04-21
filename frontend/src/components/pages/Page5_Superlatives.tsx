import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../core/types';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface Props {
  stats: CalculatedStats;
  exportFormat?: 'story' | 'post';
}

export const Page5_Superlatives: React.FC<Props> = ({ stats, exportFormat = 'story' }) => {
  const ratio = stats.totalHours > 0 ? (stats.totalLandings / stats.totalHours).toFixed(1) : "0.0";
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={`flex flex-col justify-center h-full w-full bg-gradient-to-tl from-fuchsia-950 via-slate-900 to-slate-900 text-white ${exportFormat === 'post' ? 'p-6' : 'p-8'}`}
    >
      <h2 className={`${exportFormat === 'post' ? 'text-3xl mb-6' : 'text-4xl mb-10'} font-black text-fuchsia-400`}>My Logbook Superlatives.</h2>
      <div className="space-y-10">
        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-fuchsia-500 text-sm font-bold uppercase tracking-widest mb-1">The Bounce Rate</p>
          <p className="text-4xl font-bold mb-2"><AnimatedCounter value={stats.totalLandings} /> Landing{stats.totalLandings === 1 ? '' : 's'}</p>
          <p className="text-fuchsia-200/50 text-sm font-mono mb-2">Ratio: {ratio} Ldg/Hr</p>
        </motion.div>
        
        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="text-fuchsia-400 text-sm font-bold uppercase tracking-widest mb-1">The Stamp Collector</p>
          <p className="text-4xl font-bold mb-2">{stats.uniqueAirports} Airports</p>
          <p className="text-fuchsia-200/50 text-sm font-mono mb-2">HOME BASE: {stats.homeBase}</p>
        </motion.div>
        
        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
          <p className="text-fuchsia-300 text-sm font-bold uppercase tracking-widest mb-1">Frequent Flyer Territory</p>
          <p className="text-4xl font-bold mb-2">{stats.mostVisitedState}</p>
          <p className="text-fuchsia-200/50 text-sm font-mono mb-2">{stats.mostVisitedStateCount} visits</p>
        </motion.div>
      </div>
    </motion.div>
  );
};