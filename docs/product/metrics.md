# Metrics & phases

> Track progress weekly. Numbers beat feelings.

## North star (12 months)

**One loyal team** using Total Report every sprint without the founder pushing.

## 90-day outcomes

| Metric | Target | Current |
|--------|--------|---------|
| Loyal team using every sprint | 1 (workplace) | 0 |
| Launches ingested per week (by them) | ≥ 5 | — |
| Unprompted compare/history sessions | ≥ 2/week | — |
| CI integration without founder help | Yes | No |

## Phase checklist

Use this repo’s product phases; check off as you go.

### Phase 1 — Problem fit ✅

- [x] Product brief (`brief.md`)
- [x] Persona (`persona.md`)
- [x] Wedge vs ReportPortal articulated
- [ ] 5 user interviews (even internal) — **next action**

### Phase 2 — MVP scope ✅

- [x] In/out list (`mvp-scope.md`)
- [x] Golden path defined
- [ ] Confirm project/workspace model in schema — **next action**

### Phase 3 — User stories 🔄

- [x] MVP story list (`../stories/mvp/README.md`)
- [ ] Prioritize top 3 stories for this sprint
- [ ] Acceptance criteria reviewed with workplace QA lead

### Phase 4 — Build & ship

- [ ] JUnit adapter v1
- [ ] History timeline UI
- [ ] UI plugin API v1 + example plugin
- [ ] Docker Compose deploy path
- [ ] `getting-started.md` validated by non-founder

### Phase 5 — Validate

- [ ] Workplace pilot started (date: ___)
- [ ] Retro after 2 sprints: still using without push?
- [ ] Decision: expand internally / find external team / pivot

## Weekly ritual (30 min)

1. Update **Current** column above.
2. Pick **one** story; ship or unblock it.
3. One conversation with a QA-minded person (internal counts).
4. Note blockers in `../stories/mvp/README.md` backlog section.

## Kill criteria (honest pivot signals)

Consider narrowing or pivoting if after **8 weeks** of workplace pilot:

- Zero unprompted usage
- Team actively chose to stay on ReportPortal
- JUnit adapter too brittle to trust in CI
