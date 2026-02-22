/**
 * Asserts that the actual value is equal to the expected value.
 *
 * @param actual The actual value.
 * @param expected The expected value.
 * @param message The message to display if the assertion fails.
 */
export function assertEquals<T>(
  actual: unknown,
  expected: T,
  message: string,
): asserts actual is T {
  if (actual === expected) return;
  throw new Error(message);
}

/**
 * Returns a new date that is after the given date by the specified delay in milliseconds.
 *
 * @param params.date The date to add the delay to.
 * @param params.delayMilliseconds The delay in milliseconds to add.
 * @returns A new date that is after the given date by the specified delay.
 */
export function after(params: {
  timestamp: Date | string;
  delayMilliseconds: number;
}): Date {
  const date =
    typeof params.timestamp === "string"
      ? new Date(params.timestamp)
      : params.timestamp;
  return new Date(date.getTime() + params.delayMilliseconds);
}

/**
 * Returns first defined value from the given arguments. If all arguments are undefined, throws an error.
 * 
 * @param args The arguments to check for defined value.
 * @returns The first defined value from the given arguments.
 * @throws If all arguments are undefined.
 */
export function firstDefined<T>(...args: (T | undefined)[]): T {
  for (const arg of args) {
    if (arg !== undefined) {
      return arg;
    }
  }
  throw new Error("All arguments are undefined");
}
