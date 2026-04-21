import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLogbookStore } from '../../store/useLogbookStore';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const resetStore = useLogbookStore((state) => state.resetStore);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogoClick = () => {
    closeMenu();
    resetStore();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
      <nav className="w-full p-4 flex justify-between items-center max-w-6xl mx-auto relative">
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity z-50">
          <img src="/logo/logo.webp" alt="LogbookWrapped Logo" className="w-20 h-20 object-contain" />
          <span className="text-2xl font-bold text-white tracking-tight block">LogbookWrapped</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 text-sm font-medium items-center">
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <Link to="/methodology" className="hover:text-white transition-colors">Methodology</Link>
          <Link to="/export" className="hover:text-white transition-colors">Export</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 -mr-2 text-slate-300 hover:text-white z-50 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Nav Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 flex flex-col p-4 gap-4 text-base font-medium shadow-xl md:hidden z-40">
            <Link to="/about" onClick={closeMenu} className="block py-3 border-b border-slate-800 hover:text-white transition-colors">About</Link>
            <Link to="/methodology" onClick={closeMenu} className="block py-3 border-b border-slate-800 hover:text-white transition-colors">Methodology</Link>
            <Link to="/export" onClick={closeMenu} className="block py-3 border-b border-slate-800 hover:text-white transition-colors">Export</Link>
            <Link to="/contact" onClick={closeMenu} className="block py-3 hover:text-white transition-colors">Contact</Link>
          </div>
        )}
      </nav>
    </header>
  );
};