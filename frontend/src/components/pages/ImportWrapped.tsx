import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogbookStore } from '../../store/useLogbookStore';
import { RadarLoader } from '../ui/RadarLoader';

export const ImportWrapped: React.FC = () => {
  const navigate = useNavigate();
  const { processFiles, setDateFilter } = useLogbookStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const allowedOrigins = [
        'http://localhost:5173', 
        'http://localhost:3000',
        // 'https://their-app.com' 
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        console.warn(`[ImportWrapped] Blocked message from unapproved origin: ${event.origin}`);
        return;
      }

      const { type, csvData, filter } = event.data;

      if (type === 'LOGBOOK_IMPORT' && csvData) {
        try {
          if (filter && filter.type) {
            setDateFilter(filter);
          }

          const virtualFile = new File([csvData], "imported_logbook.csv", { type: "text/csv" });
          
          // Use processFiles (array) and pass `true` to bypass the Config page
          await processFiles([virtualFile], true);
          
          // Redirect based on the mode requested by the API payload
          if (filter?.type === 'yoy') {
            navigate('/growth');
          } else {
            navigate('/wrapped');
          }
          
        } catch (err: any) {
          setError(err.message || "Failed to process the imported logbook.");
        }
      }
    };

    window.addEventListener("message", handleMessage);

    if (window.opener) {
        window.opener.postMessage({ type: 'LOGBOOK_WRAPPED_READY' }, '*');
    }

    return () => window.removeEventListener("message", handleMessage);
  }, [navigate, processFiles, setDateFilter]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-24 h-24 mb-8">
        <RadarLoader />
      </div>
      {error ? (
        <p className="text-red-400 max-w-md mx-auto">{error}</p>
      ) : (
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          Waiting for Logbook...
        </h2>
      )}
    </div>
  );
};