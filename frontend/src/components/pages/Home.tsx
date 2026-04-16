import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Shield, Zap, Share2, ArrowDownCircle, Info } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';
import { Dropzone } from '../ui/Dropzone';
import { StoryContainer } from '../layout/StoryContainer';

const SCREENSHOTS = Array.from({ length: 8 }, (_, i) => `/screenshots/page${i + 1}.webp`);

export const Home = () => {
  const { status, stats, errorMessage, resetStore } = useLogbookStore();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % SCREENSHOTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (status === 'success' && stats) {
    return (
      <>
        <Helmet>
          <title>Your LogbookWrapped</title>
        </Helmet>
        <div className="w-full flex-grow flex items-center justify-center p-0 lg:p-6">
          <StoryContainer stats={stats} onClose={resetStore} />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 md:px-6 py-12 gap-20">
      <Helmet>
        <title>LogbookWrapped | Your Aviation Year in Review</title>
        <meta name="description" content="A privacy-first web app that transforms EFB logbook exports into shareable aviation stories." />
      </Helmet>

      {/* Hero Section - Borders Removed */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-16 w-full">
        <div className="flex-1 flex flex-col items-center lg:items-center gap-8 text-center lg:text-center">
          <img 
            src="/logo3.webp" 
            alt="Logbook Wrapped Logo" 
            className="h-28 w-auto md:h-52 md:w-auto object-contain" 
          />
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Your Year in <span className="text-yellow-400">Aviation</span>, Visualized.
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
              LogbookWrapped is the <strong>"Spotify Wrapped for Pilots."</strong> <br />Turn your logbook data into a stunning visual journey.
            </p>
          </div>
          
          <a 
            href="#upload-section" 
            className="lg:hidden inline-flex items-center justify-center gap-3 bg-yellow-400 text-black font-bold py-4 px-10 rounded-2xl shadow-xl shadow-yellow-500/10 active:scale-95 transition-all w-full max-w-xs mx-auto"
          >
            Make Your Wrapped <ArrowDownCircle size={20} />
          </a>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4 w-full">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Shield size={24} />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">100% Private</p>
                <p className="text-sm text-slate-400">100% client-side in-browser processing.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Zap size={24} />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Instant Insights</p>
                <p className="text-sm text-slate-400">Auto-detects EFB formats automatically.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Share2 size={24} />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Social Ready</p>
                <p className="text-sm text-slate-400">Export 9:16 vertical infographics for social media.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          {/* The Glow/Shadow behind the phone */}
          <div className="absolute -inset-1 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          {/* The Phone Frame - Adjusted to aspect-[9/16] */}
          <div className="relative w-[280px] md:w-[320px] aspect-[9/16] rounded-[3rem] border-[10px] border-slate-800 bg-slate-900 shadow-2xl ring-1 ring-slate-700">
            
            {/* Inner Padding/Screen Area */}
            <div className="absolute inset-1.5 md:inset-2 bg-black rounded-[2.25rem] overflow-hidden">
              {SCREENSHOTS.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`App Preview ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentImage ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
            
            {/* The Notch/Dynamic Island - Narrowed to look more modern */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-full z-10 shadow-sm border border-slate-800/50"></div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section 
        id="upload-section" 
        className="w-full flex flex-col items-center text-center gap-10 bg-slate-900/40 border border-slate-800/50 backdrop-blur-md px-4 py-10 md:p-20 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl scroll-mt-32"
      >
        <div className="max-w-2xl space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">Ready to make your wrapped?</h2>
          <p className="text-lg text-slate-400">
            1. Select a timeframe (Year, Any Range, All Time). <br />
            2. Export your entire logbook as a <span className="text-white font-mono">.csv</span> from your EFB and upload it below. <br />
            <span className="text-sm mt-2 block font-medium">Not sure how? <Link to="/export" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">Read our export guide.</Link></span>
          </p>
          <p className="text-sm text-slate-500 pt-2">
            Curious how we patch missing data? Read about our{' '}
            <Link to="/logbook" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">
              parsing logic and assumptions
            </Link>.
          </p>
        </div>
        
        {/* Borderless Dropzone Container */}
        <div className="w-full max-w-2xl">
          {status === 'error' ? (
            <div className="p-8 text-center space-y-4">
              <div className="inline-flex p-3 bg-red-500/10 rounded-full text-red-500 mb-2">
                <Info size={32} />
              </div>
              <p className="text-red-200 font-medium">{errorMessage}</p>
              <button 
                onClick={resetStore} 
                className="px-6 py-2 bg-white text-black rounded-full hover:bg-slate-200 transition-colors font-bold text-sm"
              >
                Try Another File
              </button>
            </div>
          ) : (
            <Dropzone />
          )}
        </div>
      </section>
    </div>
  );
};