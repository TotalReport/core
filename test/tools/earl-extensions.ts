import { isEqual, registerMatcher } from "earl";

declare module "earl" {
  interface Matchers {
    /**
     * Check if the value is a string that represents a date that is close to now.
     * @param delta - The maximum difference in milliseconds between the value and now.
     */
    isCloseToNow(delta: number): never;

    /**
     * Check if the value is an array that is equal to the expected array, but not necessarily in the same order.
     * 
     * @param expected - The expected array. 
     */
    equalUnsorted<T>(expected: Array<T>): never;
  }
}

registerMatcher("isCloseToNow", isCloseToNow);
registerMatcher("equalUnsorted", equalUnsorted);

export function isCloseToNow(delta: number) {
  return (value: unknown): boolean => {
    const nowLocal = new Date();

    if (value instanceof Date) {
      const nowUtc = nowLocal.getTime();

      const valueAsNumber = (<Date>value).getTime();

      return Math.abs(nowUtc - valueAsNumber) <= delta;
    }

    if (typeof value === "string") {
      const nowUtc = nowLocal.getTime();

      const valueAsNumber = new Date(value).getTime();

      return Math.abs(nowUtc - valueAsNumber) <= delta;
    }

    return false;
  };
}

export function equalUnsorted<T>(expected: Array<T>) {
  return (value: unknown): boolean => {    
    return Array.isArray(value) && isEqual(value.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))), expected.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))));
  };
}
