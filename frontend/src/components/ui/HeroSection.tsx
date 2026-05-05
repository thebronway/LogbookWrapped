import { useState, useEffect } from 'react';
import { Shield, Zap, Share2, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const SCREENSHOTS = Array.from({ length: 10 }, (_, i) => `/screenshots/page${i + 1}.webp`);

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
          src="/logo/logo.webp" 
          alt="Logbook Wrapped Logo" 
          className="h-28 w-auto md:h-52 md:w-auto object-contain" 
        />
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            <span className="block text-2xl md:text-3xl text-slate-300 mb-2 font-bold tracking-normal">LogbookWrapped</span>
            Your Aviation Journey,<br />
            <span className="text-yellow-400">Visualized.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed mt-6">
            The <strong>"Spotify Wrapped for Pilots."</strong> <br className="hidden md:block" />Turn your logbook data into a stunning visual story.<br className="hidden md:block" />
            Generate your Annual Review, Lifetime Review, track a Milestone, or see your Year-over-Year Growth.
          </p>
        </div>
        
        <Link 
          to="/upload" 
          className="lg:hidden inline-flex items-center justify-center gap-3 bg-yellow-400 text-black font-bold py-4 px-10 rounded-2xl shadow-xl shadow-yellow-500/10 active:scale-95 transition-all w-full max-w-xs mx-auto"
        >
          Make Your Wrapped <ArrowRight size={20} />
        </Link>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4 w-full">
          {/* Hidden H2 for Screen Readers and SEO structure */}
          <h2 className="sr-only">Core Features</h2>
          
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Shield size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-base m-0">100% Private Logs</h3>
              <p className="text-sm text-slate-400">Client-side parsing. Your raw logbook never leaves your device.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Zap size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-base m-0">Instant Insights</h3>
              <p className="text-sm text-slate-400">Auto-detects and parses EFB logbook formats automatically.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Share2 size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-base m-0">Social Ready</h3>
              <p className="text-sm text-slate-400">Export 9:16 stories and 4:5 posts for social media, or share a live link directly.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-12">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative w-[280px] md:w-[320px] aspect-[9/16] rounded-[3rem] border-[10px] border-slate-800 bg-slate-900 shadow-2xl ring-1 ring-slate-700">
            
            <div 
              className="absolute inset-1.5 md:inset-2 bg-black rounded-[2.25rem] overflow-hidden"
              style={{ 
                transform: 'translateZ(0)', 
                WebkitTransform: 'translateZ(0)',
                WebkitMaskImage: 'radial-gradient(white, black)'
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

        <a
          href="https://logbookwrapped.com/s#v1.H4sIAAAAAAAAE41WS2_jKhj9KxVrhhowxniXtKqmczNp1fZ2E2VBE5JYk5hcG3c0GvW_X2Eg8SPT8cry8cf53gf_BkYbuf-q67ICGaEYJdBBd_t8uzMVyDCJINjpg5rKSoEM_PPwNAPe6DavjCxWan4AGRZRFEFQF_l_tZrk5aqUG_Py66gsccBfZL6f14c3VTq02unSqMo4byCLEOuDt9JYt-Sa0GuSgP7nJ12bENaV0Vc-vL0uti3exIbWwcac867xNeHOdZP0TBbrvNg2peGthI-6tPUizNvNnes4QalH7r_fgIzEiPj35_xQ76VRa5Bx6rHJytRyPynWz_kBZIKfjCfHY6nlamfrKSIICkv_qMqVKgzIbJNUZfKDpbur1X5alwXISEqpLelOVveFUWUhTa4LuQfZRu4rBcFBV-bfSq0nebkp5cGm-zghKRh-udF10VTy_OncTZCBOSZ0MgWXvraObuS7LnOj_lD-zmd_rBlAS_qaV7lR62fj2nI3A0Pcn6FJHDrTwFXAIZDvqpRb5Tr8ktuUMRIQbNzAP6ryuy7MDmQ4guCtrnJVGY-Ab3WhrkjUzEJYid44yJXJ31VzoIEgOMjjrTQSZL9Bode2fYvFlxQjSikkKWJxsoSLL2mEaJJCwlEsWANgFDEBiUA4pR4gkBKECW9eCWKWgSPBkwCw2AL0xJBGwvpISWCIKbcAEf4E4cS6SNx7jCiLIY1QHGEfVCQSSBKU-BgIIiRuguIOoIhwbo_wlPgjSYytDxwFgIsmCoZdWAzFDFKMKMGek9tEbSIhs4RwC_AkJEIosxScxx6gAlsOzJyTBFER2-pQHzlGQmAbuSD-nXNm3zGjPqzYlo-hJE49gHlzAgu-XEKg1lvXrL92awkXlxvYOuRsBjydJgebQd8v8Px5NoJFZ1jGxNIZKGfz-YydbPpjN_A14BkZT9_Xhfq1RjzYDKZ-TB_OmxFMursyLuLzPoXEP9kwZzJYujGeOosZ5q-3qyMjPu_zKeTuio_h6ciAsxkow7i8WuoR8uoJyjielugEnp4OXZzTXu5trXImffUaV-WWwgVPPdEbx9MSxsAz0MoBzwVJHqjXhY1oae5JUwYyPIz5M6k--eqq95jcOwrvbC6I_phNP18MwaR_VYxhaV0nwaZ3w4yb09YtFLrVu5jG8XQur0UfGvIsIXjTdbG2V5wrJRWCO79cQKcnjInEFThiIl2e_3putC790Q7tBwTS_6hOSyV_rPXPwv753M-eQRZB8DSfvLr_19eHpwaZPdw0z_nttHlqs7P_k9HHx_-ylGRanQwAAA"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => window.umami?.track('Sample Dashboard Clicked')}
          className="w-[280px] md:w-[320px] inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-slate-800/60 border border-slate-600 hover:border-sky-500/60 hover:bg-slate-800 text-sky-400 hover:text-sky-300 text-base font-semibold transition-all shadow hover:shadow-sky-500/10 hover:-translate-y-0.5"
        >
          <LayoutDashboard size={18} />
          View a Sample Wrapped
        </a>
      </div>
    </section>
  );
};