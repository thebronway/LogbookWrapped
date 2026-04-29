import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import { Calendar, Trophy, Globe, ArrowUpRight, AlertCircle, TrendingUp } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';

type ConfigMode = 'annual' | 'milestone' | 'all_time' | 'yoy';

export const Config = () => {
  const { datasets, dateFilter, setDateFilter, applyFilterAndCalculate, status } = useLogbookStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<ConfigMode>('annual');
  const [error, setError] = useState<string | null>(null);
  const [milestoneType, setMilestoneType] = useState<string>('None');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  if (datasets.length === 0) {
    return <Navigate to="/" replace />;
  }

  const validateDates = (start?: string, end?: string) => {
    if (!start || !end) return false;
    const startYear = new Date(start).getFullYear();
    const endYear = new Date(end).getFullYear();
    if (startYear < 1900 || startYear > currentYear + 1) return false;
    if (endYear < 1900 || endYear > currentYear + 1) return false;
    if (new Date(start) > new Date(end)) return false;
    return true;
  };

  const handleGenerate = () => {
    setError(null);

    if (mode === 'milestone') {
      if (!validateDates(dateFilter.start, dateFilter.end)) {
        setError('Please enter valid start and end dates.');
        return;
      }
    }

    (window as any).umami?.track('Generate Wrapped Clicked', {
      mode: mode, 
      filter_type: dateFilter.type,
      file_count: datasets.length,
      milestone_title: mode === 'milestone' ? dateFilter.label : undefined,
      yoy_year1: mode === 'yoy' ? dateFilter.year1 : undefined,
      yoy_year2: mode === 'yoy' ? dateFilter.year2 : undefined,
      annual_year: mode === 'annual' && dateFilter.start ? dateFilter.start.substring(0, 4) : undefined
    });

    applyFilterAndCalculate();
    
    setTimeout(() => {
      const currentStatus = useLogbookStore.getState().status;
      if (currentStatus === 'error') {
        setError(useLogbookStore.getState().errorMessage || 'No flights found in this date range.');
      } else {
        // Replace history so clicking 'back' from the dashboard goes directly to Home
        navigate(mode === 'yoy' ? '/growth' : '/wrapped', { replace: true });
      }
    }, 100);
  };

  const OptionCard = ({ id, icon: Icon, title, desc, selected, onClick }: any) => (
    <div 
      id={`option-card-${id}`}
      onClick={onClick}
      className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex items-start gap-4 ${
        selected ? 'border-yellow-400 bg-yellow-400/5 shadow-lg shadow-yellow-400/10' : 'border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800'
      }`}
    >
      <div className={`p-3 rounded-xl ${selected ? 'bg-yellow-400/20 text-yellow-400' : 'bg-slate-700/50 text-slate-400'}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className={`font-bold text-lg mb-1 ${selected ? 'text-white' : 'text-slate-200'}`}>{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 md:px-6 py-12"
    >
      <Helmet>
        <title>Configure Your Story | LogbookWrapped</title>
      </Helmet>

      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Configure your LogbookWrapped</h1>
      </div>

      <div className="w-full space-y-8">
        {datasets.length === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OptionCard 
              id="annual" icon={Calendar} title="Annual Review" desc="Your stats for a specific calendar year." 
              selected={mode === 'annual'} 
              onClick={() => { setMode('annual'); setDateFilter({ type: 'custom', start: `${currentYear}-01-01`, end: `${currentYear}-12-31` }); }} 
            />
            <OptionCard 
              id="milestone" icon={Trophy} title="Milestone / Custom" desc="Analyze training or a custom date range." 
              selected={mode === 'milestone'} 
              onClick={() => { 
                setMode('milestone'); 
                setDateFilter({ type: 'milestone', start: '', end: '', label: (milestoneType === 'Other' || milestoneType === 'None') ? '' : milestoneType }); 
              }} 
            />
            <OptionCard 
              id="all_time" icon={Globe} title="All-Time Journey" desc="Your entire logbook history combined." 
              selected={mode === 'all_time'} 
              onClick={() => { setMode('all_time'); setDateFilter({ type: 'all_time' }); }} 
            />
            <OptionCard 
              id="yoy" icon={TrendingUp} title="Year over Year" desc="See your growth across two different years." 
              selected={mode === 'yoy'} 
              onClick={() => { setMode('yoy'); setDateFilter({ type: 'yoy', year1: currentYear.toString(), year2: (currentYear - 1).toString() }); }} 
            />
          </div>
        )}

        <div className="bg-slate-800/40 border border-slate-700 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
          
          {mode === 'annual' && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-300">Select Year</label>
              <select 
                value={dateFilter.type === 'custom' ? dateFilter.start?.substring(0, 4) : currentYear.toString()}
                onChange={(e) => {
                  const year = e.target.value;
                  setDateFilter({ type: 'custom', start: `${year}-01-01`, end: `${year}-12-31` });
                }}
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none font-medium appearance-none cursor-pointer"
              >
                {years.map(year => (
                  <option key={`annual-${year}`} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}

          {mode === 'milestone' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-300">Milestone (Optional)</label>
                <select 
                  value={milestoneType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMilestoneType(val);
                    setDateFilter({ ...dateFilter, label: (val === 'Other' || val === 'None') ? '' : val });
                  }}
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none font-medium appearance-none cursor-pointer"
                >
                  <option value="None">No Milestone (Date Range Only)</option>
                  <option value="Private Pilot License">Private Pilot License</option>
                  <option value="Instrument Rating">Instrument Rating</option>
                  <option value="Commercial Pilot License">Commercial Pilot License</option>
                  <option value="Multi-Engine Rating">Multi-Engine Rating</option>
                  <option value="Other">Other (Custom Title)</option>
                </select>
              </div>

              {milestoneType === 'Other' && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-300">Custom Title (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Tailwheel Checkout" 
                    maxLength={15}
                    value={dateFilter.label || ''}
                    onChange={(e) => setDateFilter({ ...dateFilter, label: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">If provided, this will appear on the cover page of your Wrapped.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-300">Start Date</label>
                  <input 
                    type="date" 
                    min="1900-01-01"
                    max="2099-12-31"
                    value={dateFilter.start || ''}
                    onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 h-[50px] focus:ring-2 focus:ring-sky-500 outline-none block appearance-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-300">End Date</label>
                  <input 
                    type="date" 
                    min="1900-01-01"
                    max="2099-12-31"
                    value={dateFilter.end || ''}
                    onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 h-[50px] focus:ring-2 focus:ring-sky-500 outline-none block appearance-none"
                  />
                </div>
              </div>
            </div>
          )}

          {mode === 'yoy' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-sky-300">Year 1</label>
                <select 
                  value={dateFilter.year1 || currentYear.toString()}
                  onChange={(e) => setDateFilter({ ...dateFilter, year1: e.target.value })}
                  className="w-full bg-slate-900 border border-sky-500/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none font-medium appearance-none cursor-pointer"
                >
                  {years.map(year => <option key={`y1-${year}`} value={year}>{year}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-purple-300">Year 2</label>
                <select 
                  value={dateFilter.year2 || (currentYear - 1).toString()}
                  onChange={(e) => setDateFilter({ ...dateFilter, year2: e.target.value })}
                  className="w-full bg-slate-900 border border-purple-500/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none font-medium appearance-none cursor-pointer"
                >
                  {years.map(year => <option key={`y2-${year}`} value={year}>{year}</option>)}
                </select>
              </div>
            </div>
          )}

          {mode === 'all_time' && (
            <div className="text-center py-4">
              <Globe className="mx-auto text-sky-400 mb-2 opacity-50" size={48} />
              <p className="text-slate-300 font-medium">Ready to process your entire aviation history.</p>
            </div>
          )}

        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 p-4 rounded-xl">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <button 
          onClick={handleGenerate}
          className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-1 bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg shadow-yellow-500/20"
        >
          {mode === 'yoy' ? 'Analyze My Growth' : 'Generate My Wrapped'}
          <ArrowUpRight size={24} />
        </button>

      </div>
    </motion.div>
  );
};