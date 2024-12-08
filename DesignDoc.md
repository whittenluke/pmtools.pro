# PMTools.pro - Website Design Document (v1.0)

## 1. Executive Summary

PMTools.pro is a progressive web application (PWA) designed to provide productivity professionals with a suite of powerful, intuitive tools. The platform is built with scalability, performance, and user experience as core principles.

## 2. Technical Architecture

### 2.1 Technology Stack

- **Frontend**: React (Next.js 14+)
- **Backend**: Supabase
- **Hosting**: Netlify
- **Database**: Supabase Postgres
- **State Management**: Zustand
- **UI Framework**: Shadcn/UI
- **Styling**: Tailwind CSS
- **Analytics**: Plausible (privacy-focused)
- **Drag and Drop**: @atlaskit/pragmatic-drag-and-drop

### 2.2 Architectural Principles

- Modular microservice-like frontend architecture
- Serverless backend design
- Comprehensive SEO optimization
- Performance-first approach
- Accessibility compliance (WCAG 2.1)

### 2.3 Drag and Drop Implementation

The application uses @atlaskit/pragmatic-drag-and-drop for all drag-and-drop functionality, chosen for:

- **Performance**: ~4.7kB core with incremental loading
- **Framework Agnostic**: Works with any frontend framework
- **Accessibility**: Built-in accessibility support
- **Cross-Platform**: Full feature support across browsers and devices
- **Virtualization Support**: Compatible with virtual scrolling implementations

Key drag-and-drop features:

- Element dragging with customizable previews
- Drop target management
- External file drag-and-drop support
- Text selection dragging
- Cross-iframe dragging support
- Automatic scrolling
- Customizable drop effects

Implementation approach:

- Core package for essential operations
- Optional adapters loaded on demand:
  - Element adapter for UI components
  - Text selection adapter for text operations
  - External adapter for file uploads
- Custom preview rendering for optimal UX
- Accessibility-first implementation using ARIA

## 3. Initial Tool Suite

### 3.1 Tool 1: Calculator

- **Identifier**: `/tools/calculator`
- **Features**:
  - Multiple calculation modes
  - History tracking
  - Shareable results
  - Keyboard support

### 3.2 Tool 2: Time Tracker

- **Identifier**: `/tools/time-tracker`
- **Features**:
  - Pomodoro technique integration
  - Project-based time logging
  - Exportable reports
  - Real-time synchronization

### 3.3 Tool 3: Project Estimation Tool

- **Identifier**: `/tools/estimation`
- **Features**:
  - Parametric cost estimation
  - Risk factor calculations
  - Comparative analysis
  - Template saving

### 3.8 Project Tables

- **Identifier**: `/tools/tables`
- **Features**:
  - Multiple table views per project
  - Configurable columns (status, dates, assignees, etc.)
  - Row grouping and filtering
  - Seamless switching between table and kanban views
  - Real-time collaboration
  - Customizable status colors and labels
  - Drag and drop row reordering
  - Bulk actions and editing
  - Search and filter capabilities
  - Integration with other tools

## 4. URL Structure

```
https://pmtools.pro/
├── /tools
│   ├── /calculator
│   ├── /time-tracker
│   ├── /estimation
│   ├── /tables
│   ├── /kanban
│   └── /notes
├── /projects
│   ├── /[project_id]
│   │   ├── /kanban/[view_id]
│   │   └── /table/[view_id]
│   └── /new
└── /account
    ├── login
    ├── signup
    └── dashboard
```

### 4.1 Project-Centric Routing

- `/projects/new`: Project creation wizard
- `/projects/[id]`: Project overview and settings
- `/projects/[id]/kanban/[view_id]`: Kanban board view
- `/projects/[id]/table/[view_id]`: Table view
- `/tools/*`: Standalone tools (calculator, timer, etc.)

### 4.2 View Management

Projects can have multiple views:

- Each view has a unique ID
- Views can be kanban or table type
- Views share project data but with different visualizations
- Views maintain independent settings and preferences

## 5. Database Schema (Supabase)

### 5.1 Tables

