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
      <div className="grid gap-8 md:grid-cols-2 mb-12">
        {/* GitHub Card (Primary) */}
        <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 flex flex-col shadow-xl">
          <Github className="text-white mb-6" size={32} />
          <h3 className="text-xl text-white font-bold mb-3">Open a GitHub Issue</h3>
          <div className="text-sm text-slate-400 mb-8 flex-grow space-y-4 leading-relaxed">
            <p>
              Found a bug, missing an aircraft profile, or want to request a new feature? LogbookWrapped is open source, and our development is 100% transparent.
            </p>
            <p>
              Check our public tracker to see if your idea has already been posted, or create a new issue for our team to tackle!
            </p>
          </div>
          <a 
            href={issuesUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-white/10 mt-auto"
          >
            <Github size={18} />
            Go to GitHub Tracker
          </a>
        </div>

        {/* Email Card (Alternative) */}
        <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 flex flex-col shadow-xl">
          <Mail className="text-indigo-400 mb-6" size={32} />
          <h3 className="text-xl text-white font-bold mb-3">Send us an Email</h3>
          <div className="text-sm text-slate-400 mb-8 flex-grow space-y-5 leading-relaxed">
            <p>
              Don't have a GitHub account? No problem. You can reach out directly via email for bug reports, general feedback, or inquiries.
            </p>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
              <strong className="text-slate-300 font-semibold block mb-1">Experiencing a parsing error?</strong> 
              Emailing us a copy of your exported logbook CSV allows us to diagnose and resolve the issue much faster!
            </div>
          </div>
          <a 
            href={`mailto:${email}?subject=LogbookWrapped%20Contact`}
            className="flex items-center justify-center gap-2 w-full py-4 bg-slate-700/50 text-white hover:bg-slate-700 border border-slate-600 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 mt-auto"
          >
            <Mail size={18} />
            Email the Team
          </a>
        </div>
      </div>
    </div>
  );
};