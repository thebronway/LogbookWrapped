import { useLogbookStore } from './store/useLogbookStore';
import { Dropzone } from './components/ui/Dropzone';
import { StoryContainer } from './components/layout/StoryContainer';

function App() {
  const { status, stats, errorMessage, resetStore } = useLogbookStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950">
      
      {status === 'idle' && (
        <>
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">Logbook Wrapped</h1>
            <p className="text-slate-400">Your year in aviation, visualized.</p>
          </header>
          <Dropzone />
        </>
      )}

      {status === 'error' && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg max-w-md text-center">
          <p>{errorMessage}</p>
          <button onClick={resetStore} className="mt-4 underline text-sm hover:text-white">Try Again</button>
        </div>
      )}

      {/* Replace the JSON dump with the slick Story wrapper! */}
      {status === 'success' && stats && (
        <StoryContainer stats={stats} onClose={resetStore} />
      )}

    </div>
  );
}

export default App;