import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Compass, Plane, Briefcase, TrendingUp } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';

export const Demos = () => {
  const { status, datasets, setDateFilter, processFiles, dateFilter } = useLogbookStore();
  const navigate = useNavigate();

  // If a demo successfully processes (and bypasses config), route to the correct experience
  useEffect(() => {
    if (status === 'success' && datasets.length > 0 && datasets[0].stats) {
      if (dateFilter.type === 'yoy') {
        navigate('/growth');
      } else {
        navigate('/wrapped');
      }
    }
  }, [status, datasets, navigate, dateFilter.type]);

  const loadDemo = async (demoId: 'cfi' | 'regional' | 'private' | 'growth') => {
    try {
      (window as any).umami?.track('Demo Character Loaded', { character: demoId });
      
      // 1. SET THE FILE PATH BASED ON THE DEMO CLICKED
      let filePath = '';
      if (demoId === 'cfi' || demoId === 'private' || demoId === 'growth') {
        filePath = '/assets/demo_files/demo_a.csv';
      } else if (demoId === 'regional') {
        filePath = '/assets/demo_files/demo_b.csv';
      }

      const response = await fetch(filePath);
      if (!response.ok) throw new Error('Failed to fetch demo file');
      
      const blob = await response.blob();
      const file = new File([blob], `${demoId}_logbook.csv`, { type: 'text/csv' });

      // 2. SET THE DATES TO MATCH THE DATA IN THOSE FILES
      if (demoId === 'cfi') { // Sarah's IFR Era
        setDateFilter({ type: 'custom', start: '2023-01-01', end: '2023-12-31' });
      } 
      else if (demoId === 'regional') { // John's All Time
        setDateFilter({ type: 'all_time' });
      } 
      else if (demoId === 'private') { // Alex's Student Era
        setDateFilter({ type: 'milestone', label: 'Private Pilot Training', start: '2020-01-01', end: '2021-12-31' });
      }
      else if (demoId === 'growth') { // Mark's Pro Era YoY
        setDateFilter({ type: 'yoy', year1: '2026', year2: '2025' });
      }

      // Pass true to bypass the /config screen
      await processFiles([file], true);
    } catch (error) {
      console.error('Error loading demo:', error);
      alert("Failed to load demo data. Please try again.");
    }
  };

  const DemoCard = ({ id, name, title, desc, icon: Icon, colorClass, borderClass }: any) => (
    <button 
      onClick={() => loadDemo(id)}
      className={`relative overflow-hidden flex flex-col p-8 rounded-3xl bg-slate-800/40 border transition-all group text-left cursor-pointer hover:-translate-y-1 hover:shadow-2xl ${borderClass}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
      
      <div className="flex items-center gap-4 mb-4 z-10">
        <div className={`p-4 rounded-2xl ${colorClass}`}>
          <Icon size={32} className="text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white leading-tight">{name}</h3>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        </div>
      </div>
      
      <p className="text-slate-300 leading-relaxed mb-8 flex-grow z-10">
        {desc}
      </p>
      
      <div 
        className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all z-10 ${colorClass} group-hover:opacity-90 shadow-lg`}
      >
        <Play size={20} fill="currentColor" />
        Load Logbook
      </div>
    </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 md:px-6 py-12 lg:py-20 gap-12"
    >
      <Helmet>
        <title>Explore Examples | LogbookWrapped</title>
      </Helmet>

      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase italic">The Demo Hangar</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">Don't have your logbook exported yet? Meet our demo pilots and experience LogbookWrapped.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
        <DemoCard 
          id="cfi" 
          name="Sarah" 
          title="The IFR Explorer" 
          icon={Plane}
          colorClass="bg-sky-700"
          borderClass="border-sky-700/30 hover:border-sky-500"
          desc="Explore a 2023 Annual Review highlighting instrument training and cross-country progression across the Southeast."
        />
        <DemoCard 
          id="regional" 
          name="Captain John" 
          title="The Regional Lifer" 
          icon={Briefcase}
          colorClass="bg-indigo-700"
          borderClass="border-indigo-700/30 hover:border-indigo-500"
          desc="Visualize 15 years of Part 121 operations. See how the engine handles thousands of hours of high-volume East Coast flying."
        />
        <DemoCard 
          id="private" 
          name="Alex" 
          title="The Weekend Warrior" 
          icon={Compass}
          colorClass="bg-teal-700"
          borderClass="border-teal-700/30 hover:border-teal-500"
          desc="Follow a complete Private Pilot journey. This Milestone Tracker details 2020-2021 flights from day one to the checkride."
        />
        <DemoCard 
          id="growth" 
          name="Mark" 
          title="The West Coast Pro" 
          icon={TrendingUp}
          colorClass="bg-amber-700"
          borderClass="border-amber-700/30 hover:border-amber-500"
          desc="Analyze year-over-year progression. This Growth Report compares high-volume West Coast operations between 2027 and 2028."
        />
      </div>
    </motion.div>
  );
};