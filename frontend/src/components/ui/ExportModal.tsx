import React, { useState, useEffect } from 'react';
import { X, Share2, Archive, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import { CalculatedStats } from '../../core/types';
import { ExportWrapper } from '../layout/ExportWrapper';

import { Page1_Cover } from '../pages/Page1_Cover';
import { Page2_FootprintMap } from '../pages/Page2_FootprintMap';
import { Page3_Fleet } from '../pages/Page3_Fleet';
import { Page4_BigPicture } from '../pages/Page4_BigPicture';
import { Page5_Extremes } from '../pages/Page5_Extremes';
import { Page6_Superlatives } from '../pages/Page6_Superlatives';
import { Page7_Elements } from '../pages/Page7_Elements';
import { Page8_Summary } from '../pages/Page8_Summary';

interface Props {
  stats: CalculatedStats;
  onClose: () => void;
}

export const ExportModal: React.FC<Props> = ({ stats, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [readyBlobs, setReadyBlobs] = useState<Record<string, Blob>>({});

  const pages = [
    { id: 'export-p1', name: 'Cover', render: () => <Page1_Cover stats={stats} /> },
    // isExportMode passed to Map to lock WebGL buffer and disable animations
    { id: 'export-p2', name: 'Footprint', render: () => <Page2_FootprintMap stats={stats} isExportMode={true} /> },
    { id: 'export-p3', name: 'Fleet', render: () => <Page3_Fleet stats={stats} /> },
    { id: 'export-p4', name: 'Big Picture', render: () => <Page4_BigPicture stats={stats} /> },
    { id: 'export-p5', name: 'Extremes', render: () => <Page5_Extremes stats={stats} /> },
    { id: 'export-p6', name: 'Superlatives', render: () => <Page6_Superlatives stats={stats} /> },
    { id: 'export-p7', name: 'Elements', render: () => <Page7_Elements stats={stats} /> },
    // isExportMode passed to Summary to hide buttons
    { id: 'export-p8', name: 'Summary', render: () => <Page8_Summary stats={stats} isExportMode={true} /> },
  ];

  const generateBlob = async (elementId: string): Promise<Blob | null> => {
    const el = document.getElementById(elementId);
    if (!el) return null;
    const canvas = await html2canvas(el, { 
      scale: 2.4, 
      useCORS: true, 
      backgroundColor: '#020617',
      logging: false,
      width: 450,
      height: 800,
      windowWidth: 450,
      windowHeight: 800,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0
    });
    return new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.95));
  };

  useEffect(() => {
    let isMounted = true;
    const generateAll = async () => {
      // Increased to 2 seconds to guarantee Mapbox WebGL has fully downloaded and painted
      await new Promise(r => setTimeout(r, 2000));
      
      for (const page of pages) {
        if (!isMounted) break;
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
        setLoadingText(`Packaging ${pages[i].name}...`);
        const blob = readyBlobs[pages[i].id] || await generateBlob(pages[i].id);
        if (blob) {
          zip.file(`LogbookWrapped_Page${i + 1}_${pages[i].name.replace(/\s+/g, '')}.png`, blob);
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
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.warn("Share cancelled or failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden flex flex-col animate-in fade-in duration-300">
      
      {/* LAYER 1: The Engine Sandbox. 
          Placed at 0,0 so Safari refuses to cull it, but securely at the absolute bottom of this modal's z-index stack */}
      <div className="absolute top-0 left-0 w-[450px] h-[800px] pointer-events-none z-[1]">
        {pages.map((page, idx) => (
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
        <div className="flex justify-between items-center w-full max-w-6xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Export to Social Media</h2>
          <button onClick={onClose} disabled={isExporting} className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full text-white transition-all disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 w-full max-w-6xl mx-auto overflow-y-auto pr-2 pb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {pages.map((page, idx) => (
              <div key={idx} className="flex flex-col gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="text-sm font-medium text-slate-300 text-center">{page.name}</div>
                
                {/* Previews */}
                <div className="w-full aspect-[9/16] bg-black rounded-xl overflow-hidden relative border border-slate-700 shadow-inner group">
                   <div className="absolute top-0 left-0 w-[450px] h-[800px] origin-top-left transform scale-[0.32] sm:scale-[0.38] md:scale-[0.38] lg:scale-[0.45] xl:scale-[0.52] pointer-events-none">
                      <ExportWrapper pageId={`${page.id}-preview`}>
                         {page.render()}
                      </ExportWrapper>
                   </div>
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none" />
                </div>

                {/* Buttons */}
                <button 
                  onClick={() => handleShare(page.id, page.name)}
                  disabled={isExporting || !readyBlobs[page.id]}
                  className={`w-full flex justify-center items-center gap-2 py-2.5 rounded-lg transition-colors text-sm font-medium mt-auto text-white ${
                    readyBlobs[page.id] 
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20' 
                      : 'bg-slate-700 cursor-not-allowed opacity-70'
                  }`}
                >
                  {!readyBlobs[page.id] ? (
                    <><Loader2 size={16} className="animate-spin" /> Generating...</>
                  ) : (
                    <><Share2 size={16} /> Share / Save</>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Master Zip Button */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex justify-center pb-8 pt-12">
          <button
            onClick={downloadZip}
            disabled={isExporting || Object.keys(readyBlobs).length < pages.length}
            className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-200 disabled:bg-slate-500 disabled:opacity-80 text-slate-950 font-bold rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            {isExporting || Object.keys(readyBlobs).length < pages.length ? <Loader2 className="animate-spin" size={20} /> : <Archive size={20} />}
            {isExporting 
              ? loadingText 
              : Object.keys(readyBlobs).length < pages.length
                ? `Generating ${Object.keys(readyBlobs).length}/${pages.length}...`
                : 'Download All as ZIP (High Res)'}
          </button>
        </div>
      </div>
    </div>
  );
};