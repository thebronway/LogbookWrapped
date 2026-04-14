import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { Printer, Loader2 } from 'lucide-react';
import { CalculatedStats } from '../../core/types';
import { PosterPrintLayout } from '../layout/PosterPrintLayout';

interface Props {
  stats: CalculatedStats;
}

export const PosterExportTrigger: React.FC<Props> = ({ stats }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const el = document.getElementById('poster-print-target');
      if (!el) throw new Error('Poster element not found');

      // Using toPng to generate a high-res file
      const dataUrl = await toPng(el, {
        pixelRatio: 2, // Renders a 2400x3600 image (double our 1200x1800 div)
        backgroundColor: '#020617',
        skipFonts: true, // Prevents Tailwind pseudo-element rendering bugs
      });

      const link = document.createElement('a');
      link.download = `LogbookWrapped_Poster_Test.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export poster:', error);
      alert('Failed to generate poster. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* The Download Button */}
      <button 
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Printer size={20} />}
        {isExporting ? 'Generating High-Res File...' : 'Test Print Poster (24x36)'}
      </button>

      {/* The Hidden Sandbox Layer */}
      <div className="fixed top-0 left-[-9999px] pointer-events-none z-[-1]">
        <PosterPrintLayout id="poster-print-target" stats={stats} />
      </div>
    </>
  );
};