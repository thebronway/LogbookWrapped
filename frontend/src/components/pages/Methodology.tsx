import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Methodology = () => {
  const [showCountries, setShowCountries] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto py-16 px-6 sm:px-8 text-slate-300"
    >
      <Helmet>
        <title>How It Works | LogbookWrapped</title>
        <meta name="description" content="Discover how LogbookWrapped cleans, patches, and interprets your pilot logbook data to calculate your aviation stats." />
      </Helmet>
      
      <header className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">How We Crunch The Numbers</h1>
        <p className="text-xl text-slate-300 leading-relaxed">
          Pilots log things differently. Some are meticulous; others leave half the columns blank. 
          Here is how our engine automatically cleans, patches, and interprets your data before doing the math.
        </p>
      </header>

      <div className="bg-slate-800/40 border border-slate-700 p-6 sm:p-10 rounded-2xl space-y-10 text-lg leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">1. No Landings Logged</h2>
          <p className="leading-relaxed">
            Unless you jumped out with a parachute, you landed. If your departure and destination are different and you logged flight time, we automatically credit you with 1 landing.
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You fly from KANP to 2W5, but leave the Landings column blank. We assume you landed and count that as 1 landing.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">2. Aircraft Normalization</h2>
          <p className="leading-relaxed">
            Pilots log aircraft types in dozens of creative ways. We strip out dashes and spaces, then use smart substring matching to automatically group variants into their core profiles.
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You log your plane as "C-172P", "172N", and "C172". Instead of splitting your stats into three different planes, we normalize them all under C172.
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
            The app scans your entire logbook to memorize your fleet. If it sees you flew a specific tail number as a C172 yesterday, it automatically fills in the blank for today so your performance stats don't break.
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You log tail number N7368F but forget to fill in the aircraft type (C172), and in previous entries you logged N7368F as a C172. We assume that the airframe hasn't changed for that tail number as log it as such.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">4. The Hobbs & Block Fallback</h2>
          <p className="leading-relaxed">
            We rebuild missing flight times for you. We check your Hobbs meters, then Tach meters, and finally calculate your Block Time (even if your flight crossed midnight).
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You forget to enter your Total Time, but you did log your Engine Hobbs meters or Clock Times (Time Out/Time In). So we do some basic math to calculate the Total Time.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">5. The Local Flight Loop</h2>
          <p className="leading-relaxed">
            We assume you returned to base. We copy your departure airport into the destination slot so you still get a nice dot on the map.
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You take off from KXKX, do some maneuvers, and land back at KXKX. You write "Local" in the destination or just leave it blank. So we assume the destination is the same as the origin.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">6. Shorthand vs. Ghost Airports</h2>
          <p className="leading-relaxed">
            To prevent your map from drawing wild lines to the across the map, we explicitly ignore common pilot shorthands in the route column (DCT, DIR, GPS, RNAV, VOR, VFR, etc.).
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You write "DCT" (Direct) in your route. Coincidentally, "DCT" is the official code for Duncan Town Airport in the Bahamas, so we drop that drop the route.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">7. Supported Geographies</h2>
          <p className="leading-relaxed">
            To keep the application fast and lightweight, our airport script exclusively pulls in data for the US, Canada, Mexico, the Caribbean, and US territories. Airports outside these regions will not be plotted on the map.
          </p>

          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg mt-3">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You log a flight to London Heathrow (EGLL). Because it falls outside our supported geographic boundary, it will not be used for calculations or mapping.
            </p>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => setShowCountries(!showCountries)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-blue-400 hover:bg-slate-700 hover:text-blue-300 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
            >
              {showCountries ? "Hide supported countries ▲" : "View full list of supported countries ▼"}
            </button>
          </div>

          {showCountries && (
            <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl text-sm text-slate-400 leading-relaxed mt-2">
              <strong className="text-white block mb-1">North America:</strong> United States, Canada, Mexico <br/>
              <strong className="text-white block mt-2 mb-1">US Territories:</strong> Puerto Rico, U.S. Virgin Islands, Guam, American Samoa, Northern Mariana Islands <br/>
              <strong className="text-white block mt-2 mb-1">Caribbean & Atlantic:</strong> Anguilla, Antigua and Barbuda, Aruba, Bahamas, Barbados, Bermuda, Bonaire Sint Eustatius and Saba, British Virgin Islands, Cayman Islands, Cuba, Curaçao, Dominica, Dominican Republic, Grenada, Haiti, Jamaica, Montserrat, Saint Barthélemy, Saint Kitts and Nevis, Saint Lucia, Saint Martin, Saint Vincent and the Grenadines, Sint Maarten, Trinidad and Tobago, Turks and Caicos Islands
            </div>
          )}

        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">8. The Plausibility Envelope</h2>
          <p className="leading-relaxed">
            We calculate Earth-curvature distances. Based on your aircraft's known cruise speed, if reaching a waypoint would require you to fly Mach 3, we know it's a VOR masquerading as an airport and drop it from the map.
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You log a 1-hour flight in a Cessna 172 in Maryland, but log a VOR in your route that shares a 3-letter code with an airport in Mexico, we exclude that waypoint in our calculations.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">9. Missing Distances & Fuel Burn</h2>
          <p className="leading-relaxed">
            We use the Haversine Great Circle formula to calculate the exact distance of your flight path. For fuel, we look up your Aircraft Type in our database of over 50 performance profiles. Flying something experimental? We default to 120 knots and 10 GPH.
          </p>
          <div className="bg-slate-900/60 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-200/90 font-mono">
              <span className="font-sans font-bold text-blue-400 uppercase tracking-widest text-xs block mb-1">Example</span>
              You leave the Distance or Fuel Burn columns completely blank, so we default to 120 knots and 10 GPH.
            </p>
          </div>
        </section>

        <hr className="border-slate-700/50 my-8" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Data Sources & Attribution</h2>
          <p className="leading-relaxed text-sm">
            LogbookWrapped relies on several incredible open-source projects to power our geographic and airport data. We want to extend a huge thank you to the maintainers of these datasets:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-400 ml-2 mt-2">
            <li><strong className="text-slate-300">Global Boundaries:</strong> Provided by <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Natural Earth</a>, a public domain map dataset.</li>
            <li><strong className="text-slate-300">Map Rendering Architecture:</strong> Powered by <a href="https://github.com/topojson/topojson" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">TopoJSON</a>, created by Mike Bostock.</li>
            <li><strong className="text-slate-300">Canadian Geographies:</strong> Sourced via <a href="https://carto.com/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">CARTO</a> (formerly CartoDB) open datasets.</li>
            <li><strong className="text-slate-300">Airport Database:</strong> A highly curated, locally-stored subset derived from <a href="https://ourairports.com/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">OurAirports</a> and FAA open data.</li>
          </ul>
        </section>
      </div>

      {/* Call to Action */}
      <section className="flex flex-col items-center justify-center pt-8 mt-16">
        <p className="mb-6 text-center text-lg text-slate-300">
          Pilots find crazy edge cases every day. Is a rule not working right? <br className="hidden sm:block" /> 
          Have a suggestion for a new fallback? Help us improve the parser!
        </p>
        <Link 
          to="/contact"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-full transition-transform hover:scale-105 active:scale-95 hover:bg-slate-100 shadow-xl shadow-white/10"
        >
          <Mail size={24} />
          Contact Us
        </Link>
      </section>

    </motion.div>
  );
};