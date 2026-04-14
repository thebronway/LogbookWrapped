import { Routes, Route, Link } from 'react-router-dom';
import { Home } from './components/pages/Home';
import { About } from './components/pages/About';
import { Privacy } from './components/pages/Privacy';
import { Disclaimer } from './components/pages/Disclaimer';
import { Contact } from './components/pages/Contact';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/30 text-slate-200 font-sans">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
        <nav className="w-full p-4 flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <span className="text-2xl font-bold text-white tracking-tight block">LogbookWrapped</span>
        </Link>
        <div className="flex gap-4 sm:gap-6 text-sm font-medium">
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="w-full p-6 text-center text-sm text-slate-500 border-t border-slate-800 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Logbook Wrapped · All rights reserved · v0.5.0</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/disclaimer" className="hover:text-slate-300 transition-colors">Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;