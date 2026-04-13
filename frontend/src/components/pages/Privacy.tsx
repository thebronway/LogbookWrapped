import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Printer, BarChart3, Github, Lock } from 'lucide-react';

export const Privacy = () => {
  const issuesUrl = "https://github.com/thebronway/LogbookWrapped";

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-slate-300">
      <Helmet>
        <title>Privacy Policy | LogbookWrapped</title>
        <meta name="description" content="Read the privacy policy for Logbook Wrapped. We respect your data with 100% client-side processing." />
      </Helmet>

      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium w-fit">
            <Lock size={12} />
            Privacy-First Architecture
          </div>
        </div>
        <p className="text-slate-400">Last Updated: April 13, 2026</p>
      </header>

      <div className="space-y-8">
        {/* The Big Guarantee */}
        <section className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheck className="text-emerald-400" size={32} />
              <h2 className="text-2xl font-semibold text-white">1. Local Processing Guarantee</h2>
            </div>
            <p className="text-lg leading-relaxed mb-4">
              The core feature of Logbook Wrapped—parsing and visualizing your Electronic Flight Bag (EFB) CSV file—is performed <span className="text-white font-medium">entirely on your local device</span>. 
            </p>
            <p className="text-slate-400">
              Your raw logbook data is <strong>never uploaded to, transmitted to, or stored on our servers.</strong> The heavy lifting happens inside your browser's memory and is wiped the moment you close the tab.
            </p>
          </div>
          <ShieldCheck className="absolute -bottom-4 -right-4 text-slate-700/10" size={160} />
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Print Proxy */}
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <Printer className="text-blue-400 mb-4" size={24} />
            <h2 className="text-xl font-semibold text-white mb-2">2. Optional Print Data</h2>
            <p className="text-sm leading-relaxed text-slate-400">
              If you purchase a print-on-demand map, only the specific, anonymized geometric data required for the print is routed to our partners. You will be explicitly notified before any data leaves your browser.
            </p>
          </section>

          {/* Analytics */}
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <BarChart3 className="text-purple-400 mb-4" size={24} />
            <h2 className="text-xl font-semibold text-white mb-2">3. Analytics & Cookies</h2>
            <p className="text-sm leading-relaxed text-slate-400">
              We use basic, anonymized web analytics to track site visits. These do not tie back to your personal logbook data, your identity, or your flight history.
            </p>
          </section>
        </div>

        {/* Audit / Verify Section */}
        <section className="mt-16 py-12 border-t border-slate-800 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Don't take our word for it.</h2>
          <p className="mb-8 max-w-2xl mx-auto text-slate-400">
            Our code is 100% open-source. If you’re a developer or a security enthusiast, 
            you can audit our processing logic or ask questions in our issues tracker.
          </p>
          
          <a 
            href={issuesUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-slate-900 font-bold rounded-full transition-all hover:scale-105 active:scale-95 hover:bg-slate-100 shadow-xl shadow-white/10"
          >
            <Github size={20} />
            Verify Source on GitHub
          </a>
        </section>
      </div>
    </div>
  );
};