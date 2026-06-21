# Persona — QA lead (primary)

## Snapshot

| | |
|---|---|
| **Role** | QA lead / senior test engineer |
| **Org size** | 11–100 engineers |
| **Reports to** | Engineering manager or head of QA |
| **Tools today** | ReportPortal (or evaluating it), CI artifacts, JUnit/XML |

## Goals

- Know release health quickly after CI finishes.
- Find **regressions and flaky tests** without digging through raw CI logs.
- Show engineering leadership trends: what’s failing repeatedly across sprints.

## Frustrations

- “Same test, different runs” is hard to compare — names change, parameterized args differ.
- Latest-run dashboards hide **history**; root cause needs cross-launch context.
- Locked into vendor UI layouts; extending reports means fighting the product, not composing it.

## Jobs to be done (JTBD)

1. **When** a nightly build fails, **I want to** see which tests changed status vs. last green build, **so I can** prioritize fixes.
2. **When** a build is green but logs show server errors, **I want** those tests marked passed-with-warning, **so I can** catch false greens before release.
3. **When** investigating a flaky test, **I want** substatus history across launches, **so I can** decide skip, quarantine, or fix.
4. **When** our squad needs a custom release dashboard, **I want** to add a TypeScript plugin, **so I can** tune the view without vendor roadmap dependency.
5. **When** onboarding the team, **I want** self-hosted install with clear docs, **so I can** meet data-residency expectations.

## What they say

- “The build passed but production logs were on fire — why is everything green?”
- “I need to know if this test failed in the last five runs.”
- “Can we add a panel that only our team cares about?”

## First design partner

**Your workplace** — pitch the idea internally; treat them as design partner #1 even before external users.

## How to reach them (later)

After workplace validation: QA communities, “Total Report vs ReportPortal for cross-run history” content, conference demos.
