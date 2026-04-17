import React, { useState, useEffect } from 'react';
import { X, Share2, Archive, Loader2, Download } from 'lucide-react';
import JSZip from 'jszip';
import { toBlob } from 'html-to-image';
import { CalculatedStats } from '../../core/types';
import { ExportWrapper } from '../layout/ExportWrapper';

import { Page1_Cover } from '../pages/Page1_Cover';
import { Page2_BigPicture } from '../pages/Page2_BigPicture';
import { Page3_Fleet } from '../pages/Page3_Fleet';
import { Page4_Extremes } from '../pages/Page4_Extremes';
import { Page5_Superlatives } from '../pages/Page5_Superlatives';
import { Page6_Elements } from '../pages/Page6_Elements';
import { Page7_Passport } from '../pages/Page7_Passport';
import { Page8_Stats } from '../pages/Page8_Stats';

interface Props {
  stats: CalculatedStats;
  onClose: () => void;
}

// This dynamic component measures its own container width and mathematically scales 
// the 450px preview to fit perfectly, completely eliminating black bars and zoom bugs.
const PreviewCard = ({ page }: { page: any }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.3); // Start small to prevent flicker

  React.useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setScale(entries[0].contentRect.width / 450);
      }
    });
    
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full aspect-[9/16] bg-black rounded-xl overflow-hidden relative border border-slate-700 shadow-inner group">
       <div 
         className="absolute top-0 left-0 w-[450px] h-[800px] origin-top-left pointer-events-none"
         style={{ transform: `scale(${scale})` }}
       >
          <ExportWrapper pageId={`${page.id}-preview`}>
             {page.render()}
          </ExportWrapper>
       </div>
       <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none z-10" />
    </div>
  );
};

