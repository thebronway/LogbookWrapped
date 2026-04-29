import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Disable the browser's attempt to restore scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Immediate scroll for standard navigation
    window.scrollTo(0, 0);

    // 3. Slight delay to catch refreshes where the browser overrides the scroll
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      // Cover both html and body elements just in case
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    }, 0);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null; // This component doesn't render any actual HTML
};