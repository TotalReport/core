# Feature: Entities Correlation

To understand how test statuses change over time (for example, between releases), tests should be correlated.

Below is the explanation of how correlation is performed:

Every test has 3 fields:
1. Correlation ID - The ID which is compared when it is required to find the same test but in different runs/releases and so on.
2. Arguments hash - The hash of arguments which is provided by test itself (for example JUnit 5 parameterized tests). It is compared when need to distinct the same test but run with different arguments.
3. External arguments hash - The hash of global arguments which are not provided by the test itsef but can be provided by the launch or environment.

If these fields are not set explicitly, the defaults are:
- `Correlation ID`: the MD5 hash of the test name
- `Arguments hash`: the MD5 hash of the JSON representation of the test arguments
- `External Arguments hash`: the MD5 hash of the JSON representation of the external test arguments

To preserve the ability to track a test even if its name or arguments change, you can set explicit values for these fields. This is useful when migrating to a new test name.
