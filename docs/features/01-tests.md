# Feature: Tests

Summary

Tests are modeled using three distinct entities to make execution, reporting, and debugging clearer:

1. `before_test` — setup or pre-test checks
2. `test` — the main test
3. `after_test` — teardown or post-test checks

Why the before/after phases matter

- If a `before_test` fails, dependent tests may not run. On some platforms it is impossible to determine exactly which tests were expected to run (for example, certain JUnit 5 parameterized tests), so in case there is no information about before test failed those tests will be silently omitted in the report.
- If an `after_test` fails, cleanup may be incomplete and subsequent tests may fail for unrelated reasons. Reports should highlight this problem.

The test entities have the next characteristics:
1. Title
2. Started timestamp
3. Finished timestamp
4. Status
5. Correlation ID
6. Arguments Hash
7. External Arguments Hash
8. Launch ID
9. Arguments
10. External Arguments

Every argument or external argument has a name, a type, and a value.
