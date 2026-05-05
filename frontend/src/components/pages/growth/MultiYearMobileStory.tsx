import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { GrowthStats, CalculatedStats } from '../../../core/types';
import { GrowthBoard } from './GrowthBoard';
import { GrowthPage2_Export } from './GrowthPage2_Export';
import { MultiYearHighLowCard } from './MultiYearHighLowCard';

export interface MultiYearMobileStoryProps {
  pairs: { nameA: string; nameB: string; gStats: GrowthStats }[];
  yearData: { year: string; stats: CalculatedStats }[];
  firstYear: string;
  lastYear: string;
  copied: boolean;
  closeRoute: string;
  onResetStore: () => void;
  onOpenExport: () => void;
  onOpenDonation: () => void;
  onShareApp: () => void;
  handleViewWrapped: (yearOrType: string) => void;
  totalSlides: number;
  hasHighLow: boolean;
  highLowSlideIdx: number;
  isDemo?: boolean;
}

export const MultiYearMobileStory: React.FC<MultiYearMobileStoryProps> = ({
  pairs, yearData, firstYear, lastYear, copied, closeRoute, onResetStore,
  onOpenExport, onOpenDonation, onShareApp, handleViewWrapped, totalSlides,
  hasHighLow, highLowSlideIdx, isDemo
}) => {
  const [slide, setSlide] = useState(0);
  const isLastSlide = slide === totalSlides - 1;

  // Auto-advance for pair slides (not the final export slide)
  useEffect(() => {
    if (isLastSlide) return;
    const t = setTimeout(() => setSlide(p => p + 1), 10000);
    return () => clearTimeout(t);
  }, [slide, isLastSlide]);

  const goNext = () => setSlide(p => Math.min(totalSlides - 1, p + 1));
  const goPrev = () => setSlide(p => Math.max(0, p - 1));

  return (
    <div className="fixed inset-0 z-[100] w-full h-[100dvh] bg-black overflow-hidden flex flex-col touch-none">
      <style>{`
        @keyframes fillProgress { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-progress { animation: fillProgress 10s linear forwards; }
      `}</style>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full z-50 flex gap-1 p-3 pt-4">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <div className={`h-full bg-white ${
              idx < slide ? 'w-full'
              : idx === slide && !isLastSlide ? 'w-0 animate-progress'
              : idx === slide && isLastSlide ? 'w-full animate-pulse'
              : 'w-0'
            }`} />
          </div>
        ))}
      </div>

      {/* Close */}
      <div className="absolute top-8 right-4 z-[100]">
        <Link to={closeRoute} onClick={onResetStore} className="p-2 bg-black/50 hover:bg-black/80 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-yellow-400/30 block">
          <X size={20} />
        </Link>
      </div>

      {/* Touch zones */}
      {isLastSlide ? (
        <>
          <div className="absolute left-0 top-0 z-40 cursor-pointer h-1/3 w-1/2" onClick={goPrev} />
          <div className="absolute right-0 top-0 z-40 cursor-pointer h-1/3 w-1/2" onClick={goNext} />
          <div className="absolute left-0 bottom-0 z-40 cursor-pointer h-[15%] w-1/2" onClick={goPrev} />
          <div className="absolute right-0 bottom-0 z-40 cursor-pointer h-[15%] w-1/2" onClick={goNext} />
        </>
      ) : (
        <>
          <div className="absolute left-0 top-0 z-40 cursor-pointer h-full w-1/3" onClick={goPrev} />
          <div className="absolute right-0 top-0 z-40 cursor-pointer h-full w-2/3" onClick={goNext} />
        </>
      )}

      {/* Content */}
      <div className="w-full h-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {slide < pairs.length ? (
              <GrowthBoard
                gStats={pairs[slide].gStats}
                nameA={pairs[slide].nameA}
                nameB={pairs[slide].nameB}
                isExportMode={false}
                exportFormat="story"
              />
            ) : slide === highLowSlideIdx && hasHighLow ? (
              <MultiYearHighLowCard yearData={yearData} />
            ) : (
              <GrowthPage2_Export
                nameA={firstYear}
                nameB={lastYear}
                copied={copied}
                onOpenExport={onOpenExport}
                onOpenDonation={onOpenDonation}
                onShareApp={onShareApp}
                handleViewWrapped={handleViewWrapped}
                isDemo={isDemo}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
