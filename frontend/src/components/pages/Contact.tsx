import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Github, MessageSquare, Bug, Mail, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const Contact = () => {
  const [copied, setCopied] = useState(false);
  const issuesUrl = "https://github.com/thebronway/LogbookWrapped/issues";
  const email = "contact@logbookwrapped.com";

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto px-6 py-16 text-slate-300"
    >
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
              Found a bug, missing an aircraft profile, or want to request a new feature? LogbookWrapped is open source, and our development is 100% transparent and open-source.
            </p>
            <p>
              Check our public tracker to see if your idea has already been posted, or create a new issue for our team to look at.
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

        {/* Email Card */}
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
          <div className="mt-auto flex flex-col gap-3 w-full">
            {/* Clickable email display to copy */}
            <button
              onClick={handleCopy}
              className="group flex items-center justify-between w-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-600/80 rounded-xl p-3 sm:p-4 transition-all active:scale-[0.98] text-left"
              title="Click to copy email address"
              aria-label="Copy email address"
            >
              <span className="text-slate-300 group-hover:text-white font-mono text-sm sm:text-base tracking-tight truncate mr-2 transition-colors">
                {email}
              </span>
              <div className="text-slate-400 group-hover:text-white transition-colors flex-shrink-0">
                {copied ? (
                  <Check className="w-[18px] h-[18px] text-green-400" />
                ) : (
                  <Copy className="w-[18px] h-[18px]" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};