import { registerMatcher } from "earl";

declare module "earl" {
  interface Matchers {
    /**
     * Check if the value is a string that represents a date that is close to now.
     * @param delta - The maximum difference in milliseconds between the value and now.
     */
    isCloseToNow(delta: number): never;
  }
}

registerMatcher("isCloseToNow", isCloseToNow);

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