```sql
-- Core Tables
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Views System
CREATE TABLE project_views (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  type TEXT CHECK (type IN ('kanban', 'table')),
  title TEXT NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE view_columns (
  id UUID PRIMARY KEY,
  view_id UUID REFERENCES project_views(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE view_items (
  id UUID PRIMARY KEY,
  view_id UUID REFERENCES project_views(id) ON DELETE CASCADE,
  column_id UUID REFERENCES view_columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legacy Kanban System (to be migrated)
CREATE TABLE kanban_boards (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE kanban_columns (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES kanban_boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE kanban_tasks (
  id UUID PRIMARY KEY,
  column_id UUID REFERENCES kanban_columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tool Management
CREATE TABLE tool_registry (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tool_usage (
  id UUID PRIMARY KEY,
  tool_id UUID REFERENCES tool_registry(id),
  user_id UUID REFERENCES auth.users(id),
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes System
CREATE TABLE notes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  content TEXT,
  is_pinned BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.2 Row Level Security (RLS)

Each table implements specific RLS policies to ensure data security:

#### Projects & Views

- Users can only access their own projects
- Project views are restricted to project owners
- View columns and items inherit project-level permissions

#### Tools & Usage

- Tool registry is publicly readable but admin-only writable
- Users can only track their own tool usage

#### Notes

- Users can only access their own notes
- Notes support soft deletion via status field

### 5.3 Indexes

```sql
-- Project Views System
CREATE INDEX idx_project_views_project_id ON project_views(project_id);
CREATE INDEX idx_project_views_user_id ON project_views(user_id);
CREATE INDEX idx_view_columns_view_id ON view_columns(view_id);
CREATE INDEX idx_view_items_view_id ON view_items(view_id);
CREATE INDEX idx_view_items_column_id ON view_items(column_id);

-- Legacy Kanban System
CREATE INDEX idx_kanban_boards_project_id ON kanban_boards(project_id);
CREATE INDEX idx_kanban_boards_user_id ON kanban_boards(user_id);
CREATE INDEX idx_kanban_columns_board_id ON kanban_columns(board_id);
CREATE INDEX idx_kanban_tasks_column_id ON kanban_tasks(column_id);
```

## 6. SEO and Performance Strategy

### 6.1 SEO Optimization

- Server-side rendering (Next.js)
- Dynamic meta tags generation
- Semantic HTML structure
- Schema.org markup
- Optimized page speed
- Mobile-first design

### 6.2 Content Strategy

- Detailed tool documentation
- Blog with productivity insights
- Tool-specific landing pages
- Keyword-optimized descriptions
- Automated sitemap generation
- Structured data for each tool

## 7. Monetization Approach

### 7.1 Ad Integration

- Non-intrusive ad placements
- Programmatic ad networks
- Performance-based ad loading
- User consent management
- GDPR and CCPA compliant ad tracking

### 7.2 Potential Revenue Streams

- Contextual advertising
- Affiliate marketing
- Premium tool features
- Enterprise licensing
- Data insights (anonymized, aggregated)

## 8. Extensibility Framework

### 8.1 Tool Addition Process

- Standardized tool template
- Automated documentation generation
- One-click tool registration
- Centralized configuration management
- Automatic SEO integration

### 8.2 Dynamic Tool Registration

```typescript
interface ToolRegistration {
  slug: string;
  name: string;
  description: string;
  category: string;
  component: React.ComponentType;
  metadata: {
    seoKeywords: string[];
    searchVolume: number;
  };
}

