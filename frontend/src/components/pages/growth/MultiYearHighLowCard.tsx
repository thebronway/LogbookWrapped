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
  { label: 'Night',    key: 'totalNight',      unit: 'hrs' },
  { label: 'Airports', key: 'uniqueAirports',  unit: ''    },
];

export const MultiYearHighLowCard: React.FC<Props> = ({ yearData, isExportMode = false }) => {
  const firstYear = yearData[0].year;
  const lastYear  = yearData[yearData.length - 1].year;
  const numYears  = parseInt(lastYear) - parseInt(firstYear) + 1;

  // Extra bottom padding in export mode reserves space above the ExportWrapper
  // watermark so the inner card never touches/overlaps it (works for both
  // 800px story and 562px post canvases because padding is relative to the card).
  const padding = isExportMode ? 'p-5 pt-6 pb-10' : 'p-5 sm:p-6';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col h-full w-full bg-gradient-to-br from-amber-950 via-slate-950 to-slate-900 text-white overflow-hidden ${padding}`}
    >
      {/* Header */}
      <div className={`flex flex-col items-start gap-1 text-left shrink-0 ${isExportMode ? 'mb-5 mt-1' : 'mb-6 mt-6 sm:mt-2'}`}>
        <h1 className="text-2xl font-black tracking-tight leading-tight">
          <span className="text-amber-400">Career Highs</span>
          <br />
          <span className="text-sky-400">&amp; Lows.</span>
        </h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
          {firstYear} → {lastYear} · {numYears} {numYears === 1 ? 'year' : 'years'}
        </p>
      </div>

      {/* Main card — flex-1 so it fills remaining height on any canvas size */}
      <div className="flex flex-col flex-1 min-h-0 bg-slate-900/50 border border-amber-900/30 rounded-3xl shadow-2xl overflow-hidden">

        {/* Column header bar */}
        <div className="flex items-center border-b border-slate-800/60 px-4 py-3 shrink-0">
          <div className="w-24 shrink-0" />
          <div className="flex-1 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">High</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">Low</span>
          </div>
        </div>

        {/* Stat rows — flex-1 with evenly distributed rows; shrinks gracefully on short canvases */}
        <div className="flex flex-col flex-1 min-h-0 justify-between px-4 py-2">
          {statDefs.map(({ label, key, unit }, idx) => {
            const vals = yearData.map(y => ({
              year: y.year,
              val: key === 'totalDistanceNm'
                ? Math.round(y.stats[key] as number)
                : y.stats[key] as number,
            }));
            const highest = vals.reduce((a, b) => b.val > a.val ? b : a);
            const lowest  = vals.reduce((a, b) => b.val < a.val ? b : a);

            return (
              <motion.div
                key={label}
                initial={isExportMode ? false : { opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + idx * 0.06 }}
                className="flex items-center flex-1 border-b border-slate-800/40 last:border-0 min-h-0 py-1"
              >
                {/* Stat label */}
                <div className="w-24 shrink-0 text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight">
                  {label}
                  {unit && <span className="block normal-case text-slate-600">{unit}</span>}
                </div>

                {/* High */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-black text-amber-600">▲</span>
                    <span className="text-base font-black text-amber-400 leading-tight">
                      {highest.val.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 leading-none mt-0.5">{highest.year}</span>
                </div>

                {/* Low */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-black text-sky-700">▼</span>
                    <span className="text-base font-black text-sky-400 leading-tight">
                      {lowest.val.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 leading-none mt-0.5">{lowest.year}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
