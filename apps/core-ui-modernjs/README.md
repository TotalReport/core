# Modern.js App

## Project Structure

The project follows a modular architecture for better code organization and maintenance:

```
core-ui-modernjs/
├── src/                   # Source code directory
│   ├── components/        # Reusable UI components
│   │   ├── providers/     # Context providers
│   │   ├── reports/       # Report-specific components
│   │   ├── test-statistics/ # Test statistics components
│   │   └── ui/            # Base UI components (buttons, inputs, etc.)
│   ├── hooks/             # Custom React hooks
│   │   └── api/           # REST API access hooks
│   ├── lib/               # Utility libraries
│   │   ├── api-client.ts  # API client configuration
│   │   ├── pagination-utils.ts # Pagination helper utilities  
│   │   ├── test-statistics-utils.ts # Test statistics utilities
│   │   └── utils.ts       # General utility functions
│   ├── routes/            # Application routes using Modern.js routing
│   │   ├── layout.tsx     # Root layout component
│   │   ├── page.tsx       # Home page component
│   │   └── reports/       # Report-related routes
│   ├── styles/            # Global styles
│   │   └── globals.css    # Global CSS with Tailwind directives
│   ├── modern-app-env.d.ts # Type definitions for Modern.js
│   └── modern.runtime.ts  # Runtime configuration
├── biome.json             # Biome linter and formatter configuration
├── components.json        # shadcn/ui components configuration
├── modern.config.ts       # Modern.js framework configuration
├── package.json           # Package dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get Started

Start the dev server:

```bash
pnpm dev
```

Enable optional features or add a new entry:

```bash
pnpm new
```

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm serve
```

## Key Files and Directories

