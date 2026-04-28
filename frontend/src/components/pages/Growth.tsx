import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Share2, Bug, Check, Forward, HandCoins, X, Calendar, Globe } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';
import { calculateGrowthStats } from '../../core/MathEngine';
import { getYoYCopy } from '../../core/Copywriter';
import { GrowthStats, GrowthCategory } from '../../core/types';
import { DonationModal } from '../ui/DonationModal';
import { ExportModal } from '../ui/ExportModal';

export const Growth = () => {
  const { datasets, resetStore, setDateFilter, applyFilterAndCalculate } = useLogbookStore();
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  
  const handleViewWrapped = (yearOrType: string) => {
    // 1. Tell the component we are leaving so it doesn't trigger the aggressive homepage redirect
    setIsNavigating(true);
    
    // 2. Set the new filters
    if (yearOrType === 'all_time') {
       setDateFilter({ type: 'all_time' });
    } else {
       setDateFilter({ type: 'custom', start: `${yearOrType}-01-01`, end: `${yearOrType}-12-31` });
    }
    
    // 3. Recalculate and navigate instantly
    applyFilterAndCalculate();
    navigate('/wrapped');
  };

  // If we are actively navigating away, freeze the UI so it doesn't crash on the missing second dataset
  if (isNavigating) {
    return <div className="min-h-screen w-full bg-slate-900" />;
  }

  // The aggressive fallback redirect
  if (datasets.length !== 2 || !datasets[0].stats || !datasets[1].stats) {
    return <Navigate to="/" replace />;
  }

  const pilotA = datasets[0];
  const pilotB = datasets[1];
  const nameA = pilotA.ownerName || 'Year 1';
  const nameB = pilotB.ownerName || 'Year 2';

  const gStats = calculateGrowthStats(pilotA.stats!, pilotB.stats!);
  
  const isIncrease = gStats.hours.valueB > gStats.hours.valueA;
  const copyText = getYoYCopy(gStats.hours.delta, isIncrease);

  const handleShareApp = async () => {
    const shareUrl = 'https://logbookwrapped.com';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LogbookWrapped',
          text: 'See your pilot logbook visualized! Check out LogbookWrapped:',
          url: shareUrl
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const StatRow = ({ cat }: { cat: GrowthCategory }) => {
    const isUp = cat.valueB > cat.valueA;

    return (
      <div className="flex justify-between items-center py-5 border-b border-slate-700/50 last:border-0 relative">
        <div className="text-center w-1/3 font-black text-2xl md:text-3xl text-purple-400 leading-tight">
          {cat.valueA.toLocaleString()} 
          <span className="block text-sm font-normal opacity-70 tracking-normal">{cat.unit}</span>
        </div>
        
        <div className="text-center w-1/3 font-bold text-slate-400 text-[10px] sm:text-xs md:text-sm uppercase tracking-widest flex flex-col items-center gap-1">
          {cat.label}
          {cat.valueB !== cat.valueA && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isUp ? '▲' : '▼'} {cat.delta.toLocaleString()}
            </span>
          )}
        </div>
        
        <div className="text-center w-1/3 font-black text-2xl md:text-3xl text-sky-400 leading-tight">
          {cat.valueB.toLocaleString()} 
          <span className="block text-sm font-normal opacity-70 tracking-normal">{cat.unit}</span>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 gap-8 relative"
    >
      <Helmet>
        <title>Growth Report | LogbookWrapped</title>
      </Helmet>

      {/* Floating X Button */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
        <Link 
          to="/"
          onClick={() => resetStore()}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors shadow-lg border border-yellow-400/30 hover:border-yellow-400/60 block"
        >
          <X size={24} />
        </Link>
      </div>

      <div className="w-full flex flex-col items-start mb-4 mt-4 md:mt-0">
        <div className="flex items-center gap-4 mb-8 pr-10 md:pr-0">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight md:whitespace-nowrap">
            My LogbookWrapped <br className="md:hidden" /> Growth Report.
          </h1>
        </div>
        
        <div className="bg-sky-900/30 border border-sky-500/30 p-5 rounded-xl w-full">
          <p className="text-lg text-sky-200 leading-relaxed">{copyText}</p>
        </div>
      </div>

      <div 
        className="w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
        style={{ 
          transform: 'translateZ(0)', 
          WebkitTransform: 'translateZ(0)',
          WebkitMaskImage: '-webkit-radial-gradient(white, black)'
        }}
      >
        
        <div className="flex justify-between items-center mb-10 relative px-2">
          <div className="text-center flex-1 z-10 w-1/3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-purple-400 truncate">{nameA}</h2>
          </div>
          
          <div className="text-slate-600 font-black text-2xl md:text-3xl italic z-10 w-1/3 text-center">VS</div>
          
          <div className="text-center flex-1 z-10 w-1/3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-sky-400 truncate">{nameB}</h2>
          </div>

          <div className="absolute -left-10 -top-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl -z-10" />
        </div>

        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-2 md:p-6 relative z-10">
          <StatRow cat={gStats.hours} />
          <StatRow cat={gStats.flights} />
          <StatRow cat={gStats.distance} />
          <StatRow cat={gStats.landings} />
          <StatRow cat={gStats.night} />
          <StatRow cat={gStats.airports} />
        </div>
      </div>

      <div className="w-full max-w-md mx-auto mt-6 flex flex-col gap-3">
        <button 
          onClick={() => {
            (window as any).umami?.track('Growth Export Opened');
            setShowExport(true);
          }}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
        >
          <Share2 size={18} />
          Share or Download
        </button>

        <button 
          onClick={() => {
            (window as any).umami?.track('Donation Modal Opened', { source: 'growth' });
            setShowDonation(true);
          }}
          className="w-full bg-slate-800 hover:bg-slate-700 text-yellow-400 py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
        >
          <HandCoins size={18} />
          Help Keep the App Airborne
        </button>

        <button 
          onClick={() => {
            (window as any).umami?.track('App Shared');
            handleShareApp();
          }}
          className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
        >
          {copied ? <Check size={18} /> : <Forward size={18} />}
          {copied ? 'Link Copied!' : 'Share App with a Wingman'}
        </button>

        <hr className="border-slate-800/60 w-full my-3" />

        <div className="flex flex-col sm:flex-row gap-3 w-full">
           <button 
            onClick={() => handleViewWrapped(nameA)}
            className="flex-1 bg-slate-800/50 hover:bg-slate-700 text-slate-300 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700/50 text-sm"
          >
            <Calendar size={16} className="text-purple-400" />
            {nameA} Wrapped
          </button>
          
          <button 
            onClick={() => handleViewWrapped(nameB)}
            className="flex-1 bg-slate-800/50 hover:bg-slate-700 text-slate-300 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700/50 text-sm"
          >
            <Calendar size={16} className="text-sky-400" />
            {nameB} Wrapped
          </button>
        </div>

        <button 
          onClick={() => handleViewWrapped('all_time')}
          className="w-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700/50 text-sm"
        >
          <Globe size={16} />
          View All-Time Career Wrapped
        </button>

        <a 
          href="/contact"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => (window as any).umami?.track('Support Link Clicked', { source: 'growth_footer' })}
          className="w-full mt-2 text-slate-500 hover:text-slate-300 py-2 font-bold text-[13px] flex items-center justify-center gap-2 transition-colors"
        >
          <Bug size={14} />
          Report an Issue
        </a>
      </div>

      <AnimatePresence>
        {showExport && (
          <ExportModal 
            title="Export Growth Report"
            onClose={() => setShowExport(false)} 
            items={[
              {
                id: 'growth-report',
                name: 'Growth Report',
                isPoster: false,
                render: (format) => <GrowthExportCard format={format} gStats={gStats} nameA={nameA} nameB={nameB} />
              }
            ]}
          />
        )}
      </AnimatePresence>
      
      {showDonation && <DonationModal isOpen={showDonation} onClose={() => setShowDonation(false)} />}
    </motion.div>
  );
};

