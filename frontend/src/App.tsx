import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './components/pages/Home';
import { Upload } from './components/pages/Upload';
import { Config } from './components/pages/Config';
import { Wrapped } from './components/pages/Wrapped';
import { Growth } from './components/pages/Growth';
import { Demos } from './components/pages/Demos';
import { About } from './components/pages/About';
import { Privacy } from './components/pages/Privacy';
import { Disclaimer } from './components/pages/Disclaimer';
import { Contact } from './components/pages/Contact';
import { Methodology } from './components/pages/Methodology';
import { Export } from './components/pages/Export';
import { AircraftProfiles } from './components/pages/AircraftProfiles';
import { NotFound } from './components/pages/NotFound';
import { ImportWrapped } from './components/pages/ImportWrapped';
import { Dev } from './components/pages/Dev';
import { FAQ } from './components/pages/FAQ';
import { ScrollToTop } from './components/layout/ScrollToTop';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200 font-sans relative overflow-hidden">
      <ScrollToTop />
      
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-grow w-full">
        <Navbar />
        <main className="flex-grow flex flex-col w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/export" element={<Export />} />
            <Route path="/aircraftprofiles" element={<AircraftProfiles />} />
            <Route path="/mywrapped" element={<ImportWrapped />} />
            <Route path="/dev" element={<Dev />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/config" element={<Config />} />
            <Route path="/wrapped" element={<Wrapped />} />
            <Route path="/growth" element={<Growth />} />
            <Route path="/demos" element={<Demos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}
export default App;