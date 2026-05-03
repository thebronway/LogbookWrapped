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

// Neutral professional palette — all years use same muted tone
// Max/min values still get their green/red highlight
const YEAR_COLOR = '#e2e8f0'; // slate-200
const YEAR_HEADER_COLOR = '#cbd5e1'; // slate-300

// On-brand accent colors (match the card title)
const LABEL_COLOR = '#a78bfa';      // purple-400 — row titles
const FROZEN_COLOR = '#38bdf8';     // sky-400 — frozen (latest) column

const LABEL_W = 140;
const YEAR_W  = 130;
const ARROW_W = 44;

// Shared cell base. No fixed height — rows flex to fill the parent card
// (body rows share available space evenly via percentage height).
const cellBase: React.CSSProperties = {
  padding: 0,
  verticalAlign: 'middle',
  boxSizing: 'border-box',
};

export const MultiYearBoard: React.FC<Props> = ({ years }) => {
  const n = years.length;

  const statRows = getStatRows(years[0].stats).map((row, rowIdx) => ({
    label: row.label,
    unit: row.unit,
    values: years.map(y => getStatRows(y.stats)[rowIdx].value),
  }));

  // Row divider: first stat row gets no top border, others do
  const rowBorder = (rowIdx: number): React.CSSProperties =>
    rowIdx > 0 ? { borderTop: '1px solid rgba(255,255,255,0.15)' } : {};

  // The "frozen last column" style (sticky to right) — fully opaque so it cleanly
  // occludes scrolled cells behind it
  const stickyRight: React.CSSProperties = {
    position: 'sticky',
    right: 0,
    background: '#1e293b', // slate-800 (solid)
    borderLeft: '2px solid rgba(100,116,139,0.5)',
    zIndex: 1,
  };

  // The "frozen label column" style (sticky to left) — mirrors the right sticky
  const stickyLeft: React.CSSProperties = {
    position: 'sticky',
    left: 0,
    background: '#1e293b', // slate-800 (solid)
    borderRight: '2px solid rgba(100,116,139,0.5)',
    zIndex: 1,
  };

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
        <div className="flex flex-col h-full p-4 sm:p-5 min-h-0">

          <div className="flex-1 bg-slate-800/50 rounded-2xl border border-slate-700/30 overflow-auto min-h-0">
            <table
              className="w-full h-full"
              style={{
                borderCollapse: 'separate',
                borderSpacing: 0,
                tableLayout: 'fixed',
                height: '100%',
              }}
            >
              <colgroup>
                <col style={{ width: LABEL_W }} />
                {years.map((_, i) => (
                  <React.Fragment key={i}>
                    {/* All year cells are equal-width (except last, which is sticky) */}
                    <col style={{ width: YEAR_W }} />
                    {i < n - 1 && <col style={{ width: ARROW_W }} />}
                  </React.Fragment>
                ))}
              </colgroup>

              {/* Header */}
              <thead>
                <tr>
                  <th style={{ ...cellBase, padding: '8px 4px', ...stickyLeft }} />
                  {years.map((y, i) => {
                    const isLast = i === n - 1;
                    const isFirst = i === 0;
                    return (
                      <React.Fragment key={y.year}>
                        <th
                          style={{
                            ...cellBase,
                            padding: isFirst ? '8px 4px 8px 20px' : '8px 4px',
                            borderBottom: '1px solid rgba(255,255,255,0.15)',
                            ...(isLast ? stickyRight : {}),
                          }}
                        >
                          <span
                            className="text-lg sm:text-xl font-black"
                            style={{ color: isLast ? FROZEN_COLOR : YEAR_HEADER_COLOR }}
                          >
                            {y.year}
                          </span>
                        </th>
                        {!isLast && (
                          <th
                            style={{
                              ...cellBase,
                              padding: '8px 0',
                              borderBottom: '1px solid rgba(255,255,255,0.15)',
                            }}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {statRows.map((row, rowIdx) => {
                  const maxVal = Math.max(...row.values);
                  const minVal = Math.min(...row.values);
                  const allSame = maxVal === minVal;
                  return (
                    <motion.tr
                      key={row.label}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + rowIdx * 0.05 }}
                      style={{ height: `${100 / statRows.length}%` }}
                    >
                      {/* Label cell (frozen left) */}
                      <td
                        style={{
                          ...cellBase,
                          ...rowBorder(rowIdx),
                          ...stickyLeft,
                          padding: '4px 8px',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          className="text-sm sm:text-base font-bold uppercase tracking-wide leading-tight whitespace-nowrap"
                          style={{ color: LABEL_COLOR }}
                        >
                          {row.label}
                          {row.unit && (
                            <span className="block normal-case text-slate-500 text-[10px] font-semibold tracking-normal">
                              {row.unit}
                            </span>
                          )}
                        </div>
                      </td>

                      {row.values.map((val, i) => {
                        const isMax = !allSame && val === maxVal;
                        const isMin = !allSame && val === minVal;
                        const isLast = i === n - 1;
                        const isFirst = i === 0;
                        const nextVal = !isLast ? row.values[i + 1] : null;
                        const trendUp   = nextVal !== null && nextVal > val;
                        const trendDown = nextVal !== null && nextVal < val;
                        const color = isMax
                          ? '#4ade80'
                          : isMin
                          ? '#f87171'
                          : isLast
                          ? FROZEN_COLOR
                          : YEAR_COLOR;
                        const bg = isMax ? 'rgba(34,197,94,0.2)' : isMin ? 'rgba(239,68,68,0.2)' : 'transparent';

                        return (
                          <React.Fragment key={i}>
                            {/* Year value cell */}
                            <td
                              style={{
                                ...cellBase,
                                ...rowBorder(rowIdx),
                                padding: isFirst ? '4px 2px 4px 20px' : '4px 2px',
                                textAlign: 'center',
                                ...(isLast ? stickyRight : {}),
                              }}
                            >
                              <div
                                style={{
                                  background: bg,
                                  borderRadius: 6,
                                  padding: '4px 2px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <span
                                  className="text-sm sm:text-base font-black leading-tight"
                                  style={{ color }}
                                >
                                  {val.toLocaleString()}
                                </span>
                              </div>
                            </td>

                            {/* Arrow cell (between years, not after last) */}
                            {!isLast && (
                              <td
                                style={{
                                  ...cellBase,
                                  ...rowBorder(rowIdx),
                                  padding: i === n - 2 ? '0 20px 0 0' : 0,
                                  textAlign: 'center',
                                }}
                              >
                                <span
                                  className="text-xs font-black"
                                  style={{
                                    color: trendUp ? '#4ade80' : trendDown ? '#f87171' : '#475569',
                                  }}
                                >
                                  {trendUp ? '▲' : trendDown ? '▼' : '➖'}
                                </span>
                              </td>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