// --- CUSTOM EXPORT CARD CONTENT GENERATOR ---
const GrowthExportCard = ({ format, gStats, nameA, nameB }: { format: 'story'|'post', gStats: GrowthStats, nameA: string, nameB: string }) => {
  const isPost = format === 'post';
  
  return (
    <div className={`flex flex-col w-full h-full bg-slate-900 ${isPost ? 'p-6 pt-6 justify-center gap-5' : 'p-8 pt-12 justify-center gap-8'}`}>
      <div className="flex flex-col items-start gap-2 text-left">
        <h1 className={`${isPost ? 'text-2xl' : 'text-3xl'} font-black text-white tracking-tight leading-tight`}>
          My LogbookWrapped <br /> Growth Report.
        </h1>
      </div>
        
      <div 
        className={`w-full bg-slate-900 border border-slate-700 rounded-3xl ${isPost ? 'p-5' : 'p-6'} shadow-2xl relative overflow-hidden`}
        style={{ 
          transform: 'translateZ(0)', 
          WebkitTransform: 'translateZ(0)',
          WebkitMaskImage: '-webkit-radial-gradient(white, black)'
        }}
      >
        <div className={`flex justify-between items-center ${isPost ? 'mb-4' : 'mb-8'} relative`}>
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

        <div className={`bg-slate-800/50 rounded-2xl border border-slate-700/50 relative z-10 ${isPost ? 'p-2' : 'p-3'}`}>
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
  const py = format === 'post' ? 'py-1.5' : 'py-2.5';
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