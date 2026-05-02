import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../../core/types';
import { useLogbookStore } from '../../../store/useLogbookStore';

interface Props {
  stats: CalculatedStats;
  isExportMode?: boolean;
  exportFormat?: 'story' | 'post';
}

export const Page8_Stats: React.FC<Props> = ({ stats, isExportMode, exportFormat = 'story' }) => {
  const dateFilter = useLogbookStore((state) => state.dateFilter);

  let titlePrefix = "My LogbookWrapped";
  if (dateFilter?.type === 'this_year') titlePrefix = `My ${new Date().getFullYear()} LogbookWrapped`;
  else if (dateFilter?.type === 'last_year') titlePrefix = `My ${new Date().getFullYear() - 1} LogbookWrapped`;
  else if (dateFilter?.type === 'custom' && dateFilter.start && dateFilter.end && dateFilter.start.substring(0,4) === dateFilter.end.substring(0,4)) {
    titlePrefix = `My ${dateFilter.start.substring(0, 4)} LogbookWrapped`;
  } else if (dateFilter?.type === 'milestone') {
    const label = dateFilter.label || '';
    const acronymMap: Record<string, string> = { 'Private Pilot License': 'PPL', 'Instrument Rating': 'IFR', 'Commercial Pilot License': 'CPL', 'Multi-Engine Rating': 'Multi-Engine', 'First Solo': 'First Solo' };
    titlePrefix = `My ${acronymMap[label] || label}`;
  }
  const isLongTitle = titlePrefix.length > 20;

  let statRows = [
    { type: 'single', label: 'Total Time', value: `${stats.totalHours} Hour${stats.totalHours === 1 ? '' : 's'}`, sub: [`${stats.averageFlightTime} Hrs/Flight`, `${stats.totalNight} Hrs Night`] },
    { type: 'single', label: 'Total Flights', value: `${stats.totalFlights} Flights`, sub: [`${stats.flightsPerMonth} Flights/Month`, `Busiest: ${stats.busiestMonth}`] },
    { type: 'single', label: 'Distance Flown', value: `${stats.totalDistanceNm?.toLocaleString()} NM` },
    { type: 'single', label: 'Landings', value: `${stats.totalLandings} Landings`, sub: `${stats.totalApproaches} Approach${stats.totalApproaches === 1 ? '' : 'es'}` },
    { type: 'single', label: 'Actual IMC', value: `${stats.totalIMC} Hours`, sub: `${stats.totalSimulated} Hours Simulated` },
    { type: 'double', 
      left: { label: 'Airports', value: stats.uniqueAirports, sub: `Home: ${stats.homeBase}` },
      right: { label: 'Top State', value: stats.mostVisitedState, sub: `${stats.mostVisitedStateCount} Visit${stats.mostVisitedStateCount === 1 ? '' : 's'}` }
    },
    { type: 'double', 
      left: { label: 'Type', value: stats.mostUsedAirframe, sub: `${stats.mostUsedAirframeCount} Sortie${stats.mostUsedAirframeCount === 1 ? '' : 's'}` },
      right: { label: 'Tail', value: stats.mostUsedTailNumber, sub: `${stats.mostUsedTailNumberCount} Sortie${stats.mostUsedTailNumberCount === 1 ? '' : 's'}` }
    }
  ];

  const paddingClass = `flex flex-col h-full w-full bg-gradient-to-br from-slate-800 to-slate-950 text-white overflow-hidden ${
    isExportMode 
      ? (exportFormat === 'story' ? 'p-6 pt-16' : 'p-5 pt-6') 
      : 'p-5 sm:p-6'
  }`;
  const titleClass = `${exportFormat === 'post' ? 'text-2xl' : (isLongTitle ? 'text-2xl' : 'text-3xl')} font-black text-sky-400 tracking-tight leading-tight shrink-0 ${isExportMode ? "mb-6 mt-2" : "mb-8 sm:mb-6 mt-8 sm:mt-2"}`;
  const gapClass = "flex flex-col w-full flex-1 pb-8";
  const leftPadClass = `flex justify-between items-center gap-2 border-r border-slate-700/50 ${isExportMode ? "pr-4" : "pr-3 sm:pr-4"}`;
  const rightPadClass = `flex justify-between items-center gap-2 ${isExportMode ? "pl-4" : "pl-3 sm:pl-4"}`;

  const labelClass = `text-slate-400 font-semibold uppercase tracking-widest shrink-0 ${isExportMode ? (exportFormat === 'post' ? "text-[10px]" : "text-xs") : "text-[10px] sm:text-xs"}`;
  const valClass = `font-bold text-white text-right truncate ${isExportMode ? (exportFormat === 'post' ? "text-sm" : "text-base") : "text-sm sm:text-base"}`;
  const subClass = `text-sky-200/60 mt-0.5 text-right ${isExportMode ? (exportFormat === 'post' ? "text-[8px]" : "text-[10px]") : "text-[9px] sm:text-[10px]"}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={paddingClass}
    >
      <h2 className={titleClass}>
        {titlePrefix}<br /><span className="text-blue-400">By The Numbers.</span>
      </h2>
      <div className={gapClass}>
        {statRows.map((row: any, i) => {
          
          const staggerDelay = 0.2 + (i * 0.08);
          const isLastRow = i === statRows.length - 1;
          const dynamicRowClass = `flex-1 ${isLastRow ? 'border-b-0' : 'border-b border-slate-700/50'}`;

          if (row.type === 'double') {
            return (
              <motion.div 
                key={i} 
                initial={{ x: -40, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: staggerDelay, ease: "easeOut" }}
                className={`grid grid-cols-2 items-center ${dynamicRowClass}`}
              >
                
                {/* Left Side */}
                <div className={leftPadClass}>
                  <span className={labelClass}>{row.left.label}</span>
                  <div className="flex flex-col items-end">
                    <span className={valClass}>{row.left.value}</span>
                    {row.left.sub && (Array.isArray(row.left.sub) ? row.left.sub.map((s: string, idx: number) => <span key={idx} className={subClass}>{s}</span>) : <span className={subClass}>{row.left.sub}</span>)}
                  </div>
                </div>

                {/* Right Side */}
                <div className={rightPadClass}>
                  <span className={labelClass}>{row.right.label}</span>
                  <div className="flex flex-col items-end">
                    <span className={valClass}>{row.right.value}</span>
                    {row.right.sub && (Array.isArray(row.right.sub) ? row.right.sub.map((s: string, idx: number) => <span key={idx} className={subClass}>{s}</span>) : <span className={subClass}>{row.right.sub}</span>)}
                  </div>
                </div>

              </motion.div>
            );
          }

          return (
            <motion.div 
              key={i} 
              initial={{ x: -40, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              transition={{ delay: staggerDelay, ease: "easeOut" }}
              className={`flex justify-between items-center gap-4 ${dynamicRowClass}`}
            >
              <span className={labelClass}>{row.label}</span>
              <div className="flex flex-col items-end">
                <span className={valClass}>{row.value}</span>
                {row.sub && (Array.isArray(row.sub) ? row.sub.map((s: string, idx: number) => <span key={idx} className={subClass}>{s}</span>) : <span className={subClass}>{row.sub}</span>)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};