import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Whenever the URL path changes, scroll to the absolute top-left
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render any actual HTML
};