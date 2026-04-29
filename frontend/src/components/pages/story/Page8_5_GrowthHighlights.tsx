import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats, GrowthCategory } from '../../../core/types';
import { calculateGrowthStats } from '../../../core/MathEngine';
import { useLogbookStore } from '../../../store/useLogbookStore';

interface Props {
  stats: CalculatedStats;
  comparisonStats: CalculatedStats;
  isExportMode?: boolean;
  exportFormat?: 'story' | 'post';
}

export const Page8_5_GrowthHighlights: React.FC<Props> = ({ 
  stats, 
  comparisonStats, 
  isExportMode, 
  exportFormat = 'story' 
}) => {
  const dateFilter = useLogbookStore((state) => state.dateFilter);
  const growth = calculateGrowthStats(comparisonStats, stats);
  const isPost = exportFormat === 'post';

  // Resilient Year Detection
  const currentYear = (() => {
    const now = new Date().getFullYear();
    if (dateFilter.type === 'this_year') return now;
    if (dateFilter.type === 'last_year') return now - 1;
    if (dateFilter.start) return parseInt(dateFilter.start.substring(0, 4));
    return now;
  })();
  const prevYear = currentYear - 1;

  // Formatting for Export vs Story UI
  const containerClasses = isExportMode 
    ? (isPost ? 'p-6 pt-6 justify-center' : 'p-6 pt-20') 
    : 'p-6 pt-12';

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className={`flex flex-col h-full w-full bg-gradient-to-br from-purple-900 via-slate-950 to-blue-900 text-white overflow-hidden ${containerClasses}`}
    >
      {/* Title Sections */}
      <div className="flex flex-col items-start gap-2 text-left shrink-0 mb-6">
        <h1 className={`${isExportMode ? (isPost ? 'text-2xl' : 'text-3xl') : 'text-2xl'} font-black text-white tracking-tight leading-tight`}>
          My LogbookWrapped <br /> Growth Report.
        </h1>
      </div>
        
      <div 
        className={`w-full flex flex-col bg-slate-900/40 border border-slate-700/50 rounded-3xl ${isPost ? 'p-5' : 'p-6 flex-1 mb-8'} shadow-2xl relative overflow-hidden`}
      >
        {/* Comparison Header */}
        <div className={`flex justify-between items-center ${isPost ? 'mb-4' : 'mb-8 shrink-0'} relative`}>
          <div className="text-center flex-1 z-10 w-1/3">
            <h2 className={`${isPost ? 'text-xl' : 'text-2xl'} font-black text-purple-400 truncate`}>{prevYear}</h2>
          </div>
          <div className={`text-slate-600 font-black ${isPost ? 'text-lg' : 'text-xl'} italic z-10 w-1/3 text-center`}>VS</div>
          <div className="text-center flex-1 z-10 w-1/3">
            <h2 className={`${isPost ? 'text-xl' : 'text-2xl'} font-black text-sky-400 truncate`}>{currentYear}</h2>
          </div>
          
          {/* Visual Glows matching other pages */}
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl -z-10" />
        </div>

        {/* The Stats Table */}
        <div className={`flex flex-col flex-1 justify-between bg-slate-800/50 rounded-2xl border border-slate-700/30 relative z-10 ${isPost ? 'p-2' : 'p-4'}`}>
          <StatRowHighlight cat={growth.hours} format={exportFormat} delay={0.1} />
          <StatRowHighlight cat={growth.flights} format={exportFormat} delay={0.2} />
          <StatRowHighlight cat={growth.distance} format={exportFormat} delay={0.3} />
          <StatRowHighlight cat={growth.landings} format={exportFormat} delay={0.4} />
          <StatRowHighlight cat={growth.night} format={exportFormat} delay={0.5} />
          <StatRowHighlight cat={growth.airports} format={exportFormat} delay={0.6} />
        </div>
      </div>
    </motion.div>
  );
};

const StatRowHighlight = ({ cat, format, delay }: { cat: GrowthCategory, format: 'story'|'post', delay: number }) => {
  const isUp = cat.valueB > cat.valueA;
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
        {cat.valueB !== cat.valueA && (
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