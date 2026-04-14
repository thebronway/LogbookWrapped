import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../core/types';
import { getPage1Copy } from '../../core/Copywriter';
import { useLogbookStore } from '../../store/useLogbookStore';

interface Props {
  stats: CalculatedStats;
}

export const Page1_Cover: React.FC<Props> = ({ stats }) => {
  const { hoursCopy, flightsCopy } = getPage1Copy(stats);
  const dateFilter = useLogbookStore((state) => state.dateFilter);

  let titleText = "My Time";
  if (dateFilter.type === 'this_year') titleText = `My ${new Date().getFullYear()}`;
  if (dateFilter.type === 'last_year') titleText = `My ${new Date().getFullYear() - 1}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col justify-center h-full w-full p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white"
    >
      <h2 className="text-4xl md:text-5xl font-black mb-8 md:mb-12 tracking-tight text-sky-400">
        {titleText}<br/>In The Sky.
      </h2>

      <div className="space-y-5 md:space-y-8">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-blue-300 text-xs md:text-sm font-bold uppercase tracking-widest mb-1">Total Time</p>
          <p className="text-3xl md:text-4xl font-bold mb-1 md:mb-2">{stats.totalHours} Hours</p>
        </motion.div>

        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="text-emerald-300 text-xs md:text-sm font-bold uppercase tracking-widest mb-1">Sorties</p>
          <p className="text-3xl md:text-4xl font-bold mb-1 md:mb-2">{stats.totalFlights} Flights</p>
        </motion.div>

        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
          <p className="text-purple-300 text-xs md:text-sm font-bold uppercase tracking-widest mb-1">Home Base</p>
          <p className="text-3xl md:text-4xl font-bold mb-1 md:mb-2">{stats.homeBase}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};