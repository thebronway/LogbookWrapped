import { Helmet } from 'react-helmet-async';
import { Download, Smartphone } from 'lucide-react';

export const Export = () => (
  <div className="max-w-4xl mx-auto px-6 py-16 text-slate-300">
    <Helmet>
      <title>How to Export Your Logbook | LogbookWrapped</title>
      <meta name="description" content="Learn how to export your aviation logbook from ForeFlight, Garmin Pilot, LogTen Pro, and more." />
    </Helmet>

    <header className="mb-12">
      <h1 className="text-4xl font-bold text-white mb-6 flex items-center gap-4">
        <Download size={36} className="text-indigo-400" />
        Export Guide
      </h1>
      <p className="text-xl leading-relaxed">
        LogbookWrapped needs your raw logbook data in a <strong className="text-white">.csv</strong> format to generate your stats. Here is how to easily export your data from the most popular Electronic Flight Bags (EFBs).
      </p>
    </header>

    <div className="space-y-10 text-lg leading-relaxed">
      
      {/* EFB Instructions */}
      <section className="bg-slate-800/40 border border-slate-700 p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Exporting from your EFB</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">ForeFlight</h3>
            <ol className="list-decimal pl-5 space-y-1 text-slate-400">
              <li>Open ForeFlight on the web (plan.foreflight.com) or the iOS App.</li>
              <li>Go to <strong>Logbook</strong>.</li>
              <li>Tap the <strong>Export</strong> button (usually an arrow pointing out of a box at the top right).</li>
              <li>Select <strong>Export as CSV</strong>.</li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-2">Garmin Pilot</h3>
            <ol className="list-decimal pl-5 space-y-1 text-slate-400">
              <li>Open the Garmin Pilot app.</li>
              <li>Navigate to <strong>Logbook</strong> from the home menu.</li>
              <li>Tap the <strong>Menu</strong> icon (three dots) in the top right.</li>
              <li>Select <strong>Export Logbook</strong> and choose the <strong>CSV</strong> format.</li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-2">LogTen Pro</h3>
            <ol className="list-decimal pl-5 space-y-1 text-slate-400">
              <li>Open LogTen Pro.</li>
              <li>Go to the <strong>Reports</strong> tab.</li>
              <li>Search for or select <strong>Export</strong>.</li>
              <li>Choose <strong>Export to CSV</strong> or <strong>Export to Excel (CSV)</strong> and generate the report.</li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-2">MyFlightbook</h3>
            <ol className="list-decimal pl-5 space-y-1 text-slate-400">
              <li>Log into MyFlightbook on the web.</li>
              <li>Go to <strong>Logbook</strong> {'>'} <strong>Download</strong>.</li>
              <li>Select <strong>CSV</strong> as the format and click Download.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Mobile Saving Instructions */}
      <section className="bg-slate-800/40 border border-slate-700 p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          <Smartphone size={28} className="text-emerald-400" />
          Saving & Retrieving on Mobile
        </h2>
        <p className="mb-6">
          If you are doing this entirely on your phone or tablet, saving the file properly is crucial so LogbookWrapped can access it.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">iOS (iPhone/iPad)</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>When the export finishes, the iOS Share Sheet will appear.</li>
              <li>Scroll down and tap <strong>Save to Files</strong>.</li>
              <li>Choose a location (like "On My iPhone" {'>'} "Downloads") and tap <strong>Save</strong>.</li>
              <li>When uploading to LogbookWrapped, tap the upload area and select <strong>Choose File</strong>. Browse to where you saved it.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-2">Android</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>When the export finishes, tap <strong>Save</strong> or <strong>Download</strong>.</li>
              <li>The file will be saved in your <strong>Downloads</strong> folder.</li>
              <li>When uploading to LogbookWrapped, tap the upload area and select <strong>Files</strong> or <strong>Media</strong>.</li>
              <li>Navigate to your Downloads folder to select the CSV.</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  </div>
);