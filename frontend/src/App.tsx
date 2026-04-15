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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/30 text-slate-200 font-sans">
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
  );
}

export default App;