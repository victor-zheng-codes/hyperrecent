'use client';

import { useEffect, useCallback } from 'react';

export function UrlCleaner() {
  const cleanUrl = useCallback(() => {
    const currentPath = window.location.pathname;
    console.log("Checking path:", currentPath);
    
    if (currentPath.includes('%')) {
      console.log("Found encoded characters, cleaning URL");
      const cleanPath = currentPath
        .replace(/%20/g, '-')
        .replace(/%26/g, '-')
        .replace(/%2B/g, '-')
        .replace(/%2C/g, '-')
        .replace(/%3A/g, '-');
      
      if (cleanPath !== currentPath) {
        console.log("Updating to clean path:", cleanPath);
        window.history.replaceState({}, '', cleanPath);
      }
    }
  }, []);

  useEffect(() => {
    // Clean URL on initial load
    cleanUrl();

    // Set up a mutation observer to watch for URL changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          cleanUrl();
        }
      });
    });

    // Watch for changes in the document
    observer.observe(document, {
      childList: true,
      subtree: true
    });

    // Also watch for history changes
    window.addEventListener('popstate', cleanUrl);
    window.addEventListener('pushstate', cleanUrl);
    window.addEventListener('replacestate', cleanUrl);

    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', cleanUrl);
      window.removeEventListener('pushstate', cleanUrl);
      window.removeEventListener('replacestate', cleanUrl);
    };
  }, [cleanUrl]);

  return null;
}
