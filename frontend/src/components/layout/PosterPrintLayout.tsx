import React from 'react';
import { CalculatedStats } from '../../core/types';

interface Props {
  id?: string;
  stats: CalculatedStats;
}

export const PosterPrintLayout: React.FC<Props> = ({ id, stats }) => {
  return (
    <div 
      id={id} 
      className="bg-[#020617] text-white flex flex-col relative overflow-hidden"
      style={{ width: '1200px', height: '1800px', padding: '80px' }} 
    >
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black text-sky-400 mb-4 tracking-tighter">My Logbook Passport</h1>
        <p className="text-2xl text-slate-400 font-medium tracking-widest uppercase">24x36 Poster Print Layout Test</p>
      </div>

      {/* Placeholder for D3 Map (Phase 2) */}
      <div className="w-full h-[800px] bg-slate-900 border-2 border-dashed border-slate-700 rounded-3xl flex items-center justify-center mb-16">
         <span className="text-slate-500 text-3xl font-mono">[ D3.js SVG Map Goes Here in Phase 2 ]</span>
      </div>

      {/* Stats Grid Scaffolding */}
      <div className="grid grid-cols-2 gap-8 flex-grow">
         <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 flex flex-col justify-center items-center text-center">
            <h3 className="text-sky-500/80 text-xl font-bold uppercase tracking-widest mb-2">Total Hours</h3>
            <p className="text-8xl font-black">{stats.totalHours}</p>
         </div>
         <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 flex flex-col justify-center items-center text-center">
            <h3 className="text-sky-500/80 text-xl font-bold uppercase tracking-widest mb-2">Home Base</h3>
            <p className="text-8xl font-black">{stats.homeBase}</p>
         </div>
         <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 flex flex-col justify-center items-center text-center">
            <h3 className="text-sky-500/80 text-xl font-bold uppercase tracking-widest mb-2">Aircraft Flown</h3>
            <p className="text-8xl font-black">{stats.uniqueAircraftTypes}</p>
         </div>
         <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 flex flex-col justify-center items-center text-center">
            <h3 className="text-sky-500/80 text-xl font-bold uppercase tracking-widest mb-2">Distance (NM)</h3>
            <p className="text-8xl font-black">{stats.totalDistanceNm?.toLocaleString()}</p>
         </div>
      </div>
    </div>
  );
};