import { useState, useEffect } from 'react';
import { Shield, Zap, Share2, ArrowDownCircle } from 'lucide-react';

const SCREENSHOTS = Array.from({ length: 9 }, (_, i) => `/screenshots/page${i + 1}.webp`);

export const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % SCREENSHOTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between gap-16 w-full">
      <div className="flex-1 flex flex-col items-center lg:items-center gap-8 text-center lg:text-center">
        <img 
          src="/logo/logo3.webp" 
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
          href="#steps-list" 
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
        <div className="absolute -inset-1 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        
        <div className="relative w-[280px] md:w-[320px] aspect-[9/16] rounded-[3rem] border-[10px] border-slate-800 bg-slate-900 shadow-2xl ring-1 ring-slate-700">
          
          <div 
            className="absolute inset-1.5 md:inset-2 bg-black rounded-[2.25rem] overflow-hidden"
            style={{ 
              transform: 'translateZ(0)', 
              WebkitTransform: 'translateZ(0)',
              WebkitMaskImage: '-webkit-radial-gradient(white, black)'
            }}
          >
            {SCREENSHOTS.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`App Preview ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImage ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  transform: 'translateZ(0)', 
                  WebkitTransform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  willChange: 'opacity'
                }}
              />
            ))}
          </div>
          
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-full z-10 shadow-sm border border-slate-800/50"></div>
        </div>
      </div>
    </section>
  );
};