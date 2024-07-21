export function expect_toBe<T>(
  actual: unknown,
  expected: T
): asserts actual is T {
  expect(actual).toBe(expected);
}

export function expect_toBeCloseTo(
  actual: number,
  expected: number,
  delta: number
): void {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(delta);
}

export function expect_toBeCloseToNow(actual: number, delta: number): void {
  const nowLocal = new Date();
  const nowUtc = nowLocal.getTime() + nowLocal.getTimezoneOffset() * 60 * 1000;
  expect_toBeCloseTo(actual, nowUtc, delta);
}