- **modern.config.ts**: Configures the Modern.js application settings, including bundlers, plugins, and environment variables
- **tailwind.config.ts**: Defines the Tailwind CSS theme configuration with custom colors, spacing, and other design tokens
- **biome.json**: Sets up code quality rules and formatting preferences
- **components.json**: Configures shadcn/ui component settings and theme preferences
- **src/components/ui/**: Contains reusable UI components built with shadcn/ui and Tailwind
- **src/hooks/api/**: Custom React hooks for interacting with the REST API endpoints
- **src/lib/api-client.ts**: Sets up the API client for communicating with the Total Report backend services
- **src/routes/**: Contains the application's page components and routing structure
- **src/styles/globals.css**: Defines global styling and includes Tailwind directives

## Application Architecture

- **Routing**: Uses Modern.js file-based routing system with layouts and pages
- **State Management**: Leverages React Query for server state management
- **API Integration**: Implements type-safe API client with ts-rest and custom React hooks for each endpoint
- **Component Design**: Follows a composable component architecture with shadcn/ui
- **Styling**: Utilizes utility-first approach with Tailwind CSS

### Component State Philosophy

The application intentionally avoids global state management solutions in favor of a more modular and extensible approach:

- **UI Components**: Pure presentation components that manage their internal state locally
- **Container Components**: Data-fetching components that use API hooks to request exactly what they need
- **Decentralized State**: Each component is responsible for its own data requirements
- **API-Driven**: Components retrieve data directly through API hooks rather than from a global store

This architecture was deliberately chosen to facilitate:

1. **Extensibility**: Third-party plugins and extensions can easily integrate without depending on a complex global state
2. **Predictability**: Components have clear data dependencies that are explicitly declared
3. **Testability**: Isolated components are easier to test and maintain
4. **Performance**: Only the necessary data is fetched and updated when needed
5. **Maintainability**: Reduced coupling between components leads to more maintainable code

## Integration with Total Report

This UI application is part of the Total Report monorepo and integrates with:

- **@total-report/core-contract**: For type-safe API contracts
- **Backend Services**: Connects to core-service for data retrieval and manipulation
- **Shared Types**: Utilizes shared type definitions across the monorepo

For more information, see the [Modern.js documentation](https://modernjs.dev/en).

## Tests Implementation

The tests page follows the same architectural patterns as the reports and launches pages:

### Key Components

- **TestsList**: Main component orchestrating the tests interface with resizable panels
- **TestsListSidebar**: Left panel containing test list with filter button and pagination
- **UnifiedFilter**: Shared filter interface with structured filter management
  - **FiltersList**: Main filter overview with active filters display
  - **TitleFilterForm**: Dedicated title search filter form
  - **ReportFilterForm**: Dedicated report selection filter form with search functionality
  - **LaunchFilterForm**: Dedicated launch selection filter form with search functionality
- **TestDetailsContainer**: Right panel managing different test type queries and formatting
- **TestDetails**: Pure presentation component for displaying test information
- **TestListItem**: Individual test item component with status visualization

### Filter Architecture

The application implements a unified, modular filter system that is shared across tests and launches pages:

#### Shared Filter Components

- **UnifiedFilter**: Main filter component that orchestrates the entire filter experience
  - Manages filter state, panel view switching, and delegates to appropriate filter forms
  - Uses generic type constraints to work with different filter data structures
  - Configurable to show only relevant filters per entity type

- **FiltersList**: Overview of all available and active filters
  - Shows active filters with their current values and edit buttons
  - Shows available filter options that can be added
  - Provides Apply/Cancel actions for all filter changes

- **Filter Forms**: Individual filter forms for each filter type
  - **TitleFilterForm**: Text input for title/name searching with debouncing
  - **ReportFilterForm**: Searchable report selection with API integration
  - **LaunchFilterForm**: Searchable launch selection with API integration

- **FilterOption**: Reusable component for displaying filter option cards

#### Filter Configuration

Each page specifies which filters are available using a `FilterConfig`:

```typescript
// Tests page - supports all three filter types without header
const testsFilterConfig: FilterConfig = {
  availableFilters: [FilterType.TITLE, FilterType.REPORT, FilterType.LAUNCH],
  entityName: 'tests',
  showHeader: false // Hide header since parent already provides one
};

// Launches page - supports title and report filtering without header
const launchesFilterConfig: FilterConfig = {
  availableFilters: [FilterType.TITLE, FilterType.REPORT],
  entityName: 'launches',
  showHeader: false // Hide header since parent already provides one
};
```

#### Filter UI Features

The unified filter system provides a consistent user experience:

- **Consistent Header Display**: Both tests and launches pages maintain their headers when filters are active
  - **Tests Page**: Header stays visible with filter button showing active state
  - **Launches Page**: Header stays visible with filter button showing active state  
- **Filter Button State**: Filter button changes appearance based on panel view and shows active filter count
- **Navigation**: Filter components provide their own navigation within the filter panel
- **Filter Overview**: Shows all available and active filters with their current values
- **Individual Filter Forms**: Dedicated forms for each filter type with search functionality
- **Apply/Cancel Actions**: Proper filter state management with confirmation
- **Active Filter Count**: Badge indicator on the main filter button showing number of active filters
- **Fixed Pagination**: Pagination controls remain visible at the bottom even with long lists of items

#### Data Structure

All filter data follows the shared `BaseFilterData` interface:

```typescript
interface BaseFilterData {
  title?: string;
  report?: FilterOption;
  launch?: FilterOption;
}

interface FilterOption {
  id: number;
  title: string;
}
```

#### Integration Points

- **Panel View Management**: Toggle between entity list and filters view
- **Filter Button**: Shows active filter count with badge indicator  
- **Apply/Cancel Actions**: Proper filter state management with confirmation
- **URL Synchronization**: All filter states are reflected in URL parameters
- **Query Integration**: Filter changes trigger data refetch with all params included in query keys

This unified system ensures consistent filtering behavior and UI across all entity pages while remaining extensible for future filter types. Both tests and launches now support title and report filtering through the same interface, providing a consistent user experience.

### API Integration

- **useFindTestEntities**: Fetches paginated test entities with filtering
- **useFindReports**: Fetches reports for filter selection
- **useFindLaunches**: Fetches launches for filter selection
- **useReadTest**: Fetches individual test details
- **useReadBeforeTest**: Fetches before-test details 
- **useReadAfterTest**: Fetches after-test details
- **useFindStatuses**: Fetches test status definitions
- **useFindStatusGroups**: Fetches test status group definitions

### State Management

- **useTestsList**: Custom hook managing test list state, pagination, filters, and URL synchronization
- **URL Parameters**: `page`, `pageSize`, `title~cnt`, `reportId`, `reportTitle`, `launchId`, `launchTitle`, `testId`, `beforeTestId`, `afterTestId`
- **Selected Test State**: Tracks which test is selected and its type (test/before-test/after-test)
- **Panel View State**: Manages switching between tests list and filters view

### Test Types Support

The implementation supports three test entity types:
- **test**: Regular test entities
- **beforeTest**: Before-test step entities  
- **afterTest**: After-test step entities

Each type has its own API endpoint and details are rendered consistently through shared formatting utilities.

### Utilities

- **formatTestEntity**: Transforms raw test data with status information
- **formatTestDetails**: Formats individual test details with proper typing
- **getTestTypeFromEntityType**: Maps entity types to URL parameter types
- **StatusPill**: Visual status indicator with group and status colors
