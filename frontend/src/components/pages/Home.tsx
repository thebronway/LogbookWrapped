import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeroSection } from '../ui/HeroSection';
import { Plane, Compass } from 'lucide-react';
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
        <meta name="description" content="Visualize your flight history with LogbookWrapped. A privacy-first tool to transform EFB exports into shareable stories." />
        <link rel="canonical" href="https://logbookwrapped.com/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "LogbookWrapped",
            "operatingSystem": "Web Browser",
            "applicationCategory": "AviationSoftware",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "A privacy-first web app that transforms EFB logbook exports into shareable aviation stories."
          })}
        </script>
      </Helmet>

      <HeroSection />

      {/* Launchpad App Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Upload */}
        <Link to="/upload" onClick={() => (window as any).umami?.track('Funnel Started', { path: 'upload_card' })} className="flex flex-col items-center text-center p-8 bg-slate-800/40 border border-sky-500/30 hover:border-sky-400 hover:bg-slate-800/80 rounded-3xl transition-all group shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/20 transition-colors" />
          <div className="w-16 h-16 bg-sky-500/20 text-sky-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform z-10">
            <Plane size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 z-10">Upload Your Logbook</h3>
          <p className="text-slate-400 text-sm leading-relaxed z-10">Generate your Annual Review, track a Milestone, or see your Year-over-Year Growth. Processed <strong className="text-emerald-400">100% locally</strong>.</p>
        </Link>

        {/* Card 2: Demo Hangar */}
        <Link to="/demos" onClick={() => (window as any).umami?.track('Funnel Started', { path: 'demo_card' })} className="flex flex-col items-center text-center p-8 bg-slate-800/40 border border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-800/80 rounded-3xl transition-all group shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform z-10">
            <Compass size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 z-10">Explore Examples</h3>
          <p className="text-slate-400 text-sm leading-relaxed z-10">Don't have a logbook handy? Meet our demo pilots and see the magic of LogbookWrapped in action.</p>
        </Link>
      </div>

      {/* SEO Density & Trust Indicators */}
      <div className="w-full max-w-4xl mt-8 bg-slate-800/40 border border-slate-700 p-6 sm:p-10 rounded-2xl space-y-10 text-left mb-8">
        
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Supported Electronic Flight Bags</h2>
          <p className="text-slate-300 leading-relaxed">
            LogbookWrapped’s parser automatically cleans and visualizes CSV exports from&nbsp;
            <a href="https://foreflight.com" target="_blank" rel="noopener noreferrer nofollow" className="text-white hover:text-sky-400 underline decoration-slate-700 transition-colors">ForeFlight</a>,&nbsp;
            <a href="https://fly.garmin.com/fly-garmin/garmin-pilot/" target="_blank" rel="noopener noreferrer nofollow" className="text-white hover:text-sky-400 underline decoration-slate-700 transition-colors">Garmin Pilot</a>,&nbsp;
            <a href="https://myflightbook.com" target="_blank" rel="noopener noreferrer nofollow" className="text-white hover:text-sky-400 underline decoration-slate-700 transition-colors">MyFlightbook</a>,&nbsp;
            <a href="https://coradine.com" target="_blank" rel="noopener noreferrer nofollow" className="text-white hover:text-sky-400 underline decoration-slate-700 transition-colors">LogTen Pro</a>, and custom spreadsheet formats.
          </p>
          <div className="pt-2">
            <Link to="/export" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-sky-400 hover:bg-slate-700 hover:text-sky-300 rounded-lg text-sm font-semibold transition-colors border border-slate-700">
              Read our EFB export guides &rarr;
            </Link>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">How We Parse Your Flight Logs</h2>
          <p className="text-slate-300 leading-relaxed">
            Pilots log things differently. Some are meticulous; others leave half the columns blank. Here is how our engine automatically cleans, patches, and interprets your data before doing the math.
          </p>
          <div className="pt-2">
            <Link to="/methodology" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-sky-400 hover:bg-slate-700 hover:text-sky-300 rounded-lg text-sm font-semibold transition-colors border border-slate-700">
              View our parsing methodology &rarr;
            </Link>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Share Your Aviation Adventures</h2>
          <p className="text-slate-300 leading-relaxed">
            View your routes, see aviation extremes and superlatives, and then export 4:5 posts and 9:16 vertical stories directly to <strong className="text-white">Instagram, TikTok, Facebook, or aviation forums</strong>.
          </p>
        </section>
        
        <div className="bg-slate-900/60 border-l-4 border-emerald-500 p-4 rounded-r-lg mt-6">
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            <span className="font-sans font-bold text-emerald-400 uppercase tracking-widest text-xs block mb-1">100% Private</span> 
            All processing happens completely in your web browser. No data is ever sent to a server. Your flight logs remain strictly on your device.
          </p>
          <div className="pt-2">
            <Link to="/privacy" className="text-sky-400 hover:text-sky-300 text-sm font-medium underline underline-offset-4 transition-colors">
              Read our full Privacy Policy
            </Link>
          </div>
        </div>
        
      </div>
      
    </motion.div>
  );
};