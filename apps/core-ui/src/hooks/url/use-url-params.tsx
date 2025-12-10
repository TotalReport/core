import { useNavigate, useSearchParams } from '@modern-js/runtime/router';
import { useCallback } from 'react';

type ParamValue = string | number | null | undefined;
type ParamGetter<T> = T extends number ? ReturnType<typeof useUrlParams>['getNumericParam'] : ReturnType<typeof useUrlParams>['getParam'];

export function useUrlParams() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const updateParams = useCallback(
    (params: Record<string, ParamValue>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      
      // Process all params
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      const search = newSearchParams.toString();
      const query = search ? `?${search}` : '';
      
      // Update the URL without refreshing the page
      navigate(`${window.location.pathname}${query}`, { replace: true });
    },
    [navigate, searchParams]
  );
  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );
  const getNumericParam = useCallback(
    (key: string): number | null => {
      const value = searchParams.get(key);
      if (value === null) return null;
      
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? null : parsed;
    },
    [searchParams]
  );
  const getRequiredNumericParam = useCallback(
    (key: string, defaultValue: number): number => {
      const value = searchParams.get(key);
      if (value === null) return defaultValue;

      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    },
    [searchParams]
  );

  /**
   * Creates a parameter-specific state handler that combines getting and updating a parameter.
   * @param key The URL parameter key
   * @param defaultValue Optional default value to use if parameter is not present
   * @param constraintFn Optional function to apply constraints to the value before setting
   * @returns [value, setValue] tuple similar to React useState
   */
  const useParam = useCallback(
    <T extends ParamValue>(
      key: string, 
      defaultValue?: T,
      constraintFn?: (value: T | null) => T | null
    ): [T | null, (value: T | null) => void] => {
      // Get the current value
      const currentValue = 
        typeof defaultValue === 'number'
          ? getNumericParam(key) as T
          : getParam(key) as T;
      
      // Function to update just this param
      const setValue = (value: T | null) => {
        // Apply constraints if provided
        const constrainedValue = constraintFn ? constraintFn(value) : value;
        updateParams({ [key]: constrainedValue });
      };

      return [currentValue ?? defaultValue ?? null, setValue];
    },
    [getParam, getNumericParam, updateParams]
  );

  /**
   * Creates a parameter-specific state handler that ensures the value is a number.
   * @param key The URL parameter key
   * @param defaultValue Default value to use if parameter is not present
   * @param constraintFn Optional function to apply constraints to the value before setting
   * @returns [value, setValue] tuple similar to React useState
   */
  const useRequiredNumberParam = useCallback(
    (
      key: string, 
      defaultValue: number,
      constraintFn?: (value: number) => number
    ): [number, (value: number) => void] => {      
      const currentValue = getRequiredNumericParam(key, defaultValue);
      const constrainedValue = constraintFn !== undefined ? constraintFn(currentValue) : currentValue;
      
      const setValue = (value: number | null) => {
        const currentValue = value === null ? defaultValue : value;

        const constrainedValue = constraintFn !== undefined ? constraintFn(currentValue) : currentValue;
        updateParams({ [key]: constrainedValue });
      };

      return [constrainedValue, setValue];
    },
    [getRequiredNumericParam, updateParams]
  );

  /**
   * Manages multiple URL parameters with constraints and returns their values and an atomic setter.
   * @param params Object mapping param keys to their config (defaultValue, constraintFn)
   * @returns Object with current values and setValues function that updates all params atomically
   */
  const useParams = useCallback(
    <T extends Record<string, any>>(
      params: {
        [K in keyof T]: {
          defaultValue: T[K];
          constraintFn?: (value: T[K]) => T[K];
        };
      }
    ): {
      urlParams: { [K in keyof T]: T[K] };
      setUrlParams: (newValues: Partial<{ [K in keyof T]: T[K] }>) => void;
    } => {
      // Get current values for all params
      const values = {} as any;
      Object.keys(params).forEach((key) => {
        const config = params[key];
        const currentValue = 
          typeof config.defaultValue === 'number'
            ? getNumericParam(key)
            : getParam(key);
        values[key] = currentValue ?? config.defaultValue;
      });

      // Function to update multiple params atomically
      const setValues = (newValues: Partial<{ [K in keyof T]: T[K] }>) => {
        const updates: Record<string, ParamValue> = {};
        
        Object.entries(newValues).forEach(([key, value]) => {
          const config = params[key];
          const constrainedValue = config?.constraintFn 
            ? config.constraintFn(value as T[typeof key])
            : value;
          updates[key] = constrainedValue as ParamValue;
        });
        
        updateParams(updates);
      };

      return { urlParams: values as { [K in keyof T]: T[K] }, setUrlParams: setValues };
    },
    [getParam, getNumericParam, updateParams]
  );

  return { updateParams, getParam, getNumericParam, useParam, useParams, useRequiredNumberParam };
}
