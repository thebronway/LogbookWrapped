import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { CalculatedStats } from '../../../core/types';
import { useLogbookStore } from '../../../store/useLogbookStore';
import { AIRCRAFT_PROFILES } from '../../../core/AircraftProfiles';

interface Props {
  stats: CalculatedStats;
  exportFormat?: 'story' | 'post';
  isExportMode?: boolean;
}

export const Page10_Community: React.FC<Props> = ({ stats, exportFormat = 'story', isExportMode = false }) => {
  const { communityAverages, setCommunityAverages, dateFilter, hasSharedCommunityStats, setHasSharedCommunityStats } = useLogbookStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  let yearStr = new Date().getFullYear().toString();
  if (dateFilter.type === 'last_year') yearStr = (new Date().getFullYear() - 1).toString();
  else if (dateFilter.type === 'custom' && dateFilter.start) yearStr = dateFilter.start.substring(0, 4);

  const profile = AIRCRAFT_PROFILES[stats.mostUsedAirframe] || AIRCRAFT_PROFILES['UNKNOWN'];
  let autoSize = profile.type;
  if (autoSize === 'experimental') autoSize = 'small';
  if (!['small', 'medium', 'large'].includes(autoSize)) autoSize = 'unknown';

  const handleUnlock = async () => {
    window.umami?.track('Community Stats Unlocked', { size: autoSize, year: yearStr });
    setIsSubmitting(true);
    setLoadingPhase(1);
    setError(null);

    const payload = {
      year: parseInt(yearStr),
      flight_time: stats.totalHours,
      flights: stats.totalFlights,
      distance: stats.totalDistanceNm,
      landings: stats.totalLandings,
      night_hours: stats.totalNight,
      states_count: stats.mostVisitedStateCount > 0 ? 1 : 0, 
      dominant_size: autoSize
    };

    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to connect to server');
      const data = await res.json();

      setLoadingPhase(2); // Crunching Numbers
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.floor(Math.random() * 400) + 100));
      
      setLoadingPhase(3); // Comparing Averages
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.floor(Math.random() * 400) + 100));

      if (data.averages) setCommunityAverages(data.averages);

      setSuccess(true);
      setLoadingPhase(0);
      setTimeout(() => setHasSharedCommunityStats(true), 1000);

    } catch (err) {
      setError("Couldn't reach server. Try again or skip.");
      setIsSubmitting(false);
      setLoadingPhase(0);
    }
  };

  const StatRow = ({ label, myVal, commVal, unit, isDecimal, delay }: any) => {
    const isPost = exportFormat === 'post';
    const py = isPost ? 'py-1.5' : 'py-1 flex-1';
    const valSize = isPost ? 'text-lg' : 'text-xl';
    
    const myFormatted = isDecimal ? myVal.toFixed(1) : Math.round(myVal).toLocaleString();
    const commFormatted = isDecimal ? commVal.toFixed(1) : Math.round(commVal).toLocaleString();
    
    const isTie = myVal === commVal;
    const isUp = myVal > commVal;
    const diff = Math.abs(myVal - commVal);
    const diffFormatted = isDecimal ? diff.toFixed(1) : Math.round(diff).toLocaleString();

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`flex justify-between items-center ${py} border-b border-white/5 last:border-0`}
      >
        <div className={`text-center w-1/3 font-black ${valSize} text-yellow-400 leading-tight`}>
          {myFormatted} 
          <span className="text-[10px] font-normal opacity-70 tracking-normal block">{unit || '\u00A0'}</span>
        </div>
        
        <div className="text-center w-1/3 font-bold text-slate-500 text-[9px] uppercase tracking-widest flex flex-col items-center gap-0.5">
          {label}
          {isTie ? (
            <span className="text-[8px] px-1.5 py-[1px] rounded-full font-black bg-slate-500/20 text-slate-400">
              - {diffFormatted}
            </span>
          ) : (
            <span className={`text-[8px] px-1.5 py-[1px] rounded-full font-black ${isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isUp ? '▲' : '▼'} {diffFormatted}
            </span>
          )}
        </div>
        
        <div className={`text-center w-1/3 font-black ${valSize} text-emerald-400 leading-tight`}>
          {commFormatted} 
          <span className="text-[10px] font-normal opacity-70 tracking-normal block">{unit || '\u00A0'}</span>
        </div>
      </motion.div>
    );
  };

  if (isExportMode && !hasSharedCommunityStats) return null;

  const containerClasses = isExportMode ? (exportFormat === 'post' ? 'p-5 pt-6' : 'p-6 pt-16') : 'p-5 sm:p-6';

  return (
    <div className={`flex flex-col h-full w-full bg-gradient-to-br from-emerald-900 via-slate-950 to-yellow-900 text-white overflow-hidden ${containerClasses}`}>
      <AnimatePresence mode="wait">
        
        {/* --- STATE 1: LOCKED (THE TOLLBOOTH) --- */}
        {!hasSharedCommunityStats && (
          <motion.div 
            key="locked"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className={`flex flex-col h-full justify-center max-w-md mx-auto w-full ${isExportMode ? 'hidden' : ''}`}
          >
            <h2 className="text-3xl sm:text-4xl font-black text-center text-white leading-tight tracking-tight mb-4">
              Unlock Community Averages
            </h2>
            
            <p className="text-slate-400 text-sm sm:text-base text-center leading-relaxed mb-8">
              To see how you stack up, contribute your high-level totals to the pool. 
              <strong className="text-white block mt-2">Your logbook entries remain 100% private.</strong> 
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" /> Anonymous Data to Share
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Year</span><span className="font-mono text-white">{yearStr}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Hours</span><span className="font-mono text-white">{stats.totalHours.toFixed(1)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Flights</span><span className="font-mono text-white">{stats.totalFlights}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Landings</span><span className="font-mono text-white">{stats.totalLandings}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Distance</span><span className="font-mono text-white">{Math.round(stats.totalDistanceNm)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Category</span><span className="font-mono text-white capitalize">{autoSize}</span>
                </div>
              </div>
            </div>

            {error && <div className="mb-4 text-sm text-rose-400 bg-rose-900/20 p-3 rounded-lg text-center border border-rose-900/50">{error}</div>}

            {success ? (
              <div className="w-full relative z-50 bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                <CheckCircle2 size={20} /> Unlocked Successfully!
              </div>
            ) : (
              <>
                <button
                  onClick={handleUnlock}
                  disabled={isSubmitting}
                  className="w-full relative z-50 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-80 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/20 text-lg hover:scale-[1.02] active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      {loadingPhase === 1 ? 'Transmitting...' : loadingPhase === 2 ? 'Crunching Numbers...' : 'Comparing Averages...'}
                    </>
                  ) : (
                    <><Send size={20} /> Share & Unlock</>
                  )}
                </button>
                <button 
                  onClick={() => window.umami?.track('Community Stats Skipped')}
                  className="w-full relative z-50 mt-3 bg-transparent border border-slate-700 hover:bg-slate-800/50 text-slate-400 hover:text-slate-300 font-bold py-4 rounded-xl transition-all flex items-center justify-center text-lg"
                >
                  Skip for now
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* --- STATE 2: UNLOCKED (EXACT GROWTH BOARD STYLING) --- */}
        {hasSharedCommunityStats && communityAverages && (
          <motion.div 
            key="unlocked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex flex-col h-full w-full ${isExportMode ? '' : 'max-w-md mx-auto'}`}
          >
            <div className={`flex flex-col items-start gap-2 text-left shrink-0 ${isExportMode ? "mb-6 mt-2" : "mb-8 sm:mb-6 mt-8 sm:mt-2"}`}>
              <h1 className="text-2xl font-black text-yellow-400 tracking-tight leading-tight">
                My {yearStr} LogbookWrapped <br /> <span className="text-emerald-400">VS The Community.</span>
              </h1>
            </div>
              
            <div className={`w-full flex flex-col bg-slate-900/40 border border-slate-700/50 rounded-3xl ${exportFormat === 'post' ? 'p-5' : 'p-6 flex-1 mb-8'} shadow-2xl relative overflow-hidden`}>
              
              <div className={`flex justify-between items-center ${exportFormat === 'post' ? 'mb-4' : 'mb-8 shrink-0'} relative`}>
                <div className="text-center flex-1 z-10 w-1/3">
                  <h2 className={`${exportFormat === 'post' ? 'text-xl' : 'text-2xl'} font-black text-yellow-400 truncate`}>You</h2>
                </div>
                <div className={`text-slate-600 font-black ${exportFormat === 'post' ? 'text-lg' : 'text-xl'} italic z-10 w-1/3 text-center`}>VS</div>
                <div className="text-center flex-1 z-10 w-1/3">
                  <h2 className={`${exportFormat === 'post' ? 'text-xl' : 'text-2xl'} font-black text-emerald-400 truncate`}>
                    <span className="hidden sm:inline">Average</span>
                    <span className="inline sm:hidden">Avg</span>
                  </h2>
                </div>
                
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl -z-10" />
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl -z-10" />
              </div>

              <div className={`flex flex-col flex-1 justify-between bg-slate-800/50 rounded-2xl border border-slate-700/30 relative z-10 ${exportFormat === 'post' ? 'p-2' : 'p-4'}`}>
                <StatRow label="Flight Time" myVal={stats.totalHours} commVal={Number(communityAverages.flight_time)} unit="hrs" isDecimal={true} delay={0.1} />
                <StatRow label="Flights" myVal={stats.totalFlights} commVal={Number(communityAverages.flights)} delay={0.2} />
                <StatRow label="Distance" myVal={stats.totalDistanceNm} commVal={Number(communityAverages.distance)} unit="nm" delay={0.3} />
                <StatRow label="Landings" myVal={stats.totalLandings} commVal={Number(communityAverages.landings)} delay={0.4} />
                <StatRow label="Night Hrs" myVal={stats.totalNight} commVal={Number(communityAverages.night_hours)} unit="hrs" isDecimal={true} delay={0.5} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};