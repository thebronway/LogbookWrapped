import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Plane, Upload } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';
import { decodeHashToStats } from '../../core/ShareEngine';
import { StoryContainer } from '../layout/StoryContainer';
import { RadarLoader } from '../ui/RadarLoader';

/**
 * Read-only viewer for /s#<encoded-stats> links. Decodes the hash on mount,
 * hydrates the store, then reuses StoryContainer. The `isSharedView` flag
 * suppresses the community tollbooth and rewrites the Page 11 CTAs.
 */
export const SharedView = () => {
  const { stats, hydrateFromShared, resetStore } = useLogbookStore();
  const navigate = useNavigate();
  const [decodeError, setDecodeError] = useState<string | null>(null);

  useEffect(() => {
    window.umami?.track('Shared View Opened');

    const run = async () => {
      const hash = window.location.hash;
      if (!hash || hash.length < 4) {
        setDecodeError('This link is missing its shared data. Ask the sender to generate a new one.');
        return;
      }
      try {
        const decoded = await decodeHashToStats(hash);
        hydrateFromShared(decoded);
      } catch (err) {
        console.error('Share link decode failed:', err);
        setDecodeError(err instanceof Error ? err.message : 'Could not decode this share link.');
      }
    };
    run();

    // Reset on unmount so a subsequent upload flow starts clean.
    return () => { resetStore(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (decodeError) {
    return (
      <>
        <Helmet>
          <title>Share Link Error | LogbookWrapped</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <div className="max-w-md bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/40 mx-auto mb-4">
              <AlertCircle size={22} className="text-rose-400" />
            </div>
            <h1 className="text-xl font-black text-white mb-2">Couldn't open this share link</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">{decodeError}</p>
            <Link to="/" className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl transition-colors">
              Go Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <Helmet>
          <title>Loading Shared Wrapped | LogbookWrapped</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <div className="relative w-24 h-24 mb-6"><RadarLoader /></div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Opening shared Wrapped...</h2>
          <p className="text-slate-400 text-sm">Unpacking the pilot's stats from the link.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>A Shared LogbookWrapped</title>
        {/* Hash-only URLs can't support per-page OG previews; that's a v1.1.0 feature. */}
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="w-full flex-grow flex items-center justify-center p-0 lg:p-6">
        <StoryContainer stats={stats} onClose={() => navigate('/')} />
      </div>

      {/* Floating desktop CTA. Mobile uses Page 11's own CTA in shared view. */}
      <div className="hidden lg:flex fixed bottom-6 left-0 right-0 z-[50] justify-center pointer-events-none">
        <Link
          to="/"
          onClick={() => window.umami?.track('Shared View CTA Clicked', { location: 'desktop_floating' })}
          className="pointer-events-auto flex items-center gap-2 px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-full shadow-2xl shadow-yellow-500/20 transition-all hover:scale-105 active:scale-95 text-sm"
        >
          <Plane size={16} />
          Create your own LogbookWrapped
          <Upload size={14} className="opacity-70" />
        </Link>
      </div>
    </>
  );
};
