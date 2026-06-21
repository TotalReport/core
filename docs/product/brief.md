# Product brief — Total Report

> Phase 1 artifact. One page. Update when pivoting.

## Problem

QA leads in mid-size product orgs (11–100 people) struggle to **track how individual tests behave across runs**. ReportPortal and similar tools exist, but cross-run investigation is still painful: flaky tests, regressions between releases, and “did this test pass last week?” require too much manual work.

## Target user (primary)

**QA lead / test engineer** who owns test quality across CI pipelines, often evaluating or using ReportPortal-class tooling.

## Current alternative

[ReportPortal](https://reportportal.io/) — primary benchmark users will compare against.

## Solution

**Total Report** — self-hosted, open-source test reporting with:

- **Correlation model** — track the same logical test across launches
- **Substatuses** — subdivide every top-level outcome, including passes; separate a clean pass from one that still deserves review (e.g. error logs on a healthy service — noteworthy, not release-blocking)
- **TypeScript dashboard plugins** — teams compose tailored views; low-ceremony authoring (see `plugin-model.md`)
- **Uniform REST API** — ingestion decoupled from frameworks; JUnit is the first adapter

## Wedge (why switch)

1. **Correlation-first history** — status and substatus timeline for one test across many launches.
2. **Substatus depth** — passes get substatuses too, unlike typical pass/fail-only reporting; non-blocking signals stay visible without marking the run failed.
3. **Composable dashboards** — TypeScript plugins per team, not a single fixed vendor UI.
4. **Uniform REST API** — framework adapters stay thin; JVM only where ingestion needs it, not for UI extensions.

## Business model (hypothesis)

Open-source, **self-hosted** (Docker Compose first). No SaaS in v1. Monetization TBD after one loyal team validates the problem.

## Success — next 90 days

**One team** (goal: your workplace) uses Total Report **every sprint without you pushing them**.

Leading indicators:

- They ingest launches via the JUnit → REST path without your help.
- Someone on the team opens the **compare/history** view unprompted.
- Dashboard shows **passed-with-warning** (or other substatus) counts — not only green/red.
- They choose Total Report over ReportPortal for at least one project.

## Non-goals (for now)

- Multi-tenant hosted SaaS
- Plugin marketplace / third-party store
- Supporting every test framework on day one
- Enterprise sales motion

## Open questions

- [ ] Exact ReportPortal workflows to match or beat (demo script)
- [ ] Open-source license (MIT vs Apache 2.0)
- [ ] Minimum plugin API surface (see `plugin-model.md`)
- [ ] JUnit mapping rules for warning / soft-failure → substatus (e.g. PW)
