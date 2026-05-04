import { Helmet } from 'react-helmet-async';
import { ShieldCheck, BarChart3, Github, Lock, Trash2, Mail, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Privacy = () => {
  const issuesUrl = "https://github.com/thebronway/LogbookWrapped";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto px-6 py-16 text-slate-300"
    >
      <Helmet>
        <title>Privacy Policy | LogbookWrapped</title>
        <meta name="description" content="LogbookWrapped is built with a 100% client-side, privacy-first architecture. Read our commitment to keeping your sensitive flight data on your device." />
        <link rel="canonical" href="https://logbookwrapped.com/privacy" />
      </Helmet>

      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium w-fit">
            <Lock size={12} />
            Privacy-First Architecture
          </div>
        </div>
        <p className="text-slate-400">Last Updated: May 3, 2026</p>
      </header>

      <div className="space-y-8">
        <section className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheck className="text-emerald-400" size={32} />
              <h2 className="text-2xl font-semibold text-white">1. Local Logbook Parsing</h2>
            </div>
            <p className="text-lg leading-relaxed mb-4">
              The core feature of LogbookWrapped, parsing and visualizing your Electronic Flight Bag (EFB) CSV file, is performed <span className="text-white font-medium">entirely on your local device</span>. 
            </p>
            <p className="text-slate-400">
              Your raw logbook entries (names, tail numbers, flight tracks, dates, remarks, etc.) are <strong>never uploaded to, transmitted to, or stored on our servers.</strong> The heavy lifting happens inside your browser's memory.
            </p>
          </div>
          <ShieldCheck className="absolute -bottom-4 -right-4 text-slate-700/10" size={160} />
        </section>

        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="text-blue-400" size={24} />
            <h2 className="text-xl font-semibold text-white">2. Optional Community Sharing</h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            At the end of your annual story, you have the <strong>opt-in choice</strong> to share your yearly totals to help build public community averages. If you explicitly choose to unlock this feature, we securely transmit only high-level anonymous integers: <em>Year, Total Flight Time, Total Flights, Distance, Landings, Night Hours, and Aircraft Size Category.</em> No identifiable logbook data is ever attached to these totals.
          </p>
        </section>

        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <LinkIcon className="text-yellow-400" size={24} />
            <h2 className="text-xl font-semibold text-white">3. Optional Shareable Link</h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            From the Share screen you can generate a personal URL (of the form <code className="text-yellow-300">/s#...</code>) that opens a read-only view of your Wrapped. The feature is <strong>opt-in</strong> and requires you to confirm a consent screen before the link is created. Your aggregated stats (totals, superlatives, and route map coordinates rounded to ~100&nbsp;m precision) are compressed and encoded <strong>directly into the URL hash fragment</strong>. Because browsers never transmit the fragment to servers, <strong>no data is uploaded to us</strong> when you generate or open a share link. Anyone you give the URL to can see the snapshot, so treat it like any other social-media post.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Analytics */}
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <BarChart3 className="text-purple-400 mb-4" size={24} />
            <h2 className="text-xl font-semibold text-white mb-2">4. Telemetry & Analytics</h2>
            <p className="text-sm leading-relaxed text-slate-400">
              We use privacy-friendly web analytics to track general site visits. Additionally, when a logbook is successfully parsed locally, we record an anonymous telemetry ping containing the EFB software format used (e.g., ForeFlight). These metrics cannot be tied back to your identity.
            </p>
          </section>

          {/* Data Retention */}
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <Trash2 className="text-orange-400 mb-4" size={24} />
            <h2 className="text-xl font-semibold text-white mb-2">5. Data Retention</h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Because we have no backend database for user logs, our data retention policy for your logbook is simple: <strong>Zero</strong>. The moment you close your browser, all processed logbook data is permanently erased from memory.
            </p>
          </section>
        </div>

        {/* Audit / Verify Section */}
        <section className="mt-16 py-12 border-t border-slate-800 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Don't take our word for it.</h2>
          <p className="mb-8 max-w-2xl mx-auto text-slate-400">
            Our code is 100% open-source. If you’re a developer or a security enthusiast, 
            you can audit our processing logic yourself. Have questions about our privacy practices? Reach out to us directly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={issuesUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 text-white font-bold rounded-full transition-transform hover:scale-105 active:scale-95 hover:bg-slate-700 shadow-xl border border-slate-700"
            >
              <Github size={20} />
              Verify Source
            </a>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-full transition-transform hover:scale-105 active:scale-95 hover:bg-slate-100 shadow-xl shadow-white/10"
            >
              <Mail size={20} />
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </motion.div>
  );
};