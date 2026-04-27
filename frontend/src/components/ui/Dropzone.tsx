import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, Users } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';

export const Dropzone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const processFiles = useLogbookStore((state) => state.processFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const validateAndProcessFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    
    const files = Array.from(fileList);
    const validExtensions = ['.csv', '.txt', '.tsv'];
    
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        (window as any).umami?.track('Upload Attempt', { status: 'error_size' });
        alert(`File ${file.name} exceeds 10MB limit.`);
        return false;
      }
      if (!(file.type === 'text/csv' || validExtensions.some(ext => file.name.toLowerCase().endsWith(ext)))) {
        (window as any).umami?.track('Upload Attempt', { status: 'error_invalid_extension' });
        alert(`File ${file.name} is not a valid CSV, TXT, or TSV.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      (window as any).umami?.track('Upload Attempt', { status: 'success', count: validFiles.length });
      processFiles(validFiles);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    validateAndProcessFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndProcessFiles(e.target.files);
  }, [processFiles]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">

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