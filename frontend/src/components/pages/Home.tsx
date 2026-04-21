import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useLogbookStore } from '../../store/useLogbookStore';
import { StoryContainer } from '../layout/StoryContainer';
import { HeroSection } from '../ui/HeroSection';
import { UploadSection } from '../ui/UploadSection';

export const Home = () => {
  const { status, stats, resetStore } = useLogbookStore();

  if (status === 'success' && stats) {
    return (
      <>
        <Helmet>
          <title>Your LogbookWrapped</title>
        </Helmet>
        <div className="w-full flex-grow flex items-center justify-center p-0 lg:p-6">
          <StoryContainer stats={stats} onClose={resetStore} />
        </div>
      </>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 md:px-6 py-12 gap-20"
    >
      <Helmet>
        <title>LogbookWrapped | Your Aviation Year in Review</title>
        <meta name="description" content="A privacy-first web app that transforms EFB logbook exports into shareable aviation stories." />
      </Helmet>

      <HeroSection />
      <UploadSection />
    </motion.div>
  );
};