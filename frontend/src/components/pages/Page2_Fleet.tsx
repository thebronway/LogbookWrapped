import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../core/types';
import { getPage3Copy } from '../../core/Copywriter';

interface Props {
  stats: CalculatedStats;
}

export const Page2_Fleet: React.FC<Props> = ({ stats }) => {
  const fleetCopy = getPage3Copy(stats);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col justify-center h-full w-full p-8 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white"
    >
      <h2 className="text-4xl font-black mb-10 tracking-tight text-indigo-400">
        My Logbook <br /> Fleet.
      </h2>

      <div className="space-y-12">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-1">Unique Airframes</p>
          <p className="text-5xl font-black text-white mb-2">{stats.uniqueAircraftTypes}</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-1">Different Tail Numbers</p>
          <p className="text-5xl font-black text-white mb-2">{stats.uniqueTailNumbers}</p>
          <p className="text-slate-300 text-lg leading-relaxed">&nbsp;</p>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 1 }}
          className="bg-indigo-900/40 p-6 rounded-2xl border border-indigo-500/30"
        >
          <p className="text-lg font-medium leading-relaxed italic text-indigo-100">
            "{fleetCopy}"
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};