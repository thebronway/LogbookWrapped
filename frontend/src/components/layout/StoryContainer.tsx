import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CalculatedStats } from '../../core/types';
import { Page1_Cover } from '../pages/Page1_Cover';
import { Page2_BigPicture } from '../pages/Page2_BigPicture';
import { Page3_Fleet } from '../pages/Page3_Fleet';
import { Page4_Extremes } from '../pages/Page4_Extremes';
import { Page5_Superlatives } from '../pages/Page5_Superlatives';
import { Page6_Elements } from '../pages/Page6_Elements';
import { Page7_Passport } from '../pages/Page7_Passport';
import { Page8_Stats } from '../pages/Page8_Stats';
import { Page9_Export } from '../pages/Page9_Export';
import { ExportModal } from '../ui/ExportModal';
import { DonationModal } from '../ui/DonationModal';

interface Props {
  stats: CalculatedStats;
  onClose: () => void;
}

export const StoryContainer: React.FC<Props> = ({ stats, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
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
    <Page2_BigPicture stats={stats} key="p2" />,
    <Page3_Fleet stats={stats} key="p3" />,
    <Page4_Extremes stats={stats} key="p4" />,
    <Page5_Superlatives stats={stats} key="p5" />,
    <Page6_Elements stats={stats} key="p6" />,
    <Page7_Passport stats={stats} key="p7" />,
    <Page8_Stats stats={stats} key="p8" />,
    <Page9_Export 
      stats={stats} 
      key="p9" 
      onOpenExport={() => setIsExportModalOpen(true)} 
      onOpenDonation={() => setIsDonationModalOpen(true)}
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
    }, 10000); // 8 seconds per slide

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
      {isDonationModalOpen && <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />}
        
        <div className="w-full max-w-[1600px] mx-auto py-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8 px-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">Your Aviation Dashboard</h2>
          <button onClick={onClose} className="bg-slate-800/80 hover:bg-slate-700 p-2.5 rounded-full text-white transition-all shadow-lg border border-slate-700">
            <X size={20} />
          </button>
        </div>

        {/* CSS Grid dynamically mapping the 8 pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(380px,auto)] px-4 [&>div]:overflow-y-auto [&>div]:overflow-x-hidden">
          {/* Row 1: Cover (pages[0]), Big Picture (pages[1]), Fleet (pages[2]) */}
          <div className="col-span-1 lg:col-span-2 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[0]}
          </div>
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[1]}
          </div>
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[2]}
          </div>
          
          {/* Row 2 & 3: Passport (pages[6]) rendered here so it sits under Cover */}
          <div className="col-span-1 lg:col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[6]}
          </div>
          
          {/* Row 2 & 3 Right Side: Extremes (pages[3]), Superlatives (pages[4]), Elements (pages[5]) stacked next to Passport */}
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[3]}
          </div>
          <div className="col-span-1 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[4]}
          </div>
          <div className="col-span-1 lg:col-span-2 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[5]}
          </div>

          {/* Bottom Row: Stats (Left) & Export (Right) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[7]}
          </div>
          
          <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative">
            {pages[8]}
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
      {isDonationModalOpen && <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />}
      
      <div className="fixed inset-0 z-[100] w-full h-[100dvh] bg-black overflow-hidden flex flex-col touch-none">
        
        {/* Custom Animation for the 8-second progress bar fill */}
        <style>{`
          @keyframes fillProgress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: fillProgress 10s linear forwards;
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
      {/* On the last page, we shrink the touch zones to the top/sides so they don't block the CTA buttons in the middle */}
      <div 
        className={`absolute left-0 top-0 z-40 cursor-pointer h-full ${currentIndex === pages.length - 1 ? 'w-1/4' : 'w-1/3'}`} 
        onClick={handlePrev} 
      />
      <div 
        className={`absolute right-0 top-0 z-40 cursor-pointer h-full ${currentIndex === pages.length - 1 ? 'w-1/4' : 'w-2/3'}`} 
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