import { registerMatcher } from 'earl'

declare module 'earl' {
  interface Matchers {
    /**
     * Check if the value is a string that represents a date that is close to now.
     * @param delta - The maximum difference in milliseconds between the value and now.
     */
    isCloseToNow(delta: number): never
  }
}

registerMatcher('isCloseToNow', isCloseToNow)

export function isCloseToNow(delta: number) {

  return (value: unknown): boolean => {
    const nowLocal = new Date();
    
    if (typeof value !== 'string'){
        return false;
    }

    const nowUtc = nowLocal.getTime() + nowLocal.getTimezoneOffset() * 60 * 1000;
    const valueAsNumber = Date.parse(value)
    
    return Math.abs(nowUtc - valueAsNumber) <= delta
  }
}