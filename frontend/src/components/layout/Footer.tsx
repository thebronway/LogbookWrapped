import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full p-6 text-center text-sm text-slate-500 border-t border-slate-800 mt-12">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Logbook Wrapped · All rights reserved</p>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          <Link to="/disclaimer" className="hover:text-slate-300 transition-colors">Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
};