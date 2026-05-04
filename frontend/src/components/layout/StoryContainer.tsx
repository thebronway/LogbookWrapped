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
import { getExportPages } from '../../core/ExportPages';

interface Props {
  stats: CalculatedStats;
  onClose: () => void;
}

export const StoryContainer: React.FC<Props> = ({ stats, onClose }) => {
  const { comparisonStats, dateFilter, isSharedView } = useLogbookStore();

  // Community stats submission only makes sense for a single calendar year
  // AND only when the viewer owns the data. Shared-view viewers see a
  // snapshot, so the tollbooth would be meaningless for them.
  const showCommunityPage =
    !isSharedView &&
    (dateFilter?.type === 'this_year' ||
      dateFilter?.type === 'last_year' ||
      (dateFilter?.type === 'custom' && dateFilter.start?.substring(0, 4) === dateFilter.end?.substring(0, 4)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
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

  // Named page elements shared between the mobile story sequence and the
  // desktop dashboard grid.
  const p1  = <Page1_Cover stats={stats} key="p1" />;
  const p2  = <Page2_BigPicture stats={stats} key="p2" />;
  const p3  = <Page3_Fleet stats={stats} key="p3" />;
  const p4  = <Page4_Extremes stats={stats} key="p4" />;
  const p5  = <Page5_Superlatives stats={stats} key="p5" />;
  const p6  = <Page6_Elements stats={stats} key="p6" />;
  const p7  = <Page7_Passport stats={stats} key="p7" />;
  const p8  = <Page8_Stats stats={stats} key="p8" />;
  const p9  = comparisonStats ? <Page9_GrowthHighlights stats={stats} comparisonStats={comparisonStats} key="p9" /> : null;
  const p10 = showCommunityPage ? <Page10_Community stats={stats} key="p10" onSkip={() => setCurrentIndex(prev => prev + 1)} /> : null;
  const p11 = (
    <Page11_Export
      stats={stats}
      key="p11"
      onOpenExport={() => setIsExportModalOpen(true)}
      onOpenDonation={() => setIsDonationModalOpen(true)}
    />
  );

  // Mobile: sequential story array
  const pages = [p1, p2, p3, p4, p5, p6, p7, p8, ...(p9 ? [p9] : []), ...(p10 ? [p10] : []), p11];

  // Desktop Row 3 contains the optional/export pages after Stats. When fewer
  // than 3 natural row-3 cards exist, Stats (p8) drops down to fill the row
  // and Elements (p6) expands into the vacated slot in Row 2.
  const row3Natural = [p9, p10, p11].filter(Boolean) as React.ReactElement[];
  const statsMovesToRow3 = row3Natural.length < 3;
  const row3Items: React.ReactElement[] = statsMovesToRow3
    ? [...row3Natural.filter(p => p !== p11), p8, p11]
    : row3Natural;

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
        {isExportModalOpen && <ExportModal items={getExportPages(stats)} stats={stats} onClose={() => setIsExportModalOpen(false)} />}
        {isDonationModalOpen && <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />}
        
        <div className="w-full max-w-[1600px] mx-auto py-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8 px-4">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">My LogbookWrapped Dashboard.</h2>
          <button onClick={onClose} className="bg-slate-800/80 hover:bg-slate-700 p-2.5 rounded-full text-white transition-all shadow-lg border border-yellow-400/30 hover:border-yellow-400/60">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(650px,auto)] px-4 [&>div]:overflow-y-auto [&>div]:overflow-x-hidden">

          {/* ── Row 1 ─────────────────────────────────────────────── */}
          {/* Cover (wide) */}
          <div className="col-span-1 lg:col-span-2 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {p1}
          </div>
          {/* Big Picture */}
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {p2}
          </div>
          {/* Fleet */}
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {p3}
          </div>

          {/* ── Row 2 ─────────────────────────────────────────────── */}
          {/* Passport — spans 2 rows so rows 2 & 3 right-side cards sit beside it */}
          <div className="col-span-1 lg:col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {p7}
          </div>
          {/* Extremes */}
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {p4}
          </div>
          {/* Superlatives */}
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {p5}
          </div>
          {/* Elements — expands to col-span-2 when Stats has moved to Row 3 */}
          <div className={`col-span-1 ${statsMovesToRow3 ? 'lg:col-span-2' : 'lg:col-span-1'} row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative`}>
            {p6}
          </div>
          {/* Stats — only rendered in Row 2 when it is NOT moving to Row 3 */}
          {!statsMovesToRow3 && (
            <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
              {p8}
            </div>
          )}

          {/* ── Row 3 ─────────────────────────────────────────────── */}
          {/* Dynamic bottom row (2 or 3 cards). Grid columns match item count
              so cards always span the full width. */}
          <div className={`col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 gap-6 !overflow-visible ${row3Items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
            {row3Items.map((page, idx) => (
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
      {isExportModalOpen && <ExportModal items={getExportPages(stats)} stats={stats} onClose={() => setIsExportModalOpen(false)} />}
      {isDonationModalOpen && <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />}
      
      <div
        className="fixed inset-0 z-[100] w-full h-[100dvh] bg-black overflow-hidden flex flex-col touch-none"
        onPointerDown={(e) => {
          // Let interactive elements manage their own pointer events.
          if ((e.target as HTMLElement).closest('[data-no-nav], button, a, input, select, textarea')) return;
          e.clientX < window.innerWidth / 2 ? handlePrev() : handleNext();
        }}
      >
        
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
              {/* Completed: full. Active: 10s live fill. Last page (Export): pulses awaiting action. Future: empty. */}
              <div
                key={`progress-${idx}-${currentIndex}`}
                className={`h-full bg-white ${
                  idx < currentIndex
                    ? 'w-full'
                    : idx === currentIndex && idx !== pages.length - 1
                      ? 'w-0 animate-progress'
                      : idx === currentIndex && idx === pages.length - 1
                        ? 'w-full animate-pulse'
                        : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>
      <button onClick={onClose} className="absolute top-8 right-4 z-[100] bg-black/50 p-2 rounded-full text-white/70 hover:text-white hover:bg-black/80 transition-all backdrop-blur-md border border-yellow-400/30">
        <X size={20} />
      </button>

      <div className="w-full h-full relative z-10">
        {pages[currentIndex]}
      </div>
    </div>
    </>
  );
};