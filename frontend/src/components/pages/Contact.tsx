import { Helmet } from 'react-helmet-async';

export const Contact = () => (
  <div className="max-w-3xl mx-auto px-6 py-16 text-slate-300">
    <Helmet>
      <title>Contact Us | Logbook Wrapped</title>
      <meta name="description" content="Get in touch with the team behind Logbook Wrapped. We welcome bug reports, feature requests, and general feedback." />
    </Helmet>
    <h1 className="text-4xl font-bold text-white mb-6">Contact Us</h1>
    <p className="text-lg mb-8">
      Have a feature request, spotted a bug, or just want to talk aviation? We'd love to hear from you. 
    </p>
    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
      <p className="mb-4">
        Currently, the best way to reach us is by opening an issue on our open-source GitHub repository.
      </p>
      <a 
        href="https://github.com/thebronway/LogbookWrapped" 
        target="_blank" 
        rel="noreferrer"
        className="inline-block bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Visit GitHub Repository
      </a>
    </div>
  </div>
);