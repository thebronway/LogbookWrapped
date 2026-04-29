import React from 'react';
import { GrowthStats, GrowthCategory } from '../../../core/types';

interface Props {
  format: 'story' | 'post';
  gStats: GrowthStats;
  nameA: string;
  nameB: string;
}

export const GrowthExportCard: React.FC<Props> = ({ format, gStats, nameA, nameB }) => {
  const isPost = format === 'post';
  
  return (
    <div className={`flex flex-col w-full h-full bg-slate-900 ${isPost ? 'p-6 pt-6 justify-center gap-5' : 'p-6 pt-16 gap-6'}`}>
      <div className="flex flex-col items-start gap-2 text-left shrink-0">
        <h1 className={`${isPost ? 'text-2xl' : 'text-3xl'} font-black text-white tracking-tight leading-tight`}>
          My LogbookWrapped <br /> Growth Report.
        </h1>
      </div>
        
      <div 
        className={`w-full flex flex-col bg-slate-900 border border-slate-700 rounded-3xl ${isPost ? 'p-5' : 'p-6 flex-1 mb-8'} shadow-2xl relative overflow-hidden`}
        style={{ 
          transform: 'translateZ(0)', 
          WebkitTransform: 'translateZ(0)',
          WebkitMaskImage: '-webkit-radial-gradient(white, black)'
        }}
      >
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

        <div className={`flex flex-col flex-1 justify-between bg-slate-800/50 rounded-2xl border border-slate-700/50 relative z-10 ${isPost ? 'p-2' : 'p-4'}`}>
          <StatRowExport cat={gStats.hours} format={format} />
          <StatRowExport cat={gStats.flights} format={format} />
          <StatRowExport cat={gStats.distance} format={format} />
          <StatRowExport cat={gStats.landings} format={format} />
          <StatRowExport cat={gStats.night} format={format} />
          <StatRowExport cat={gStats.airports} format={format} />
        </div>
      </div>
    </div>
  );
};

const StatRowExport = ({ cat, format }: { cat: GrowthCategory, format: 'story'|'post' }) => {
  const isUp = cat.valueB > cat.valueA;
  const py = format === 'post' ? 'py-1.5' : 'py-1 flex-1';
  const valSize = format === 'post' ? 'text-lg' : 'text-xl';
  
  return (
    <div className={`flex justify-between items-center ${py} border-b border-slate-700/50 last:border-0`}>
      <div className={`text-center w-1/3 font-black ${valSize} text-purple-400 leading-tight`}>
        {cat.valueA.toLocaleString()} 
        <span className="text-[10px] font-normal opacity-70 tracking-normal block">{cat.unit}</span>
      </div>
      <div className="text-center w-1/3 font-bold text-slate-400 text-[9px] uppercase tracking-widest flex flex-col items-center gap-0.5">
        {cat.label}
        {cat.valueB !== cat.valueA && (
          <span className={`text-[8px] px-1.5 py-[1px] rounded-full ${isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {isUp ? '▲' : '▼'} {cat.delta.toLocaleString()}
          </span>
        )}
      </div>
      <div className={`text-center w-1/3 font-black ${valSize} text-sky-400 leading-tight`}>
        {cat.valueB.toLocaleString()} 
        <span className="text-[10px] font-normal opacity-70 tracking-normal block">{cat.unit}</span>
      </div>
    </div>
  );
};