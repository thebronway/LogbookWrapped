import React from 'react';
import { motion } from 'framer-motion';
import { GrowthStats, GrowthCategory } from '../../../core/types';

interface Props {
  gStats: GrowthStats;
  nameA: string | number;
  nameB: string | number;
  isExportMode?: boolean;
  // Kept for API compatibility (callers still pass it); no longer used for
  // layout branching — the flex-1 + pb-10 pattern handles both canvas sizes
  // (800px story, 562px post) without needing format-specific overrides.
  exportFormat?: 'story' | 'post';
}

export const GrowthBoard: React.FC<Props> = ({
  gStats,
  nameA,
  nameB,
  isExportMode,
}) => {
  // Export mode: pb-10 reserves space above the ExportWrapper watermark at
  // bottom-2/bottom-3. flex-1 on the inner card fills whatever vertical
  // space remains — works for both story (800px) and post (562px) canvases.
  const containerClasses = isExportMode
    ? 'p-5 pt-6 pb-10'
    : 'p-5 sm:p-6';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col h-full w-full bg-gradient-to-br from-purple-900 via-slate-950 to-blue-900 text-white overflow-hidden ${containerClasses}`}
    >
      <div className={`flex flex-col items-start gap-2 text-left shrink-0 ${isExportMode ? 'mb-5 mt-1' : 'mb-8 sm:mb-6 mt-8 sm:mt-2'}`}>
        <h1 className="text-2xl font-black text-purple-400 tracking-tight leading-tight">
          My LogbookWrapped <br /> <span className="text-sky-400">Growth Report.</span>
        </h1>
      </div>

      {/* Outer card — flex-1 so it fills remaining vertical space on any canvas */}
      <div
        className="w-full flex flex-col flex-1 min-h-0 bg-slate-900/40 border border-slate-700/50 rounded-3xl p-5 shadow-2xl relative overflow-hidden"
        style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
      >
        {/* Header row (names) */}
        <div className="flex justify-between items-center mb-4 shrink-0 relative">
          <div className="text-center flex-1 z-10 w-1/3">
            <h2 className="text-2xl font-black text-purple-400 truncate">{nameA}</h2>
          </div>
          <div className="text-slate-600 font-black text-xl italic z-10 w-1/3 text-center">VS</div>
          <div className="text-center flex-1 z-10 w-1/3">
            <h2 className="text-2xl font-black text-sky-400 truncate">{nameB}</h2>
          </div>

          <div className="absolute -left-10 -top-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl -z-10" />
        </div>

        {/* Stat rows — flex-1 with min-h-0 so rows share available height evenly */}
        <div className="flex flex-col flex-1 min-h-0 justify-between bg-slate-800/50 rounded-2xl border border-slate-700/30 relative z-10 p-3">
          <StatRow cat={gStats.hours}    delay={0.1} />
          <StatRow cat={gStats.flights}  delay={0.2} />
          <StatRow cat={gStats.distance} delay={0.3} />
          <StatRow cat={gStats.landings} delay={0.4} />
          <StatRow cat={gStats.night}    delay={0.5} />
          <StatRow cat={gStats.airports} delay={0.6} />
        </div>
      </div>
    </motion.div>
  );
};

const StatRow = ({ cat, delay }: { cat: GrowthCategory; delay: number }) => {
  const isUp = cat.valueB > cat.valueA;
  const isTie = cat.valueB === cat.valueA;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex justify-between items-center flex-1 min-h-0 py-1 border-b border-white/5 last:border-0"
    >
      <div className="text-center w-1/3 font-black text-xl text-purple-400 leading-tight">
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

      <div className="text-center w-1/3 font-black text-xl text-sky-400 leading-tight">
        {cat.valueB.toLocaleString()}
        <span className="text-[10px] font-normal opacity-70 tracking-normal block">{cat.unit}</span>
      </div>
    </motion.div>
  );
};
