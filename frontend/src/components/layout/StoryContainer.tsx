import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CalculatedStats } from '../../core/types';
import { Page1_Cover } from '../pages/story/Page1_Cover';
import { Page2_BigPicture } from '../pages/story/Page2_BigPicture';
import { Page3_Fleet } from '../pages/story/Page3_Fleet';
import { Page4_Extremes } from '../pages/story/Page4_Extremes';
import { Page5_Superlatives } from '../pages/story/Page5_Superlatives';
import { Page6_Elements } from '../pages/story/Page6_Elements';
import { Page7_Passport } from '../pages/story/Page7_Passport';
import { Page8_Stats } from '../pages/story/Page8_Stats';
import { Page9_GrowthHighlights } from '../pages/story/Page9_GrowthHighlights';
import { Page10_Community } from '../pages/story/Page10_Community';
import { Page11_Export } from '../pages/story/Page11_Export';
import { useLogbookStore } from '../../store/useLogbookStore';
import { ExportModal } from '../ui/ExportModal';
import { DonationModal } from '../ui/DonationModal';
import { getExportPages } from '../../config/ExportPages';

interface Props {
  stats: CalculatedStats;
  onClose: () => void;
}

export const StoryContainer: React.FC<Props> = ({ stats, onClose }) => {
  const { comparisonStats, dateFilter, isDemo } = useLogbookStore();
  
  // Community stats submission only makes sense for a single calendar year
  const isSingleYear = dateFilter?.type === 'this_year' || dateFilter?.type === 'last_year' || (dateFilter?.type === 'custom' && dateFilter.start?.substring(0,4) === dateFilter.end?.substring(0,4));
  const showCommunityPage = isSingleYear;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      window.umami?.track('Dashboard Viewed', { device: 'desktop' });
    } else {
      const pageNames = ['Cover', 'BigPicture', 'Fleet', 'Extremes', 'Superlatives', 'Elements', 'Passport', 'Stats'];
      if (comparisonStats) pageNames.push('Growth');
      if (showCommunityPage) pageNames.push('Community');
      pageNames.push('Export');
      window.umami?.track('Story Page Viewed', { page: pageNames[currentIndex] || `Page_${currentIndex}` });
    }
  }, [currentIndex, isDesktop]);

  const handleNext = () => {
    if (currentIndex < pages.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const pages = [
    <Page1_Cover stats={stats} key="p1" />,
    <Page2_BigPicture stats={stats} key="p2" />,
    <Page3_Fleet stats={stats} key="p3" />,
    <Page4_Extremes stats={stats} key="p4" />,
    <Page5_Superlatives stats={stats} key="p5" />,
    <Page6_Elements stats={stats} key="p6" />,
    <Page7_Passport stats={stats} key="p7" />,
    <Page8_Stats stats={stats} key="p8" />,
    ...(comparisonStats ? [<Page9_GrowthHighlights stats={stats} comparisonStats={comparisonStats} key="p9" />] : []),
    ...(showCommunityPage ? [<Page10_Community stats={stats} key="p10" onSkip={() => setCurrentIndex(prev => prev + 1)} />] : []),
    <Page11_Export 
      stats={stats} 
      key="p11"
      onOpenExport={() => setIsExportModalOpen(true)} 
      onOpenDonation={() => setIsDonationModalOpen(true)}
    />
  ];

  useEffect(() => {
    if (isDesktop) return;
    if (currentIndex === pages.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentIndex, isDesktop, pages.length]);

  if (isDesktop) {
    return (
      <>
        {isExportModalOpen && <ExportModal items={getExportPages(stats)} onClose={() => setIsExportModalOpen(false)} />}
        {isDonationModalOpen && <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />}
        
        <div className="w-full max-w-[1600px] mx-auto py-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8 px-4">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">My LogbookWrapped Dashboard.</h2>
          <button onClick={onClose} className="bg-slate-800/80 hover:bg-slate-700 p-2.5 rounded-full text-white transition-all shadow-lg border border-yellow-400/30 hover:border-yellow-400/60">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(650px,auto)] px-4 [&>div]:overflow-y-auto [&>div]:overflow-x-hidden">
          <div className="col-span-1 lg:col-span-2 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[0]}
          </div>
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[1]}
          </div>
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[2]}
          </div>
          {/* Passport spans 2 rows so it sits under Cover */}
          <div className="col-span-1 lg:col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[6]}
          </div>
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[3]}
          </div>
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[4]}
          </div>
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[5]}
          </div>
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[7]}
          </div>
          {/* Bottom row: Growth (optional), Community (optional), Export */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6 !overflow-visible">
            {pages.slice(8).map((page, idx) => (
              <div key={idx} className="rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative min-h-[700px] overflow-y-auto overflow-x-hidden">
                {page}
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      {isExportModalOpen && <ExportModal items={getExportPages(stats)} onClose={() => setIsExportModalOpen(false)} />}
      {isDonationModalOpen && <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />}
      
      <div className="fixed inset-0 z-[100] w-full h-[100dvh] bg-black overflow-hidden flex flex-col touch-none">
        
        <style>{`
          @keyframes fillProgress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: fillProgress 10s linear forwards;
          }
        `}</style>

        <div className="absolute top-0 left-0 w-full z-50 flex gap-1 p-3 pt-4">
          {pages.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden bg-slate-800/50">
              <div 
                className={`h-full bg-white ${
                  idx < currentIndex 
                    ? 'w-full' // Completed pages remain instantly full
                    : idx === currentIndex && idx !== pages.length - 1 
                      ? 'w-0 animate-progress' // Active playing page gets the 8s live fill
                      : idx === currentIndex && idx === pages.length - 1
                        ? 'w-full animate-pulse' // Last page (Export) pulses to show it's waiting for user action
                        : 'w-0' // Future pages remain empty
                }`} 
              />
            </div>
          ))}
        </div>
      <button onClick={onClose} className="absolute top-8 right-4 z-[100] bg-black/50 p-2 rounded-full text-white/70 hover:text-white hover:bg-black/80 transition-all backdrop-blur-md border border-yellow-400/30">
        <X size={20} />
      </button>

        {/* Touch navigation zones */}
        {currentIndex === pages.length - 1 ? (
          // Last page (Export): small corner zones only — page has interactive buttons
          <>
            <div className="absolute left-0 top-0 z-40 cursor-pointer h-1/3 w-1/2" onClick={handlePrev} />
            <div className="absolute right-0 top-0 z-40 cursor-pointer h-1/3 w-1/2" onClick={handleNext} />
            <div className="absolute left-0 bottom-0 z-40 cursor-pointer h-[15%] w-1/2" onClick={handlePrev} />
            <div className="absolute right-0 bottom-0 z-40 cursor-pointer h-[15%] w-1/2" onClick={handleNext} />
          </>
        ) : showCommunityPage && currentIndex === pages.length - 2 ? (
          // Community page (Page10): top strip only — bottom half has Share/Skip buttons
          <>
            <div className="absolute left-0 top-0 z-40 cursor-pointer h-1/4 w-1/2" onClick={handlePrev} />
            <div className="absolute right-0 top-0 z-40 cursor-pointer h-1/4 w-1/2" onClick={handleNext} />
          </>
        ) : (
          // All other pages: full height zones
          <>
            <div className="absolute left-0 top-0 z-40 cursor-pointer h-full w-1/3" onClick={handlePrev} />
            <div className="absolute right-0 top-0 z-40 cursor-pointer h-full w-2/3" onClick={handleNext} />
          </>
        )}

      <div className="w-full h-full relative z-10">
        {pages[currentIndex]}
      </div>
    </div>
    </>
  );
};