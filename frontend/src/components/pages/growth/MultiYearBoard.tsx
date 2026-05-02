import React from 'react';
import { motion } from 'framer-motion';
import { CalculatedStats } from '../../../core/types';

interface YearData {
  year: string;
  stats: CalculatedStats;
}

interface Props {
  years: YearData[];
}

const getStatRows = (stats: CalculatedStats) => [
  { label: 'Hours', value: stats.totalHours, unit: 'hrs' },
  { label: 'Flights', value: stats.totalFlights, unit: 'flights' },
  { label: 'Distance', value: Math.round(stats.totalDistanceNm), unit: 'NM' },
  { label: 'Landings', value: stats.totalLandings, unit: '' },
  { label: 'Night', value: stats.totalNight, unit: 'hrs' },
  { label: 'Airports', value: stats.uniqueAirports, unit: '' },
];

const yearColors = [
  '#a78bfa', // purple-400
  '#38bdf8', // sky-400
  '#34d399', // emerald-400
  '#fbbf24', // amber-400
  '#f472b6', // pink-400
  '#22d3ee', // cyan-400
];

// Column widths in px
const LABEL_W = 80;    // left label column
const YEAR_W  = 140;   // each year value column
const ARROW_W = 48;    // each arrow spacer between years
const MAX_BOARD_W = 1100; // px — beyond this the table scrolls (~5 years)

