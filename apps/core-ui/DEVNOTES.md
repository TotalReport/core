# Developer notes

Brief guidance to keep UI code consistent across `core-ui`.

Visual roles

- Component — presentational: receives props and renders UI only. Components should not fetch data or perform side effects.
- Container — data-aware: fetches and composes data (via hooks) and renders the view. Containers may render presentational components or render markup directly when that is clearer.

Containers

- Containers should handle three primary states:
  - Loading — show skeletons where data will appear; keep layout consistent with the final view.
  - Error — display a concise error message and provide a reload/refetch action.
  - Data — render the requested content.

Data fetching

- Use hooks and TanStack Query for all data access. Hooks should expose the standard query API (`data`, `isLoading`, `isError`, `refetch`) so containers handle states uniformly.

Application state

- The UI does not maintain a centralized application state; each container requests the data it needs. TanStack Query caching reduces backend load and keeps containers modular.
