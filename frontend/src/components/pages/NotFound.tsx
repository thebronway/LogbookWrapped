import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
      <h1 className="text-7xl font-bold text-white mb-4">404</h1>
      <p className="text-2xl text-slate-300 mb-8">Oops! Looks like you flew off course.</p>
      <Link 
        to="/" 
        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold transition-colors"
      >
        Return to Base
      </Link>
    </div>
  );
};