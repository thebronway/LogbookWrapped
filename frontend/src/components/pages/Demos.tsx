import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Compass, Plane, Briefcase, TrendingUp, Calendar, Globe, Map, ArrowRight } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';

export const Demos = () => {
  const { setDateFilter, processFiles, resetStore, setIsDemo } = useLogbookStore();
  const navigate = useNavigate();
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);

  useEffect(() => {
    resetStore();
  }, [resetStore]);

  const loadDemo = async (fileName: string, filterConfig: any, actionId: string) => {
    try {
      setLoadingDemo(actionId);
      window.umami?.track('Demo Loaded', { file: fileName, filterType: filterConfig.type });
      
      const response = await fetch(`/assets/demo_files/${fileName}`);
      if (!response.ok) throw new Error('Failed to fetch demo file');
      
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'text/csv' });

      setIsDemo(true);
      setDateFilter(filterConfig);
      await processFiles([file], true);
      setLoadingDemo(null);
      if (filterConfig.type === 'yoy') {
        navigate('/growth');
      } else {
        navigate('/wrapped');
      }
    } catch (error) {
      console.error('Error loading demo:', error);
      alert("Failed to load demo data. Please try again.");
      setLoadingDemo(null);
    }
  };

  // Persona header over two distinct report slots (Wrapped vs Growth) so
  // viewers can tell at a glance they're picking between two product views.
  const DemoCard = ({ name, title, desc, icon: Icon, colorClass, borderClass, fileName, actions }: any) => {
    const wrappedAction = actions.find((a: any) => a.kind === 'wrapped') || actions[0];
    const growthAction = actions.find((a: any) => a.kind === 'growth') || actions[1];
    const wrappedIdx = actions.indexOf(wrappedAction);
    const growthIdx = actions.indexOf(growthAction);

    return (
      <div className={`relative overflow-hidden flex flex-col p-6 sm:p-8 rounded-3xl bg-slate-800/40 border transition-all text-left shadow-xl ${borderClass}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />

        <div className="flex items-center gap-4 mb-4 z-10">
          <div className={`p-4 rounded-2xl ${colorClass}`}>
            <Icon size={32} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white leading-tight">{name}</h3>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</span>
          </div>
        </div>

        <p className="text-slate-300 leading-relaxed mb-6 z-10">{desc}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 z-10 w-full mt-auto">
          {/* Wrapped slot */}
          {wrappedAction && (() => {
            const actionId = `${fileName}-${wrappedIdx}`;
            const isLoading = loadingDemo === actionId;
            const ActionIcon = wrappedAction.icon || Calendar;
            return (
              <button
                key="wrapped"
                disabled={loadingDemo !== null}
                onClick={() => loadDemo(fileName, wrappedAction.filter, actionId)}
                className={`group relative overflow-hidden flex flex-col items-start gap-2 p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700 hover:border-sky-500/60 transition-all text-left ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10'
                }`}
              >
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-sky-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Yearly Wrapped
                </div>
                <div className="flex items-center gap-2 text-white font-black text-base leading-tight">
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ActionIcon size={18} className="text-sky-400" />
                  )}
                  {wrappedAction.label}
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  Story-format recap with maps, stats & superlatives
                </div>
              </button>
            );
          })()}

          {/* Growth slot */}
          {growthAction && (() => {
            const actionId = `${fileName}-${growthIdx}`;
            const isLoading = loadingDemo === actionId;
            const ActionIcon = growthAction.icon || TrendingUp;
            return (
              <button
                key="growth"
                disabled={loadingDemo !== null}
                onClick={() => loadDemo(fileName, growthAction.filter, actionId)}
                className={`group relative overflow-hidden flex flex-col items-start gap-2 p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700 hover:border-purple-500/60 transition-all text-left ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10'
                }`}
              >
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-purple-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Growth Report
                </div>
                <div className="flex items-center gap-2 text-white font-black text-base leading-tight">
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ActionIcon size={18} className="text-purple-400" />
                  )}
                  {growthAction.label}
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  Side-by-side year-over-year comparison
                </div>
              </button>
            );
          })()}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 md:px-6 py-12 lg:py-20 gap-12"
    >
      <Helmet>
        <title>Explore Examples & Demos | LogbookWrapped</title>
        <meta name="description" content="Try LogbookWrapped without uploading your own data. Explore interactive demo logbooks for student pilots, career captains, and weekend aviators." />
        <link rel="canonical" href="https://logbookwrapped.com/demos" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "LogbookWrapped Interactive Demos",
            "description": "A collection of sample pilot logbooks demonstrating the parsing and visualization capabilities of LogbookWrapped.",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Annual Review Demo" },
              { "@type": "ListItem", "position": 2, "name": "Career Pilot Demo" },
              { "@type": "ListItem", "position": 3, "name": "Student Pilot Milestone Demo" },
              { "@type": "ListItem", "position": 4, "name": "Cross Country Pilot Demo" }
            ]
          })}
        </script>
      </Helmet>

      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase italic">The Demo Hangar</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">Don't have your logbook exported yet? Try our demos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
        <DemoCard
          fileName="demo_2026.csv"
          name="Sarah"
          title="The Annual Reviewer"
          icon={Plane}
          colorClass="bg-sky-700"
          borderClass="border-sky-700/30"
          desc="Explore a complete 2026 Annual Review highlighting recent training and flight progression over a single year."
          actions={[
            { kind: 'wrapped', label: "2026 Wrapped", icon: Calendar, filter: { type: 'custom', start: '2026-01-01', end: '2026-12-31' } },
            { kind: 'growth', label: "'25 vs '26", icon: TrendingUp, filter: { type: 'yoy', year1: '2025', year2: '2026' } }
          ]}
        />
        <DemoCard
          fileName="demo_alltime.csv"
          name="Captain John"
          title="The Career Pilot"
          icon={Briefcase}
          colorClass="bg-indigo-700"
          borderClass="border-indigo-700/30"
          desc="Visualize an entire flying career. See how the engine handles thousands of hours of high-volume operations."
          actions={[
            { kind: 'wrapped', label: "All-Time Wrapped", icon: Globe, filter: { type: 'all_time' } },
            { kind: 'growth', label: "'16 vs '26", icon: TrendingUp, filter: { type: 'yoy', year1: '2016', year2: '2026' } }
          ]}
        />
        <DemoCard
          fileName="demo_ppl.csv"
          name="Alex"
          title="The Student Pilot"
          icon={Compass}
          colorClass="bg-teal-700"
          borderClass="border-teal-700/30"
          desc="Follow a complete Private Pilot journey. Track the milestones from the very first flight to the checkride."
          actions={[
            { kind: 'wrapped', label: "PPL Milestone", icon: Play, filter: { type: 'milestone', label: 'Private Pilot License', start: '2025-01-01', end: '2026-12-31' } },
            { kind: 'growth', label: "'25 vs '26", icon: TrendingUp, filter: { type: 'yoy', year1: '2025', year2: '2026' } }
          ]}
        />
        <DemoCard
          fileName="demo_cc.csv"
          name="Mark"
          title="The Cross Country Guy"
          icon={Map}
          colorClass="bg-amber-700"
          borderClass="border-amber-700/30"
          desc="Analyze an extensive history of cross-country flights. Perfect for visualizing long-distance routes and regional travel."
          actions={[
            { kind: 'wrapped', label: "All-Time Wrapped", icon: Globe, filter: { type: 'all_time' } },
            { kind: 'growth', label: "'25 vs '26", icon: TrendingUp, filter: { type: 'yoy', year1: '2025', year2: '2026' } }
          ]}
        />
      </div>

      <div className="mt-4 md:mt-8 flex flex-col items-center gap-4 bg-slate-800/40 p-8 md:p-10 rounded-3xl border border-slate-700/50 w-full max-w-3xl mx-auto shadow-xl text-center">
        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
          Ready for takeoff?
        </h3>
        <p className="text-slate-300 text-lg mb-2">
          After trying out the demo hangar, upload your own logbook export to see your stats.
        </p>
        <Link 
          to="/upload" 
          onClick={() => window.umami?.track('Demo CTA Clicked')}
          className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-500/20 hover:-translate-y-0.5"
        >
          Create Your Own Wrapped
          <ArrowRight size={20} />
        </Link>
      </div>
    </motion.div>
  );
};