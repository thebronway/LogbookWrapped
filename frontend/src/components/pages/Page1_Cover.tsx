import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../core/types';
import { useLogbookStore } from '../../store/useLogbookStore';

interface Props {
  stats: CalculatedStats;
  exportFormat?: 'story' | 'post';
}

export const Page1_Cover: React.FC<Props> = ({ stats, exportFormat = 'story' }) => {
  const dateFilter = useLogbookStore((state) => state.dateFilter);

  let titleText = "My Time";
  if (dateFilter.type === 'this_year') {
    titleText = `My ${new Date().getFullYear()} Logbook`;
  } else if (dateFilter.type === 'last_year') {
    titleText = `My ${new Date().getFullYear() - 1} Logbook`;
  } else if (dateFilter.type === 'custom' && dateFilter.start && dateFilter.end) {
    if (dateFilter.start.endsWith('-01-01') && dateFilter.end.endsWith('-12-31')) {
      const startYear = dateFilter.start.substring(0, 4);
      const endYear = dateFilter.end.substring(0, 4);
      if (startYear === endYear) {
        titleText = `My ${startYear} Logbook`;
      }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col justify-center h-full w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white ${exportFormat === 'post' ? 'p-6' : 'p-8'}`}
    >
      <h2 className={`${exportFormat === 'post' ? 'text-3xl mb-6' : 'text-4xl md:text-4xl mb-8 md:mb-12'} font-black tracking-tight text-blue-400`}>
        {titleText}<br/>In The Sky.
      </h2>

      <div className="space-y-5 md:space-y-10">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-blue-500 text-xs md:text-sm font-bold uppercase tracking-widest mb-1">Total Time</p>
          <p className="text-3xl md:text-4xl font-bold mb-1 md:mb-2">{stats.totalHours} Hours</p>
          <p className="text-blue-200/50 text-sm font-mono mb-2">{stats.averageFlightTime} Hrs/Flight</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="text-blue-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-1">Sorties</p>
          <p className="text-3xl md:text-4xl font-bold mb-1 md:mb-2">{stats.totalFlights} Flights</p>
          <p className="text-blue-200/50 text-sm font-mono">{stats.flightsPerMonth} Flights/Month</p>
          <p className="text-blue-200/50 text-sm font-mono mb-2">Busiest: {stats.busiestMonth}</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
          <p className="text-blue-300 text-xs md:text-sm font-bold uppercase tracking-widest mb-1">Home Base</p>
          <p className="text-3xl md:text-4xl font-bold mb-1 md:mb-2">{stats.homeBase}</p>
          <p className="text-blue-200/50 text-sm font-mono mb-2">{stats.homeBaseLandings} total landings</p>
        </motion.div>
      </div>
    </motion.div>
  );
};