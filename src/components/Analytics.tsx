
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics tracking ID
const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with your actual tracking ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Make gtag globally available
    (window as any).gtag = gtag;
  }
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track custom events for the blog platform
export const trackBlogEvent = {
  postView: (postId: string, title: string) => {
    trackEvent('view_post', 'Blog', `${title} (${postId})`);
  },
  
  postSubmission: (category: string) => {
    trackEvent('submit_post', 'User Action', category);
  },
  
  paymentInitiated: (amount: number) => {
    trackEvent('payment_initiated', 'Commerce', 'Guest Post', amount);
  },
  
  paymentCompleted: (amount: number, postId: string) => {
    trackEvent('purchase', 'Commerce', postId, amount);
  },
  
  searchPerformed: (query: string) => {
    trackEvent('search', 'User Interaction', query);
  },
  
  categoryFilter: (category: string) => {
    trackEvent('filter_category', 'User Interaction', category);
  },
  
  userRegistration: (method: string = 'email') => {
    trackEvent('sign_up', 'User Action', method);
  },
  
  userLogin: (method: string = 'email') => {
    trackEvent('login', 'User Action', method);
  }
};

// Analytics component to track page views automatically
const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

export default Analytics;
