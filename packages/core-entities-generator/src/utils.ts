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
  message: string
): asserts actual is T {
  console.assert(actual === expected, message);
}
