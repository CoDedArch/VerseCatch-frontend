import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_TRACKING_ID = import.meta.env.VITE_GOOGLE_ANALYTICS;

export const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof gtag === 'function' && GA_TRACKING_ID) {
      gtag('config', GA_TRACKING_ID, {
        page_path: location.pathname + location.search,
        send_page_view: true,
      });
    }
  }, [location]);

  return null;
};