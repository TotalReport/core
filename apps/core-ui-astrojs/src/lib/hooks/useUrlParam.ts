import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A custom hook that manages URL parameters and synchronizes them with component state
 * @param paramName The name of the URL parameter to track
 * @param initialValue Optional initial value to use if parameter is missing
 * @returns A tuple containing [paramValue, setParamValue]
 */
export function useUrlParam<T extends string | number | null>(
  paramName: string,
  parser: (value: string | null) => T
) {
  // Function to get parameter value from URL
  const getParamFromUrl = useCallback(() => {
    if (typeof window === "undefined") return parser(null);
    const params = new URLSearchParams(window.location.search);
    const param = params.get(paramName);
    return parser(param);
  }, [paramName, parser]);

  // Initialize state with current URL parameter value
  const [paramValue, setParamValue] = useState<T>(() => getParamFromUrl());

  // Use a callback for checking URL params to avoid recreating it on every render
  const checkUrlParams = useCallback(() => {
    const newValue = getParamFromUrl();
    
    // Only update state if the value has changed
    if (newValue !== paramValue) {
      setParamValue(newValue);
    }
  }, [paramValue, getParamFromUrl]);

  // Listen for URL changes
  useEffect(() => {
    // Check immediately on mount
    checkUrlParams();
    
    // Function handler for URL changes
    const handleUrlChange = () => {
      checkUrlParams();
    };
    
    // Listen for both our custom event and popstate
    window.addEventListener("urlchange", handleUrlChange);
    window.addEventListener("popstate", handleUrlChange);
    
    // Clean up
    return () => {
      window.removeEventListener("urlchange", handleUrlChange);
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [checkUrlParams]);

  // Skip URL updates from this component to avoid loops
  const isUpdatingUrl = useRef(false);
  
  // Update URL when parameter value changes
  useEffect(() => {
    if (typeof window !== "undefined" && !isUpdatingUrl.current) {
      isUpdatingUrl.current = true;
      
      const url = new URL(window.location.href);
      
      // Keep page and pageSize parameters (common pagination params)
      const page = url.searchParams.get("page");
      const pageSize = url.searchParams.get("pageSize");
      
      // Clear the parameter first
      url.searchParams.delete(paramName);
      
      // Then set the active one if it exists
      if (paramValue != null) {
        url.searchParams.set(paramName, paramValue.toString());
      }
      
      // Restore pagination params if they existed
      if (page) url.searchParams.set("page", page);
      if (pageSize) url.searchParams.set("pageSize", pageSize);
      
      window.history.replaceState({}, "", url.toString());
      
      // Reset flag after a small delay to ensure events are processed
      setTimeout(() => {
        isUpdatingUrl.current = false;
      }, 0);
    }
  }, [paramValue, paramName]);

  return [paramValue, setParamValue] as const;
}

/**
 * A hook that manages a numeric URL parameter
 * @param paramName The name of the URL parameter to track
 * @returns A tuple containing [numValue, setNumValue]
 */
export function useNumericUrlParam(paramName: string) {
  return useUrlParam(paramName, (value) => {
    if (value === null) return null;
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
  });
}

/**
 * A hook that manages multiple URL parameters related to test details
 * @returns An object containing test parameters and functions to update them
 */
export function useTestDetailsParams() {
  // Define the possible test types
  type TestType = 'test' | 'beforeTest' | 'afterTest';

  const [testId, setTestId] = useNumericUrlParam("testId");
  const [beforeTestId, setBeforeTestId] = useNumericUrlParam("beforeTestId");
  const [afterTestId, setAfterTestId] = useNumericUrlParam("afterTestId");
  
  // Determine which test type to show based on URL params
  let currentType: TestType = 'test';
  if (beforeTestId != null) currentType = 'beforeTest';
  else if (afterTestId != null) currentType = 'afterTest';

  const setCurrentTest = useCallback((type: TestType, id: number | null) => {
    // Clear all current test IDs
    setTestId(null);
    setBeforeTestId(null);
    setAfterTestId(null);
    
    // Set only the requested one
    switch (type) {
      case 'test':
        setTestId(id);
        break;
      case 'beforeTest':
        setBeforeTestId(id);
        break;
      case 'afterTest':
        setAfterTestId(id);
        break;
    }
  }, [setTestId, setBeforeTestId, setAfterTestId]);

  return {
    testId,
    beforeTestId,
    afterTestId,
    currentType,
    setCurrentTest
  };
}
