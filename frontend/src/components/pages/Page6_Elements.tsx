import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../core/types';
import { getPage7Copy } from '../../core/Copywriter';

export const Page6_Elements: React.FC<{stats: CalculatedStats}> = ({ stats }) => {
  const { nightCopy, imcCopy, fuelCopy } = getPage7Copy(stats);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col justify-center h-full w-full p-8 bg-gradient-to-b from-cyan-950 via-slate-900 to-slate-900 text-white"
    >
      <h2 className="text-4xl font-black mb-8 text-cyan-400">In The Elements.</h2>
      <div className="space-y-8">
        <div>
          <p className="text-cyan-300 text-sm font-bold uppercase tracking-widest mb-1">The Night Owl</p>
          <p className="text-3xl font-bold mb-1">{stats.totalNight} Hours</p>
        </div>
        <div>
          <p className="text-sky-300 text-sm font-bold uppercase tracking-widest mb-1">In The Soup</p>
          <p className="text-3xl font-bold mb-1">{stats.totalIMC} Hours Actual</p>
        </div>
        <div className="bg-cyan-950/40 p-4 rounded-xl border border-cyan-800/50">
          <p className="text-cyan-500 text-xs font-bold uppercase tracking-widest mb-1">Fuel Burn Estimate</p>
          <p className="text-2xl font-bold mb-1">{stats.estimatedFuelBurn.toLocaleString()} Gallons</p>
        </div>
      </div>
    </motion.div>
  );
};