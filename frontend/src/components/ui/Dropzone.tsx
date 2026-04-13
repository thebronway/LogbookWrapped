import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';

export const Dropzone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const processFile = useLogbookStore((state) => state.processFile);

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
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        processFile(file);
      } else {
        alert('Please upload a valid CSV file.');
      }
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  return (
    <div 
      className={`w-full max-w-xl p-12 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center transition-colors duration-200 ${
        isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 bg-slate-800'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <UploadCloud className={`w-16 h-16 mb-4 ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
      <h3 className="text-xl font-bold mb-2 text-center">Drop your Logbook CSV here</h3>
      <p className="text-slate-400 text-center mb-6">
        Supports ForeFlight, Garmin Pilot, and LogTen exports. <br/>100% private. No data leaves your browser.
      </p>
      
      <label className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer font-semibold transition-colors">
        Browse Files
        <input 
          type="file" 
          className="hidden" 
          accept=".csv" 
          onChange={handleFileInput} 
        />
      </label>
    </div>
  );
};