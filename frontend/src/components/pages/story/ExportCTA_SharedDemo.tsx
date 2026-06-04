import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { useLogbookStore } from '../../../store/useLogbookStore';
import { useNavigate } from 'react-router-dom';

export const ExportCTA_SharedDemo: React.FC = () => {
  const { dateFilter, isDemo, isSharedView, resetStore } = useLogbookStore();
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const isDemoFlow = isDemo && !isSharedView;

  let titleX = '';
  if (dateFilter?.type === 'this_year') titleX = `${new Date().getFullYear()} `;
  else if (dateFilter?.type === 'last_year') titleX = `${new Date().getFullYear() - 1} `;
  else if (dateFilter?.type === 'all_time') titleX = 'All-Time ';
  else if (dateFilter?.type === 'custom' && dateFilter.start && dateFilter.end) {
    if (dateFilter.start.endsWith('-01-01') && dateFilter.end.endsWith('-12-31')) {
      const startYear = dateFilter.start.substring(0, 4);
      if (startYear === dateFilter.end.substring(0, 4)) titleX = `${startYear} `;
    }
  }

  const headline = isDemoFlow ? (
    <>That was a demo <br /><span className="text-sky-400">logbook.</span></>
  ) : (
    <>That's someone's<br /><span className="text-sky-400">year in the skies.</span></>
  );
  const subline = isDemoFlow ? `${titleX}Wrapped · Demo Sample` : `${titleX}Wrapped · Shared Snapshot`;
  const primaryTarget = '/upload';
  const trackLocation = isDemoFlow ? 'demo_page11_primary' : 'page11_primary';
  const secondaryHref = isDemoFlow ? '/demos' : '/about';
  const secondaryLabel = isDemoFlow ? 'Browse more demo logbooks' : 'Learn more about LogbookWrapped';
  const footerNote = isDemoFlow
    ? 'Sample data for exploring the app. Upload your own logbook to generate personal stats.'
    : 'This view was generated from a shared link. No personal data was uploaded to make it visible.';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full w-full px-6 pt-24 pb-24 lg:p-0 bg-slate-950 lg:bg-transparent text-white overflow-y-auto justify-start lg:justify-center items-center"
    >
      <div className="relative flex flex-col shrink-0 w-full max-w-sm lg:max-w-full h-auto lg:h-full bg-slate-900 rounded-2xl lg:rounded-none shadow-2xl lg:shadow-none border border-slate-800 lg:border-none overflow-hidden mb-12 lg:mb-0">
        <div className="p-8 pb-8 text-center bg-slate-800/50 sm:pt-16">
          <h2 className="text-3xl font-black text-white leading-tight tracking-tight">{headline}</h2>
          <p className="text-slate-400 text-[11px] mt-4 font-bold uppercase tracking-widest">{subline}</p>
        </div>

        <div className="relative flex items-center justify-between w-full h-0">
          <div className="absolute -left-4 w-8 h-8 bg-slate-950 rounded-full shadow-[inset_-2px_0_4px_rgba(0,0,0,0.5)] z-10"></div>
          <div className="w-full border-t-2 border-dashed border-slate-700 z-0 mx-2"></div>
          <div className="absolute -right-4 w-8 h-8 bg-slate-950 rounded-full shadow-[inset_2px_0_4px_rgba(0,0,0,0.5)] z-10"></div>
        </div>

        <div data-no-nav className={`p-6 pt-8 flex flex-col flex-1 justify-center gap-4 sm:px-12 sm:pb-12 ${!isReady ? 'pointer-events-none' : ''}`}>
          <button
            disabled={!isReady}
            onClick={() => {
              window.umami?.track(isDemoFlow ? 'Demo CTA Clicked' : 'Shared View CTA Clicked', { location: trackLocation });
              resetStore();
              navigate(primaryTarget);
            }}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-500/20 hover:-translate-y-0.5"
          >
            <Plane size={18} />
            Create Your Own LogbookWrapped
          </button>

          <a
            href={secondaryHref}
            onClick={() => window.umami?.track(isDemoFlow ? 'Demo CTA Clicked' : 'Shared View CTA Clicked', { location: `${trackLocation.replace('primary', 'secondary')}` })}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            {secondaryLabel}
          </a>

          <p className="text-[11px] text-slate-500 text-center mt-2 leading-relaxed">{footerNote}</p>
        </div>
      </div>
    </motion.div>
  );
};
