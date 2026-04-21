import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { AIRCRAFT_PROFILES } from '../../core/AircraftProfiles';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export const AircraftProfilesTable = () => {
  const allProfiles = Object.entries(AIRCRAFT_PROFILES);
  
  const small = allProfiles.filter(([, profile]) => profile.type === 'small').sort((a, b) => a[0].localeCompare(b[0]));
  const medium = allProfiles.filter(([, profile]) => profile.type === 'medium').sort((a, b) => a[0].localeCompare(b[0]));
  const large = allProfiles.filter(([, profile]) => profile.type === 'large').sort((a, b) => a[0].localeCompare(b[0]));
  const experimentalAndUnknown = allProfiles.filter(([, profile]) => profile.type === 'experimental' || profile.type === 'unknown').sort((a, b) => a[0].localeCompare(b[0]));

  const renderTable = (title: string, data: typeof small) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white px-2 border-l-4 border-blue-500">{title}</h2>
      <div className="overflow-x-auto bg-slate-900 rounded-xl border border-slate-800 shadow-xl relative z-10">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="text-xs text-slate-300 uppercase bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 font-bold w-1/3">Aircraft Code</th>
              <th className="px-6 py-4 font-bold w-1/3">Speed (KTAS)</th>
              <th className="px-6 py-4 font-bold w-1/3">Fuel Burn (GPH)</th>
            </tr>
          </thead>
          <tbody>
            {data.map(([code, profile]) => (
              <tr key={code} className="border-b border-slate-800 hover:bg-slate-800 transition-colors">
                <td className="px-6 py-4 font-mono font-medium text-white">{code}</td>
                <td className="px-6 py-4">{profile.speed}</td>
                <td className="px-6 py-4">{profile.gph}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-16 px-6 sm:px-8 space-y-12 text-slate-300 w-full"
    >
      <Helmet>
        <title>Supported Aircraft | LogbookWrapped</title>
        <meta name="description" content="A complete list of aircraft performance profiles used by LogbookWrapped." />
      </Helmet>
      
      <div className="space-y-4">
        <h1 className="text-4xl font-black text-white tracking-tight">Supported Aircraft Profiles</h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          We use this database to estimate fuel burn and validate distances. Our parser will attempt to group your logged variants into these core profiles (e.g. C172N C-172P 172 &gt; C172). If your aircraft isn't listed, we default to <strong className="text-white">120 KTAS</strong> and <strong className="text-white">10 GPH</strong>.
        </p>
        <div className="pt-2">
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-blue-400 hover:bg-slate-700 hover:text-blue-300 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
          >
            <Mail size={16} />
            Report a missing profile or incorrect data
          </Link>
        </div>
      </div>

      <div className="space-y-12">
        {renderTable("Small (Piston Single & Twin)", small)}
        {renderTable("Medium (Turboprops & Light/Mid Jets)", medium)}
        {renderTable("Large (Commercial Airliners)", large)}
        {renderTable("Experimental & Unknown", experimentalAndUnknown)}
      </div>
    </motion.div>
  );
};