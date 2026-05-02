import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../../core/types';

interface YearData {
  year: string;
  stats: CalculatedStats;
}

interface Props {
  yearData: YearData[];
  isExportMode?: boolean;
}

const statDefs: { label: string; key: keyof CalculatedStats; unit: string }[] = [
  { label: 'Hours',    key: 'totalHours',      unit: 'hrs' },
  { label: 'Flights',  key: 'totalFlights',    unit: ''    },
  { label: 'Distance', key: 'totalDistanceNm', unit: 'NM'  },
  { label: 'Landings', key: 'totalLandings',   unit: ''    },
  { label: 'Night',    key: 'totalNight',       unit: 'hrs' },
  { label: 'Airports', key: 'uniqueAirports',  unit: ''    },
];

export const MultiYearHighLowCard: React.FC<Props> = ({ yearData, isExportMode = false }) => {
  const firstYear = yearData[0].year;
  const lastYear = yearData[yearData.length - 1].year;
  const numYears = parseInt(lastYear) - parseInt(firstYear) + 1;

  return (
    <div className={`flex flex-col h-full w-full ${isExportMode ? '' : 'bg-gradient-to-br from-purple-900 via-slate-950 to-blue-900'} text-white overflow-hidden`}>
      <div className="flex items-center justify-center flex-1 p-5 sm:p-6">
        <div className="relative flex flex-col w-full max-w-sm bg-slate-900 shadow-2xl border border-slate-800 overflow-hidden rounded-3xl">
          <div className="p-8 pb-8 text-center bg-slate-800/50">
            <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
              Career Highs<br />
              <span className="text-slate-400">&amp; Lows.</span>
            </h2>
            <p className="text-slate-400 text-[11px] mt-4 font-bold uppercase tracking-widest">
              {firstYear} → {lastYear} · {numYears} {numYears === 1 ? 'year' : 'years'}
            </p>
          </div>

          <div className="relative flex items-center justify-between w-full h-0">
            <div className="absolute -left-4 w-8 h-8 bg-slate-950 rounded-full shadow-[inset_-2px_0_4px_rgba(0,0,0,0.5)] z-10" />
            <div className="w-full border-t-2 border-dashed border-slate-700 z-0 mx-2" />
            <div className="absolute -right-4 w-8 h-8 bg-slate-950 rounded-full shadow-[inset_2px_0_4px_rgba(0,0,0,0.5)] z-10" />
          </div>

          <div className="p-6 pt-8">
            {/* Column headers */}
            <div className="flex mb-3">
              <div className="w-20 shrink-0" />
              <div className="flex-1 text-center text-[10px] font-black uppercase tracking-widest text-green-400">Highest</div>
              <div className="flex-1 text-center text-[10px] font-black uppercase tracking-widest text-red-400">Lowest</div>
            </div>
            {statDefs.map(({ label, key, unit }, idx) => {
              const vals = yearData.map(y => ({
                year: y.year,
                val: key === 'totalDistanceNm' ? Math.round(y.stats[key] as number) : y.stats[key] as number,
              }));
              const highest = vals.reduce((a, b) => b.val > a.val ? b : a);
              const lowest  = vals.reduce((a, b) => b.val < a.val ? b : a);
              return (
                <motion.div
                  key={label}
                  initial={isExportMode ? false : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + idx * 0.05 }}
                  className="flex items-center py-2 border-b border-slate-800/60 last:border-0"
                >
                  <div className="w-20 shrink-0 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {label}
                    {unit && <span className="block normal-case text-slate-600">{unit}</span>}
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <span className="text-base font-black text-green-400">{highest.val.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-slate-500">{highest.year}</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <span className="text-base font-black text-red-400">{lowest.val.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-slate-500">{lowest.year}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
