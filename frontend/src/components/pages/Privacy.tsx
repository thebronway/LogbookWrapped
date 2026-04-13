import { Helmet } from 'react-helmet-async';

export const Privacy = () => (
  <div className="max-w-4xl mx-auto px-6 py-16 text-slate-300">
    <Helmet>
      <title>Privacy Policy | Logbook Wrapped</title>
      <meta name="description" content="Read the privacy policy for Logbook Wrapped. We respect your data with 100% client-side processing." />
    </Helmet>
    <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
    <div className="space-y-6 leading-relaxed">
      <p>Last Updated: {new Date().toLocaleDateString()}</p>
      <h2 className="text-2xl font-semibold text-white mt-8 mb-2">1. Local Processing Guarantee</h2>
      <p>
        The core feature of Logbook Wrapped—parsing and visualizing your Electronic Flight Bag (EFB) CSV file—is performed entirely on your local device (client-side) using JavaScript. Your raw logbook data is <strong>never uploaded to, transmitted to, or stored on our servers.</strong>
      </p>
      <h2 className="text-2xl font-semibold text-white mt-8 mb-2">2. Optional Print Proxy Data</h2>
      <p>
        If you optionally choose to purchase a print-on-demand poster of your flight map, ONLY the specific, anonymized geometric data required to generate that print will be routed through our proxy server to our print partner (e.g., Printful/Printify). You will be explicitly notified before any data leaves your browser.
      </p>
      <h2 className="text-2xl font-semibold text-white mt-8 mb-2">3. Analytics & Cookies</h2>
      <p>
        We may use basic, anonymized web analytics to see how many people visit the site. These do not tie back to your personal logbook data.
      </p>
    </div>
  </div>
);