export const ExportModal: React.FC<Props> = ({ stats, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [readyBlobs, setReadyBlobs] = useState<Record<string, Blob>>({});

  const pages = [
    { id: 'export-p7', name: 'Passport', isPoster: false, render: () => <Page7_Passport stats={stats} isExportMode={true} /> },
    { id: 'export-p8', name: 'Stats', isPoster: false, render: () => <Page8_Stats stats={stats} isExportMode={true} /> },
    { id: 'export-p1', name: 'Cover', isPoster: false, render: () => <Page1_Cover stats={stats} /> },
    { id: 'export-p2', name: 'Big Picture', isPoster: false, render: () => <Page2_BigPicture stats={stats} /> },
    { id: 'export-p3', name: 'Fleet', isPoster: false, render: () => <Page3_Fleet stats={stats} /> },
    { id: 'export-p4', name: 'Extremes', isPoster: false, render: () => <Page4_Extremes stats={stats} /> },
    { id: 'export-p5', name: 'Superlatives', isPoster: false, render: () => <Page5_Superlatives stats={stats} /> },
    { id: 'export-p6', name: 'Elements', isPoster: false, render: () => <Page6_Elements stats={stats} /> },
  ];
  
  const normalPagesCount = pages.length;

  const generateBlob = async (elementId: string): Promise<Blob | null> => {
    const el = document.getElementById(elementId);
    if (!el) return null;
    
    try {
      return await toBlob(el, {
        pixelRatio: 2.4,
        backgroundColor: '#020617',
        width: 450,
        height: 800,
        // This is the magic flag that tells it to ignore Tailwind's phantom border rendering
        skipFonts: true, 
      });
    } catch (error) {
      console.error(`Failed to generate blob for ${elementId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const generateAll = async () => {
      // Increased to 2 seconds to guarantee D3 maps and geographical data have fully rendered
      await new Promise(r => setTimeout(r, 2000));
      
      for (const page of pages) {
        if (!isMounted) break;
        if (page.isPoster) continue; // Skip poster generation for social media blobs
        try {
          const blob = await generateBlob(page.id);
          if (blob && isMounted) {
            setReadyBlobs(prev => ({ ...prev, [page.id]: blob }));
          }
        } catch (err) {
          console.error(`Failed to generate ${page.id}`, err);
        }
      }
    };
    generateAll();
    return () => { isMounted = false; };
  }, []);

  const downloadZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].isPoster) continue;
        setLoadingText(`Packaging ${pages[i].name}...`);
        const blob = readyBlobs[pages[i].id] || await generateBlob(pages[i].id);
        if (blob) {
          zip.file(`LogbookWrapped_${pages[i].name.replace(/\s+/g, '')}.png`, blob);
        }
      }
      setLoadingText('Compressing ZIP bundle...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'LogbookWrapped_Export.zip';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to generate ZIP bundle.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = (id: string, name: string) => {
    const blob = readyBlobs[id];
    if (!blob) return;
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LogbookWrapped_${name.replace(/\s+/g, '')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async (id: string, name: string) => {
    const blob = readyBlobs[id];
    if (!blob) return;

    const file = new File([blob], `LogbookWrapped_${name.replace(/\s+/g, '')}.png`, { type: 'image/png' });
    try {
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `My LogbookWrapped - ${name}`,
          files: [file]
        });
      } else {
        handleDownload(id, name);
      }
    } catch (err) {
      console.warn("Share cancelled or failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden flex flex-col touch-auto animate-in fade-in duration-300">
      
      {/* LAYER 1: The Engine Sandbox. 
          Placed at 0,0 so Safari refuses to cull it, but securely at the absolute bottom of this modal's z-index stack */}
      <div className="absolute top-0 left-0 w-[450px] h-[800px] pointer-events-none z-[1]">
        {pages.filter(p => !p.isPoster).map((page, idx) => (
          <div key={`wrapper-${idx}`} className="absolute top-0 left-0 w-full h-full bg-[#020617]">
            <ExportWrapper pageId={page.id}>
              {page.render()}
            </ExportWrapper>
          </div>
        ))}
      </div>

      {/* LAYER 2: The Solid Blocker. 
          A completely opaque background that hides the sandbox from the user. No more Page 8 bleeding through! */}
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl z-[2]" />

      {/* LAYER 3: The Actual Modal UI */}
      <div className="relative z-[10] flex flex-col h-full w-full p-4 sm:p-8">
        <div className="flex justify-between items-center w-full max-w-6xl mx-auto mb-6 sm:mb-8 mt-4 sm:mt-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Export to Social Media</h2>
          <button onClick={onClose} disabled={isExporting} className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full text-white transition-all disabled:opacity-50 shrink-0 ml-4">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 w-full max-w-6xl mx-auto overflow-y-auto pr-2 pb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {pages.map((page, idx) => {
              const isFeatured = page.id === 'export-p7' || page.id === 'export-p8';
              
              return (
              <div key={idx} className={`flex flex-col gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors ${isFeatured ? 'md:col-span-2' : 'col-span-1'}`}>
                <div className="text-sm font-medium text-slate-300 text-center">{page.name}</div>
                
                {/* Previews */}
                <PreviewCard page={page} />

                {/* Buttons */}
                <div className="flex gap-2 mt-auto w-full">
                  <button 
                    onClick={() => handleDownload(page.id, page.name)}
                    disabled={isExporting || !readyBlobs[page.id]}
                    title="Save to Device"
                    className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg transition-colors text-sm font-medium text-white ${
                      readyBlobs[page.id] 
                        ? 'bg-slate-700 hover:bg-slate-600 shadow-lg' 
                        : 'bg-slate-800 cursor-not-allowed opacity-70'
                    }`}
                  >
                    {!readyBlobs[page.id] ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <><Download size={16} /> <span className="hidden sm:inline">Save</span></>
                    )}
                  </button>
                  <button 
                    onClick={() => handleShare(page.id, page.name)}
                    disabled={isExporting || !readyBlobs[page.id]}
                    title="Share via Device"
                    className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg transition-colors text-sm font-medium text-white ${
                      readyBlobs[page.id] 
                        ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20' 
                        : 'bg-slate-800 cursor-not-allowed opacity-70'
                    }`}
                  >
                    {!readyBlobs[page.id] ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <><Share2 size={16} /> <span className="hidden sm:inline">Share</span></>
                    )}
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Master Zip Button */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex justify-center pb-8 pt-12">
          <button
            onClick={downloadZip}
            disabled={isExporting || Object.keys(readyBlobs).length < normalPagesCount}
            className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-200 disabled:bg-slate-500 disabled:opacity-80 text-slate-950 font-bold rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            {isExporting || Object.keys(readyBlobs).length < normalPagesCount ? <Loader2 className="animate-spin" size={20} /> : <Archive size={20} />}
            {isExporting 
              ? loadingText 
              : Object.keys(readyBlobs).length < normalPagesCount
                ? `Generating ${Object.keys(readyBlobs).length}/${normalPagesCount}...`
                : 'Download All as ZIP (High Res)'}
          </button>
        </div>
      </div>
    </div>
  );
};