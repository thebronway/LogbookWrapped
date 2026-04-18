import React, { useState, useEffect } from 'react';
import { X, Share2, Archive, Loader2, Download } from 'lucide-react';
import { CalculatedStats } from '../../core/types';
import { ExportWrapper } from '../layout/ExportWrapper';
import { getExportPages } from '../../config/ExportPages';
import { generateBlob, downloadZipBundle, shareOrDownloadImage, triggerDownload } from '../../core/ExportEngine';
import { PreviewCard } from './PreviewCard';

interface Props {
  stats: CalculatedStats;
  onClose: () => void;
}

export const ExportModal: React.FC<Props> = ({ stats, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [readyBlobs, setReadyBlobs] = useState<Record<string, Blob>>({});
  const [selectedFormat, setSelectedFormat] = useState<'story' | 'post'>('story');

  // useMemo ensures the array reference stays stable between renders
  // so the useEffect doesn't abort and restart the generation loop!
  const pages = React.useMemo(() => getExportPages(stats), [stats]);
  const normalPagesCount = pages.filter(p => !p.isPoster).length;

  useEffect(() => {
    let isMounted = true;
    const generateAll = async () => {
      // Allow 2s for D3 maps and geographical data to fully render
      await new Promise(r => setTimeout(r, 2000));
      
      for (const page of pages) {
        if (!isMounted) break;
        if (page.isPoster) continue; 
        
        try {
          const blobStory = await generateBlob(`${page.id}-story`, 'story');
          const blobPost = await generateBlob(`${page.id}-post`, 'post');
          
          if (isMounted) {
            setReadyBlobs(prev => ({ 
                ...prev, 
                ...(blobStory ? { [`${page.id}-story`]: blobStory } : {}),
                ...(blobPost ? { [`${page.id}-post`]: blobPost } : {})
            }));
          }
        } catch (err) {
          console.error(`Failed to generate blobs for ${page.id}`, err);
        }
      }
    };
    generateAll();
    return () => { isMounted = false; };
  }, [pages]);

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await downloadZipBundle(pages, readyBlobs, setLoadingText);
    } catch (err) {
      alert('Failed to generate ZIP bundle.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSingle = (id: string, name: string) => {
    const blob = readyBlobs[`${id}-${selectedFormat}`];
    if (!blob) return;
    const filename = `LogbookWrapped_${selectedFormat === 'story' ? 'Story' : 'Post'}_${name.replace(/\s+/g, '')}.png`;
    triggerDownload(blob, filename);
  };

  const handleShareSingle = async (id: string, name: string) => {
    const blob = readyBlobs[`${id}-${selectedFormat}`];
    if (!blob) return;
    await shareOrDownloadImage(blob, name, selectedFormat);
  };

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden flex flex-col touch-auto animate-in fade-in duration-300">
      
      {/* LAYER 1: The Engine Sandbox */}
      <div className="absolute top-0 left-0 w-[450px] h-[800px] pointer-events-none z-[1]">
        {pages.filter(p => !p.isPoster).map((page, idx) => (
          <React.Fragment key={`sandbox-${idx}`}>
            <div className="absolute top-0 left-0 w-full h-[800px] bg-[#020617]">
              <ExportWrapper pageId={`${page.id}-story`} format="story">{page.render('story')}</ExportWrapper>
            </div>
            <div className="absolute top-0 left-0 w-full h-[562px] bg-[#020617]">
              <ExportWrapper pageId={`${page.id}-post`} format="post">{page.render('post')}</ExportWrapper>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* LAYER 2: The Solid Blocker */}
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl z-[2]" />

      {/* LAYER 3: The Actual Modal UI */}
      <div className="relative z-[10] flex flex-col h-full w-full p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full max-w-6xl mx-auto mb-6 sm:mb-8 mt-4 sm:mt-0 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Export to Social Media</h2>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700 w-full sm:w-auto shadow-inner">
              <button
                onClick={() => setSelectedFormat('story')}
                className={`flex-1 sm:px-6 py-2 rounded-md text-sm font-bold transition-all duration-300 ${selectedFormat === 'story' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                Story (9:16)
              </button>
              <button
                onClick={() => setSelectedFormat('post')}
                className={`flex-1 sm:px-6 py-2 rounded-md text-sm font-bold transition-all duration-300 ${selectedFormat === 'post' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                Post (4:5)
              </button>
            </div>
            <button onClick={onClose} disabled={isExporting} className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full text-white transition-all disabled:opacity-50 shrink-0 ml-auto sm:ml-0 shadow-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-6xl mx-auto overflow-y-auto pr-2 pb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {pages.map((page, idx) => {
              const isFeatured = page.id === 'export-p7' || page.id === 'export-p8';
              const isReady = readyBlobs[`${page.id}-${selectedFormat}`];
              
              return (
              <div key={idx} className={`flex flex-col gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors shadow-lg ${isFeatured ? 'md:col-span-2' : 'col-span-1'}`}>
                <div className="text-sm font-medium text-slate-300 text-center">{page.name}</div>
                <PreviewCard page={page} format={selectedFormat} />

                <div className="flex gap-2 mt-auto w-full">
                  <button 
                    onClick={() => handleDownloadSingle(page.id, page.name)}
                    disabled={isExporting || !isReady}
                    className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg transition-colors text-sm font-medium text-white ${isReady ? 'bg-slate-700 hover:bg-slate-600 shadow-md' : 'bg-slate-800 cursor-not-allowed opacity-70'}`}
                  >
                    {!isReady ? <Loader2 size={16} className="animate-spin" /> : <><Download size={16} /> <span className="hidden sm:inline">Save</span></>}
                  </button>
                  <button 
                    onClick={() => handleShareSingle(page.id, page.name)}
                    disabled={isExporting || !isReady}
                    className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg transition-colors text-sm font-medium text-white ${isReady ? 'bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-900/20' : 'bg-slate-800 cursor-not-allowed opacity-70'}`}
                  >
                    {!isReady ? <Loader2 size={16} className="animate-spin" /> : <><Share2 size={16} /> <span className="hidden sm:inline">Share</span></>}
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>

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
      </div>
    </div>
  );
};