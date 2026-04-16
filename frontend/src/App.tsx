import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './components/pages/Home';
import { About } from './components/pages/About';
import { Privacy } from './components/pages/Privacy';
import { Disclaimer } from './components/pages/Disclaimer';
import { Contact } from './components/pages/Contact';
import { LogbookLogic } from './components/pages/LogbookLogic';
import { Export } from './components/pages/Export';
import { AircraftProfilesTable } from './components/pages/AircraftProfilesTable';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200 font-sans relative overflow-hidden">
      
      {/* Decorative Aurora Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Faint Grid Overlay (On top of aurora, behind content) */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

      {/* App Content Container */}
      <div className="relative z-10 flex flex-col flex-grow w-full">
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/logbook" element={<LogbookLogic />} />
          <Route path="/export" element={<Export />} />
          <Route path="/aircraftprofiles" element={<AircraftProfilesTable />} />
        </Routes>
      </main>

      <Footer />
    </div>
  </div>
  );
}
export default App;