import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../core/types';
import { getPage1Copy } from '../../core/Copywriter';

interface Props {
  stats: CalculatedStats;
}

export const Page1_Cover: React.FC<Props> = ({ stats }) => {
  const { hoursCopy, flightsCopy } = getPage1Copy(stats);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col justify-center h-full w-full p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white"
    >
      <h2 className="text-5xl font-black mb-12 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
        Your Year<br/>In The Sky.
      </h2>

      <div className="space-y-10">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-blue-300 text-sm font-bold uppercase tracking-widest mb-1">Total Time</p>
          <p className="text-4xl font-bold mb-2">{stats.totalHours} Hours</p>
          <p className="text-slate-300 text-lg leading-relaxed">{hoursCopy}</p>
        </motion.div>

        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="text-emerald-300 text-sm font-bold uppercase tracking-widest mb-1">Sorties</p>
          <p className="text-4xl font-bold mb-2">{stats.totalFlights} Flights</p>
          <p className="text-slate-300 text-lg leading-relaxed">{flightsCopy}</p>
        </motion.div>

        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
          <p className="text-purple-300 text-sm font-bold uppercase tracking-widest mb-1">Home Base</p>
          <p className="text-4xl font-bold mb-2">{stats.homeBase}</p>
          <p className="text-slate-300 text-lg leading-relaxed">We hope you aren't paying hourly for tie-downs.</p>
        </motion.div>
      </div>
    </motion.div>
  );
};