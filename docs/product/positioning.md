# Positioning vs ReportPortal

> For internal pitches and future comparison content. Not marketing copy.

## One-liner

**Total Report** is self-hosted test reporting for **cross-run history** (correlation IDs), **honest outcomes** (substatuses inside pass/fail/skip), and **team-built TypeScript dashboards** (plugin-composed UI).

## Comparison (honest)

| | ReportPortal | Total Report (MVP target) |
|---|--------------|---------------------------|
| Hosting | SaaS + self-hosted options | Self-hosted OSS first |
| Strength | Mature ecosystem, many agents | Correlation timeline + substatus depth |
| UI | Productized, less pluggable | **TS dashboard plugins** per team |
| Pass/fail nuance | Labels exist; model varies | **Substatus in every group** (e.g. passed + warning) |
| History / trends | Yes, mature | Timeline by correlation ID **including substatus** |
| beforeTest / afterTest | Not first-class | First-class entity model |
| Extension stack | Java agents, service integrations | **TypeScript** for UI plugins; REST for data |
| Your risk | Incumbent, feature-rich | Solo founder, smaller surface |

## When we win

- Team wants **self-hosted** and simpler ops than full ReportPortal.
- **Cross-launch test investigation** is daily work, not edge case.
- **False-green** scenarios matter — they need passed-with-warning (and similar) visible on the dashboard.
- Team wants **custom dashboards in TypeScript** without maintaining a fork.

## When we lose (for now)

- Need broad language agents day one.
- Need enterprise SSO, RBAC, support contract.
- Team already deep in ReportPortal integrations and training.

## Pitch to workplace (draft)

“We’re building an open-source alternative focused on three things: **test history across runs** (correlation IDs), **honest status** (substatuses like passed-with-warning when the build is green but the system isn’t), and **dashboards your team extends in TypeScript** — like composing your own reporting workspace. JUnit CI feeds a REST API; we pilot on one project for two sprints.”

## Proof to prepare

1. 5-minute demo: JUnit run → dashboard with **warning substatus** → test history timeline.
2. Side-by-side: same workflow in ReportPortal (time steps).
3. Show a **sample TypeScript dashboard plugin** enabled on the instance.
4. Docker Compose install on a staging machine they control.
