import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../core/types';
import { useLogbookStore } from '../../store/useLogbookStore';

interface Props {
  stats: CalculatedStats;
  isExportMode?: boolean;
}

export const Page8_Stats: React.FC<Props> = ({ stats, isExportMode }) => {
  const dateFilter = useLogbookStore((state) => state.dateFilter);

  // Dynamic Title Logic
  let titleX = '';
  if (dateFilter?.type === 'this_year') {
    titleX = `${new Date().getFullYear()} `;
  } else if (dateFilter?.type === 'last_year') {
    titleX = `${new Date().getFullYear() - 1} `;
  } else if (dateFilter?.type === 'all_time') {
    titleX = 'All-Time ';
  } else if (dateFilter?.type === 'custom' && dateFilter.start && dateFilter.end) {
    if (dateFilter.start.endsWith('-01-01') && dateFilter.end.endsWith('-12-31')) {
      const startYear = dateFilter.start.substring(0, 4);
      const endYear = dateFilter.end.substring(0, 4);
      if (startYear === endYear) {
        titleX = `${startYear} `;
      }
    }
  }

  const statRows = [
    { type: 'single', label: 'Total Time', value: `${stats.totalHours} Hour${stats.totalHours === 1 ? '' : 's'}` },
    { type: 'single', label: 'Distance Flown', value: `${stats.totalDistanceNm?.toLocaleString()} NM` },
    { type: 'double', 
      left: { label: 'Flights', value: stats.totalFlights },
      right: { label: 'Landings', value: stats.totalLandings }
    },
    { type: 'double', 
      left: { label: 'Actual IMC', value: `${stats.totalIMC} Hrs` },
      right: { label: 'Sim IMC', value: `${stats.totalSimulated} Hrs` }
    },
    { type: 'double', 
      left: { label: 'Night', value: `${stats.totalNight} Hrs` },
      right: { label: 'Aircraft', value: stats.uniqueTailNumbers, sub: `${stats.uniqueAircraftTypes} Type${stats.uniqueAircraftTypes === 1 ? '' : 's'}` }
    },
    { type: 'double', 
      left: { label: 'Type', value: stats.mostUsedAirframe, sub: `${stats.mostUsedAirframeCount} Flt${stats.mostUsedAirframeCount === 1 ? '' : 's'}` },
      right: { label: 'Tail', value: stats.mostUsedTailNumber, sub: `${stats.mostUsedTailNumberCount} Flt${stats.mostUsedTailNumberCount === 1 ? '' : 's'}` }
    },
    { type: 'double', 
      left: { label: 'Airports', value: stats.uniqueAirports, sub: `Home Base: ${stats.homeBase}` },
      right: { label: 'Top State', value: stats.mostVisitedState, sub: `${stats.mostVisitedStateCount} time${stats.mostVisitedStateCount === 1 ? '' : 's'}` }
    },
    { type: 'single', label: 'Favorite Route', value: stats.favoriteRoute, sub: `${stats.favoriteRouteCount} time${stats.favoriteRouteCount === 1 ? '' : 's'}` },
    { type: 'single', label: 'Shortest Flight', value: `${stats.shortestFlight} Hour${stats.shortestFlight === 1 ? '' : 's'}`, sub: `${stats.shortestFlightRoute} on ${stats.shortestFlightDate}` },
    { type: 'single', label: 'Longest Flight', value: `${stats.longestFlight} NM`, sub: `${stats.longestFlightRoute} on ${stats.longestFlightDate}` },
  ];

  const paddingClass = `flex flex-col h-full w-full bg-gradient-to-br from-slate-800 to-slate-950 text-white overflow-hidden ${isExportMode ? "p-6" : "p-5 sm:p-6"}`;
  const titleClass = `text-3xl font-black text-sky-400 tracking-tight leading-tight shrink-0 ${isExportMode ? "mb-6 mt-2" : "mb-8 sm:mb-6 mt-8 sm:mt-2"}`;
  const gapClass = `flex flex-col w-full flex-1 ${isExportMode ? "gap-4 pb-8" : "gap-3 sm:gap-4 pb-8"}`;
  const rowClass = `border-b border-slate-700/50 ${isExportMode ? "pb-2.5" : "pb-2 sm:pb-2.5"}`;
 const leftPadClass = `flex justify-between items-center gap-2 border-r border-slate-700/50 ${isExportMode ? "pr-4" : "pr-3 sm:pr-4"}`;
  const rightPadClass = `flex justify-between items-center gap-2 ${isExportMode ? "pl-4" : "pl-3 sm:pl-4"}`;

  const labelClass = `text-slate-400 font-semibold uppercase tracking-widest shrink-0 ${isExportMode ? "text-xs" : "text-[10px] sm:text-xs"}`;
  const valClass = `font-bold text-white text-right truncate ${isExportMode ? "text-base" : "text-sm sm:text-base"}`;
  const subClass = `text-sky-200/60 mt-0.5 text-right ${isExportMode ? "text-[10px]" : "text-[9px] sm:text-[10px]"}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={paddingClass}
    >
      <h2 className={titleClass}>
        My {titleX}Logbook<br />By The Numbers.
      </h2>
      <div className={gapClass}>
        {statRows.map((row: any, i) => {
          
          const staggerDelay = 0.2 + (i * 0.08);

          if (row.type === 'double') {
            return (
              <motion.div 
                key={i} 
                initial={{ x: -40, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: staggerDelay, ease: "easeOut" }}
                className={`grid grid-cols-2 ${rowClass}`}
              >
                
                {/* Left Side */}
                <div className={leftPadClass}>
                  <span className={labelClass}>{row.left.label}</span>
                  <div className="flex flex-col items-end">
                    <span className={valClass}>{row.left.value}</span>
                    {row.left.sub && <span className={subClass}>{row.left.sub}</span>}
                  </div>
                </div>

                {/* Right Side */}
                <div className={rightPadClass}>
                  <span className={labelClass}>{row.right.label}</span>
                  <div className="flex flex-col items-end">
                    <span className={valClass}>{row.right.value}</span>
                    {row.right.sub && <span className={subClass}>{row.right.sub}</span>}
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
              className={`flex justify-between items-center gap-4 ${rowClass}`}
            >
              <span className={labelClass}>{row.label}</span>
              <div className="flex flex-col items-end">
                <span className={valClass}>{row.value}</span>
                {row.sub && <span className={subClass}>{row.sub}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};