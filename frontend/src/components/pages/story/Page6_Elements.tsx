import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../../core/types';
import { getPage6Copy, getTitleData } from '../../../core/Copywriter';
import { useLogbookStore } from '../../../store/useLogbookStore';
import { AnimatedCounter } from '../../ui/AnimatedCounter';

interface Props {
  stats: CalculatedStats;
  exportFormat?: 'story' | 'post';
}

export const Page6_Elements: React.FC<Props> = ({ stats, exportFormat = 'story' }) => {
  const dateFilter = useLogbookStore((state) => state.dateFilter);
  const { line1, isLongLine1 } = getTitleData(dateFilter);
  const { nightCopy } = getPage6Copy(stats);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={`flex flex-col justify-center h-full w-full bg-gradient-to-b from-cyan-950 via-slate-900 to-slate-900 text-white ${exportFormat === 'post' ? 'p-6' : 'p-8'}`}
    >
      <h2 className={`${exportFormat === 'post' ? (isLongLine1 ? 'text-2xl mb-6' : 'text-3xl mb-6') : (isLongLine1 ? 'text-2xl mb-8' : 'text-3xl mb-8')} font-black tracking-tight text-cyan-400 leading-tight`}>
        {line1}<br />
        <span className="text-sky-400">In The Elements.</span>
      </h2>
      <div className="space-y-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-cyan-500 text-sm font-bold uppercase tracking-widest mb-1">The Night Owl</p>
          <p className="text-3xl font-bold mb-1"><AnimatedCounter value={stats.totalNight} decimals={1} /> Hours</p>
          <p className="text-cyan-200/50 text-sm font-mono mb-2">{nightCopy}</p>
          {stats.totalNight > 0 && stats.nightPercent > 0 && (
            <p className="text-cyan-200/50 text-sm font-mono">{stats.nightPercent}% of your total flight time.</p>
          )}
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-1">In The Clouds</p>
          <p className="text-3xl font-bold mb-1"><AnimatedCounter value={stats.totalIMC} decimals={1} /> Hours Actual</p>
          <p className="text-sky-200/50 text-sm font-mono">{stats.totalSimulated} Hours Simulated</p>
          {stats.totalApproaches > 0 && (
            <p className="text-sky-200/50 text-sm font-mono mb-2">{stats.totalApproaches} IFR Approach{stats.totalApproaches === 1 ? '' : 'es'}</p>
          )}
          {stats.totalApproaches > 0 && stats.approachBreakdown && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(['ILS', 'RNAV', 'VOR', 'LOC', 'NDB', 'other'] as const)
                .filter(k => (stats.approachBreakdown as any)[k] > 0)
                .map(k => (
                  <span key={k} className="px-2 py-0.5 rounded-full bg-cyan-900/40 border border-cyan-800/50 text-cyan-200/80 text-[10px] font-mono uppercase tracking-wider">
                    {k === 'other' ? 'Other' : k} · {(stats.approachBreakdown as any)[k]}
                  </span>
                ))}
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.8 }}
          className="bg-cyan-950/40 p-4 rounded-xl border border-cyan-800/50 flex flex-col justify-center"
        >
          <p className="text-cyan-300 text-xs font-bold uppercase tracking-widest mb-1">Fuel Burn Estimate</p>
          <p className="text-2xl font-bold mb-1"><AnimatedCounter value={stats.estimatedFuelBurn} format={true} /> Gallons</p>
        </motion.div>
      </div>
    </motion.div>
  );
};