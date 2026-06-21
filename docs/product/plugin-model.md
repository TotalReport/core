# Plugin model

> Product principle — informs MVP and long-term architecture.

## Goal

Teams compose their own reporting workspace: each squad installs or authors **dashboard plugins** that pull the data they care about and render a tailored view. The core ships sensible defaults; customization does not require forking the app.

## Design principles

| Principle | Implication |
|-----------|-------------|
| **TypeScript end-to-end** | Plugins are authored in TS/TSX — same language as the UI host and API contracts. No JVM plugin classpath, no separate extension SDK in another language. |
| **Low ceremony** | Adding a plugin should feel closer to Obsidian community plugins than to enterprise “integration projects”: manifest, entry module, enable in config. |
| **Contract-stable data access** | Plugins call the host’s typed client (`@total-report/core-contract`) or host-provided hooks — not ad-hoc internal imports. |
| **Dashboard-first** | Primary extension surface is **dashboard tiles/panels** that teams arrange per project, not one-off hooks buried in settings. |
| **Team-owned** | Plugins live in the team’s repo or a `plugins/` folder on the instance — curated by them, not only by Total Report releases. |

## What a plugin does

1. **Register** — id, name, version, compatible host range.
2. **Declare** — which dashboard slots it fills (e.g. `launch-overview`, `project-home`, `test-side-panel`).
3. **Fetch** — use host-injected API client + context (`projectId`, `launchId`, `correlationId`, date range).
4. **Render** — React component returned from the plugin entry; host supplies layout chrome and auth.

## Host responsibilities

- Load enabled plugins from config (folder path or package list).
- Pass authenticated, typed API access — plugins never handle secrets directly.
- Versioned **plugin SDK** package (`@total-report/plugin-sdk` or similar) with minimal surface.
- Example plugin in monorepo: `plugins/example-dashboard-widget/`.

## MVP v1 scope (bounded)

Ship the **smallest slice** that proves the model:

- [ ] SDK package with types + `registerDashboardPlugin()`
- [ ] **One** dashboard slot on launch or project view
- [ ] One reference plugin (e.g. “warnings summary” using passed-with-warning substatus)
- [ ] Docs: “Author your first plugin in 15 minutes”

Defer: marketplace, remote install, sandboxed iframe plugins, hot-reload marketplace review.

## Anti-patterns

- Java/Kotlin adapter-style plugins for UI — keep JVM on ingestion side only if needed.
- Plugins importing `core-service` or DB layers — contract client only.
- Monolithic “customization” via env vars — if it needs UI, it should be a plugin.

## Success signal

A team at the workplace pilot authors **one internal plugin** without core-team help after reading the guide.
