import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export const Dev: React.FC = () => {
  return (
    <div className="flex flex-col items-center min-h-[80vh] px-6 py-12 md:py-24 max-w-4xl mx-auto w-full">
      <Helmet>
        <title>Developer API | Partner Integration | LogbookWrapped</title>
        <meta name="description" content="Integrate LogbookWrapped into your aviation app with our secure, 100% client-side import API using the browser's native window.postMessage() API." />
        <link rel="canonical" href="https://logbookwrapped.com/dev" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full text-left space-y-8"
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-sky-400 mb-4 tracking-tight">Partner Integration API</h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            LogbookWrapped offers a 100% serverless, client-side import API. This allows partner applications to securely send user flight data to LogbookWrapped for visualization without routing sensitive logbook data through third-party backend servers.
          </p>
        </div>

        <hr className="border-slate-800" />

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-400 mb-4">
            Instead of a traditional REST endpoint, our API utilizes the browser's native <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300">window.postMessage()</code> API. This creates a secure, tab-to-tab data bridge.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-2">
            <li>Your application opens <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300">logbookwrapped.com/import</code> in a new browser tab.</li>
            <li>LogbookWrapped initializes and broadcasts a "Ready" message back to your window.</li>
            <li>Your application sends the raw CSV string via <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300">postMessage</code>.</li>
            <li>LogbookWrapped parses the data locally and begins the Wrapped experience.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Security & Allowed Origins</h2>
          <div className="bg-sky-950/30 border border-sky-900/50 p-4 rounded-xl">
            <p className="text-sky-200/80 text-sm">
              <strong>Important:</strong> LogbookWrapped strictly enforces a Cross-Origin allowlist. Messages sent from unauthorized domains are silently dropped. You must contact us to have your application's domain (e.g., <code className="text-sky-300">https://app.yourdomain.com</code>) added to the approved sender list before implementing in production.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Implementation Example</h2>
          <p className="text-slate-400 mb-4">Below is a complete implementation showing how to launch specific LogbookWrapped experiences (Wrapped, Growth, or Milestones) from your application.</p>
          
          <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden relative">
            <pre className="p-4 overflow-x-auto text-sm text-sky-200 font-mono leading-relaxed">
{`// 1. Define the raw CSV data (must match standard EFB export formats)
const rawCsvString = "Date,Aircraft ID,Route,Total Time...\\n2023-10-01,N12345,KLAX-KSFO,1.5...";

// 2. Open LogbookWrapped in a new tab
const wrappedWindow = window.open('https://logbookwrapped.com/mywrapped', '_blank');

// 3. Set up a listener to wait for LogbookWrapped to be ready
const handleMessage = (event) => {
  // Verify the message came from LogbookWrapped
  if (event.origin !== 'https://logbookwrapped.com') return;

  // When LogbookWrapped says it's ready, send the payload
  if (event.data && event.data.type === 'LOGBOOK_WRAPPED_READY') {
    
    // Example: Launching a Growth (Year-over-Year) Report
    const payload = {
      type: 'LOGBOOK_IMPORT',
      csvData: rawCsvString,
      filter: {
        type: 'yoy',      // Determines the dashboard mode
        year1: '2025',    // The baseline year
        year2: '2024'     // The comparison year
      }
    };

    // Send the data securely
    wrappedWindow.postMessage(payload, 'https://logbookwrapped.com');

    // Clean up the listener once sent
    window.removeEventListener('message', handleMessage);
  }
};

window.addEventListener('message', handleMessage);`}
            </pre>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Data Payload Specs</h2>
          <ul className="space-y-4 text-slate-400">
            <li>
              <strong className="text-slate-200">type:</strong> Must be exactly <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300">"LOGBOOK_IMPORT"</code>.
            </li>
            <li>
              <strong className="text-slate-200">csvData:</strong> A string containing the entire uncompressed CSV file. LogbookWrapped automatically fuzzy-matches standard EFB headers. Ensure newline characters (<code className="text-sky-300">\n</code>) are retained.
            </li>
            <li>
              <strong className="text-slate-200">filter (Optional):</strong> An object dictating the target experience and timeframe. If omitted, defaults to the current year Wrapped.
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2 text-sm text-slate-400">
                <li><code className="text-slate-300">{"{ type: 'this_year' }"}</code> - Current calendar year Wrapped</li>
                <li><code className="text-slate-300">{"{ type: 'last_year' }"}</code> - Previous calendar year Wrapped</li>
                <li><code className="text-slate-300">{"{ type: 'all_time' }"}</code> - Entire logbook history Wrapped</li>
                <li>
                  <code className="text-slate-300">{"{ type: 'yoy', year1: '2025', year2: '2024' }"}</code> - Generates a <strong>Growth</strong> report comparing the two provided years.
                </li>
                <li>
                  <code className="text-slate-300">{"{ type: 'milestone', label: 'Private Pilot', start: '2023-01-01', end: '2023-12-31' }"}</code> - Generates a <strong>Milestone</strong> tracker with a custom title on the cover page.
                </li>
                <li>
                  <code className="text-slate-300">{"{ type: 'custom', start: '2022-01-01', end: '2022-12-31' }"}</code> - Any custom date range (YYYY-MM-DD). If the range spans exactly Jan 1st to Dec 31st of a single year, LogbookWrapped automatically renders an annual Wrapped.
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="pb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Get In Touch</h2>
          <div className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-xl">
            <p className="text-slate-300 text-lg mb-2">
              Want to chat about an integration or need your domain added to the allowlist?
            </p>
            <p className="text-slate-400">
              Shoot us an email at <a href="mailto:contact@logbookwrapped.com" className="text-sky-400 hover:text-sky-300 font-medium underline underline-offset-4">contact@logbookwrapped.com</a>
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
};