import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { AIRCRAFT_PROFILES } from '../../core/AircraftProfiles';
import { Link } from 'react-router-dom';
import { Mail, ChevronDown } from 'lucide-react';

export const AircraftProfilesTable = () => {
  const allProfiles = Object.entries(AIRCRAFT_PROFILES);
  
  const small = allProfiles.filter(([, profile]) => profile.type === 'small').sort((a, b) => a[0].localeCompare(b[0]));
  const medium = allProfiles.filter(([, profile]) => profile.type === 'medium').sort((a, b) => a[0].localeCompare(b[0]));
  const large = allProfiles.filter(([, profile]) => profile.type === 'large').sort((a, b) => a[0].localeCompare(b[0]));
  const experimental = allProfiles.filter(([, profile]) => profile.type === 'experimental').sort((a, b) => a[0].localeCompare(b[0]));
  const unknown = allProfiles.filter(([, profile]) => profile.type === 'unknown').sort((a, b) => a[0].localeCompare(b[0]));

  /**
   * FIX: Robust scroll handler
   * Uses manual pixel calculation instead of scrollIntoView to prevent "stuck" bugs.
   */
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Pixels to leave above the header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const renderTable = (id: string, title: string, data: [string, any][]) => (
    <div id={id} className="space-y-4 scroll-mt-24">
      <h2 className="text-2xl font-bold text-white px-2 border-l-4 border-blue-500">{title}</h2>
      <div className="overflow-x-auto bg-slate-900 rounded-xl border border-slate-800 shadow-xl relative z-10">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="text-xs text-slate-300 uppercase bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 font-bold">Code</th>
              <th className="hidden sm:table-cell px-6 py-4 font-bold">Aircraft Name</th>
              <th className="px-6 py-4 font-bold text-right">Speed (KTAS)</th>
              <th className="px-6 py-4 font-bold text-right">Fuel Burn (GPH)</th>
            </tr>
          </thead>
          <tbody>
            {data.map(([code, profile]) => (
              <tr key={code} className="border-b border-slate-800 hover:bg-slate-800 transition-colors">
                <td className="px-6 py-4 font-mono font-medium text-blue-400">{code}</td>
                <td className="hidden sm:table-cell px-6 py-4 text-white font-medium">{profile.name}</td>
                <td className="px-6 py-4 text-right font-mono">{profile.speed}</td>
                <td className="px-6 py-4 text-right font-mono">{profile.gph}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-16 px-6 sm:px-8 space-y-10 text-slate-300 w-full"
    >
      <Helmet>
        <title>Supported Aircraft | LogbookWrapped</title>
        <meta name="description" content="A complete list of aircraft performance profiles used by LogbookWrapped." />
      </Helmet>
      
      <div className="space-y-4">
        <h1 className="text-4xl font-black text-white tracking-tight">Supported Aircraft Profiles</h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          We use this database to estimate fuel burn and validate distances. Our parser will attempt to group your logged variants into these core profiles. If your aircraft isn't listed, we default to <strong className="text-white">120 KTAS</strong> and <strong className="text-white">10 GPH</strong>.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-blue-400 hover:bg-slate-700 hover:text-blue-300 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
          >
            <Mail size={16} />
            Missing a profile?
          </Link>
        </div>
      </div>

      {/* Jump Links with Pixel-Perfect Scrolling */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          <ChevronDown size={14} />
          Jump to Category
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'small', label: 'Small' },
            { id: 'medium', label: 'Medium' },
            { id: 'large', label: 'Large' },
            { id: 'experimental', label: 'Experimental' },
            { id: 'unknown', label: 'Unknown' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => scrollToSection(cat.id)}
              className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-16 pt-4">
        {renderTable("small", "Small (Piston Single & Twin)", small)}
        {renderTable("medium", "Medium (Turboprops & Light/Mid Jets)", medium)}
        {renderTable("large", "Large (Commercial Airliners)", large)}
        {renderTable("experimental", "Experimental", experimental)}
        {renderTable("unknown", "Unknown", unknown)}
      </div>
    </motion.div>
  );
};