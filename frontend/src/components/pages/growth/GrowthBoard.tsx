import React from 'react';
import { motion } from 'framer-motion';
import { GrowthStats, GrowthCategory } from '../../../core/types';

interface Props {
  gStats: GrowthStats;
  nameA: string | number;
  nameB: string | number;
  isExportMode?: boolean;
  exportFormat?: 'story' | 'post';
}

export const GrowthBoard: React.FC<Props> = ({ 
  gStats, 
  nameA, 
  nameB, 
  isExportMode, 
  exportFormat = 'story' 
}) => {
  const isPost = exportFormat === 'post';

  // Exact Page 9 container formatting
  const containerClasses = isExportMode 
    ? (isPost ? 'p-5 pt-6' : 'p-6 pt-16') 
    : 'p-5 sm:p-6';

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className={`flex flex-col h-full w-full bg-gradient-to-br from-purple-900 via-slate-950 to-blue-900 text-white overflow-hidden ${containerClasses}`}
    >
      <div className={`flex flex-col items-start gap-2 text-left shrink-0 ${isExportMode ? "mb-6 mt-2" : "mb-8 sm:mb-6 mt-8 sm:mt-2"}`}>
        <h1 className="text-2xl font-black text-purple-400 tracking-tight leading-tight">
          My LogbookWrapped <br /> <span className="text-sky-400">Growth Report.</span>
        </h1>
      </div>
        
      <div className={`w-full flex flex-col bg-slate-900/40 border border-slate-700/50 rounded-3xl ${isPost ? 'p-5' : 'p-6 flex-1 mb-8'} shadow-2xl relative overflow-hidden`}>
        <div className={`flex justify-between items-center ${isPost ? 'mb-4' : 'mb-8 shrink-0'} relative`}>
          <div className="text-center flex-1 z-10 w-1/3">
            <h2 className={`${isPost ? 'text-xl' : 'text-2xl'} font-black text-purple-400 truncate`}>{nameA}</h2>
          </div>
          <div className={`text-slate-600 font-black ${isPost ? 'text-lg' : 'text-xl'} italic z-10 w-1/3 text-center`}>VS</div>
          <div className="text-center flex-1 z-10 w-1/3">
            <h2 className={`${isPost ? 'text-xl' : 'text-2xl'} font-black text-sky-400 truncate`}>{nameB}</h2>
          </div>
          
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl -z-10" />
        </div>

        <div className={`flex flex-col flex-1 justify-between bg-slate-800/50 rounded-2xl border border-slate-700/30 relative z-10 ${isPost ? 'p-2' : 'p-4'}`}>
          <StatRow cat={gStats.hours} format={exportFormat} delay={0.1} />
          <StatRow cat={gStats.flights} format={exportFormat} delay={0.2} />
          <StatRow cat={gStats.distance} format={exportFormat} delay={0.3} />
          <StatRow cat={gStats.landings} format={exportFormat} delay={0.4} />
          <StatRow cat={gStats.night} format={exportFormat} delay={0.5} />
          <StatRow cat={gStats.airports} format={exportFormat} delay={0.6} />
        </div>
      </div>
    </motion.div>
  );
};

const StatRow = ({ cat, format, delay }: { cat: GrowthCategory, format: 'story'|'post', delay: number }) => {
  const isUp = cat.valueB > cat.valueA;
  const isTie = cat.valueB === cat.valueA;
  const py = format === 'post' ? 'py-1.5' : 'py-1 flex-1';
  const valSize = format === 'post' ? 'text-lg' : 'text-xl';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`flex justify-between items-center ${py} border-b border-white/5 last:border-0`}
    >
      <div className={`text-center w-1/3 font-black ${valSize} text-purple-400 leading-tight`}>
        {cat.valueA.toLocaleString()} 
        <span className="text-[10px] font-normal opacity-70 tracking-normal block">{cat.unit}</span>
      </div>
      
      <div className="text-center w-1/3 font-bold text-slate-500 text-[9px] uppercase tracking-widest flex flex-col items-center gap-0.5">
        {cat.label}
        {isTie ? (
          <span className="text-[8px] px-1.5 py-[1px] rounded-full font-black bg-slate-500/20 text-slate-400">
            ➖ {cat.delta.toLocaleString()}
          </span>
        ) : (
          <span className={`text-[8px] px-1.5 py-[1px] rounded-full font-black ${isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {isUp ? '▲' : '▼'} {cat.delta.toLocaleString()}
          </span>
        )}
      </div>
      
      <div className={`text-center w-1/3 font-black ${valSize} text-sky-400 leading-tight`}>
        {cat.valueB.toLocaleString()} 
        <span className="text-[10px] font-normal opacity-70 tracking-normal block">{cat.unit}</span>
      </div>
    </motion.div>
  );
};