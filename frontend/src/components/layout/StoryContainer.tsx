import React, { useState } from 'react';
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

  return (
    <div className="relative w-full max-w-md h-[800px] max-h-[90vh] bg-black rounded-xl overflow-hidden shadow-2xl flex flex-col group">
      
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 w-full z-50 flex gap-1 p-3">
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
      <button onClick={onClose} className="absolute top-6 right-4 z-[100] bg-black/50 p-2 rounded-full text-white/70 hover:text-white hover:bg-black/80 transition-all">
        <X size={20} />
      </button>

      {/* VISIBLE NAVIGATION CONTROLS */}
      {currentIndex > 0 && (
        <button 
          onClick={handlePrev} 
          className="absolute left-2 top-1/2 -translate-y-1/2 z-[100] bg-black/40 hover:bg-black/70 p-3 rounded-full text-white transition-all opacity-100"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {currentIndex < pages.length - 1 && (
        <button 
          onClick={handleNext} 
          className="absolute right-2 top-1/2 -translate-y-1/2 z-[100] bg-black/40 hover:bg-black/70 p-3 rounded-full text-white transition-all opacity-100"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Current Page Content */}
      <div className="w-full h-full relative z-10">
        {pages[currentIndex]}
      </div>
      
    </div>
  );
};