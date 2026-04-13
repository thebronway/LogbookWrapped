import { Helmet } from 'react-helmet-async';
import { Github } from 'lucide-react'; // Assuming you use lucide-react, or replace with an SVG

export const About = () => (
  <div className="max-w-4xl mx-auto px-6 py-16 text-slate-300">
    <Helmet>
      <title>About LogbookWrapped | Your Aviation Story</title>
      <meta name="description" content="Learn more about LogbookWrapped, the privacy-first tool built for pilots to visualize their flight history." />
    </Helmet>

    <header className="mb-12">
      <h1 className="text-4xl font-bold text-white mb-6">About LogbookWrapped</h1>
      <p className="text-xl leading-relaxed">
        Welcome to LogbookWrapped, the tool for pilots wanting to visualize their aviation milestones. 
        We believe your flight history is more than just rows in a CSV file, it's a story of your journey through the skies.
      </p>
    </header>

    <div className="space-y-10 text-lg leading-relaxed">
      <section>
        <p>
          Born from the viral success of end-of-year review apps, LogbookWrapped was created to give 
          aviators a beautiful, engaging, and easy-to-share recap of their flying hours, favorite routes, 
          fleet diversity, and aviation extremes.
        </p>
      </section>

      <section className="bg-slate-800/40 border border-slate-700 p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">Why Privacy Matters</h2>
        <div className="space-y-4">
          <p>
            As pilots ourselves, we know how sensitive logbook data can be. Your certificates, routes, 
            and remarks are your business. That's why LogbookWrapped is built with a 
            <strong className="text-white"> 100% client-side privacy-first architecture</strong>.
          </p>
          <p>
            When you drop your CSV into our platform, your browser processes the data locally. 
            Your raw logbook entries are never shared or sent to our servers. The only exception 
            is if you choose to use a 3rd party printing service; then only the specific data 
            being printed is transmitted.
          </p>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center py-8 border-t border-slate-800">
        <p className="mb-6 text-center">
          Transparency is key. You can verify our privacy architecture by auditing our 100% open-source code.
        </p>
        <a 
          href="https://github.com/thebronway/LogbookWrapped" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-full transition-transform hover:scale-105 active:scale-95 hover:bg-slate-100 shadow-xl shadow-white/10"
        >
          <Github size={24} />
          Verify Source on GitHub
        </a>
      </section>
    </div>
  </div>
);