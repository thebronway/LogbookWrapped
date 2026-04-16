import { Helmet } from 'react-helmet-async';
import { Github, MessageSquare, Bug, Mail } from 'lucide-react';

export const Contact = () => {
  const issuesUrl = "https://github.com/thebronway/LogbookWrapped/issues";
  const email = "brian@conway.im";

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-slate-300">
      <Helmet>
        <title>Contact Us | LogbookWrapped</title>
        <meta name="description" content="Get in touch with the team behind Logbook Wrapped. We welcome bug reports, feature requests, and general feedback." />
      </Helmet>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Let's Connect</h1>
        <p className="text-xl leading-relaxed max-w-2xl mx-auto">
          Whether you're missing an airport profile, think our math assumptions are a bit off, 
          or just want to chat about aviation and logbooks, we want to hear from you. 
          LogbookWrapped is built by pilots, for pilots, and your feedback directly shapes its future.
        </p>
      </header>

      {/* Quick Action Grid */}
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        {/* Bug Report Card */}
        <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex flex-col">
          <Bug className="text-orange-400 mb-4" size={28} />
          <h3 className="text-white font-bold mb-2">Report a Bug or Issue</h3>
          <div className="text-sm mb-6 flex-grow flex flex-col gap-4">
            <p>
              Did we get our math assumptions wrong? Are we missing an aircraft profile or an airport you flew into? Or maybe you found an issue parsing your specific CSV format? Let us know so we can fix it!
            </p>
            <p className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300 font-semibold">Quick Tip:</strong> (Optional) If you are experiencing a parsing error, emailing us a copy of your exported logbook CSV allows us to diagnose and resolve the issue much faster.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <a 
              href={issuesUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium flex-1"
            >
              <Github size={16} />
              Open GitHub Issue
            </a>
            <a 
              href={`mailto:${email}?subject=LogbookWrapped%20Bug%20Report`}
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/20 rounded-lg transition-colors text-sm font-medium flex-1"
            >
              <Mail size={16} />
              Email
            </a>
          </div>
        </div>

        {/* Feature Request Card */}
        <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex flex-col">
          <MessageSquare className="text-blue-400 mb-4" size={28} />
          <h3 className="text-white font-bold mb-2">Feature Requests & Feedback</h3>
          <p className="text-sm mb-6 flex-grow">
            Want to see new stats, charts, or visual elements? Have general feedback or just want to chat about aviation? We love building what pilots actually want to use.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <a 
              href={issuesUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium flex-1"
            >
              <Github size={16} />
              Request on GitHub
            </a>
            <a 
              href={`mailto:${email}?subject=LogbookWrapped%20Feature%20Request`}
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/20 rounded-lg transition-colors text-sm font-medium flex-1"
            >
              <Mail size={16} />
              Email
            </a>
          </div>
        </div>
      </div>

      {/* Main CTA Card */}
      <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl text-center">
        <h2 className="text-2xl font-semibold text-white mb-4">Open Source & Transparent</h2>
        <p className="mb-8 max-w-md mx-auto text-slate-400">
          Our development is 100% transparent. You can view existing reports or create your own directly on our GitHub tracker.
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
      </div>
    </div>
  );
};