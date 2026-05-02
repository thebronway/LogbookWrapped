import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';

export const Dropzone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
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

  const validateAndProcessFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setFileError(null);

    const files = Array.from(fileList);
    const validExtensions = ['.csv', '.txt', '.tsv'];

    const errors: string[] = [];
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        window.umami?.track('Upload Attempt', { status: 'error_size' });
        errors.push(`"${file.name}" exceeds the 10MB file size limit.`);
        return false;
      }
      if (!(file.type === 'text/csv' || validExtensions.some(ext => file.name.toLowerCase().endsWith(ext)))) {
        window.umami?.track('Upload Attempt', { status: 'error_invalid_extension' });
        errors.push(`"${file.name}" is not a valid CSV, TXT, or TSV file.`);
        return false;
      }
      return true;
    });

    if (errors.length > 0) {
      setFileError(errors.join(' '));
    }

    if (validFiles.length > 0) {
      window.umami?.track('Upload Attempt', { status: 'success', count: validFiles.length });
      processFiles(validFiles);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [processFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    validateAndProcessFiles(e.dataTransfer.files);
  }, [validateAndProcessFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndProcessFiles(e.target.files);
  }, [validateAndProcessFiles]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">

      {/* The Dropzone */}
      <div
        className={`w-full p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-200 shadow-xl cursor-pointer group ${
          isDragging
            ? 'border-yellow-400 bg-yellow-400/10 scale-105'
            : 'border-slate-600 bg-slate-800/50 hover:bg-slate-800 hover:border-yellow-400/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className={`w-16 h-16 mb-4 transition-colors ${isDragging ? 'text-yellow-400' : 'text-slate-400 group-hover:text-yellow-400'}`} />
        <h3 className="text-xl font-bold mb-2 text-center text-white group-hover:text-yellow-50 transition-colors">Drop your Logbook file here</h3>
        <p className="text-slate-400 text-center mb-6">
          100% private. No data leaves your browser.
        </p>

        <span className="bg-yellow-400 group-hover:bg-yellow-300 text-black shadow-lg shadow-yellow-500/20 px-8 py-3 rounded-lg font-bold tracking-wide transition-colors">
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

      {/* Inline File Validation Error */}
      {fileError && (
        <div className="flex items-start gap-2 text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-xl text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{fileError}</span>
        </div>
      )}

    </div>
  );
};
