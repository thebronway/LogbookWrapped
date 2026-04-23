import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogbookStore } from '../../store/useLogbookStore';
import { RadarLoader } from '../ui/RadarLoader';

export const ImportAPI: React.FC = () => {
  const navigate = useNavigate();
  const processFile = useLogbookStore(state => state.processFile);
  const setDateFilter = useLogbookStore(state => state.setDateFilter);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This function listens for the postMessage from the partner's tab
    const handleMessage = async (event: MessageEvent) => {
      // 1. SECURITY CHECK: Ensure it's coming from an approved domain
      // NOTE: For testing locally, you can allow '*' or 'http://localhost:5173', 
      // but in production, STRICTLY enforce domains like 'https://app.myflightbook.com'
      const allowedOrigins = [
        'http://localhost:5173', 
        'http://localhost:3000',
        // 'https://their-app.com' 
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        console.warn(`[ImportAPI] Blocked message from unapproved origin: ${event.origin}`);
        return;
      }

      // 2. EXTRACT DATA: Expecting a JSON object with { type: 'LOGBOOK_IMPORT', csvData: '...', filter?: {...} }
      const { type, csvData, filter } = event.data;

      if (type === 'LOGBOOK_IMPORT' && csvData) {
        try {
          // 3. FILTER: Set the date filter if provided by the partner (defaults to 'this_year' otherwise)
          if (filter && filter.type) {
            setDateFilter(filter);
          }

          // 4. TRANSLATE: Turn the raw text string into a virtual File object for your Parser
          const virtualFile = new File([csvData], "imported_logbook.csv", { type: "text/csv" });
          
          // 5. PARSE & STORE (processFile handles the airport DB and applies the active filter)
          await processFile(virtualFile);
          
          // 6. REDIRECT: Send them straight to the Wrapped experience
          navigate('/story'); // Or whichever route starts your slides
          
        } catch (err: any) {
          setError(err.message || "Failed to process the imported logbook.");
        }
      }
    };

    // Attach the listener
    window.addEventListener("message", handleMessage);

    // Tell the parent window (if we were opened via window.open) that we are ready to receive!
    if (window.opener) {
        window.opener.postMessage({ type: 'LOGBOOK_WRAPPED_READY' }, '*');
    }

    // Cleanup listener on unmount
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate, processFile, setDateFilter]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-24 h-24 mb-8">
        <RadarLoader />
      </div>
      <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
        Receiving Flight Data...
      </h2>
      <p className="text-slate-400 max-w-md mx-auto">
        {error ? (
          <span className="text-red-400">{error}</span>
        ) : (
          "Securely importing your logbook from our partner. This will just take a second."
        )}
      </p>
    </div>
  );
};