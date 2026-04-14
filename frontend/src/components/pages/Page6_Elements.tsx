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
      <h2 className="text-4xl font-black mb-8 text-cyan-400">My Logbook <br />In The Elements.</h2>
      <div className="space-y-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <p className="text-cyan-300 text-sm font-bold uppercase tracking-widest mb-1">The Night Owl</p>
          <p className="text-3xl font-bold mb-1">{stats.totalNight} Hours</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <p className="text-sky-300 text-sm font-bold uppercase tracking-widest mb-1">In The Clouds</p>
          <p className="text-3xl font-bold mb-1">{stats.totalIMC} Hours Actual</p>
        </motion.div>
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.8 }}
          className="bg-cyan-950/40 p-4 rounded-xl border border-cyan-800/50 flex flex-col justify-center"
        >
          <p className="text-cyan-500 text-xs font-bold uppercase tracking-widest mb-1">Fuel Burn Estimate</p>
          <p className="text-2xl font-bold mb-1">{stats.estimatedFuelBurn.toLocaleString()} Gallons</p>
        </motion.div>
      </div>
    </motion.div>
  );
};