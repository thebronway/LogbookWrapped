import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLogbookStore } from '../../store/useLogbookStore';
import { UploadSection } from '../ui/UploadSection';

export const Upload = () => {
  const { status, datasets } = useLogbookStore();
  const navigate = useNavigate();

  // Once files are processed, navigate to the configuration screen
  useEffect(() => {
    if (status === 'success' && datasets.length > 0) {
      navigate('/config', { replace: true });
    }
  }, [status, datasets, navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 md:px-6 py-12 lg:py-20 gap-8"
    >
      <Helmet>
        <title>Upload Logbook | LogbookWrapped</title>
      </Helmet>

      <UploadSection />
    </motion.div>
  );
};