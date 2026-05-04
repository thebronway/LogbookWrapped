import React, { useState, useEffect, useRef } from 'react';
import { X, Share2, Archive, Loader2, Download, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { CalculatedStats, ExportItem } from '../../core/types';
import { ExportWrapper } from '../layout/ExportWrapper';
import { generateBlob, downloadZipBundle, shareOrDownloadImage, triggerDownload } from '../../core/ExportEngine';
import { PreviewCard } from './PreviewCard';
import { ShareLinkModal } from './ShareLinkModal';

interface Props {
  items: ExportItem[];
  onClose: () => void;
  title?: string;
  // When provided, a "Share as Link" button appears in the header. Omitted
  // for flows (e.g. Growth exports) where a linkable snapshot isn't meaningful.
  stats?: CalculatedStats;
}

export const ExportModal: React.FC<Props> = ({ items, onClose, title = "Share Your LogbookWrapped", stats }) => {
  const [isShareLinkOpen, setIsShareLinkOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('');
  const [readyBlobs, setReadyBlobs] = useState<Record<string, Blob>>({});
  const [failedBlobs, setFailedBlobs] = useState<Set<string>>(new Set());
  const [selectedFormat, setSelectedFormat] = useState<'story' | 'post'>('story');

  const normalPagesCount = items.filter(p => !p.isPoster).length;
  const isSingleItem = items.length === 1;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Forwards wheel events to the inner scroll container so the modal scrolls from anywhere
  const handleModalWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: e.deltaY, behavior: 'auto' });
    }
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const generateAll = async () => {
      // Wait for D3 maps to finish rendering before capturing
      await new Promise(r => setTimeout(r, 2000));
      
      for (const item of items) {
        if (!isMounted) break;
        if (item.isPoster) continue; 
        
        try {
          const blobStory = await generateBlob(`${item.id}-story`, 'story');
          const blobPost = await generateBlob(`${item.id}-post`, 'post');
          
          if (isMounted) {
            setReadyBlobs(prev => ({
              ...prev,
              ...(blobStory ? { [`${item.id}-story`]: blobStory } : {}),
              ...(blobPost ? { [`${item.id}-post`]: blobPost } : {}),
            }));
            if (!blobStory || !blobPost) {
              setFailedBlobs(prev => new Set(prev).add(item.id));
            }
          }
        } catch (err) {
          console.error(`Failed to generate blobs for ${item.id}`, err);
          if (isMounted) setFailedBlobs(prev => new Set(prev).add(item.id));
        }
      }
    };
    generateAll();
    return () => { isMounted = false; };
  }, [items]);

  const handleDownloadZip = async () => {
    if (isSingleItem) return;
    window.umami?.track('Export Action', { type: 'zip_all' });
    setIsExporting(true);
    setExportError(null);
    try {
      await downloadZipBundle(items, readyBlobs, setLoadingText);
    } catch (err) {
      setExportError('Failed to generate ZIP bundle. Please try downloading images individually.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSingle = (id: string, name: string) => {
    window.umami?.track('Export Action', { type: 'save_single', format: selectedFormat, page: id });
    const blob = readyBlobs[`${id}-${selectedFormat}`];
    if (!blob) return;
    const filename = `LogbookWrapped_${selectedFormat === 'story' ? 'Story' : 'Post'}_${name.replace(/\s+/g, '')}.png`;
    triggerDownload(blob, filename);
  };

  const handleShareSingle = async (id: string, name: string) => {
    window.umami?.track('Export Action', { type: 'share_single', format: selectedFormat, page: id });
    const blob = readyBlobs[`${id}-${selectedFormat}`];
    if (!blob) return;
    await shareOrDownloadImage(blob, name, selectedFormat);
  };

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden flex flex-col touch-auto animate-in fade-in duration-300" onWheel={handleModalWheel}>
      {isShareLinkOpen && stats && (
        <ShareLinkModal stats={stats} onClose={() => setIsShareLinkOpen(false)} />
      )}
      
      {/* Off-screen render sandbox: html-to-image needs live DOM nodes */}
      <div className="absolute top-0 left-0 w-[450px] h-[800px] pointer-events-none z-[1] opacity-0 overflow-hidden">
        {items.filter(p => !p.isPoster).map((item, idx) => (
          <React.Fragment key={`sandbox-${idx}`}>
            <div className="absolute top-0 left-0 w-full h-[800px] bg-[#020617]">
              <ExportWrapper pageId={`${item.id}-story`} format="story">{item.render('story')}</ExportWrapper>
            </div>
            <div className="absolute top-0 left-0 w-full h-[562px] bg-[#020617]">
              <ExportWrapper pageId={`${item.id}-post`} format="post">{item.render('post')}</ExportWrapper>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl z-[2]" />
      <div className="relative z-[10] flex flex-col h-full w-full p-4 sm:p-8">
        {/* Mobile: title + close stack on row 1, share/slider/close on row 2.
            Desktop (sm+): everything inline on one row. */}
        <div className="w-full max-w-6xl mx-auto mb-6 sm:mb-8 mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center justify-between gap-4 w-full sm:w-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{title}</h2>
            <button onClick={onClose} disabled={isExporting} className="sm:hidden bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full text-white transition-all disabled:opacity-50 shadow-lg shrink-0">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {stats && (
              <button
                onClick={() => {
                  window.umami?.track('Share Link Modal Opened', { source: 'export_modal' });
                  setIsShareLinkOpen(true);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg shadow-yellow-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <LinkIcon size={15} />
                Share as Link
              </button>
            )}
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700 w-full sm:w-auto shadow-inner">
              <button
                onClick={() => setSelectedFormat('story')}
                className={`flex-1 sm:px-6 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all duration-300 ${selectedFormat === 'story' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                Story (9:16)
              </button>
              <button
                onClick={() => setSelectedFormat('post')}
                className={`flex-1 sm:px-6 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all duration-300 ${selectedFormat === 'post' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                Post (4:5)
              </button>
            </div>
            <button onClick={onClose} disabled={isExporting} className="hidden sm:inline-flex bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full text-white transition-all disabled:opacity-50 shrink-0 shadow-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        {exportError && (
          <div className="w-full max-w-6xl mx-auto mb-4 flex items-start gap-2 text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-xl text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{exportError}</span>
          </div>
        )}

        <div ref={scrollRef} className={`flex-1 w-full max-w-6xl mx-auto overflow-y-auto pr-2 pb-24 ${isSingleItem ? 'flex justify-center items-start' : ''}`}>
          <div className={isSingleItem ? 'w-full max-w-sm mt-4' : 'grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'}>
            {items.map((item, idx) => {
              const isReady = readyBlobs[`${item.id}-${selectedFormat}`];
              const hasFailed = failedBlobs.has(item.id);

              return (
              <div key={idx} className={`flex flex-col gap-3 bg-slate-900/80 p-4 rounded-2xl border transition-colors shadow-lg col-span-1 ${hasFailed ? 'border-red-800/60' : 'border-slate-800 hover:border-slate-700'} ${isSingleItem ? 'w-full' : ''}`}>
                <div className="text-sm font-medium text-slate-300 text-center">{item.name}</div>
                
                <PreviewCard page={item} format={selectedFormat} />

                {hasFailed && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>Generation failed. Try refreshing and exporting again.</span>
                  </div>
                )}

                <div className="flex gap-2 mt-auto w-full">
                  <button 
                    onClick={() => handleDownloadSingle(item.id, item.name)}
                    disabled={isExporting || !isReady}
                    className={`flex-1 flex justify-center items-center gap-1 sm:gap-2 py-3 rounded-lg transition-colors text-sm font-medium text-white ${isReady ? 'bg-slate-700 hover:bg-slate-600 shadow-md' : 'bg-slate-800 cursor-not-allowed opacity-70'}`}
                  >
                    {!isReady && !hasFailed ? <Loader2 size={16} className="animate-spin" /> : <><Download size={16} /> <span className="hidden sm:inline">Save</span></>}
                  </button>
                  <button 
                    onClick={() => handleShareSingle(item.id, item.name)}
                    disabled={isExporting || !isReady}
                    className={`flex-1 flex justify-center items-center gap-1 sm:gap-2 py-3 rounded-lg transition-colors text-sm font-medium text-white ${isReady ? 'bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-900/20' : 'bg-slate-800 cursor-not-allowed opacity-70'}`}
                  >
                    {!isReady && !hasFailed ? <Loader2 size={16} className="animate-spin" /> : <><Share2 size={16} /> <span className="hidden sm:inline">Share</span></>}
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {!isSingleItem && (
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex justify-center pb-8 pt-12 pointer-events-none">
            <button
              onClick={handleDownloadZip}
              disabled={isExporting || Object.keys(readyBlobs).length < (normalPagesCount * 2)}
              className="pointer-events-auto flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-200 disabled:bg-slate-500 disabled:opacity-80 text-slate-950 font-bold rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              {isExporting || Object.keys(readyBlobs).length < (normalPagesCount * 2) ? <Loader2 className="animate-spin" size={20} /> : <Archive size={20} />}
              {isExporting 
                ? loadingText 
                : Object.keys(readyBlobs).length < (normalPagesCount * 2)
                  ? `Generating ${Object.keys(readyBlobs).length}/${normalPagesCount * 2}...`
                  : 'Download All as ZIP (High Res)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};