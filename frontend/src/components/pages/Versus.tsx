import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, TrendingUp } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';
import { calculateVersusStats } from '../../core/MathEngine';
import { getYoYCopy } from '../../core/Copywriter';
import { VersusCategory } from '../../core/types';

export const Versus = () => {
  const { datasets, resetStore } = useLogbookStore();

  if (datasets.length !== 2 || !datasets[0].stats || !datasets[1].stats) {
    return <Navigate to="/" replace />;
  }

  const pilotA = datasets[0];
  const pilotB = datasets[1];
  const nameA = pilotA.ownerName || 'Year 1';
  const nameB = pilotB.ownerName || 'Year 2';

  const vStats = calculateVersusStats(pilotA.stats, pilotB.stats);
  
  const isIncrease = vStats.hours.winner === 'A';
  const copyText = getYoYCopy(vStats.hours.delta, isIncrease);

  const StatRow = ({ cat }: { cat: VersusCategory }) => {
    const aWins = cat.winner === 'A';
    const bWins = cat.winner === 'B';
    const isTie = cat.winner === 'Tie';

    return (
      <div className="grid grid-cols-3 items-center py-5 border-b border-slate-700/50 last:border-0 relative">
        {aWins && <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-purple-500/10 to-transparent rounded-l-xl -z-10" />}
        {bWins && <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-sky-500/10 to-transparent rounded-r-xl -z-10" />}
        
        <div className={`text-right px-4 font-black text-2xl md:text-3xl ${aWins ? 'text-purple-400' : isTie ? 'text-slate-300' : 'text-slate-600'}`}>
          {cat.valueA.toLocaleString()} <span className="text-sm font-normal opacity-70 tracking-normal">{cat.unit}</span>
        </div>
        
        <div className="text-center font-bold text-slate-400 text-[10px] sm:text-xs md:text-sm uppercase tracking-widest flex flex-col items-center gap-1">
          {cat.label}
          {cat.delta > 0 && (
            <span className="text-[9px] sm:text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">
              Δ {cat.delta.toLocaleString()}
            </span>
          )}
        </div>
        
        <div className={`text-left px-4 font-black text-2xl md:text-3xl ${bWins ? 'text-sky-400' : isTie ? 'text-slate-300' : 'text-slate-600'}`}>
          {cat.valueB.toLocaleString()} <span className="text-sm font-normal opacity-70 tracking-normal">{cat.unit}</span>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 md:px-6 py-12 gap-8"
    >
      <Helmet>
        <title>Growth Report | LogbookWrapped</title>
      </Helmet>

      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-slate-800/80 border border-slate-700 rounded-full mb-2 shadow-xl text-sky-400">
          <TrendingUp size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase italic">
          Growth Report
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">{copyText}</p>
      </div>

      <div className="w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        <div className="flex justify-between items-center mb-10 relative">
          <div className="text-center flex-1 z-10 w-1/3">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-purple-400 truncate px-2">{nameA}</h2>
            <div className="text-6xl md:text-8xl font-black text-white mt-2 drop-shadow-xl">{vStats.scoreA}</div>
          </div>
          
          <div className="text-slate-600 font-black text-2xl md:text-3xl italic z-10 w-1/3 text-center">VS</div>
          
          <div className="text-center flex-1 z-10 w-1/3">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-sky-400 truncate px-2">{nameB}</h2>
            <div className="text-6xl md:text-8xl font-black text-white mt-2 drop-shadow-xl">{vStats.scoreB}</div>
          </div>

          {vStats.overallWinner === 'A' && <div className="absolute -left-20 -top-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />}
          {vStats.overallWinner === 'B' && <div className="absolute -right-20 -top-20 w-64 h-64 bg-sky-500/20 rounded-full blur-[100px]" />}
        </div>

        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-2 md:p-6 relative z-10">
          <StatRow cat={vStats.hours} />
          <StatRow cat={vStats.landings} />
          <StatRow cat={vStats.distance} />
          <StatRow cat={vStats.airports} />
          <StatRow cat={vStats.night} />
          <StatRow cat={vStats.fuel} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
        <Link 
          to="/config"
          className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg"
        >
          <ArrowLeft size={20} />
          Change Parameters
        </Link>
        <Link 
          to="/upload"
          onClick={() => resetStore()}
          className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw size={20} />
          Start New File
        </Link>
      </div>
    </motion.div>
  );
};