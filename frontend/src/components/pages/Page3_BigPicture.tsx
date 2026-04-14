import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../core/types';
import { getPage4Copy } from '../../core/Copywriter';

interface Props {
  stats: CalculatedStats;
}

export const Page3_BigPicture: React.FC<Props> = ({ stats }) => {
  const { distCopy, days, hours } = getPage4Copy(stats);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col justify-center h-full w-full p-8 bg-gradient-to-tr from-orange-950 via-slate-900 to-slate-900 text-white"
    >
      <h2 className="text-4xl font-black mb-12 tracking-tight text-orange-500">
        The Big Picture.
      </h2>

      <div className="space-y-12">
        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-orange-400 text-sm font-bold uppercase tracking-widest mb-1">Total Distance</p>
          <p className="text-5xl font-black mb-4">{stats.totalDistanceNm.toLocaleString()} NM</p>
          <p className="text-slate-300 text-lg leading-relaxed">{distCopy}</p>
        </motion.div>

        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
          <p className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-1">Time in the Seat</p>
          <p className="text-slate-300 text-lg leading-relaxed">
            You logged {stats.totalHours} total hours. That means you spent exactly...
          </p>
          <div className="mt-4 bg-orange-900/30 border border-orange-500/30 p-5 rounded-xl">
            <p className="text-2xl font-bold text-orange-200">
              {days} solid days
            </p>
            <p className="text-xl text-orange-300/80">
              and {hours} hours
            </p>
            <p className="text-sm text-slate-400 mt-2 uppercase tracking-wide">Strapped into a cockpit.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};