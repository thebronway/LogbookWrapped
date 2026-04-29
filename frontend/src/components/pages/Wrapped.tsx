import { Helmet } from 'react-helmet-async';
import { useLogbookStore } from '../../store/useLogbookStore';
import { StoryContainer } from '../layout/StoryContainer';
import { Navigate, useNavigate } from 'react-router-dom';

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
    </>
  );
};