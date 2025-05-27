'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type ParamsObject = { [key: string]: string };

/**
 * Custom hook for managing URL parameters
 */
export function useUrlParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Get a parameter value from the URL
   */
  const getParam = useCallback(
    (param: string): string | null => {
      return searchParams.get(param);
    },
    [searchParams]
  );

  /**
   * Get a numeric parameter value from the URL
   */
  const getNumericParam = useCallback(
    (param: string): number | null => {
      const value = searchParams.get(param);
      if (value === null) return null;
      
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? null : parsed;
    },
    [searchParams]
  );

  /**
   * Update URL parameters
   */
  const updateParams = useCallback(
    (params: ParamsObject) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      
      // Update or add parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });
      
      const search = newSearchParams.toString();
      const query = search ? `?${search}` : '';
      router.push(`${pathname}${query}`);
    },
    [searchParams, router, pathname]
  );

  /**
   * Clear all URL parameters
   */
  const clearParams = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return {
    getParam,
    getNumericParam,
    updateParams,
    clearParams
  };
}
