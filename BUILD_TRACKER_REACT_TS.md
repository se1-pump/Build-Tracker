# BuildTrack - React TypeScript Application

A complete React TypeScript conversion of the original BuildTrack HTML application. BuildTrack is a version history manager that saves build information directly to a GitHub repository via CSV storage.

## Project Structure

```
src/
├── components/              # React components
│   ├── FormPanel.tsx       # Build entry form with checklist
│   ├── HistoryPanel.tsx    # Build history with search and filters
│   ├── Header.tsx          # App header with logo and status
│   ├── SetupModal.tsx      # GitHub configuration modal
│   └── Toast.tsx           # Toast notification component
├── services/               # Business logic services
│   └── githubService.ts    # GitHub API integration
├── hooks/                  # Custom React hooks
│   └── useApp.tsx          # Application state context & provider
├── types.ts                # TypeScript type definitions
├── utils.ts                # Utility functions (CSV parsing, date formatting)
├── App.tsx                 # Main app component
├── App.css                 # Complete application styles (dark theme)
├── main.tsx                # React entry point
└── index.css               # Global styles
```

## Architecture

### State Management
- **Context API** (`useApp.tsx`): Global application state using React Context
  - Configuration (GitHub credentials)
  - Builds data
  - Sync status
  - Check states
  - Toast notifications

### Components

#### FormPanel
- Build date, project, version, commit ID input
- Features and notes text areas
- Interactive checklist (10 items) with progress bar
- Save to GitHub functionality

#### HistoryPanel
- Statistics dashboard (total builds, full pass count, avg checks, last build date)
- Search functionality across version, commit, features
- Build cards with expansion/collapse
- Features and notes display
- Mini checklist display
- Load build or delete actions

#### SetupModal
- GitHub authentication setup
- Owner, repo, file path, branch configuration
- Token verification
- Configuration persistence in localStorage

#### Header
- Logo and branding
- Repository link
- Sync status indicator (synced/syncing/offline)
- Settings button

### Services

#### GitHub Service
- `loadCSVFromGitHub()`: Load build history from GitHub
- `saveCSVToGitHub()`: Save/update CSV on GitHub
- `verifyGitHubAccess()`: Validate GitHub credentials
- `ghFetch()`: Authenticated GitHub API requests

### Utilities

#### CSV Processing
- `parseCSV()`: Parse CSV content to Build objects
- `buildsToCSV()`: Serialize builds back to CSV
- `parseCSVLine()`: Handle quoted CSV fields
- `toCSVLine()`: Format individual build as CSV line

#### Date & Formatting
- `today()`: Get ISO date string for today
- `toIST()`: Convert date to IST timezone
- `fmtDate()`: Format date as "DD MMM YYYY"
- `esc()`: HTML escape strings

## Features

✅ **GitHub Integration**
- Direct CSV storage in GitHub repos
- Personal access token authentication (stored in localStorage)
- Automatic sync status indicators
- Support for custom repo paths and branches

✅ **Build Tracking**
- Project selection (Stage 123, Stage 4, BMC - customizable)
- Version tagging
- Git commit reference
- Feature list documentation
- Notes/remarks
- 10-point quality checklist

✅ **History Management**
- View all saved builds
- Search across version, project, commit, features, date
- Build statistics dashboard
- Expand/collapse individual builds
- Load previous builds into form
- Delete builds

✅ **User Interface**
- Dark mode design with cyan/purple accents
- Responsive layout (mobile-friendly)
- Animated transitions and hover effects
- Progress visualization
- Toast notifications
- Syncing status indicators

## Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- GitHub account with a repository

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Opens at `http://localhost:5173`

### Production Build
```bash
npm run build
```
Outputs to `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## GitHub Configuration

1. **Create Personal Access Token**
   - Go to https://github.com/settings/tokens/new
   - Name: `buildtrack`
   - Scope: `repo` (full repository access)
   - Generate and copy token

2. **Configure in App**
   - Open app and click "⚙ Settings"
   - Enter GitHub username
   - Enter repository name
   - Enter CSV filename (default: `build_history.csv`)
   - Enter branch (default: `main`)
   - Paste your personal access token
   - Click "Connect & Save"

3. **Security Notes**
   - Token is stored only in browser's `localStorage`
   - Never transmitted except to GitHub's official API
   - To revoke: delete token from GitHub settings

## Data Format

### CSV Structure
The app saves build data in CSV format with headers:
```
id,date,project,version,commit,features,notes,check_0,check_1,...,check_9,savedAt
```

### Build Object
```typescript
interface Build {
  id: string;              // Timestamp-based ID
  date: string;            // ISO date (YYYY-MM-DD)
  project: string;         // Project name
  version: string;         // Version string
  commit: string;          // Git commit reference
  features: string;        // Features description
  notes: string;           // Additional notes
  check_0 to check_9: boolean;  // Quality checks
  savedAt: string;         // ISO timestamp with timezone
}
```

## TypeScript

- **Strict Mode Enabled** - Full type safety
- **Type-only Imports** - Optimized bundle size
- **Custom Types** - Defined in `types.ts`
  - `Build`: Build record interface
  - `Config`: GitHub configuration
  - `SyncStatus`: Connection status type
  - `GitHubContent`: API response types

## Styling

- **CSS-in-files** with CSS variables for theming
- **Dark Theme**: Professional dark mode with cyan/purple accents
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects
- **Grid Layouts**: CSS Grid for adaptive spacing

### Color Scheme
- Background: `#0a0c10` (very dark blue)
- Surface: `#111318`
- Accent: `#00e5ff` (cyan)
- Accent2: `#7c3aed` (purple)
- Accent3: `#10b981` (green - success)
- Danger: `#ef4444` (red)
- Warn: `#f59e0b` (amber)

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## Performance

- **Bundle Size**: ~150KB (gzipped)
- **Load Time**: <3 seconds
- **HMR**: Hot module replacement enabled
- **Code Splitting**: Automatic via Vite

## Development

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run tsc
```

## Conversion Notes

This is a complete React TypeScript rewrite of the original HTML/CSS/JavaScript application:

### Original → React
- Single HTML file → Modular component structure
- Inline JavaScript → React hooks & context
- Global state → Context API
- DOM manipulation → React state updates
- CSS classes → CSS with class-based styling

### Key Improvements
1. **Type Safety**: Full TypeScript with strict mode
2. **Modularity**: Separated concerns (components, services, hooks)
3. **Maintainability**: Clear dependencies and data flow
4. **Testability**: Pure functions and isolated components
5. **Scalability**: Easy to add features or integrate other services
6. **Developer Experience**: Hot reload, better error messages, editor support

## License

MIT

## Support

For issues or feature requests, contact the development team or create an issue in the repository.
