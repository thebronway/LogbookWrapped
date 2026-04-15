import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { AIRCRAFT_PROFILES } from '../../core/AircraftProfiles';

// Grouping the known keys so we don't have to rewrite the core math database
const SMALL_AIRCRAFT = new Set(["J3", "C150", "C152", "DA20", "AA5", "C172", "PA28", "M20T", "SR20", "DA40", "C177", "DA42", "C182", "SR22", "PA32", "BE36", "C206", "C210", "PA34", "PA44", "BE58", "C310"]);
const MEDIUM_AIRCRAFT = new Set(["PA46", "C208", "SF50", "TBM8", "TBM9", "PC12", "BE20", "B350", "C510", "C25A", "B190", "E55P", "PC24", "LJ45", "LJ60", "CL60", "GLF4", "C750", "GLF6", "GL5T"]);

export const AircraftProfilesTable = () => {
  const allProfiles = Object.entries(AIRCRAFT_PROFILES);
  
  // Sort each group alphabetically
  const small = allProfiles.filter(([code]) => SMALL_AIRCRAFT.has(code)).sort((a, b) => a[0].localeCompare(b[0]));
  const medium = allProfiles.filter(([code]) => MEDIUM_AIRCRAFT.has(code)).sort((a, b) => a[0].localeCompare(b[0]));
  const large = allProfiles.filter(([code]) => !SMALL_AIRCRAFT.has(code) && !MEDIUM_AIRCRAFT.has(code)).sort((a, b) => a[0].localeCompare(b[0]));

  const renderTable = (title: string, data: typeof small) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white px-2 border-l-4 border-blue-500">{title}</h2>
      <div className="overflow-x-auto bg-slate-900/50 rounded-xl border border-slate-800 shadow-xl">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="text-xs text-slate-300 uppercase bg-slate-800/80 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 font-bold w-1/3">Aircraft Code</th>
              <th className="px-6 py-4 font-bold w-1/3">Speed (KTAS)</th>
              <th className="px-6 py-4 font-bold w-1/3">Fuel Burn (GPH)</th>
            </tr>
          </thead>
          <tbody>
            {data.map(([code, profile]) => (
              <tr key={code} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
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
          We use this database to estimate fuel burn and validate distances. Our parser will attempt to group your logged variants (e.g. C-172P) into these core profiles. If your aircraft isn't listed, we safely default to <strong className="text-white">120 KTAS</strong> and <strong className="text-white">10 GPH</strong>.
        </p>
      </div>

      <div className="space-y-12">
        {renderTable("Small (Piston Single & Twin)", small)}
        {renderTable("Medium (Turboprops & Light/Mid Jets)", medium)}
        {renderTable("Large (Commercial Airliners)", large)}
      </div>
    </motion.div>
  );
};