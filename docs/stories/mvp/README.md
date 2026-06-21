# MVP user stories

> Phase 3. Prioritize top to bottom. Move done stories to **Done** section.

**Persona**: QA lead @ mid-size org · **Integration**: JUnit → REST · **Wedges**: correlation timeline, substatuses, TS dashboard plugins

## Priority 0 — unblock golden path

### TR-001 — Publish launch from JUnit CI

**As a** platform engineer,  
**I want** our JUnit test run to publish a launch via an adapter,  
**So that** QA sees results in Total Report automatically.

**Acceptance criteria**

- Given a standard JUnit XML (or surefire report) from CI  
- When the adapter runs post-build  
- Then a launch exists with tests, statuses, and correlation fields populated  
- And re-running the adapter does not corrupt existing data (document behavior)

**Maps to**: new JUnit adapter package, REST API, docs/getting-started

---

### TR-002 — Browse launches

**As a** QA lead,  
**I want** a filterable list of launches for my project,  
**So that** I can open the latest or compare specific runs.

**Acceptance criteria**

- Given I am logged in with a verified account  
- When I open the launches page  
- Then I see launches with title, time range, and status summary  
- And I can filter by title (minimum)

**Maps to**: `core-ui` launches route, project scoping TBD

---

### TR-003 — Status dashboard

**As a** QA lead,  
**I want** a dashboard of test outcomes for a launch or project,  
**So that** I grasp release health in seconds.

**Acceptance criteria**

- Given a launch with mixed statuses  
- When I view the dashboard  
- Then I see counts by status group (passed, failed, skipped)
- And I can drill into **substatuses** (e.g. passed vs passed-with-warning)
- And counts match API totals

**Maps to**: `core-ui` statistics containers, existing status APIs

---

## Priority 1 — differentiator

### TR-004 — Test detail with steps

**As a** QA lead,  
**I want** to open a single test and see steps, status, and timestamps,  
**So that** I can debug failures without CI logs.

**Acceptance criteria**

- Given a failed test with steps  
- When I open test detail  
- Then I see entity type (before/test/after), steps, error info  
- And correlation ID is visible

**Maps to**: test detail route, test-steps API

---

### TR-005 — Test history by correlation ID

**As a** QA lead,  
**I want** a timeline of one correlated test across many launches,  
**So that** I can spot flakiness and regressions.

**Acceptance criteria**

- Given the same correlation ID in ≥ 3 launches  
- When I open history for that test  
- Then I see ordered launches with **substatus** per run  
- And I can tell when status changed (e.g. passed → passed-with-warning → failed)

**Maps to**: new API query + compare/history UI (**core wedge**)

---

### TR-006 — Compare two launches (status delta)

**As a** QA lead,  
**I want** to compare two launches for correlated tests,  
**So that** I see what changed between builds.

**Acceptance criteria**

- Given two launch IDs  
- When I open compare view  
- Then I see tests that changed status, were added, or removed (by correlation)  
- And unchanged passing tests are collapsed or filterable

**Maps to**: compare view UI, correlation logic in service

---

## Priority 2 — platform

### TR-007 — Self-hosted install

**As a** QA lead,  
**I want** to install Total Report with Docker Compose,  
**So that** our data stays on our infrastructure.

**Acceptance criteria**

- Given a Linux host with Docker  
- When I follow getting-started  
- Then UI and API are up with Postgres persisted  
- And default auth secret must be changed (documented)

**Maps to**: Compose files, getting-started.md

---

### TR-008 — Team login

**As a** QA lead,  
**I want** teammates to register and log in,  
**So that** only verified users access reports.

**Acceptance criteria**

- Given email verification flow  
- When an unverified user calls protected APIs  
- Then they receive 403  
- When verified, they can use all MVP UI features

**Maps to**: auth routes, middleware (mostly exists)

---

### TR-009 — TypeScript dashboard plugin

**As a** QA lead,  
**I want** to enable a dashboard plugin our team wrote in TypeScript,  
**So that** our project home shows the metrics and layout we care about.

**Acceptance criteria**

- Given a plugin package using the plugin SDK  
- When enabled in instance config  
- Then it renders in a dashboard slot with project/launch context  
- And it fetches data only via the typed contract client  
- And reference plugin demonstrates substatus-aware widget (e.g. warnings)

**Maps to**: `plugin-model.md`, `@total-report/plugin-sdk`, `plugins/example-dashboard-widget/`

---

### TR-011 — Passed with warning on ingest

**As a** QA lead,  
**I want** tests that passed with server errors classified as **passed with warning**,  
**So that** green builds still surface systemic problems.

**Acceptance criteria**

- Given JUnit (or API) ingest with warning signals documented by adapter  
- When the test is stored  
- Then `statusId` is `PW` (or team-configured warning substatus), group remains Passed  
- And dashboard and history show the warning substatus distinctly from clean pass

**Maps to**: JUnit adapter rules, `docs/features/03-statuses.md`, status APIs

---

### TR-010 — Project scoping

**As a** QA lead,  
**I want** launches grouped by project,  
**So that** multiple products don’t mix on one instance.

**Acceptance criteria**

- Given projects A and B  
- When I filter by project A  
- Then I only see A’s launches and history

**Maps to**: schema + contract change (**decide in sprint 1**)

---

## Done

_Move completed stories here with completion date._

---

## Backlog / blockers

| Date | Note |
|------|------|
| | Workplace pitch not scheduled yet |
| | Project model not in schema — blocks TR-002, TR-010 |
| | Compare/history API not defined in contract yet |
| | JUnit → PW substatus mapping not specified |
| | Plugin SDK package not created yet |

## This sprint — pick ONE

Suggested first pick: **TR-010** (project scoping) or **TR-005** (history API design) — both unblock the wedge.
