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
- **TestFilters**: Separate filter interface with structured filter management
  - **FiltersList**: Main filter overview with active filters display
  - **TitleFilterForm**: Dedicated title search filter form
  - **ReportFilterForm**: Dedicated report selection filter form with search functionality
- **TestDetailsContainer**: Right panel managing different test type queries and formatting
- **TestDetails**: Pure presentation component for displaying test information
- **TestListItem**: Individual test item component with status visualization

### Filter Architecture

Following the same pattern as launches, the tests page implements a separate filter block:

- **Panel View Management**: Toggle between tests list and filters view
- **Filter Button**: Shows active filter count with badge indicator
- **Structured Filters**: Organized filter options with individual edit forms
  - **Title Filter**: Search tests by title with text input
  - **Report Filter**: Filter tests by specific report with searchable selection
- **Apply/Cancel Actions**: Proper filter state management with confirmation

### API Integration

- **useFindTestEntities**: Fetches paginated test entities with filtering
- **useFindReports**: Fetches reports for filter selection
- **useReadTest**: Fetches individual test details
- **useReadBeforeTest**: Fetches before-test details 
- **useReadAfterTest**: Fetches after-test details
- **useFindStatuses**: Fetches test status definitions
- **useFindStatusGroups**: Fetches test status group definitions

### State Management

- **useTestsList**: Custom hook managing test list state, pagination, filters, and URL synchronization
- **URL Parameters**: `page`, `pageSize`, `title~cnt`, `reportId`, `reportTitle`, `testId`, `beforeTestId`, `afterTestId`
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