function registerTool(tool: ToolRegistration) {
  // Validate tool
  // Update tool_registry
  // Generate dynamic route
  // Inject SEO metadata
}
```

## 9. Security Considerations

### 9.1 Authentication

- Multi-factor authentication
- OAuth integration
- Passwordless login options
- Secure token management
- Biometric login support

### 9.2 Data Protection

- End-to-end encryption
- Regular security audits
- GDPR and CCPA compliance
- Automated vulnerability scanning
- Rate limiting and DDoS protection

## 10. Deployment and CI/CD

### 10.1 Continuous Integration

- GitHub Actions
- Automated testing
- Static code analysis
- Performance benchmarking
- Automated dependency updates

### 10.2 Deployment Pipeline

- Netlify continuous deployment
- Staging and production environments
- Automatic rollback capabilities
- Performance monitoring
- Zero-downtime deployments

## 11. Roadmap and Future Vision

### 11.1 Short-Term Goals (3-6 months)

- Launch initial 3 tools
- Establish user base
- Implement analytics
- Optimize SEO
- Build community engagement

### 11.2 Mid-Term Goals (6-18 months)

- Expand tool ecosystem
- Introduce user collaboration features
- Develop mobile PWA
- Implement advanced monetization
- Create developer API

### 11.3 Long-Term Vision (2-5 years)

- Become the de-facto productivity toolkit
- Enterprise-grade feature set
- Global user community
- Potential platform expansion
- AI-powered tool recommendations

## 12. Technical Debt and Maintenance

### 12.1 Dependency Management

- Quarterly dependency updates
- Automated vulnerability checks
- Performance optimization reviews
- Deprecation strategy
- Backward compatibility testing

### 12.2 Technical Evolution

- Annual architecture review
- Technology trend monitoring
- Incremental modernization strategy
- Performance budget enforcement

## 13. Competitive Differentiation

### 13.1 Unique Value Propositions

- Seamless user experience
- Privacy-first design
- Continuous innovation
- Community-driven development
- Modular and extensible platform

## 14. Community and Contribution

### 14.1 Open Source Strategy

- Public GitHub repository
- Contributor guidelines
- Tool submission process
- Community-driven tool validation
- Recognition program for contributors

## 15. Performance Optimization

### 15.1 Frontend Optimization

- Code splitting
- Lazy loading
- Minimal JavaScript
- Efficient state management
- Memoization techniques

### 15.2 Backend Optimization

- Serverless functions
- Efficient database queries
- Caching strategies
- Edge computing support

## 16. Conclusion

PMTools.pro is designed as a scalable, modern, and user-centric productivity platform with a clear vision for long-term success and continuous improvement.

## 17. Project Structure

```
pmtools.pro/
├── .github/                    # GitHub specific configurations
│   └── workflows/             # CI/CD workflow definitions
├── public/                    # Static assets
│   ├── assets/               # Media assets
│   │   ├── icons/           # Application icons
│   │   └── images/          # Static images
│   └── fonts/               # Custom fonts
├── src/                      # Source code
│   ├── app/                 # Next.js App Router
│   │   ├── account/        # Account related pages
│   │   │   ├── dashboard/  # User dashboard
│   │   │   ├── login/     # Login page
│   │   │   └── signup/    # Signup page
│   │   └── tools/         # Tool pages
│   │       ├── calculator/ # Calculator tool
│   │       ├── estimation/ # Estimation tool
│   │       ├── time-tracker/ # Time tracking tool
│   │       ├── tables/     # Project tables tool
│   │       ├── kanban/    # Kanban tool
│   │       └── notes/     # Notes tool
│   ��── components/         # Reusable components
│   │   ├── common/        # Shared components
│   │   ├── layout/        # Layout components
│   │   └── tools/         # Tool-specific components
│   ├── config/            # Configuration files
│   ├── hooks/             # Custom React hooks
│   ├── lib/              # Utility libraries
│   │   ├── supabase/     # Supabase client and utilities
│   │   └── utils/        # Helper functions
│   ├── store/            # State management (Zustand)
│   ├── styles/           # Global styles and themes
│   └── types/            # TypeScript type definitions
├── tests/                 # Test suites
│   ├── e2e/              # End-to-end tests
│   └── unit/             # Unit tests
└── docs/                 # Documentation files
```

### 17.1 Directory Purposes

- **`.github/`**: Contains GitHub-specific configurations and CI/CD workflows
- **`public/`**: Static assets served directly by Next.js
- **`src/`**: Main source code directory
  - **`app/`**: Next.js App Router pages and routing
  - **`components/`**: Reusable React components
  - **`config/`**: Application configuration files
  - **`hooks/`**: Custom React hooks for shared logic
  - **`lib/`**: Utility functions and external service integrations
  - **`store/`**: State management using Zustand
  - **`styles/`**: Global styles and theming
  - **`types/`**: TypeScript type definitions
- **`tests/`**: Test suites for both unit and e2e testing
- **`docs/`**: Project documentation and guides

### 17.2 Component Organization

Components are organized following a feature-first approach:

- Common components are shared across the application
- Layout components handle the application structure
- Tool-specific components are isolated within their respective tool directories

### 17.3 Routing Structure

The application follows Next.js 14+ App Router conventions:

- Each route is a directory under `src/app`
- Layout files control the page structure
- Page files define the main content
- Loading and error states are handled at the route level

---

**Version**: 1.0
**Last Updated**: [Current Date]
**Status**: Pre-launch Planning
