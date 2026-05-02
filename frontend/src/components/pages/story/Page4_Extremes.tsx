import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../../core/types';
import { useLogbookStore } from '../../../store/useLogbookStore';
import { getTitleData } from '../../../core/Copywriter';

interface Props {
  stats: CalculatedStats;
  exportFormat?: 'story' | 'post';
}

export const Page4_Extremes: React.FC<Props> = ({ stats, exportFormat = 'story' }) => {
  const dateFilter = useLogbookStore((state) => state.dateFilter);
  const { line1, isLongLine1 } = getTitleData(dateFilter);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col justify-center h-full w-full bg-gradient-to-b from-slate-900 via-red-950 to-slate-900 text-white ${exportFormat === 'post' ? 'p-6' : 'p-8'}`}
    >
      <h2 className={`${exportFormat === 'post' ? (isLongLine1 ? 'text-xl mb-6' : 'text-2xl mb-6') : (isLongLine1 ? 'text-xl mb-10' : 'text-2xl mb-10')} font-black tracking-tight text-red-500 leading-tight`}>
        {line1}<br />
        <span className="text-rose-400">Extremes.</span>
      </h2>
      <div className="space-y-10">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-red-500 text-sm font-bold uppercase tracking-widest mb-1">Autopilot’s Default</p>
          <p className="text-3xl font-bold mb-2">{stats.favoriteRoute}</p>
          <p className="text-pink-200/50 text-sm font-mono mb-2">Route flown {stats.favoriteRouteCount} times</p>
        </motion.div>

        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="text-red-400 text-sm font-bold uppercase tracking-widest mb-1">The Quickie</p>
          <p className="text-3xl font-bold mb-2">Only {stats.shortestFlight} Hours</p>
          <p className="text-pink-200/50 text-sm font-mono mb-2">{stats.shortestFlightDate} • {stats.shortestFlightRoute}</p>
        </motion.div>

        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
          <p className="text-red-300 text-sm font-bold uppercase tracking-widest mb-1">The Long Haul</p>
          <p className="text-3xl font-bold mb-2">{stats.longestFlight} NM</p>
          <p className="text-pink-200/50 text-sm font-mono mb-2">{stats.longestFlightDate} • {stats.longestFlightRoute}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};