/**
 * Gets a URL parameter value as a number, with fallback to a default value
 * @param param The parameter name to get from the URL
 * @param defaultValue The default value to return if the parameter doesn't exist or isn't a valid number
 * @returns The parameter value as a number, or the default value
 */
export function getUrlParamNumber(param: string, defaultValue: number): number {
  if (typeof window === "undefined") return defaultValue;
  
  const url = new URL(window.location.href);
  const value = url.searchParams.get(param);
  
  if (value === null) return defaultValue;
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Gets a URL parameter value as a string, with fallback to a default value
 * @param param The parameter name to get from the URL
 * @param defaultValue The default value to return if the parameter doesn't exist
 * @returns The parameter value as a string, or the default value
 */
export function getUrlParamValue(param: string, defaultValue: string): string {
  if (typeof window === "undefined") return defaultValue;
  
  const url = new URL(window.location.href);
  const value = url.searchParams.get(param);
  
  return value === null ? defaultValue : value;
}

/**
 * Updates URL parameters without reloading the page
 * @param params Record of parameter names and their values to set in the URL
 */
export function updateUrlParams(params: Record<string, string | null>): void {
  if (typeof window === "undefined") return;
  
  const url = new URL(window.location.href);
  
  // Update or remove each parameter
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === "") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });
  
  // Update the URL without reloading the page
  window.history.replaceState({}, "", url.toString());
}
