import React from 'react';
import { motion } from 'framer-motion';
import { GrowthStats, GrowthCategory } from '../../../core/types';

interface Props {
  nameA: string;
  nameB: string;
  gStats: GrowthStats;
  copyText: string;
  isDesktop?: boolean;
}

const StatRow = ({ cat }: { cat: GrowthCategory }) => {
  const isUp = cat.valueB > cat.valueA;
  return (
    <div className="flex justify-between items-center py-5 border-b border-slate-700/50 last:border-0 relative">
      <div className="text-center w-1/3 font-black text-2xl md:text-3xl text-purple-400 leading-tight">
        {cat.valueA.toLocaleString()} 
        <span className="block text-sm font-normal opacity-70 tracking-normal">{cat.unit}</span>
      </div>
      <div className="text-center w-1/3 font-bold text-slate-400 text-[10px] sm:text-xs md:text-sm uppercase tracking-widest flex flex-col items-center gap-1">
        {cat.label}
        {cat.valueB !== cat.valueA && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {isUp ? '▲' : '▼'} {cat.delta.toLocaleString()}
          </span>
        )}
      </div>
      <div className="text-center w-1/3 font-black text-2xl md:text-3xl text-sky-400 leading-tight">
        {cat.valueB.toLocaleString()} 
        <span className="block text-sm font-normal opacity-70 tracking-normal">{cat.unit}</span>
      </div>
    </div>
  );
};

export const GrowthPage1_Stats: React.FC<Props> = ({ nameA, nameB, gStats, copyText, isDesktop }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className={`flex flex-col w-full h-full ${isDesktop ? 'items-start gap-8' : 'bg-slate-900 px-6 py-16 justify-center'}`}
    >
      {isDesktop ? (
        <div className="bg-sky-900/30 border border-sky-500/30 p-5 rounded-xl w-full">
          <p className="text-lg text-sky-200 leading-relaxed">{copyText}</p>
        </div>
      ) : (
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
            My LogbookWrapped <br /> Growth Report.
          </h1>
        </div>
      )}
      
      <div 
        className="w-full bg-slate-900 border border-slate-700 rounded-3xl p-5 md:p-10 shadow-2xl relative overflow-hidden flex-shrink-0"
        style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)', WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
      >
        <div className="flex justify-between items-center mb-6 md:mb-10 relative px-1 md:px-2">
          <div className="text-center flex-1 z-10 w-1/3">
            <h2 className="text-xl md:text-3xl font-black text-purple-400 truncate">{nameA}</h2>
          </div>
          <div className="text-slate-600 font-black text-xl md:text-2xl italic z-10 w-1/3 text-center mx-2">VS</div>
          <div className="text-center flex-1 z-10 w-1/3">
            <h2 className="text-xl md:text-3xl font-black text-sky-400 truncate">{nameB}</h2>
          </div>
          <div className="absolute -left-10 -top-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl -z-10" />
        </div>

        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-2 md:p-6 relative z-10">
          <StatRow cat={gStats.hours} />
          <StatRow cat={gStats.flights} />
          <StatRow cat={gStats.distance} />
          <StatRow cat={gStats.landings} />
          <StatRow cat={gStats.night} />
          <StatRow cat={gStats.airports} />
        </div>
      </div>
    </motion.div>
  );
};