export const MultiYearBoard: React.FC<Props> = ({ years }) => {
  const n = years.length;

  const statRows = getStatRows(years[0].stats).map((row, rowIdx) => ({
    label: row.label,
    unit: row.unit,
    values: years.map(y => getStatRows(y.stats)[rowIdx].value),
  }));

  // Total inner content width
  const contentW = LABEL_W + n * YEAR_W + (n - 1) * ARROW_W;
  const scrollable = contentW > MAX_BOARD_W;
  // When scrollable: frozen last-year column on the right
  // scrollable area holds all columns EXCEPT the last year
  const scrollableContentW = LABEL_W + (n - 1) * YEAR_W + (n - 1) * ARROW_W;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full w-full bg-gradient-to-br from-purple-900 via-slate-950 to-blue-900 text-white overflow-hidden p-5 sm:p-6"
    >
      {/* Title */}
      <div className="flex flex-col items-start gap-1 text-left shrink-0 mb-4 mt-2">
        <h1 className="text-2xl font-black tracking-tight leading-tight">
          <span style={{ color: '#a78bfa' }}>My LogbookWrapped</span>{' '}
          <span style={{ color: '#38bdf8' }}>Growth Report.</span>
        </h1>
        <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
          {years[0].year} → {years[n - 1].year} · {n} years
        </p>
      </div>

      {/* Main card */}
      <div className="w-full flex flex-col bg-slate-900/40 border border-slate-700/50 rounded-3xl flex-1 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col h-full p-4 sm:p-5">

          {!scrollable ? (
            // ── Non-scrollable layout ────────────────────────────────
            <div className="flex flex-col h-full">
              {/* Stat rows + header inside same padded container */}
              <div className="flex flex-col flex-1 bg-slate-800/50 rounded-2xl border border-slate-700/30 p-2 sm:p-3 w-full">

                {/* Header row — inside the container so padding matches stat cells */}
                <div className="flex w-full shrink-0 mb-2">
                  <div style={{ width: LABEL_W }} className="shrink-0" />
                  {years.map((y, i) => (
                    <React.Fragment key={y.year}>
                      <div className="flex-1 flex items-center justify-center mx-0.5">
                        <span className="text-lg sm:text-xl font-black" style={{ color: yearColors[i % yearColors.length] }}>
                          {y.year}
                        </span>
                      </div>
                      {i < n - 1 && <div style={{ width: ARROW_W }} className="shrink-0" />}
                    </React.Fragment>
                  ))}
                </div>

                {statRows.map((row, rowIdx) => {
                  const maxVal = Math.max(...row.values);
                  const minVal = Math.min(...row.values);
                  const allSame = maxVal === minVal;
                  return (
                    <motion.div
                      key={row.label}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.07 + rowIdx * 0.055 }}
                      className="flex flex-1 items-center border-b border-white/5 last:border-0 min-h-0"
                    >
                      {/* Label */}
                      <div style={{ width: LABEL_W }} className="shrink-0 text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center leading-tight pr-1">
                        {row.label}
                        {row.unit && <span className="block normal-case text-slate-600">{row.unit}</span>}
                      </div>
                      {/* Values + arrows — flex-1 year cols fill remaining width */}
                      {row.values.map((val, i) => {
                        const isMax = !allSame && val === maxVal;
                        const isMin = !allSame && val === minVal;
                        const nextVal = i < n - 1 ? row.values[i + 1] : null;
                        const trendUp   = nextVal !== null && nextVal > val;
                        const trendDown = nextVal !== null && nextVal < val;
                        return (
                          <React.Fragment key={i}>
                            <div
                              className={`flex-1 flex flex-col items-center justify-center rounded-md py-1 mx-0.5 h-full ${isMax ? 'bg-green-500/20' : isMin ? 'bg-red-500/20' : ''}`}
                            >
                              <span className="text-base font-black leading-tight" style={{ color: isMax ? '#4ade80' : isMin ? '#f87171' : yearColors[i % yearColors.length] }}>
                                {val.toLocaleString()}
                              </span>
                            </div>
                            {nextVal !== null && (
                              <div style={{ width: ARROW_W }} className="shrink-0 flex items-center justify-center">
                                <span className="text-xs font-black" style={{ color: trendUp ? '#4ade80' : trendDown ? '#f87171' : '#475569' }}>
                                  {trendUp ? '▲' : trendDown ? '▼' : '➖'}
                                </span>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            // ── Scrollable layout: last year frozen on right ─────────
            // One bg-slate-800/50 wrapper = uniform background for everything
            <div className="flex flex-1 bg-slate-800/50 rounded-2xl border border-slate-700/30 min-h-0 overflow-hidden">

              {/* LEFT: single overflow-x-auto scrolls header + all rows together */}
              <div className="flex-1 overflow-x-auto min-h-0">
                <div style={{ minWidth: scrollableContentW }} className="flex flex-col h-full p-2 sm:p-3">

                  {/* Header */}
                  <div className="flex shrink-0 mb-2">
                    <div style={{ width: LABEL_W }} className="shrink-0" />
                    {years.slice(0, -1).map((y, i) => (
                      <React.Fragment key={y.year}>
                        <div style={{ width: YEAR_W }} className="flex items-center justify-center shrink-0 mx-0.5">
                          <span className="text-lg sm:text-xl font-black" style={{ color: yearColors[i % yearColors.length] }}>
                            {y.year}
                          </span>
                        </div>
                        <div style={{ width: ARROW_W }} className="shrink-0" />
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Stat rows */}
                  <div className="flex flex-col flex-1 min-h-0">
                    {statRows.map((row, rowIdx) => {
                      const maxVal = Math.max(...row.values);
                      const minVal = Math.min(...row.values);
                      const allSame = maxVal === minVal;
                      return (
                        <motion.div
                          key={row.label}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.07 + rowIdx * 0.055 }}
                          className="flex flex-1 items-center border-b border-white/5 last:border-0 min-h-0"
                        >
                          <div style={{ width: LABEL_W }} className="shrink-0 text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center leading-tight pr-1">
                            {row.label}
                            {row.unit && <span className="block normal-case text-slate-600">{row.unit}</span>}
                          </div>
                          {row.values.slice(0, -1).map((val, i) => {
                            const isMax = !allSame && val === maxVal;
                            const isMin = !allSame && val === minVal;
                            const nextVal = row.values[i + 1];
                            const trendUp   = nextVal > val;
                            const trendDown = nextVal < val;
                            return (
                              <React.Fragment key={i}>
                                <div
                                  style={{ width: YEAR_W }}
                                  className={`shrink-0 flex flex-col items-center justify-center rounded-md py-1 mx-0.5 h-full ${isMax ? 'bg-green-500/20' : isMin ? 'bg-red-500/20' : ''}`}
                                >
                                  <span className="text-sm font-black leading-tight" style={{ color: isMax ? '#4ade80' : isMin ? '#f87171' : yearColors[i % yearColors.length] }}>
                                    {val.toLocaleString()}
                                  </span>
                                </div>
                                <div style={{ width: ARROW_W }} className="shrink-0 flex items-center justify-center">
                                  <span className="text-xs font-black" style={{ color: trendUp ? '#4ade80' : trendDown ? '#f87171' : '#475569' }}>
                                    {trendUp ? '▲' : trendDown ? '▼' : '➖'}
                                  </span>
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT: frozen last year column — shares same bg, separated by border-l */}
              <div className="shrink-0 flex flex-col border-l-2 border-l-slate-500/40 p-2 sm:p-3" style={{ width: YEAR_W }}>
                {/* Header */}
                <div className="flex items-center justify-center shrink-0 mb-2 mx-0.5">
                  <span className="text-lg sm:text-xl font-black" style={{ color: yearColors[(n - 1) % yearColors.length] }}>
                    {years[n - 1].year}
                  </span>
                </div>
                {/* Values */}
                <div className="flex flex-col flex-1 min-h-0">
                  {statRows.map((row, rowIdx) => {
                    const maxVal = Math.max(...row.values);
                    const minVal = Math.min(...row.values);
                    const allSame = maxVal === minVal;
                    const val = row.values[n - 1];
                    const isMax = !allSame && val === maxVal;
                    const isMin = !allSame && val === minVal;
                    return (
                      <motion.div
                        key={row.label}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.07 + rowIdx * 0.055 }}
                        className="flex flex-1 items-center justify-center border-b border-white/5 last:border-0 min-h-0"
                      >
                        <div className={`w-full flex flex-col items-center justify-center rounded-md py-1 mx-0.5 h-full ${isMax ? 'bg-green-500/20' : isMin ? 'bg-red-500/20' : ''}`}>
                          <span className="text-sm font-black leading-tight" style={{ color: isMax ? '#4ade80' : isMin ? '#f87171' : yearColors[(n - 1) % yearColors.length] }}>
                            {val.toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
