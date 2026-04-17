import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../core/types';

export const Page4_Extremes: React.FC<{stats: CalculatedStats}> = ({ stats }) => {

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col justify-center h-full w-full p-8 bg-gradient-to-b from-slate-900 via-red-950 to-slate-900 text-white"
    >
      <h2 className="text-4xl font-black mb-10 text-red-500">My Logbook Extremes.</h2>
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