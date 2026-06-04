import { Helmet } from 'react-helmet-async';
import { useLogbookStore } from '../../store/useLogbookStore';
import { StoryContainer } from '../layout/StoryContainer';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Plane, Upload } from 'lucide-react';

export const Wrapped = () => {
  const { status, stats, resetStore, isDemo } = useLogbookStore();
  const navigate = useNavigate();

  const handleClose = () => {
    resetStore();
    navigate(isDemo ? '/demos' : '/');
  };

  if (status !== 'success' || !stats) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Your LogbookWrapped</title>
      </Helmet>
      <div className="w-full flex-grow flex items-center justify-center p-0 lg:p-6">
        <StoryContainer stats={stats} onClose={handleClose} />
      </div>

      {isDemo && (
        <div className="hidden lg:flex fixed bottom-6 left-0 right-0 z-[50] justify-center pointer-events-none">
          <Link
            to="/upload"
            onClick={() => {
              window.umami?.track('Demo CTA Clicked', { location: 'desktop_floating' });
              resetStore();
            }}
            className="pointer-events-auto flex items-center gap-2 px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-full shadow-2xl shadow-yellow-500/20 transition-all hover:scale-105 active:scale-95 text-sm"
          >
            <Plane size={16} />
            Create your own LogbookWrapped
            <Upload size={14} className="opacity-70" />
          </Link>
        </div>
      )}
    </>
  );
};