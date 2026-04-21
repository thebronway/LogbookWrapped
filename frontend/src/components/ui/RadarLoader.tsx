import React from 'react';
import { motion } from 'framer-motion';

export const RadarLoader: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
    >
        <div className="relative w-40 h-40 rounded-full border border-emerald-900/40 flex items-center justify-center bg-black overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)]">
        {/* Inner rings */}
        <div className="absolute w-24 h-24 rounded-full border border-emerald-900/30"></div>
        <div className="absolute w-8 h-8 rounded-full border border-emerald-900/20"></div>
        <div className="absolute w-full h-px bg-emerald-900/30"></div>
        <div className="absolute h-full w-px bg-emerald-900/30"></div>

        {/* The sweeping radar beam */}
        <div className="absolute inset-0 rounded-full animate-[spin_2s_linear_infinite]" 
                style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(16, 185, 129, 0.1) 320deg, rgba(16, 185, 129, 0.6) 360deg)' }}>
        </div>

        {/* Simulated aircraft blips */}
        <div className="absolute top-10 right-10 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_6px_2px_rgba(16,185,129,0.8)] animate-pulse"></div>
        <div className="absolute bottom-12 left-12 w-1 h-1 bg-emerald-400/80 rounded-full shadow-[0_0_4px_1px_rgba(16,185,129,0.5)] animate-pulse" style={{ animationDelay: '0.7s'}}></div>
        </div>
        <div className="mt-8 text-emerald-500/80 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">
        Parsing Route Data...
        </div>
    </motion.div>
  );
};