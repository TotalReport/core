# MVP scope

> Phase 2 artifact. **In** = v1 for first loyal team. **Out** = explicitly deferred.

## Golden path (must work end-to-end)

```
JUnit CI job → JUnit adapter → Total Report REST API → PostgreSQL
                                    ↓
              QA lead → UI: launches → status dashboard → test detail
                                    ↓
              Correlation ID → test history timeline across launches
```

## In scope — MVP v1

### Ingestion

- [ ] Uniform REST API for launches, tests, steps, statuses (exists — harden + document)
- [ ] **JUnit adapter v1** (ships with MVP, not later)
- [ ] Idempotent / safe re-upload semantics documented for CI

### Correlation & history

- [ ] Correlation ID + argument hashes on ingest (exists in model)
- [ ] **Test history timeline**: one correlated test → **substatus** across N launches
- [ ] Compare between launches: status delta at minimum; timeline view required

### Status model

- [ ] Substatuses seeded and assignable on ingest (defaults exist in `core-schema`)
- [ ] Dashboard: group roll-up **and** substatus drill-down (e.g. passed vs passed-with-warning)
- [ ] History/compare uses substatus, not only pass/fail/skipped group

### UI (must-have screens)

- [ ] Launch list + filters
- [ ] Status dashboard (aggregate counts by status/group)
- [ ] Test detail (steps, status, timestamps)
- [ ] **Compare / history view** (correlation-driven) — core differentiator

### Platform

- [ ] Auth: register, login, verified users can use system (in progress)
- [ ] **Workspace model**: single self-hosted instance with **multiple projects** (ReportPortal-like; see recommendation below)
- [ ] **TypeScript dashboard plugin system v1** — SDK + one slot + reference plugin (see `plugin-model.md`)
- [ ] **Docker Compose** production-ish deploy for early adopters

### Docs & DX

- [ ] `docs/getting-started.md` — install, JUnit wiring, first launch in UI
- [ ] OpenAPI / contract as integration source of truth

## Out of scope — defer past first loyal team

- Hosted multi-tenant SaaS
- Plugin marketplace / discovery / billing
- Adapters beyond **JUnit** (pytest, Jest, .NET, …)
- Kubernetes / Helm (after Compose is stable)
- Advanced RBAC, SSO, audit logs
- Full step-level diff across launches (MVP = status timeline; step diff later)
- Historical correlations doc features beyond timeline MVP
- Billing, licensing, support SLAs

## Workspace model (recommendation)

You were unsure; for ReportPortal refugees in mid-size orgs:

| Option | Verdict |
|--------|---------|
| Single blob, no projects | Too weak — teams organize by product/service |
| **Multiple projects per instance** | **MVP pick** — map to `launch` scoping or `projectId` |
| Full multi-tenant SaaS | Defer — you chose self-hosted OSS |

**Action**: add `project` (or equivalent) to contract + schema before workplace rollout if launches are not already scoped.

## Plugin system v1 — minimum bar

See [`plugin-model.md`](./plugin-model.md). MVP proves **dashboard composition in TypeScript**:

1. `@total-report/plugin-sdk` (or equivalent) — types + `registerDashboardPlugin`
2. Host loads plugins from instance config; plugins use **contract client** only
3. **One dashboard slot** (launch or project view)
4. Reference plugin: e.g. warnings panel (`Passed with warning` substatus)
5. Authoring guide: first plugin in ~15 minutes

Defer: marketplace, remote install, non-TS plugins, iframe sandbox.

## Risk flags (solo founder)

| Choice | Risk | Mitigation |
|--------|------|------------|
| Plugin API in v1 | Scope creep | Ship one extension point + one example only |
| JUnit + compare UI + Compose | Wide MVP | Workplace pilot on one project first |
| No external design partners yet | Slow feedback | Weekly demo to workplace team; log objections |

## Definition of done — MVP shipped

- [ ] Workplace team runs JUnit CI → Total Report without your manual help
- [ ] QA lead completes history investigation for one correlated test
- [ ] Docker Compose install documented and tested on a clean machine
- [ ] One sample UI plugin loads in the app
