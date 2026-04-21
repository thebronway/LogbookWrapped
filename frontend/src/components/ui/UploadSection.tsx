import { Link } from 'react-router-dom';
import { Info, Calendar, Download, UploadCloud, Play } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';
import { Dropzone } from './Dropzone';

export const UploadSection = () => {
  const { status, errorMessage, resetStore, setDateFilter, processFile } = useLogbookStore();

  const loadDemo = async (demoType: '2025' | 'allTime') => {
    try {
      const filePath = demoType === '2025' ? '/assets/demo_files/demo1.csv' : '/assets/demo_files/demo2.csv';
      const response = await fetch(filePath);
      if (!response.ok) throw new Error('Failed to fetch demo file');
      
      const blob = await response.blob();
      const file = new File([blob], demoType === '2025' ? 'demo1.csv' : 'demo2.csv', { type: 'text/csv' });

      if (demoType === '2025') {
        setDateFilter({ type: 'custom', start: '2025-01-01', end: '2025-12-31' });
      } else {
        setDateFilter({ type: 'all_time' });
      }

      await processFile(file);
    } catch (error) {
      console.error('Error loading demo:', error);
    }
  };

  return (
    <section 
      id="upload-section" 
      className="w-full flex flex-col items-center text-center gap-10 bg-slate-900/40 border border-slate-800/50 backdrop-blur-md px-4 py-10 md:p-20 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl scroll-mt-32"
    >
      <div className="max-w-2xl w-full flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8">Ready to make your wrapped?</h2>
        
        <div className="relative text-left text-slate-300 mb-8 w-full max-w-lg">
          <ul id="steps-list" className="text-lg relative z-10 scroll-mt-28">
            <li className="relative flex items-start gap-4 pb-8">
              <div className="absolute left-4 top-8 bottom-0 w-0.5 border-l-2 border-dashed border-slate-700 -translate-x-1/2 z-0"></div>
              
              <span className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-blue-400 flex items-center justify-center border border-slate-700 shadow-sm mt-0.5">
                <Calendar size={16} />
              </span>
              <div>
                <span className="block font-medium text-white">Select your timeframe.</span>
                <span className="text-sm text-slate-400 block mt-1 leading-relaxed">
                  Choose between This Year, Last Year, All Time, or set a Custom Date Range using the dropdown below.
                </span>
                <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300">
                  <Info size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-200 font-medium">Example:</strong> Set a custom range from <code className="text-slate-300 bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-xs font-mono">01/01/2023</code> to <code className="text-slate-300 bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-xs font-mono">12/31/2023</code> to generate a dedicated 2023 Year in Review.
                  </p>
                </div>
              </div>
            </li>
            <li className="relative flex items-start gap-4 pb-8">
              <div className="absolute left-4 top-8 bottom-0 w-0.5 border-l-2 border-dashed border-slate-700 -translate-x-1/2 z-0"></div>
              
              <span className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center border border-slate-700 shadow-sm mt-0.5">
                <Download size={16} />
              </span>
              <div>
                <span className="block font-medium text-white">Export your logbook as a <code className="text-slate-300 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-sm font-mono">.csv</code> or <code className="text-slate-300 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-sm font-mono">.txt</code>.</span>
                <span className="text-sm text-slate-400 block mt-1 leading-relaxed">
                  Download your raw data from ForeFlight (beta), Garmin Pilot (beta), LogTen (Coming Soon), or MyFlightbook (Coming Soon). Not sure where to find it? <Link to="/export" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">Read our export guide.</Link>
                </span>
              </div>
            </li>
            <li className="relative flex items-start gap-4">
              <span className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-purple-400 flex items-center justify-center border border-slate-700 shadow-sm mt-0.5">
                <UploadCloud size={16} />
              </span>
              <div>
                <span className="block font-medium text-white">Upload the file to generate your story!</span>
                <span className="text-sm text-slate-400 block mt-1 leading-relaxed">
                  Drag and drop your file below. Everything is processed 100% locally in your browser. Curious how we calculate things? <Link to="/methodology" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">View our methodology.</Link>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Demo Files Section */}
      <div className="w-full max-w-2xl mb-8 flex flex-col items-center relative z-10">
        <div className="w-full flex items-center gap-4 mb-6">
          <div className="h-px bg-slate-800 flex-1"></div>
          <span className="text-slate-500 font-medium text-sm tracking-widest uppercase">Or try a demo</span>
          <div className="h-px bg-slate-800 flex-1"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <button 
            onClick={() => loadDemo('2025')}
            className="flex flex-col items-start p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800 hover:border-blue-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                <Play size={16} fill="currentColor" />
              </div>
              <span className="text-white font-semibold">2025 Year in Review</span>
            </div>
            <p className="text-sm text-slate-400">Experience a typical pilot's flight schedule over a single year.</p>
          </button>

          <button 
            onClick={() => loadDemo('allTime')}
            className="flex flex-col items-start p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800 hover:border-purple-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
                <Play size={16} fill="currentColor" />
              </div>
              <span className="text-white font-semibold">All-Time Career</span>
            </div>
            <p className="text-sm text-slate-400">See how the application visualizes thousands of flights across a career.</p>
          </button>
        </div>
      </div>

      {/* Borderless Dropzone Container */}
      <div className="w-full max-w-2xl relative z-10">
        {status === 'error' ? (
          <div className="p-8 text-center space-y-4">
            <div className="inline-flex p-3 bg-red-500/10 rounded-full text-red-500 mb-2">
              <Info size={32} />
            </div>
            <p className="text-red-200 font-medium">{errorMessage}</p>
            <button 
              onClick={resetStore} 
              className="px-6 py-2 bg-white text-black rounded-full hover:bg-slate-200 transition-colors font-bold text-sm"
            >
              Try Another File
            </button>
          </div>
        ) : (
          <Dropzone />
        )}
      </div>
    </section>
  );
};