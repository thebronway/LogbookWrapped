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

interface Props {
  stats: CalculatedStats;
  onClose: () => void;
}

export const StoryContainer: React.FC<Props> = ({ stats, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Listen for screen resizes to switch between Story Mode and Dashboard Mode
  useEffect(() => {
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
    <Page8_Summary stats={stats} key="p8" />
  ];

  const handleNext = () => {
    if (currentIndex < pages.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  // ==========================================
  // DESKTOP LAYOUT: The Dashboard Bento Box
  // ==========================================
  if (isDesktop) {
    return (
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
    );
  }

  // ==========================================
  // MOBILE LAYOUT: Immersive Full Screen Story
  // ==========================================
  return (
    <div className="fixed inset-0 z-[100] w-full h-[100dvh] bg-black overflow-hidden flex flex-col touch-none">
      
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 w-full z-50 flex gap-1 p-3 pt-4">
        {pages.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-white transition-all duration-300 ${
                idx < currentIndex ? 'w-full' : idx === currentIndex ? 'w-full animate-pulse' : 'w-0'
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
      <div 
        className="absolute left-0 top-0 w-1/3 h-full z-40 cursor-pointer" 
        onClick={handlePrev} 
      />
      <div 
        className="absolute right-0 top-0 w-2/3 h-full z-40 cursor-pointer" 
        onClick={handleNext} 
      />

      {/* Ghost UI Indicators */}
      {currentIndex > 0 && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-black/40 p-2 rounded-full text-white/50 pointer-events-none">
          <ChevronLeft size={20} />
        </div>
      )}
      {currentIndex < pages.length - 1 && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-black/40 p-2 rounded-full text-white/50 pointer-events-none">
          <ChevronRight size={20} />
        </div>
      )}

      {/* Current Page Content */}
      <div className="w-full h-full relative z-10">
        {pages[currentIndex]}
      </div>
    </div>
  );
};