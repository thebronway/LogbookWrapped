import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';
import { calculateGrowthStats } from '../../core/MathEngine';
import { getYoYCopy } from '../../core/Copywriter';
import { DonationModal } from '../ui/DonationModal';
import { ExportModal } from '../ui/ExportModal';

// Import the modular pages
import { GrowthPage1_Stats } from './growth/GrowthPage1_Stats';
import { GrowthPage2_Export } from './growth/GrowthPage2_Export';
import { GrowthExportCard } from './growth/GrowthExportCard';

export const Growth = () => {
  const { datasets, resetStore, setDateFilter, applyFilterAndCalculate, isDemo } = useLogbookStore();
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const closeRoute = isDemo ? '/demos' : '/';

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      window.umami?.track('Growth Dashboard Viewed', { device: 'desktop' });
    } else {
      const pageNames = ['Growth_Stats', 'Growth_Export'];
      window.umami?.track('Growth Page Viewed', { page: pageNames[currentIndex] || `Page_${currentIndex}` });
    }
  }, [currentIndex, isDesktop]);

  useEffect(() => {
    if (isDesktop) return;
    if (currentIndex === 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 15000); 

    return () => clearTimeout(timer);
  }, [currentIndex, isDesktop]);

  const handleNext = () => { if (currentIndex < 1) setCurrentIndex(prev => prev + 1); };
  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(prev => prev - 1); };
  
  const handleViewWrapped = (yearOrType: string) => {
    setIsNavigating(true);
    if (yearOrType === 'all_time') {
       setDateFilter({ type: 'all_time' });
    } else {
       setDateFilter({ type: 'custom', start: `${yearOrType}-01-01`, end: `${yearOrType}-12-31` });
    }
    applyFilterAndCalculate();
    navigate('/wrapped');
  };

  if (isNavigating) return <div className="min-h-screen w-full bg-slate-900" />;
  if (datasets.length !== 2 || !datasets[0].stats || !datasets[1].stats) return <Navigate to="/" replace />;

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
      try { await navigator.share({ title: 'LogbookWrapped', url: shareUrl }); } 
      catch (err: any) { if (err.name !== 'AbortError') copyToClipboard(shareUrl); }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    } catch (err) { console.error('Failed to copy', err); }
  };

  const desktopLayout = (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col items-center w-full max-w-5xl mx-auto px-4 md:px-6 py-12 gap-8 relative"
    >
      <Helmet><title>Growth Report | LogbookWrapped</title></Helmet>

      <div className="w-full flex justify-between items-center mb-2">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
          My LogbookWrapped <br className="md:hidden" /> Growth Report.
        </h1>
        <Link 
          to={closeRoute} 
          onClick={() => resetStore()} 
          className="bg-slate-800/80 hover:bg-slate-700 p-2.5 rounded-full text-white transition-all shadow-lg border border-yellow-400/30 hover:border-yellow-400/60 shrink-0"
        >
          <X size={20} />
        </Link>
      </div>

      <div className="flex flex-row w-full justify-center items-stretch gap-8">
        <div className="flex-1 flex justify-end items-stretch">
          <GrowthPage1_Stats nameA={nameA} nameB={nameB} gStats={gStats} copyText={copyText} isDesktop={true} />
        </div>
        <div className="flex-1 flex justify-start items-stretch">
          <GrowthPage2_Export nameA={nameA} nameB={nameB} copied={copied} onOpenExport={() => { window.umami?.track('Growth Export Opened'); setShowExport(true); }} onOpenDonation={() => { window.umami?.track('Donation Modal Opened', { source: 'growth_desktop' }); setShowDonation(true); }} onShareApp={() => { window.umami?.track('App Shared'); handleShareApp(); }} handleViewWrapped={handleViewWrapped} isDesktop={true} />
        </div>
      </div>
    </motion.div>
  );

  const mobileLayout = (
    <div className="fixed inset-0 z-[100] w-full h-[100dvh] bg-black overflow-hidden flex flex-col touch-none">
      <Helmet><title>Growth Report | LogbookWrapped</title></Helmet>
      <style>{`
        @keyframes fillProgress { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-progress { animation: fillProgress 15s linear forwards; }
      `}</style>
      
      <div className="absolute top-0 left-0 w-full z-50 flex gap-1 p-3 pt-4">
        {[0, 1].map((idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden bg-slate-800/50">
            <div className={`h-full bg-white ${idx < currentIndex ? 'w-full' : idx === currentIndex && idx !== 1 ? 'w-0 animate-progress' : idx === currentIndex && idx === 1 ? 'w-full animate-pulse' : 'w-0'}`} />
          </div>
        ))}
      </div>

      <div className="absolute top-8 right-4 z-[100]">
        <Link to={closeRoute} onClick={() => resetStore()} className="p-2 bg-black/50 hover:bg-black/80 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-yellow-400/30 block">
          <X size={20} />
        </Link>
      </div>

      {currentIndex === 1 ? (
        <>
          <div className="absolute left-0 top-0 z-40 cursor-pointer h-1/3 w-1/2" onClick={handlePrev} />
          <div className="absolute right-0 top-0 z-40 cursor-pointer h-1/3 w-1/2" onClick={handleNext} />
          <div className="absolute left-0 bottom-0 z-40 cursor-pointer h-[15%] w-1/2" onClick={handlePrev} />
          <div className="absolute right-0 bottom-0 z-40 cursor-pointer h-[15%] w-1/2" onClick={handleNext} />
        </>
      ) : (
        <>
          <div className="absolute left-0 top-0 z-40 cursor-pointer h-full w-1/3" onClick={handlePrev} />
          <div className="absolute right-0 top-0 z-40 cursor-pointer h-full w-2/3" onClick={handleNext} />
        </>
      )}

      <div className="w-full h-full relative z-10">
        {currentIndex === 0 ? (
          <GrowthPage1_Stats nameA={nameA} nameB={nameB} gStats={gStats} copyText={copyText} />
        ) : (
          <GrowthPage2_Export nameA={nameA} nameB={nameB} copied={copied} onOpenExport={() => setShowExport(true)} onOpenDonation={() => setShowDonation(true)} onShareApp={handleShareApp} handleViewWrapped={handleViewWrapped} />
        )}
      </div>
    </div>
  );

  return (
    <>
      {isDesktop ? desktopLayout : mobileLayout}

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
    </>
  );
};