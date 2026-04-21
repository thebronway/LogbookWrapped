import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../core/types';
import { getPage3Copy } from '../../core/Copywriter';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface Props {
  stats: CalculatedStats;
  exportFormat?: 'story' | 'post';
}

export const Page2_BigPicture: React.FC<Props> = ({ stats, exportFormat = 'story' }) => {
  const { distCopy, days, hours } = getPage3Copy(stats);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col justify-center h-full w-full bg-gradient-to-tr from-orange-950 via-slate-900 to-slate-900 text-white ${exportFormat === 'post' ? 'px-6 pt-6 pb-12' : 'p-8'}`}
    >
      <h2 className={`${exportFormat === 'post' ? 'text-3xl mb-6' : 'text-4xl mb-12'} font-black tracking-tight text-orange-400`}>
        My Logbook <br /> Big Picture.
      </h2>

      <div className={`${exportFormat === 'post' ? 'space-y-8' : 'space-y-12'}`}>
        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-1">Total Distance</p>
          <p className={`${exportFormat === 'post' ? 'text-4xl' : 'text-5xl'} font-black mb-4`}><AnimatedCounter value={stats.totalDistanceNm} format={true} /> NM</p>
          <p className="text-slate-300 text-lg leading-relaxed"></p>
          <p className="text-orange-200/50 text-sm font-mono mb-2">{distCopy}</p>
        </motion.div>

        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
          <p className="text-orange-400 text-sm font-bold uppercase tracking-widest mb-1">Time in the Seat</p>
          <p className={`text-slate-300 ${exportFormat === 'post' ? 'text-base' : 'text-lg'} leading-relaxed`}>
            You logged {stats.totalHours} total hours. That means you spent exactly...
          </p>
          <div className={`${exportFormat === 'post' ? 'mt-4' : 'mt-8'} bg-orange-900/30 border border-orange-500/30 p-5 rounded-xl flex flex-col justify-center`}>
            <p className="text-2xl font-bold text-orange-200">
              {days} solid day{days === 1 ? '' : 's'}
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