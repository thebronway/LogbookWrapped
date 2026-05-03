import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Bug, Check, Forward, HandCoins, TrendingUp } from 'lucide-react';
import { CalculatedStats } from '../../../core/types';
import { useLogbookStore } from '../../../store/useLogbookStore';
import { useNavigate } from 'react-router-dom';

interface Props {
  // `stats` is kept in the interface for API symmetry with other story pages,
  // even though this final page doesn't currently render any of them.
  stats?: CalculatedStats;
  onOpenExport?: () => void;
  onOpenDonation?: () => void;
  isExportMode?: boolean;
}

export const Page11_Export: React.FC<Props> = ({ onOpenExport, onOpenDonation, isExportMode }) => {
  const { dateFilter, rawFlights, setDateFilter, applyFilterAndCalculate } = useLogbookStore();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const generateGrowthLink = () => {
    if (!rawFlights || rawFlights.length === 0) return null;
    const years = [...new Set(rawFlights.map(f => {
      const d = new Date(f.date);
      return isNaN(d.getTime()) ? null : d.getFullYear();
    }).filter(y => y !== null))] as number[];
    years.sort((a, b) => b - a);
    if (years.length >= 2) return { y1: years[1].toString(), y2: years[0].toString() };
    return null;
  };

  const growthYears = generateGrowthLink();

  const handleGrowthClick = () => {
    if (growthYears) {
      setDateFilter({ type: 'yoy', year1: growthYears.y1, year2: growthYears.y2 });
      applyFilterAndCalculate();
      setTimeout(() => navigate('/growth'), 50);
    }
  };

  const handleShareApp = async () => {
    const shareUrl = 'https://logbookwrapped.com';
    if (navigator.share) {
      try {
        await navigator.share({ title: 'LogbookWrapped', text: 'See your pilot logbook visualized! Check out LogbookWrapped:', url: shareUrl });
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col h-full w-full px-6 pt-24 pb-24 lg:p-0 bg-slate-950 lg:bg-transparent text-white overflow-y-auto justify-start lg:justify-center items-center"
    >
      {!isExportMode && (
        <div className="relative flex flex-col shrink-0 w-full max-w-sm lg:max-w-full h-auto lg:h-full bg-slate-900 rounded-2xl lg:rounded-none shadow-2xl lg:shadow-none border border-slate-800 lg:border-none overflow-hidden mb-12 lg:mb-0">
          
          <div className="p-8 pb-8 text-center bg-slate-800/50 sm:pt-16">
            <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
              Logbook Closed.<br />
              <span className="text-sky-400">See you in the skies.</span>
            </h2>
            <p className="text-slate-400 text-[11px] mt-4 font-bold uppercase tracking-widest">
              {titleX}Wrapped Complete
            </p>
          </div>

          <div className="relative flex items-center justify-between w-full h-0">
            <div className="absolute -left-4 w-8 h-8 bg-slate-950 rounded-full shadow-[inset_-2px_0_4px_rgba(0,0,0,0.5)] z-10"></div>
            <div className="w-full border-t-2 border-dashed border-slate-700 z-0 mx-2"></div>
            <div className="absolute -right-4 w-8 h-8 bg-slate-950 rounded-full shadow-[inset_2px_0_4px_rgba(0,0,0,0.5)] z-10"></div>
          </div>

          <div data-no-nav className="p-6 pt-8 flex flex-col flex-1 justify-center gap-4 sm:px-12 sm:pb-12">
            <button 
              onClick={() => {
                window.umami?.track('Export Modal Opened');
                if (onOpenExport) onOpenExport();
              }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
            >
              <Share2 size={18} />
              Share or Download
            </button>

            {growthYears && !['this_year', 'last_year', 'yoy'].includes(dateFilter?.type || '') && !(dateFilter?.type === 'custom' && dateFilter.start?.substring(0,4) === dateFilter.end?.substring(0,4)) && (
              <button 
                onClick={handleGrowthClick}
                className="w-full bg-slate-800 hover:bg-slate-700 text-purple-400 py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <TrendingUp size={18} />
                View {growthYears.y2} vs {growthYears.y1} Growth
              </button>
            )}

            <button 
              onClick={() => {
                window.umami?.track('Donation Modal Opened', { source: 'page_10' });
                if (onOpenDonation) onOpenDonation();
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-yellow-400 py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              <HandCoins size={18} />
              Help Keep the App Airborne
            </button>

            <button 
              onClick={() => {
                window.umami?.track('App Shared');
                handleShareApp();
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              {copied ? <Check size={18} /> : <Forward size={18} />}
              {copied ? 'Link Copied!' : 'Share App with a Wingman'}
            </button>

            <a 
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => window.umami?.track('Support Link Clicked', { source: 'dashboard_footer' })}
              className="w-full mt-3 text-slate-500 hover:text-slate-300 py-2 font-bold text-[13px] flex items-center justify-center gap-2 transition-colors"
            >
              <Bug size={14} />
              Report an Issue
            </a>
          </div>
        </div>
      )}
    </motion.div>
  );
};