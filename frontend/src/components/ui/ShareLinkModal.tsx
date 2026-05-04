import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Link as LinkIcon, ShieldCheck, Copy, Check, Loader2, AlertCircle, Share2 } from 'lucide-react';
import { CalculatedStats } from '../../core/types';
import { encodeStatsToHash, buildShareUrl } from '../../core/ShareEngine';

interface Props {
  stats: CalculatedStats;
  onClose: () => void;
}

export const ShareLinkModal: React.FC<Props> = ({ stats, onClose }) => {
  const [phase, setPhase] = useState<'consent' | 'generating' | 'ready' | 'error'>('consent');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [urlLength, setUrlLength] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, []);

  const handleGenerate = async () => {
    window.umami?.track('Share Link Generated');
    setPhase('generating');
    try {
      const hash = await encodeStatsToHash(stats);
      const url = buildShareUrl(hash);
      setShareUrl(url);
      setUrlLength(url.length);
      setPhase('ready');
    } catch (err) {
      console.error('Share link generation failed:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Could not generate share link.');
      setPhase('error');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      window.umami?.track('Share Link Copied');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return handleCopy();
    try {
      await navigator.share({
        title: 'My LogbookWrapped',
        text: 'Check out my pilot year in review:',
        url: shareUrl,
      });
      window.umami?.track('Share Link Shared');
    } catch (err: any) {
      if (err.name !== 'AbortError') handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-200" onWheel={(e) => e.stopPropagation()}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-slate-800/80 hover:bg-slate-700 p-2 rounded-full text-white/70 hover:text-white transition-all border border-yellow-400/30 hover:border-yellow-400/60"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {phase === 'consent' && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-green-400/15 border border-green-400/40 rounded-xl">
                <LinkIcon size={20} className="text-green-400" />
              </div>
              <h2 className="text-xl font-black text-green-400">Generate Shareable Link</h2>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Create a personal URL anyone can open to see your Wrapped in read-only mode.
              <strong className="text-white"> Nothing is uploaded to our servers</strong>. The stats are encoded directly into the link itself.
            </p>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-5">
              <h3 className="text-[11px] font-bold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldCheck size={13} className="text-green-400" /> What's in the link
              </h3>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li className="flex gap-2"><span className="text-green-400">✓</span> Your aggregated totals (hours, flights, landings, distance)</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Top-level superlatives (favorite route, most-used airframe)</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Route map coordinates (rounded to ~100 m precision)</li>
                <li className="flex gap-2"><span className="text-rose-500">✗</span> No individual flight records</li>
                <li className="flex gap-2"><span className="text-rose-500">✗</span> No tail numbers or aircraft IDs</li>
                <li className="flex gap-2"><span className="text-rose-500">✗</span> No name, email, or personal identifiers</li>
              </ul>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed mb-5 bg-slate-800/40 rounded-lg p-3">
              Anyone with this URL can view the page. Treat it like any other
              social-media post, and share it where you're comfortable being seen.
            </div>

            <button
              onClick={handleGenerate}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <LinkIcon size={18} /> Generate My Link
            </button>
          </>
        )}

        {phase === 'generating' && (
          <div className="py-10 flex flex-col items-center gap-3">
            <Loader2 size={28} className="text-yellow-400 animate-spin" />
            <p className="text-sm text-slate-400">Packing your stats...</p>
          </div>
        )}

        {phase === 'error' && (
          <div className="py-6">
            <div className="flex items-start gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-rose-300 mb-1">Could not generate link</div>
                <div className="text-rose-400/90">{errorMsg}</div>
              </div>
            </div>
            <button
              onClick={() => { setPhase('consent'); setErrorMsg(''); }}
              className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl"
            >
              Try Again
            </button>
          </div>
        )}

        {phase === 'ready' && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-green-400/15 border border-green-400/40 rounded-xl">
                <Check size={20} className="text-green-400" />
              </div>
              <h2 className="text-xl font-black text-white">Your link is ready</h2>
            </div>

            <p className="text-slate-400 text-sm mb-4">
              Copy this URL and share it anywhere. It opens a read-only version of your Wrapped.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-2 font-mono text-[11px] text-yellow-300 break-all max-h-32 overflow-y-auto">
              {shareUrl}
            </div>
            <div className="text-[10px] text-slate-500 mb-5 text-right">{urlLength.toLocaleString()} characters</div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopy}
                className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${copied ? 'bg-green-400 text-black shadow-lg shadow-green-500/20' : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'}`}
              >
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Link</>}
              </button>
              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
                <button
                  onClick={handleNativeShare}
                  className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg shadow-yellow-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Share2 size={16} /> Share...
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="py-3 rounded-xl font-bold text-sm bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg shadow-yellow-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Done
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
