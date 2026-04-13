import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLogbookStore } from '../../store/useLogbookStore';
import { Dropzone } from '../ui/Dropzone';
import { StoryContainer } from '../layout/StoryContainer';

// Placeholders for your screenshot gallery
const SCREENSHOTS = [
  "https://placehold.co/600x800/1e293b/ffffff?text=The+Aviator",
  "https://placehold.co/600x800/1e293b/ffffff?text=The+Footprint",
  "https://placehold.co/600x800/1e293b/ffffff?text=The+Fleet"
];

export const Home = () => {
  const { status, stats, errorMessage, resetStore } = useLogbookStore();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % SCREENSHOTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Show the app interface instead of marketing page if processing is successful
  if (status === 'success' && stats) {
    return (
      <>
        <Helmet>
          <title>Your Logbook Wrapped</title>
        </Helmet>
        <div className="w-full flex-grow flex items-center justify-center p-0 lg:p-6">
          <StoryContainer stats={stats} onClose={resetStore} />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-6 py-12 gap-16">
      <Helmet>
        <title>LogbookWrapped</title>
        <meta name="description" content="A privacy-first web app that transforms EFB logbook exports into shareable aviation stories. Transform your ForeFlight or Garmin Pilot CSVs today!" />
        <meta name="keywords" content="aviation, pilot logbook, foreflight, garmin pilot, flight tracker, spotify wrapped for pilots, aviation stats" />
      </Helmet>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-12 w-full">
        <div className="flex-1 flex flex-col items-center md:items-start gap-6 text-center md:text-left">
          <img src="/logo.webp" alt="Logbook Wrapped Logo" className="h-28 w-auto md:h-48 md:w-auto object-contain rounded-2xl shadow-xl shadow-blue-500/10" />
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your Year in <span className="text-yellow-400">Aviation</span>, Visualized.
          </h1>
          
          <a 
            href="#upload-section" 
            className="md:hidden inline-flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold py-3 px-8 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all w-full max-w-xs mx-auto my-2"
          >
            Make Your Logbook Wrapped ↓
          </a>

          <p className="text-lg text-slate-400 leading-relaxed">
            Logbook Wrapped is <strong>"Spotify Wrapped for Pilots."</strong> Transform your CSV exports from EFBs like ForeFlight, Garmin Pilot, or MyFlightbook into a shareable passport of your flying history.
          </p>
          
          <div className="flex flex-col gap-3 mt-4 text-sm text-slate-300">
            <p className="flex items-center gap-2 md:justify-start justify-center">
              <span className="text-green-500 text-xl">✓</span> <strong>Privacy-First:</strong> 100% client-side. Your logbook data never routes or ever touches a server.
            </p>
            <p className="flex items-center gap-2 md:justify-start justify-center">
              <span className="text-green-500 text-xl">✓</span> <strong>Smart Mapping:</strong> Auto-detects columns and formats instantly.
            </p>
            <p className="flex items-center gap-2 md:justify-start justify-center">
              <span className="text-green-500 text-xl">✓</span> <strong>Social Export:</strong> One-click generate 9:16 vertical infographics for Instagram and TikTok.
            </p>
          </div>
        </div>

        {/* Auto-Rotating Screenshot Gallery */}
        <div className="w-full max-w-sm aspect-[9/16] relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900 mx-auto md:mx-0">
          {SCREENSHOTS.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`App Interface ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Dropzone Upload Section */}
      <section id="upload-section" className="w-full flex flex-col items-center text-center gap-8 bg-slate-900/50 p-8 md:p-16 rounded-3xl border border-slate-800 shadow-xl scroll-mt-32">
        <div>
          <h2 className="text-3xl font-bold text-white mb-3">Ready to see your story?</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Export your logbook as a CSV from your EFB and drop it below to generate your personalized logbook wrapped.
          </p>
        </div>
        
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center">
          {status === 'error' ? (
            <div className="bg-red-500/10 border border-red-500 text-red-200 p-6 rounded-xl text-center">
              <p>{errorMessage}</p>
              <button onClick={resetStore} className="mt-4 px-4 py-2 bg-red-500/20 rounded-md hover:bg-red-500/40 transition-colors text-sm font-semibold">Try Again</button>
            </div>
          ) : (
            <Dropzone />
          )}
        </div>
      </section>
    </div>
  );
};