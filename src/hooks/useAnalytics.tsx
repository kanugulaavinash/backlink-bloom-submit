
import { useEffect } from 'react';
import { trackBlogEvent } from '@/components/Analytics';

export const useAnalytics = () => {
  return {
    trackPostView: (postId: string, title: string) => {
      trackBlogEvent.postView(postId, title);
    },
    
    trackPostSubmission: (category: string) => {
      trackBlogEvent.postSubmission(category);
    },
    
    trackPaymentInitiated: (amount: number) => {
      trackBlogEvent.paymentInitiated(amount);
    },
    
    trackPaymentCompleted: (amount: number, postId: string) => {
      trackBlogEvent.paymentCompleted(amount, postId);
    },
    
    trackSearch: (query: string) => {
      trackBlogEvent.searchPerformed(query);
    },
    
    trackCategoryFilter: (category: string) => {
      trackBlogEvent.categoryFilter(category);
    },
    
    trackUserRegistration: (method?: string) => {
      trackBlogEvent.userRegistration(method);
    },
    
    trackUserLogin: (method?: string) => {
      trackBlogEvent.userLogin(method);
    }
  };
};

// Hook for tracking page performance
export const usePagePerformance = (pageName: string) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Track page load time
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'timing_complete', {
          name: 'page_load',
          value: Math.round(loadTime),
          event_category: 'Performance',
          event_label: pageName
        });
      }
    };
  }, [pageName]);
};
