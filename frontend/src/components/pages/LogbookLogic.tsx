import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LogbookLogic = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-3xl mx-auto py-16 px-6 sm:px-8 space-y-12 text-slate-300"
    >
      <Helmet>
        <title>How It Works | LogbookWrapped</title>
        <meta name="description" content="Discover how LogbookWrapped cleans, patches, and interprets your pilot logbook data to calculate your aviation stats." />
      </Helmet>
      <div className="space-y-4">
        <h1 className="text-4xl font-black text-white tracking-tight">How We Crunch The Numbers</h1>
        <p className="text-lg text-slate-400">
          Pilots log things differently. Some are meticulous; others leave half the columns blank. 
          Here is how our engine automatically cleans, patches, and interprets your data before doing the math.
        </p>
      </div>

      <div className="space-y-10">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">1. No Landings Logged</h2>
          <p className="leading-relaxed">
            <strong>The Rule:</strong> Unless you jumped out with a parachute, you landed. If your departure and destination are different and you logged flight time, we automatically credit you with 1 landing.
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You fly from KANP to KBWI, log 1.5 hours, but leave the "Landings" column blank.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">2. Aircraft Normalization</h2>
          <p className="leading-relaxed">
            <strong>The Rule:</strong> Pilots log aircraft types in dozens of creative ways. We strip out dashes and spaces, then use smart substring matching to automatically group variants into their core profiles.
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You log your plane as "C-172P", "172N", and "C172". Instead of splitting your stats into three different planes, we beautifully bundle them all under "C172".
            </p>
          </div>
          <div className="pt-2">
            <Link to="/aircraftprofiles" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-blue-400 hover:bg-slate-700 hover:text-blue-300 rounded-lg text-sm font-semibold transition-colors border border-slate-700">
              View Supported Aircraft Database &rarr;
            </Link>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">3. Self-Healing Aircraft Types</h2>
          <p className="leading-relaxed">
            <strong>The Rule:</strong> The app scans your entire logbook to memorize your fleet. If it sees you flew a specific tail number as a C172 yesterday, it automatically fills in the blank for today so your performance stats don't break.
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You log tail number N7368F but forget to fill in the aircraft type (C172).
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">4. The Hobbs & Block Fallback</h2>
          <p className="leading-relaxed">
            <strong>The Rule:</strong> We rebuild missing flight times for you. We check your Hobbs meters, then Tach meters, and finally calculate your Block Time (even if your flight crossed midnight).
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You forget to enter your Total Time, but you did log your Engine Hobbs meters or Clock Times (Time Out/Time In).
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">5. The Local Flight Loop</h2>
          <p className="leading-relaxed">
            <strong>The Rule:</strong> We assume you returned to base. We copy your departure airport into the destination slot so you still get a nice dot on the map.
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You take off from KANP, do some maneuvers, and land at KANP. You write "Local" in the destination or just leave it blank.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">6. Shorthand vs. Ghost Airports</h2>
          <p className="leading-relaxed">
            <strong>The Rule:</strong> To prevent your map from drawing wild lines to the Caribbean, we explicitly ignore common pilot shorthands in the route column (DCT, DIR, GPS, RNAV, VOR, VFR, etc.).
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You write "DCT" (Direct) in your route. Coincidentally, "DCT" is the official code for Duncan Town Airport in the Bahamas.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">7. The Plausibility Envelope</h2>
          <p className="leading-relaxed">
            <strong>The Rule:</strong> We calculate Earth-curvature distances. Based on your aircraft's known cruise speed, if reaching a waypoint would require you to fly Mach 3, we know it's a VOR masquerading as an airport and drop it from the map.
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You log a 1-hour flight in a Cessna 172 in Maryland, but log a VOR in your route that shares a 3-letter code with an airport in Mexico.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">8. Missing Distances & Fuel Burn</h2>
          <p className="leading-relaxed">
            <strong>The Rule:</strong> We use the Haversine Great Circle formula to calculate the exact distance of your flight path. For fuel, we look up your Aircraft Type in our database of over 50 performance profiles. Flying something experimental? We safely default to 120 knots and 10 GPH.
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You leave the Distance or Fuel Burn columns completely blank.
            </p>
          </div>
        </section>
      </div>

      {/* Call to Action */}
      <section className="flex flex-col items-center justify-center pt-12 mt-12 border-t border-slate-800">
        <p className="mb-6 text-center text-lg text-slate-300">
          Pilots find crazy edge cases every day. Is a rule not working right? <br className="hidden sm:block" /> 
          Have a suggestion for a new fallback? Help us improve the parser!
        </p>
        <a 
          href="https://github.com/thebronway/LogbookWrapped/issues" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-full transition-transform hover:scale-105 active:scale-95 hover:bg-slate-100 shadow-xl shadow-white/10"
        >
          <Github size={24} />
          Report an Issue or Suggestion
        </a>
      </section>

    </motion.div>
  );
};