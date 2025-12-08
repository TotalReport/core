# Developer notes

Brief guidance to keep UI code consistent across `core-ui`.

Components

- **Location:** [src/components](src/components)

- **Responsibilities:** receive props and render UI only — no data fetching or side effects.

Containers

- **Location:** [src/containers](src/containers)
- **Responsibilities:** fetch data (via hooks), compose child container, components or render directly, and handle UI states.

- **State handling:**
  - **Loading:** show skeletons where data will appear; keep layout consistent with the final view.
  - **Error:** use the [ErrorRetry](src/components/ui/error-retry.tsx) component to show a compact retry control.
  - **Data:** render the requested content.

Data fetching

- Use hooks and TanStack Query for all data access. Hooks should expose the standard query API (`data`, `isPending`/`isLoading`, `isError`, `refetch`) so containers handle states uniformly.

Application state

- The UI does not maintain a centralized application state; each container requests the data it needs. TanStack Query caching reduces backend load and keeps containers modular.

### Storybook Requirement

Every container and component in the project should have a corresponding Storybook entry. This ensures that all UI elements are documented, testable, and visually verifiable in isolation.
