import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';

export interface RouteInfo {
  path: string;
  roleRequired?: 'buyer' | 'supplier' | 'collector';
  subTab?: string;
}

/**
 * Normalizes browser path or hash into a canonical application path.
 * Supports both /buyer, /buyer/orders, and hash #/buyer, #/buyer/orders.
 */
export function parseCurrentUrl(): string {
  if (typeof window === 'undefined') return '/';

  // Check pathname first
  let path = window.location.pathname;

  // In many single-page apps / previews, pathname might be / or /index.html
  // and user may use hash e.g. #/buyer
  if ((path === '/' || path === '/index.html') && window.location.hash) {
    const hashVal = window.location.hash.replace(/^#/, '');
    if (hashVal.startsWith('/')) {
      path = hashVal;
    }
  }

  // Fallback / sanitization
  if (!path || path === '/index.html') {
    path = '/';
  }

  return path;
}

/**
 * Determines which role a given path belongs to, if any.
 */
export function getRequiredRoleForPath(path: string): 'buyer' | 'supplier' | 'collector' | null {
  const clean = path.toLowerCase().replace(/\/+$/, '') || '/';

  if (clean.startsWith('/buyer') || clean.startsWith('/pembeli')) {
    return 'buyer';
  }
  if (clean.startsWith('/supplier') || clean.startsWith('/pembekal')) {
    return 'supplier';
  }
  if (clean.startsWith('/collector') || clean.startsWith('/pengumpul') || clean.startsWith('/b40')) {
    return 'collector';
  }

  return null;
}

/**
 * Custom Hook for Seamless App Route Management:
 * - Listens to popstate, hashchange, and custom navigation
 * - Synchronizes browser URL history
 * - Enables smooth, seamless navigation between portals
 */
export function useAppRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => parseCurrentUrl());

  // Navigate to a new path with browser history synchronization
  const navigate = useCallback((targetPath: string) => {
    // Clean targetPath
    const normalized = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;

    try {
      // Update browser history (both pathname and hash for maximum compatibility)
      if (window.location.pathname !== normalized) {
        window.history.pushState({ path: normalized }, '', normalized);
      }
      window.location.hash = `#${normalized}`;
    } catch {
      // ignore
    }

    setCurrentPath(normalized);
  }, []);

  // Listen for browser back/forward or address bar changes
  useEffect(() => {
    const handleUrlChange = () => {
      const newPath = parseCurrentUrl();
      setCurrentPath(newPath);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  return {
    currentPath,
    navigate
  };
}
