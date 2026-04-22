import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, Calendar } from 'lucide-react';
import { useLogbookStore, DateFilterType } from '../../store/useLogbookStore';

export const Dropzone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const processFile = useLogbookStore((state) => state.processFile);
  const dateFilter = useLogbookStore((state) => state.dateFilter);
  const setDateFilter = useLogbookStore((state) => state.setDateFilter);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentYear = new Date().getFullYear();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (file.size > 10 * 1024 * 1024) {
        (window as any).umami?.track('Upload Attempt', { status: 'error_size' });
        alert('File size exceeds 10MB limit. Please upload a smaller file.');
        return;
      }

      const validExtensions = ['.csv', '.txt', '.tsv'];
      if (file.type === 'text/csv' || validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
        (window as any).umami?.track('Upload Attempt', { status: 'success' });
        processFile(file);
      } else {
        (window as any).umami?.track('Upload Attempt', { status: 'error_invalid_extension' });
        alert('Please upload a valid CSV, TXT, or TSV file.');
      }
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 10 * 1024 * 1024) {
        (window as any).umami?.track('Upload Attempt', { status: 'error_size' });
        alert('File size exceeds 10MB limit. Please upload a smaller file.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      (window as any).umami?.track('Upload Attempt', { status: 'success' });
      processFile(file);
    }
  }, [processFile]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      
      {/* Dynamic Date Picker */}
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-2 text-slate-300 w-full sm:w-auto">
          <Calendar size={20} className="text-blue-400" />
          <span className="font-semibold tracking-wide">Timeframe:</span>
        </div>
        <div className="w-full flex-1 flex flex-col gap-3">
          <select 
            value={dateFilter.type}
            onChange={(e) => {
              const newType = e.target.value as DateFilterType;
              (window as any).umami?.track('Timeframe Selected', { filter: newType });
              setDateFilter({ ...dateFilter, type: newType });
            }}
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none font-medium appearance-none cursor-pointer"
          >
            <option value="this_year">This Year ({currentYear})</option>
            <option value="last_year">Last Year ({currentYear - 1})</option>
            <option value="all_time">All Time</option>
            <option value="custom">Custom Date Range...</option>
          </select>
          
          {/* Custom Date Inputs */}
          {dateFilter.type === 'custom' && (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={dateFilter.start || ''}
                onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="text-slate-500 font-bold">to</span>
              <input 
                type="date" 
                value={dateFilter.end || ''}
                onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* The Dropzone */}
      <div 
        className={`w-full p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-200 shadow-xl cursor-pointer group ${
          isDragging 
            ? 'border-blue-500 bg-blue-500/20 scale-105' 
            : 'border-slate-600 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className={`w-16 h-16 mb-4 transition-colors ${isDragging ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`} />
        <h3 className="text-xl font-bold mb-2 text-center text-white group-hover:text-blue-50 transition-colors">Drop your Logbook file here</h3>
        <p className="text-slate-400 text-center mb-6">
          100% private. No data leaves your browser.
        </p>
        
        <span className="bg-blue-600/80 group-hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold tracking-wide transition-colors">
          Browse Files
        </span>
        <input 
          type="file" 
          className="hidden" 
          accept=".csv, .txt, .tsv" 
          onChange={handleFileInput}
          ref={fileInputRef}
        />
      </div>
      
    </div>
  );
};