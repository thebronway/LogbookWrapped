import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { CalculatedStats } from '../../core/types';
import { Page1_Cover } from '../pages/Page1_Cover';
import { Page2_FootprintMap } from '../pages/Page2_FootprintMap';
import { Page3_Fleet } from '../pages/Page3_Fleet';
import { Page4_BigPicture } from '../pages/Page4_BigPicture';
import { Page5_Extremes } from '../pages/Page5_Extremes';
import { Page6_Superlatives } from '../pages/Page6_Superlatives';
import { Page7_Elements } from '../pages/Page7_Elements';
import { Page8_Summary } from '../pages/Page8_Summary';
import { ExportModal } from '../ui/ExportModal';
import { PosterModal } from '../ui/PosterModal';
import { DonationModal } from '../ui/DonationModal';

interface Props {
  stats: CalculatedStats;
  onClose: () => void;
}

export const StoryContainer: React.FC<Props> = ({ stats, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  // Listen for screen resizes to switch between Story Mode and Dashboard Mode
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when dashboard mounts
    
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pages = [
    <Page1_Cover stats={stats} key="p1" />,
    <Page2_FootprintMap stats={stats} key="p2" />,
    <Page3_Fleet stats={stats} key="p3" />,
    <Page4_BigPicture stats={stats} key="p4" />,
    <Page5_Extremes stats={stats} key="p5" />,
    <Page6_Superlatives stats={stats} key="p6" />,
    <Page7_Elements stats={stats} key="p7" />,
    <Page8_Summary 
      stats={stats} 
      key="p8" 
      onOpenExport={() => setIsExportModalOpen(true)} 
      onOpenDonation={() => setIsDonationModalOpen(true)}
      onOpenPoster={() => setIsPosterModalOpen(true)}
    />
  ];

  const handleNext = () => {
    if (currentIndex < pages.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  // Auto-advance timer (Mobile Only)
  useEffect(() => {
    if (isDesktop) return; // Don't auto-advance the desktop bento dashboard
    
    // Stop auto-advancing if we are on the last page (Summary/Export)
    if (currentIndex === pages.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 8000); // 8 seconds per slide

    // If the user manually taps the screen, this cleanup clears the timer 
    // so it doesn't double-skip!
    return () => clearTimeout(timer);
  }, [currentIndex, isDesktop, pages.length]);

  // ==========================================
  // DESKTOP LAYOUT: The Dashboard Bento Box
  // ==========================================
  if (isDesktop) {
    return (
      <>
        {isExportModalOpen && <ExportModal stats={stats} onClose={() => setIsExportModalOpen(false)} />}
        {isPosterModalOpen && <PosterModal isOpen={isPosterModalOpen} onClose={() => setIsPosterModalOpen(false)} />}
        {isDonationModalOpen && <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />}
        
        <div className="w-full max-w-[1600px] mx-auto py-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8 px-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">Your Aviation Dashboard</h2>
          <button onClick={onClose} className="bg-slate-800/80 hover:bg-slate-700 p-2.5 rounded-full text-white transition-all shadow-lg border border-slate-700">
            <X size={20} />
          </button>
        </div>

        {/* CSS Grid dynamically mapping the 8 pages */}
        {/* minmax allows rows to expand if content is too tall, and [&>div]:overflow-y-auto turns bento cells into scrollable widgets if needed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(380px,auto)] px-4 [&>div]:overflow-y-auto [&>div]:overflow-x-hidden">
          <div className="col-span-1 lg:col-span-2 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[0]}
          </div>
          <div className="col-span-1 lg:col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[1]}
          </div>
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[2]}
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
          <div className="col-span-1 lg:col-span-2 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[6]}
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[7]}
          </div>
        </div>
      </div>
      </>
    );
  }

  // ==========================================
  // MOBILE LAYOUT: Immersive Full Screen Story
  // ==========================================
  return (
    <>
      {isExportModalOpen && <ExportModal stats={stats} onClose={() => setIsExportModalOpen(false)} />}
      {isPosterModalOpen && <PosterModal isOpen={isPosterModalOpen} onClose={() => setIsPosterModalOpen(false)} />}
      {isDonationModalOpen && <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />}
      
      <div className="fixed inset-0 z-[100] w-full h-[100dvh] bg-black overflow-hidden flex flex-col touch-none">
        
        {/* Custom Animation for the 8-second progress bar fill */}
        <style>{`
          @keyframes fillProgress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: fillProgress 8s linear forwards;
          }
        `}</style>

        {/* Progress Bars */}
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
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-8 right-4 z-[100] bg-black/50 p-2 rounded-full text-white/70 hover:text-white hover:bg-black/80 transition-all backdrop-blur-md">
        <X size={20} />
      </button>

      {/* Invisible Touch Zones (Better UX than tiny buttons) */}
      {/* On the last page, we shrink the height so they don't block your call-to-action buttons! */}
      <div 
        className={`absolute left-0 top-0 w-1/3 z-40 cursor-pointer ${currentIndex === pages.length - 1 ? 'h-[25%]' : 'h-full'}`} 
        onClick={handlePrev} 
      />
      <div 
        className={`absolute right-0 top-0 w-2/3 z-40 cursor-pointer ${currentIndex === pages.length - 1 ? 'h-[25%]' : 'h-full'}`} 
        onClick={handleNext} 
      />

      {/* Current Page Content */}
      <div className="w-full h-full relative z-10">
        {pages[currentIndex]}
      </div>
    </div>
    </>
  );
};