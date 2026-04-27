import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeroSection } from '../ui/HeroSection';
import { Plane, Users, Compass } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';

export const Home = () => {
  const resetStore = useLogbookStore((state) => state.resetStore);

  // Anytime the user lands on the Launchpad, ensure their session is completely cleared out
  useEffect(() => {
    resetStore();
  }, [resetStore]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 md:px-6 py-12 gap-16"
    >
      <Helmet>
        <title>LogbookWrapped | Your Aviation Year in Review</title>
        <meta name="description" content="A privacy-first web app that transforms EFB logbook exports into shareable aviation stories." />
      </Helmet>

      <HeroSection />

      {/* Launchpad App Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Upload */}
        <Link to="/upload" className="flex flex-col items-center text-center p-8 bg-slate-800/40 border border-sky-500/30 hover:border-sky-400 hover:bg-slate-800/80 rounded-3xl transition-all group shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/20 transition-colors" />
          <div className="w-16 h-16 bg-sky-500/20 text-sky-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform z-10">
            <Plane size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 z-10">Upload Your Logbook</h3>
          <p className="text-slate-400 text-sm leading-relaxed z-10">Generate your Annual Review, track a Milestone, or see your Year-over-Year Growth.</p>
        </Link>

        {/* Card 2: Demo Hangar */}
        <Link to="/demos" className="flex flex-col items-center text-center p-8 bg-slate-800/40 border border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-800/80 rounded-3xl transition-all group shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform z-10">
            <Compass size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 z-10">Explore Examples</h3>
          <p className="text-slate-400 text-sm leading-relaxed z-10">Don't have a logbook handy? Meet our demo pilots and see the magic of LogbookWrapped in action.</p>
        </Link>

      </div>
    </motion.div>
  );
};