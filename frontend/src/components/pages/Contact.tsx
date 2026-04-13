import { Helmet } from 'react-helmet-async';
import { Github, MessageSquare, Bug } from 'lucide-react';

export const Contact = () => {
  const issuesUrl = "https://github.com/thebronway/LogbookWrapped/issues";

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-slate-300">
      <Helmet>
        <title>Contact Us | LogbookWrapped</title>
        <meta name="description" content="Get in touch with the team behind Logbook Wrapped. We welcome bug reports, feature requests, and general feedback." />
      </Helmet>

      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Contact Us</h1>
        <p className="text-xl leading-relaxed">
          Have a feature request, spotted a bug, or just want to talk aviation? 
          We use GitHub Issues to track everything.
        </p>
      </header>

      {/* Quick Action Grid */}
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <a 
          href={issuesUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-orange-500/50 transition-colors group"
        >
          <Bug className="text-orange-400 mb-4 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-white font-bold mb-2">Report a Bug</h3>
          <p className="text-sm">Found an issue with a specific CSV format? Open an issue to let us know.</p>
        </a>

        <a 
          href={issuesUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 transition-colors group"
        >
          <MessageSquare className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-white font-bold mb-2">Feature Requests</h3>
          <p className="text-sm">Want to see new stats or visuals? We love building what pilots actually use.</p>
        </a>
      </div>

      {/* Main CTA Card */}
      <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl text-center">
        <h2 className="text-2xl font-semibold text-white mb-4">Visit the Issues Tracker</h2>
        <p className="mb-8 max-w-md mx-auto text-slate-400">
          Our development is 100% transparent. You can view existing reports or create your own directly on GitHub.
        </p>
        
        <a 
          href={issuesUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-4 bg-white text-slate-900 font-bold rounded-full transition-transform hover:scale-105 active:scale-95 hover:bg-slate-100 shadow-xl shadow-white/10"
        >
          <Github size={20} />
          Go to GitHub Issues
        </a>
        
        <p className="mt-6 text-xs text-slate-500 uppercase tracking-widest font-semibold">
          Open Source & Community Driven
        </p>
      </div>
    </div>
  );
};