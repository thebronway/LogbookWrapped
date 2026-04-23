import { Helmet } from 'react-helmet-async';
import { Github, Mail, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const About = () => {

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto px-6 py-16 text-slate-300"
    >
      <Helmet>
        <title>About LogbookWrapped | Your Aviation Story</title>
        <meta name="description" content="Learn more about LogbookWrapped, the privacy-first tool built for pilots to visualize their flight history." />
      </Helmet>

      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-6">About LogbookWrapped</h1>
      </header>

      <div className="space-y-10 text-lg leading-relaxed">
        <section>
          <p>
            Welcome to LogbookWrapped, the tool for pilots wanting to visualize their aviation milestones. 
            We believe your flight history is more than just rows in a CSV file, it's a story of your journey through the skies.
          </p>
        </section>
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
              As a pilot myself, I know how sensitive logbook data can be. Your certificates, routes, 
              and remarks are your business. That's why LogbookWrapped is built with a 
              <strong className="text-white"> 100% client-side privacy-first architecture</strong>.{' '}
              Read our <Link to="/privacy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">Privacy Policy</Link>.
            </p>
            <p>
              When you drop your CSV into the app, your browser processes the data locally. 
              Your raw logbook entries are never shared or sent to any servers.
            </p>
          </div>
        </section>

        <section className="bg-slate-800/40 border border-slate-700 p-8 rounded-2xl flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Keep the Servers Airborne</h2>
          <p className="mb-8 max-w-2xl text-slate-300">
            LogbookWrapped is a labor of love built by a pilot, for pilots. It's 100% free with no ads. If you love your LogbookWrapped, consider throwing a few bucks in the AvGas Tip Jar to help cover server hosting costs!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl">
            <a 
              href="https://buymeacoffee.com/brianconway" 
              target="_blank" 
              rel="noreferrer"
              onClick={() => (window as any).umami?.track('Donation Clicked', { platform: 'bmc', source: 'about_page' })}
              className="flex-1 w-full bg-[#FFDD00] hover:bg-[#FFEA4D] text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm sm:text-lg px-2"
            >
              <Coffee className="text-black shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
              Buy Me a Coffee (or 100LL)
            </a>
            
            <a 
              href="https://paypal.me/brconway" 
              target="_blank" 
              rel="noreferrer"
              onClick={() => (window as any).umami?.track('Donation Clicked', { platform: 'paypal', source: 'about_page' })}
              className="flex-1 w-full bg-[#00457C] hover:bg-[#005a9e] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm sm:text-lg px-2"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.98 5.04-4.345 6.788-8.637 6.788h-2.19c-.522 0-.966.382-1.048.9l-1.12 7.105c-.062.395.244.75.645.75h3.63c.43 0 .798-.31.865-.736l.732-4.646c.067-.426.435-.736.865-.736h.813c3.812 0 6.845-1.556 7.685-5.88.23-1.182.21-2.22-.057-3.088l-.535-.17z" />
              </svg>
              Donate via PayPal
            </a>
          </div>
        </section>

        {/* ABOUT THE CREATOR SECTION */}
        <section className="bg-slate-800/40 border border-slate-700 p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold text-white mb-4">About the Creator</h2>
          <div className="space-y-4 text-slate-300">
            <p>
              Hi, I'm Brian. By day, I work in IT, but in my free time, I love flying around in a C172 and building useful apps, especially those with an aviation flavor.
            </p>
            <p>
              LogbookWrapped is one of those passion projects.
            </p>
            <p>
              If you're curious about what else I'm working on, feel free to check out my portfolio at{' '}
              <a 
                href="https://brian.conway.im" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => (window as any).umami?.track('Portfolio Link Clicked', { source: 'about_page' })}
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                brian.conway.im
              </a>.
            </p>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center py-12 border-t border-slate-800">
          <p className="mb-6 text-center">
            Transparency is key. You can verify our privacy architecture by auditing our 100% open-source code, or reach out to us with any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://github.com/thebronway/LogbookWrapped" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 text-white font-bold rounded-full transition-transform hover:scale-105 active:scale-95 hover:bg-slate-700 shadow-xl border border-slate-700"
            >
              <Github size={20} />
              Verify Source
            </a>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-full transition-transform hover:scale-105 active:scale-95 hover:bg-slate-100 shadow-xl shadow-white/10"
            >
              <Mail size={20} />
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </motion.div>
  );
};