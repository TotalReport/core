# Feature: Statuses & substatuses

Statuses are grouped into three top-level outcomes: **Passed**, **Failed**, and **Skipped**. Each group contains **substatuses** — finer labels within that outcome.

## Why substatuses matter

A green build is not always a healthy build. Common cases:

- Test **passed** but the application under test logged server errors → **Passed with warning**
- Test **failed** but root cause is environment → **System issue** vs **Product bug**
- Run **skipped** because upstream setup failed → **Aborted** vs deliberate **Skipped**

Reporting tools that collapse everything to pass/fail/skip hide these cases. QA leads then chase false greens or mis-prioritize failures. Substatuses keep the top-level group for trends while exposing nuance for triage and **cross-run history** (a test may stay in “passed” group but flip between Passed and Passed with warning).

## Model

```
Status group (trend / dashboard roll-up)
  └── Substatus (triage / detail / history)
```

Groups are fixed for analytics consistency. Substatuses within a group are **customizable per deployment** (seed defaults, teams can extend).

## Default seed (embedded)

### Passed group
| Substatus | Id | Use when |
|-----------|-----|----------|
| Passed | PS | Clean pass |
| Passed with warning | PW | Assertions passed; errors/warnings in logs, soft checks, or server-side faults |

### Failed group
| Substatus | Id | Use when |
|-----------|-----|----------|
| Failed | FL | Generic failure |
| Product bug | PB | Assertion proves product defect |
| Automation bug | AB | Test or framework issue |
| System issue | SI | Infra, env, external dependency |
| No defect | ND | Failure expected or not a bug |
| To investigate | TI | Not yet classified |

### Skipped group
| Substatus | Id | Use when |
|-----------|-----|----------|
| Skipped | SK | Intentionally not run |
| Aborted | AR | Stopped by framework, timeout, or failed dependency |

Implementation: `packages/core-schema/src/constants.ts` (`DEFAULT_TEST_STATUSES`).

## Product requirements

- **Ingest**: adapters and API must set `statusId` to a substatus, not only the group.
- **Dashboard**: roll up by group; drill down by substatus (e.g. warning count inside “passed”).
- **History**: correlation timeline tracks **substatus** changes, not only pass/fail flips.
- **Plugins**: natural dashboard plugin — “warnings in last N launches” using `PW` and similar.

## Related

- Cross-run tracking: [`02-historical-correlations.md`](./02-historical-correlations.md)
- Plugin examples: [`../product/plugin-model.md`](../product/plugin-model.md)
