import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../core/types';
import { getPage5Copy } from '../../core/Copywriter';

export const Page4_Extremes: React.FC<{stats: CalculatedStats}> = ({ stats }) => {
  const { shortCopy, longCopy } = getPage5Copy(stats);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col justify-center h-full w-full p-8 bg-gradient-to-b from-slate-900 via-red-950 to-slate-900 text-white"
    >
      <h2 className="text-4xl font-black mb-10 text-red-500">The Extremes.</h2>
      <div className="space-y-10">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <p className="text-red-400 text-sm font-bold uppercase tracking-widest mb-1">The Quickie</p>
          <p className="text-3xl font-bold mb-2">Only {stats.shortestFlight} Hours</p>
          <p className="text-pink-200/50 text-sm font-mono mb-2">{stats.shortestFlightDate} • {stats.shortestFlightRoute}</p>
        </motion.div>
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <p className="text-rose-400 text-sm font-bold uppercase tracking-widest mb-1">The Long Haul</p>
          <p className="text-3xl font-bold mb-2">{stats.longestFlight} NM</p>
          <p className="text-pink-200/50 text-sm font-mono mb-2">{stats.longestFlightDate} • {stats.longestFlightRoute}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};