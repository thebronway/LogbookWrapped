import { Link } from 'react-router-dom';
import { Info, Calendar, Download, UploadCloud } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';
import { Dropzone } from './Dropzone';

export const UploadSection = () => {
  const { status, errorMessage, resetStore } = useLogbookStore();

  return (
    <section 
      id="upload-section" 
      className="w-full flex flex-col items-center text-center gap-10 bg-slate-900/40 border border-slate-800/50 backdrop-blur-md px-4 py-10 md:p-20 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl scroll-mt-32"
    >
      <div className="max-w-2xl w-full flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8">Upload Your Logbook</h2>
        
        <div className="relative text-left text-slate-300 mb-8 w-full max-w-lg">
          <ul id="steps-list" className="text-lg relative z-10 scroll-mt-28">
            <li className="relative flex items-start gap-4 pb-8">
              <div className="absolute left-4 top-8 bottom-0 w-0.5 border-l-2 border-dashed border-slate-700 -translate-x-1/2 z-0"></div>
              
              <span className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center border border-slate-700 shadow-sm mt-0.5">
                <Download size={16} />
              </span>
              <div>
                <span className="block font-medium text-white">1. Export your logbook.</span>
                <span className="text-sm text-slate-400 block mt-1 leading-relaxed">
                  Download your raw data from ForeFlight, Garmin Pilot, LogTen, or MyFlightbook. Not sure where to find it? <Link to="/export" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">Read our export guide.</Link>
                </span>
              </div>
            </li>
            
            <li className="relative flex items-start gap-4 pb-8">
              <div className="absolute left-4 top-8 bottom-0 w-0.5 border-l-2 border-dashed border-slate-700 -translate-x-1/2 z-0"></div>
              
              <span className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-purple-400 flex items-center justify-center border border-slate-700 shadow-sm mt-0.5">
                <UploadCloud size={16} />
              </span>
              <div>
                <span className="block font-medium text-white">2. Upload the file.</span>
                <span className="text-sm text-slate-400 block mt-1 leading-relaxed">
                  Drag and drop your file below. Everything is processed <strong className="text-emerald-400 font-bold">100% locally in your browser</strong>. Curious how we crunch the numbers? <Link to="/methodology" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">View our methodology.</Link>
                </span>
              </div>
            </li>
            
            <li className="relative flex items-start gap-4">
              <span className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-blue-400 flex items-center justify-center border border-slate-700 shadow-sm mt-0.5">
                <Calendar size={16} />
              </span>
              <div>
                <span className="block font-medium text-white">3. Configure your story.</span>
                <span className="text-sm text-slate-400 block mt-1 leading-relaxed">
                  Once uploaded, you'll choose to generate an Annual Review, track a custom Milestone, or generate a Year-over-Year Growth Report.
                </span>
              </div>
            </li>
          </ul>
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
              onClick={() => {
                window.umami?.track('Upload Retry Clicked');
                resetStore();
              }}
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