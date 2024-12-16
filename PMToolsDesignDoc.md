# PMTools.pro - Website Design Document (v1.0)

## ✅ 1. Executive Summary

PMTools.pro is a project management platform designed to provide teams with a powerful, intuitive workspace for managing projects and tasks. Built with a project-centric approach, the platform emphasizes flexibility in project views, real-time collaboration, and seamless task management. The platform is built with scalability, performance, and user experience as core principles.

## 2. Technical Architecture

### ✅ 2.1 Technology Stack

- ✅ **Frontend**: React (Next.js 14+)
- ✅ **Backend**: Supabase
- ✅ **Hosting**: Netlify
- ✅ **Database**: Supabase Postgres
- ✅ **State Management**: Zustand
- ✅ **UI Framework**: Shadcn/UI
- ✅ **Styling**: Tailwind CSS
- **Analytics**: Plausible (privacy-focused)
- ✅ **Drag and Drop**: @atlaskit/pragmatic-drag-and-drop

### ✅ 2.2 Architectural Principles

- ✅ Project-centric architecture
- ✅ Real-time collaboration using Supabase subscriptions
- ✅ Serverless backend design using Next.js API routes
- Comprehensive SEO optimization
- ✅ Performance-first approach
- Accessibility compliance (WCAG 2.1)
- ✅ Automated maintenance through GitHub Actions

### 2.3 Drag and Drop Implementation

The application uses @atlaskit/pragmatic-drag-and-drop for all drag-and-drop functionality, chosen for:

- **Performance**: ~4.7kB core with incremental loading
- **Framework Agnostic**: Works with any frontend framework
- **Accessibility**: Built-in accessibility support
- **Cross-Platform**: Full feature support across browsers and devices
- **Virtualization Support**: Compatible with virtual scrolling implementations

Key drag-and-drop features:

- Task/item dragging with customizable previews
- Column and group reordering
- External file drag-and-drop support
- Automatic scrolling during drag operations
- Cross-view drag and drop support

Implementation approach:

- Core package for essential operations
- Optional adapters loaded on demand
- Custom preview rendering for optimal UX
- Accessibility-first implementation using ARIA

### ✅ 2.3 Maintenance Strategy

#### ✅ 2.3.1 Maintenance Tasks

- ✅ Clean up old notifications (30+ days)
- ✅ Archive old activity logs (90+ days)
- ✅ Clean up expired workspace invites
- ✅ Clean up old automation logs (30+ days)
- ✅ Clean up old export jobs (7+ days)
- ✅ Database optimization (VACUUM ANALYZE)

#### ✅ 2.3.2 Implementation

- ✅ **API Endpoint**: `/api/maintenance` (Next.js API route)
- ✅ **Authentication**: Secured with MAINTENANCE_SECRET environment variable
- ✅ **Scheduler**: GitHub Actions workflow running daily at 2 AM UTC
- ✅ **Monitoring**: GitHub Actions dashboard for execution history
- ✅ **Manual Trigger**: Available through GitHub Actions workflow_dispatch

#### ✅ 2.3.3 Error Handling

- ✅ Failed executions logged in GitHub Actions
- ✅ Automatic retry mechanism for transient failures
- ✅ Admin notifications for persistent failures
- ✅ Detailed execution logs for debugging

## 2.4 Design System

### 2.4.1 Color Palette

The color system is designed to be accessible, professional, and distinctive while maintaining excellent contrast ratios and supporting both light and dark modes.

#### Primary Colors

- **Primary**: Rich Teal (#0A7B83, HSL 185 85% 28%)
  - Light mode: Used for primary actions, links, and brand elements
  - Dark mode: Adjusted to HSL 185 70% 40% for better visibility
- **Primary Foreground**: White in light mode, slightly off-white in dark mode
  - Light mode: HSL 210 40% 98%
  - Dark mode: HSL 210 40% 98%

#### Secondary Colors

- **Secondary**: Light teal tint
  - Light mode: HSL 184 40% 96%
  - Dark mode: HSL 184 45% 17%
- **Secondary Foreground**: Dark in light mode, light in dark mode
  - Light mode: HSL 222 47% 11%
  - Dark mode: HSL 210 40% 98%

#### Status Colors

- **Success**: Professional green (HSL 142 72% 29%)
- **Warning**: Clear amber (HSL 45 93% 47%)
- **Destructive**: Clear red (HSL 0 84% 60%)
- **Info**: Bright blue (HSL 199 89% 48%)

#### UI Colors

- **Background**: Pure white in light mode, rich dark in dark mode
- **Foreground**: Near black in light mode, off-white in dark mode
- **Muted**: Light teal tint for subtle backgrounds
- **Muted Foreground**: Subdued text color
- **Border**: Subtle borders matching the teal theme
- **Ring**: Focus rings using primary color

#### Color Usage Guidelines

- Primary color for main CTAs and important interactive elements
- Secondary color for less prominent actions and hover states
- Status colors reserved for their specific meanings
- Muted colors for backgrounds and disabled states
- Consistent use of HSL format for easy manipulation
- All color combinations meet WCAG 2.1 contrast requirements

### 2.4.2 Typography

[Typography section to be added]

### 2.4.3 Spacing

[Spacing section to be added]

### 2.4.4 Components

[Components section to be added]

## 3. Core Functionality

### 3.1 Projects

Projects are the central organizing unit of the platform, with the following key features:

- **Multiple View Types**:

  - ✅ Table view (basic implementation)
  - Kanban board view (in progress)
  - Dashboard view with customizable widgets
  - Timeline/Gantt view
  - Calendar view

- **View Features**:
  - ✅ Seamless switching between views
  - View-specific configurations (in progress)
  - Saved view templates
  - Real-time updates (in progress)

### ✅ 3.2 Table View

- ✅ **Groups/Tables**:
  - Collapsible groups (in progress)
  - Group-level summaries
  - ✅ Custom group styling
  - ✅ Drag-and-drop reordering
- ✅ **Columns**:
  - ✅ Custom column types (basic types implemented)
  - ✅ Column visibility controls (in progress)
  - ✅ Column reordering (in progress)
  - ✅ Column-specific filters (UI only)
- ✅ **Status Column Implementation**:

  - ✅ Special column type that drives kanban view
  - ✅ Default statuses provided (Not Started, In Progress, Done)
  - ✅ Custom status creation with color picker
  - ✅ Status order preserved across views
  - ✅ Status changes sync between table and kanban (in progress)

### 🟡 3.3 Task Management

- 🟡 **Task Modal**:

  - ✅ Single-page layout (no tabs)
  - 🟡 Rich text description (basic implementation)
  - ❌ File attachments with previews
  - 🟡 Collapsible activity log (in progress)
  - 🟡 Integrated comments section (basic implementation)
  - 🟡 Custom fields display (in progress)
  - ❌ Quick actions sidebar

- 🟡 **Comments & Updates**:
  - 🟡 Rich text support (basic implementation)
  - ❌ @mentions
  - ❌ File attachments
  - ❌ Emoji reactions
  - ❌ Comment resolution
  - ❌ Email notifications

### ✅ 3.4 Real-time Collaboration

- ✅ **Live Updates**:

  - ✅ Instant task changes
  - ✅ Real-time field updates
  - ✅ Comment notifications
  - 🟡 User presence indicators (in progress)
  - 🟡 Concurrent editing support (basic implementation)

- ✅ **Conflict Resolution**:
  - ✅ Last-write wins for simple fields
  - ✅ Merge strategy for complex fields
  - ✅ Optimistic updates
  - ✅ Offline support

### 🟡 3.5 Templates

- 🟡 **Project Templates**:

  - ✅ Pre-defined project structure
  - ✅ Default columns and views
  - ❌ Sample tasks and groups
  - 🟡 Automation rules (in progress)
  - ✅ Custom fields configuration

- ✅ **View Templates**:
  - ✅ Column configurations
  - ✅ Filter presets
  - ✅ Group settings
  - ✅ Visual preferences
  - ✅ Saved layouts

### 🟡 3.6 Status Implementation

The status system is a core feature that bridges the Table and Kanban views:

#### ✅ 3.6.1 Status Configuration

```typescript
interface StatusConfig {
  statuses: {
    id: string; // Unique identifier
    title: string; // Display name
    color: string; // HEX color code
    position: number; // Order in kanban view
    type?: "default" | "custom";
  }[];
  defaultStatusId: string;
}
```

#### ✅ 3.6.2 Database Structure

```sql
-- Status configuration stored in project_views
ALTER TABLE project_views
ADD COLUMN status_config JSONB DEFAULT '{
  "statuses": [
    {"id": "not_started", "title": "Not Started", "color": "#c4c4c4", "position": 0, "type": "default"},
    {"id": "in_progress", "title": "In Progress", "color": "#fdab3d", "position": 1, "type": "default"},
    {"id": "done", "title": "Done", "color": "#00c875", "position": 2, "type": "default"}
  ],
  "defaultStatusId": "not_started"
}'::jsonb;

-- Tasks reference status by ID
ALTER TABLE tasks
ADD COLUMN status_id TEXT NOT NULL DEFAULT 'not_started';
```

#### 🟡 3.6.3 View Interactions

- 🟡 **Table View**:

  - ✅ Status shown as a special column type
  - ✅ Status changes via dropdown or quick-select
  - 🟡 Custom status creation in column settings (in progress)
  - ✅ Status colors shown as indicators

- 🟡 **Kanban View**:
  - 🟡 Each status becomes a column (in progress)
  - 🟡 Column order matches status positions (in progress)
  - ❌ New statuses create new columns
  - 🟡 Drag-and-drop between columns updates status (in progress)
  - ✅ Column headers show status colors

#### 🟡 3.6.4 Status Management

- 🟡 Status changes sync instantly across views (in progress)
- ✅ Status updates trigger real-time notifications
- ❌ Bulk status updates supported
- ❌ Status deletion handled gracefully:
  - ❌ Warning if tasks use the status
  - ❌ Option to move tasks to different status
  - ❌ Prevents deletion of default statuses

### 🟡 3.7 Column Types

#### 🟡 3.7.1 Core Column Types

- 🟡 **Text**:

  - ✅ Single line text
  - 🟡 Long text (with rich text editor) (in progress)
  - ❌ HTML/Markdown support
  - ❌ Mentions support (@users)
  - ❌ URL detection and preview

- 🟡 **Number**:

  ```typescript
  interface NumberColumnConfig {
    type: "number";
    mode: "decimal" | "integer" | "currency" | "percentage" | "rating";
    precision?: number;
    currency?: string;
    minValue?: number;
    maxValue?: number;
    displayFormat?: string;
    aggregation?: "sum" | "average" | "min" | "max" | "count";
  }
  ```

- 🟡 **Date**:

  ```typescript
  interface DateColumnConfig {
    type: "date";
    mode: "date" | "datetime" | "time" | "duration";
    timeZone?: string;
    format?: string;
    includeTime?: boolean;
    defaultToToday?: boolean;
    allowFutureDates?: boolean;
    allowPastDates?: boolean;
  }
  ```

- 🟡 **Person**:

  ```typescript
  interface PersonColumnConfig {
    type: "person";
    allowMultiple: boolean;
    restrictToWorkspace: boolean;
    roles?: string[];
    showAvatar?: boolean;
    notifyOnAssignment?: boolean;
  }
  ```

- 🟡 **Status** (Special type, see Status Implementation)

- 🟡 **Checkbox**:
  ```typescript
  interface CheckboxColumnConfig {
    type: "checkbox";
    label?: string;
    defaultValue?: boolean;
    style?: "checkbox" | "toggle" | "star";
  }
  ```

#### 3.7.2 Advanced Column Types

- **Formula**:

  ```typescript
  interface FormulaColumnConfig {
    type: "formula";
    formula: string;
    outputType: "number" | "text" | "date" | "boolean";
    referencedColumns: string[];
    errorHandling: "zero" | "null" | "error";
    caching?: boolean;
  }
  ```

- **Lookup**:

  ```typescript
  interface LookupColumnConfig {
    type: "lookup";
    sourceColumn: string;
    targetProject: string;
    targetColumn: string;
    relationship: "oneToOne" | "oneToMany";
    displayFormat?: string;
  }
  ```

- **File**:

  ```typescript
  interface FileColumnConfig {
    type: "file";
    allowedTypes: string[];
    maxSize: number;
    maxFiles?: number;
    showPreviews: boolean;
    storage: "supabase" | "s3" | "external";
  }
  ```

- **Link**:
  ```typescript
  interface LinkColumnConfig {
    type: "link";
    validationPattern?: string;
    showPreview?: boolean;
    openInNewTab?: boolean;
    allowedDomains?: string[];
  }
  ```

#### 3.7.3 Column Storage

```sql
-- Column definitions stored in project_views
ALTER TABLE project_views
ADD COLUMN columns JSONB DEFAULT '[]'::jsonb;

-- Column values stored in tasks
ALTER TABLE tasks
ADD COLUMN column_values JSONB DEFAULT '{}'::jsonb;

-- Example column_values structure
{
  "col_123": {
    "type": "number",
    "value": 42,
    "metadata": {
      "currency": "USD",
      "formatted": "$42.00"
    }
  },
  "col_456": {
    "type": "person",
    "value": ["user_789", "user_012"],
    "metadata": {
      "notified": true
    }
  }
}
```

#### 3.7.4 Column Validation and Processing

```typescript
interface ColumnProcessor {
  validate(value: any): boolean | ValidationError;
  format(value: any): string;
  parse(input: string): any;
  aggregate(values: any[]): any;
}

class ColumnProcessorFactory {
  getProcessor(config: ColumnConfig): ColumnProcessor {
    switch (config.type) {
      case "number":
        return new NumberProcessor(config);
      case "date":
        return new DateProcessor(config);
      // ... other processors
    }
  }
}
```

#### 3.7.5 Column Interactions

- **Filtering**:

  - Type-specific operators
  - Complex conditions
  - Custom filter UI per type
  - Filter templates

- **Sorting**:

  - Type-specific sort logic
  - Multi-column sorting
  - Custom sort functions
  - Sort templates

- **Grouping**:

  - Automatic group generation
  - Custom grouping rules
  - Group aggregations
  - Nested grouping

- **Formulas**:
  - Cross-column references
  - Aggregate functions
  - Custom functions
  - Error handling

### 3.8 View Relationships

#### 3.8.1 View Data Model

```typescript
interface ViewConfig {
  id: string;
  type: "table" | "kanban" | "timeline" | "calendar" | "dashboard";
  name: string;
  description?: string;
  isDefault?: boolean;

  // Shared configuration
  columns: ColumnConfig[];
  filters: FilterConfig[];
  sorts: SortConfig[];
  groups: GroupConfig[];

  // View-specific configuration
  settings: {
    table?: TableViewSettings;
    kanban?: KanbanViewSettings;
    timeline?: TimelineViewSettings;
    calendar?: CalendarViewSettings;
    dashboard?: DashboardViewSettings;
  };
}

// Example view-specific settings
interface TableViewSettings {
  showRowNumbers: boolean;
  rowHeight: "small" | "medium" | "large";
  columnWidths: Record<string, number>;
  frozenColumns: string[];
  expandedGroups: string[];
}

interface KanbanViewSettings {
  columnWidth: number;
  collapsedColumns: string[];
  swimlanes?: {
    groupBy: string;
    expanded: string[];
  };
  cardFields: string[];
}
```

#### 3.8.2 Data Synchronization

- **Shared Data**:

  - Task core data (title, description)
  - Column values
  - Comments and attachments
  - Activity history
  - Assignments and dates

- **View-Specific Data**:
  - Visual preferences
  - Layout settings
  - Expanded/collapsed states
  - Custom field visibility
  - View-specific filters

#### 3.8.3 Cross-View Features

- **Real-time Updates**:

  ```typescript
  interface ViewUpdateHandler {
    // Handle updates that affect multiple views
    handleSharedUpdate(update: SharedUpdate): void;

    // Handle view-specific updates
    handleViewUpdate(update: ViewUpdate): void;

    // Sync view-specific state
    syncViewState(state: ViewState): void;
  }
  ```

- **View Transitions**:
  - State preservation between views
  - Animation transitions
  - Context maintenance
  - Selection persistence

#### 3.8.4 View-Specific Behaviors

- **Table View**:

  - Row-based operations
  - Column resizing/reordering
  - Inline editing
  - Bulk actions

- **Kanban View**:

  - Column-based operations
  - Card dragging
  - Swimlanes
  - WIP limits

- **Timeline View**:

  - Date-based operations
  - Dependency arrows
  - Resource allocation
  - Critical path

- **Calendar View**:
  - Event-based operations
  - Resource scheduling
  - Recurring events
  - Multi-day spanning

#### 3.8.5 View Inheritance

```typescript
interface ViewInheritance {
  // Base view configuration
  baseConfig: Partial<ViewConfig>;

  // View-specific overrides
  overrides: {
    [viewId: string]: Partial<ViewConfig>;
  };

  // Inheritance rules
  rules: {
    [key: string]: "inherit" | "override" | "merge";
  };
}

// Example inheritance implementation
class ViewManager {
  getEffectiveConfig(viewId: string): ViewConfig {
    const base = this.getBaseConfig();
    const overrides = this.getViewOverrides(viewId);
    return this.mergeConfigs(base, overrides);
  }

  mergeConfigs(base: ViewConfig, override: Partial<ViewConfig>): ViewConfig {
    // Merge logic based on inheritance rules
  }
}
```

### 3.9 Workspace System

#### 🟡 3.9.1 Workspace Model

```typescript
interface Workspace {
  id: string;
  name: string;
  slug: string;
  settings: WorkspaceSettings;
  branding?: WorkspaceBranding;
  features: EnabledFeatures;
  limits: WorkspaceLimits;
}

interface WorkspaceSettings {
  defaultTimeZone: string;
  defaultLanguage: string;
  allowedDomains?: string[];
  singleSignOn?: SSOConfig;
  security: SecuritySettings;
}

interface WorkspaceBranding {
  logo?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  customCSS?: string;
}
```

#### ✅ 3.9.2 Database Structure

```sql
-- Workspaces
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  settings JSONB DEFAULT '{}'::jsonb,
  branding JSONB DEFAULT '{}'::jsonb,
  features JSONB DEFAULT '{}'::jsonb,
  limits JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace Members
CREATE TABLE workspace_members (
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  permissions JSONB DEFAULT '{}'::jsonb,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (workspace_id, user_id)
);

-- Workspace Invites
CREATE TABLE workspace_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 🟡 3.9.3 Workspace Hierarchy

- 🟡 **Organization**:

  ```typescript
  interface WorkspaceHierarchy {
    workspace: Workspace;
    projects: Project[];
    teams: Team[];
    members: WorkspaceMember[];
  }
  ```

- ❌ **Teams**:
  ```typescript
  interface Team {
    id: string;
    name: string;
    description?: string;
    members: TeamMember[];
    projects: Project[];
    settings: TeamSettings;
  }
  ```

#### 🟡 3.9.4 Access Control

```typescript
interface WorkspacePermissions {
  // Workspace-level permissions
  manageWorkspace: boolean;
  manageMembers: boolean;
  manageBilling: boolean;
  manageIntegrations: boolean;

  // Project-level permissions
  createProject: boolean;
  deleteProject: boolean;
  manageProjectSettings: boolean;

  // View-level permissions
  createView: boolean;
  editView: boolean;
  shareView: boolean;
}

interface RoleDefinition {
  name: string;
  permissions: WorkspacePermissions;
  canBeModified: boolean;
  priority: number;
}

const DEFAULT_ROLES: Record<string, RoleDefinition> = {
  owner: {
    name: "Owner",
    permissions: {
      /* full permissions */
    },
    canBeModified: false,
    priority: 100,
  },
  admin: {
    name: "Admin",
    permissions: {
      /* admin permissions */
    },
    canBeModified: true,
    priority: 80,
  },
  member: {
    name: "Member",
    permissions: {
      /* standard permissions */
    },
    canBeModified: true,
    priority: 50,
  },
  guest: {
    name: "Guest",
    permissions: {
      /* limited permissions */
    },
    canBeModified: true,
    priority: 20,
  },
};
```

- ✅ **Permission Levels**:

  - ✅ Owner (full access)
  - ✅ Admin (manage workspace)
  - ✅ Member (basic access)
  - ❌ Guest (limited access)

- 🟡 **Access Control Features**:
  - ✅ Role-based permissions
  - ✅ Resource-level permissions
  - 🟡 Custom permission sets (in progress)
  - ❌ Permission inheritance
  - ❌ Time-based access

#### 🟡 3.9.5 Workspace Features

- 🟡 **Customization**:

  - ✅ Workspace branding
  - ✅ Custom domain
  - ❌ Custom email templates
  - ❌ White-labeling

- 🟡 **Security**:

  - ✅ SSO integration
  - ✅ 2FA requirement
  - 🟡 IP restrictions (in progress)
  - ❌ Session management
  - ❌ Audit logging

- 🟡 **Administration**:
  - ✅ Member management
  - ✅ Role assignment
  - 🟡 Usage analytics (in progress)
  - ❌ Backup/restore
  - ❌ Data export

## 4. URL Structure

```
https://pmtools.pro/
├── /projects                # Project management section
│   ├── /new                # Project creation
│   └── /[id]               # Project-specific routes
│       ├── /table          # Table view
│       ├── /kanban         # Kanban board view
│       ├── /timeline       # Timeline/Gantt view
│       ├── /calendar       # Calendar view
│       └── /dashboard      # Dashboard view
└── /account
    ├── /login
    ├── /signup
    └── /settings
```

### 4.1 Project-Centric Routing Implementation

The application uses Next.js App Router for routing with the following key features:

- Protected routes using middleware for authentication
- Nested routing with shared layouts
- Dynamic project ID parameters
- View-specific layouts and configurations
- Real-time route synchronization

## 5. Database Schema (Supabase)

### 5.1 Tables

Complete table creation queries for Supabase setup:

```sql
-- Core Tables

-- Workspaces
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  settings JSONB DEFAULT '{}'::jsonb,
  branding JSONB DEFAULT '{}'::jsonb,
  features JSONB DEFAULT '{}'::jsonb,
  limits JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace Members
CREATE TABLE workspace_members (
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  permissions JSONB DEFAULT '{}'::jsonb,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (workspace_id, user_id)
);

-- Workspace Invites
CREATE TABLE workspace_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Views
CREATE TABLE project_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('table', 'kanban', 'timeline', 'calendar', 'dashboard')),
  is_default BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}'::jsonb,
  columns JSONB DEFAULT '[]'::jsonb,
  status_config JSONB DEFAULT '{
    "statuses": [
      {"id": "not_started", "title": "Not Started", "color": "#c4c4c4", "position": 0, "type": "default"},
      {"id": "in_progress", "title": "In Progress", "color": "#fdab3d", "position": 1, "type": "default"},
      {"id": "done", "title": "Done", "color": "#00c875", "position": 2, "type": "default"}
    ],
    "defaultStatusId": "not_started",
    "interactions": {
      "allowGrouping": true,
      "allowFiltering": true,
      "allowFormulas": true,
      "allowAutomations": true,
      "allowDependencies": true
    }
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups/Tables
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  color TEXT,
  position INTEGER NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status_id TEXT NOT NULL DEFAULT 'not_started',
  assignee_id UUID REFERENCES auth.users(id),
  due_date TIMESTAMPTZ,
  position INTEGER NOT NULL,
  column_values JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates
CREATE TABLE project_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation System Tables

-- Automations
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  trigger JSONB NOT NULL,
  conditions JSONB DEFAULT '[]'::jsonb,
  actions JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation Logs
CREATE TABLE automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_id UUID REFERENCES automations(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL,
  status TEXT NOT NULL,
  error TEXT,
  details JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Import/Export System Tables

-- Import Jobs
CREATE TABLE import_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  source TEXT NOT NULL,
  config JSONB NOT NULL,
  progress INTEGER DEFAULT 0,
  total INTEGER,
  error TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Export Jobs
CREATE TABLE export_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  format TEXT NOT NULL,
  config JSONB NOT NULL,
  file_url TEXT,
  error TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permission System Tables

-- Permission Sets
CREATE TABLE permission_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL,
  is_custom BOOLEAN DEFAULT false,
  priority INTEGER NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resource Permissions
CREATE TABLE resource_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  permission_set_id UUID REFERENCES permission_sets(id),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  grantee_type TEXT NOT NULL,
  grantee_id UUID NOT NULL,
  conditions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create all necessary indexes
CREATE INDEX idx_projects_workspace_id ON projects(workspace_id);
CREATE INDEX idx_project_views_project_id ON project_views(project_id);
CREATE INDEX idx_groups_project_id ON groups(project_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_group_id ON tasks(group_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status_id ON tasks(status_id);
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_activity_log_project_id ON activity_log(project_id);
CREATE INDEX idx_activity_log_task_id ON activity_log(task_id);
CREATE INDEX idx_automations_workspace ON automations(workspace_id);
CREATE INDEX idx_automations_project ON automations(project_id);
CREATE INDEX idx_automation_logs_automation ON automation_logs(automation_id);
CREATE INDEX idx_import_jobs_workspace ON import_jobs(workspace_id);
CREATE INDEX idx_export_jobs_workspace ON export_jobs(workspace_id);
CREATE INDEX idx_resource_permissions_resource ON resource_permissions(resource_type, resource_id);
CREATE INDEX idx_resource_permissions_grantee ON resource_permissions(grantee_type, grantee_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_workspace_invites_email ON workspace_invites(email);
```

### 5.2 Row Level Security (RLS)

Each table implements specific RLS policies to ensure comprehensive data security:

```sql
-- Workspace Security
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view workspace"
  ON workspaces FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace owners can manage workspace"
  ON workspaces FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspaces.id
      AND wm.user_id = auth.uid()
      AND wm.role = 'owner'
    )
  );

-- Workspace Members Security
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view workspace members"
  ON workspace_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage workspace members"
  ON workspace_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
    )
  );

-- Projects Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view projects"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = projects.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Project managers can manage projects"
  ON projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = projects.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin', 'manager')
    )
  );

-- Project Views Security
ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view project views"
  ON project_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      WHERE p.id = project_views.project_id
      AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Project managers can manage views"
  ON project_views FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      WHERE p.id = project_views.project_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin', 'manager')
    )
  );

-- Groups Security
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view groups"
  ON groups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      WHERE p.id = groups.project_id
      AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Project editors can manage groups"
  ON groups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      WHERE p.id = groups.project_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin', 'manager', 'editor')
    )
  );

-- Tasks Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view tasks"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      WHERE p.id = tasks.project_id
      AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Project editors can manage tasks"
  ON tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      WHERE p.id = tasks.project_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin', 'manager', 'editor')
    )
  );

-- Comments Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view comments"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      JOIN tasks t ON t.project_id = p.id
      WHERE t.id = comments.task_id
      AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Project members can create comments"
  ON comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      JOIN tasks t ON t.project_id = p.id
      WHERE t.id = comments.task_id
      AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Comment owners can manage their comments"
  ON comments FOR ALL
  USING (
    comments.user_id = auth.uid()
  );

-- Activity Log Security
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view activity log"
  ON activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      WHERE p.id = activity_log.project_id
      AND wm.user_id = auth.uid()
    )
  );

-- Automations Security
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view automations"
  ON automations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = automations.workspace_id
      AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Automation managers can manage automations"
  ON automations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = automations.workspace_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin', 'automation_manager')
    )
  );

-- Import/Export Jobs Security
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own import jobs"
  ON import_jobs FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Users can manage their own import jobs"
  ON import_jobs FOR ALL
  USING (created_by = auth.uid());

CREATE POLICY "Users can view their own export jobs"
  ON export_jobs FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Users can manage their own export jobs"
  ON export_jobs FOR ALL
  USING (created_by = auth.uid());

-- Permission Sets Security
ALTER TABLE permission_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view permission sets"
  ON permission_sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = permission_sets.workspace_id
      AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace admins can manage permission sets"
  ON permission_sets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = permission_sets.workspace_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
    )
  );

-- Resource Permissions Security
ALTER TABLE resource_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view resource permissions"
  ON resource_permissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = resource_permissions.workspace_id
      AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace admins can manage resource permissions"
  ON resource_permissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = resource_permissions.workspace_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
    )
  );
```

### 5.3 Indexes

```sql
-- Projects and Views
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_workspace_id ON projects(workspace_id);
CREATE INDEX idx_project_views_project_id ON project_views(project_id);

-- Groups and Tasks
CREATE INDEX idx_groups_project_id ON groups(project_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_group_id ON tasks(group_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);

-- Comments and Activity
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_activity_log_project_id ON activity_log(project_id);
CREATE INDEX idx_activity_log_task_id ON activity_log(task_id);
```

## 6. SEO and Performance Strategy

### 6.1 SEO Optimization

- **Server-Side Rendering**:

  - Next.js App Router with server components
  - Dynamic metadata generation
  - Optimized loading states
  - Streaming and suspense support

- **Technical SEO**:

  - Semantic HTML structure
  - Schema.org markup for projects and tasks
  - Optimized meta tags
  - Sitemap generation
  - robots.txt configuration

- **Performance Metrics**:
  - Core Web Vitals optimization
  - First Contentful Paint < 1.2s
  - Time to Interactive < 2.5s
  - Cumulative Layout Shift < 0.1

### 6.2 Content Strategy

- **Landing Pages**:

  - Feature-focused content
  - Use case demonstrations
  - Customer success stories
  - Integration showcases

- **Documentation**:
  - Getting started guides
  - Feature documentation
  - Best practices
  - API documentation
  - Video tutorials

## 7. Monetization Strategy

### 7.1 Tiered Pricing Model

#### Free Tier

- Limited projects (2)
- Basic views (Table, Kanban)
- Core features
- Community support
- 100MB storage

#### Pro Tier ($10/user/month)

- Unlimited projects
- All view types
- Advanced features
- Email support
- 5GB storage
- Custom fields
- Automation features

#### Enterprise Tier (Custom)

- Custom solutions
- SLA guarantees
- Dedicated support
- Unlimited storage
- Advanced security
- Custom integrations

### 7.2 Additional Revenue Streams

- **Marketplace**:

  - Custom view templates
  - Project templates
  - Integration add-ons
  - Automation recipes

- **Services**:
  - Priority support
  - Custom development
  - Training sessions
  - Implementation consulting

## 8. Integration Framework

### 8.1 External Integrations

- **Communication**:

  - Slack
  - Microsoft Teams
  - Discord
  - Email

- **Development**:

  - GitHub
  - GitLab
  - Jira
  - Bitbucket

- **Productivity**:
  - Google Workspace
  - Microsoft 365
  - Notion
  - Confluence

### 8.2 Integration Implementation

```typescript
interface Integration {
  id: string;
  name: string;
  type: "incoming" | "outgoing" | "bidirectional";
  config: {
    authType: "oauth2" | "apiKey" | "webhook";
    endpoints: Record<string, string>;
    scopes: string[];
    webhookEvents?: string[];
  };
  handlers: {
    setup: () => Promise<void>;
    sync: () => Promise<void>;
    webhook?: (payload: any) => Promise<void>;
  };
}

class IntegrationManager {
  async setupIntegration(integration: Integration) {
    // Validate configuration
    // Setup authentication
    // Register webhooks
    // Initialize sync
  }

  async handleWebhook(integrationId: string, payload: any) {
    // Verify webhook signature
    // Process payload
    // Update relevant projects/tasks
    // Trigger notifications
  }
}
```

## 9. Security Considerations

### 9.1 Authentication Flow

#### 9.1.1 User Authentication Methods

- **Email/Password**:
  - Secure password hashing with Argon2
  - Email verification required
  - Password strength requirements
  - Reset password functionality
- **OAuth Providers**:
  - Google
  - GitHub
  - Microsoft
- **Magic Link (Passwordless)**:
  - Time-limited secure tokens
  - Device fingerprinting
  - Rate limiting

#### 9.1.2 Authentication Implementation

- **Client-Side**:

  ```typescript
  // auth.ts
  export const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Custom hook for auth state
  export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Get initial session
      supabaseClient.auth.getSession();

      // Subscribe to auth changes
      const {
        data: { subscription },
      } = supabaseClient.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }, []);

    return { user, loading };
  }
  ```

- **Server-Side (Middleware)**:

  ```typescript
  // middleware.ts
  export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Verify session token
    const supabase = createMiddlewareClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Protected routes logic
    if (req.nextUrl.pathname.startsWith("/projects")) {
      if (!session) {
        const redirectUrl = new URL("/login", req.url);
        redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }

    return res;
  }

  export const config = {
    matcher: ["/projects/:path*", "/account/:path*", "/api/:path*"],
  };
  ```

#### 9.1.3 Session Management

- JWT-based session tokens
- Configurable session duration
- Automatic token refresh
- Secure cookie handling
- Cross-tab session synchronization

#### 9.1.4 Security Features

- **Multi-Factor Authentication (MFA)**:
  - TOTP (Time-based One-Time Password)
  - SMS verification (optional)
  - Recovery codes
- **Session Management**:
  - Active session listing
  - Remote session termination
  - Concurrent session limits
- **Security Monitoring**:
  - Failed login attempt tracking
  - Suspicious activity detection
  - IP-based access controls

### 9.2 Data Protection

- End-to-end encryption
- Regular security audits
- GDPR and CCPA compliance
- Automated vulnerability scanning
- Rate limiting and DDoS protection

### 9.3 Permission System

#### 9.3.1 Permission Model

```typescript
interface Permission {
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
}

interface PermissionCondition {
  type: "workspace" | "project" | "team" | "ownership" | "custom";
  value: any;
  operator: "equals" | "includes" | "excludes" | "custom";
}

interface PermissionSet {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isCustom: boolean;
  priority: number;
}
```

#### 9.3.2 Resource-Level Permissions

```typescript
// Project Permissions
interface ProjectPermissions {
  view: boolean;
  edit: boolean;
  delete: boolean;
  share: boolean;
  manageSettings: boolean;
  manageMembers: boolean;
  manageTemplates: boolean;
  manageAutomations: boolean;
}

// View Permissions
interface ViewPermissions {
  view: boolean;
  edit: boolean;
  share: boolean;
  delete: boolean;
  manageColumns: boolean;
  manageFilters: boolean;
  manageAutomations: boolean;
}

// Task Permissions
interface TaskPermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  assignUsers: boolean;
  addComments: boolean;
  manageAttachments: boolean;
}
```

#### 9.3.3 Permission Inheritance

```typescript
class PermissionResolver {
  async resolvePermissions(
    userId: string,
    resourceType: string,
    resourceId: string
  ): Promise<ResolvedPermissions> {
    // Get all applicable permission sets
    const permissionSets = await this.getApplicablePermissionSets(
      userId,
      resourceType,
      resourceId
    );

    // Sort by priority
    const sortedSets = this.sortByPriority(permissionSets);

    // Merge permissions with override rules
    return this.mergePermissionSets(sortedSets);
  }

  private sortByPriority(sets: PermissionSet[]): PermissionSet[] {
    return sets.sort((a, b) => b.priority - a.priority);
  }

  private mergePermissionSets(sets: PermissionSet[]): ResolvedPermissions {
    // Implement permission merging logic
  }
}
```

#### 9.3.4 Permission Storage

```sql
-- Permission Sets
CREATE TABLE permission_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL,
  is_custom BOOLEAN DEFAULT false,
  priority INTEGER NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resource Permissions
CREATE TABLE resource_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  permission_set_id UUID REFERENCES permission_sets(id),
  grantee_type TEXT NOT NULL,
  grantee_id UUID NOT NULL,
  conditions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_resource_permissions_resource
  ON resource_permissions(resource_type, resource_id);
CREATE INDEX idx_resource_permissions_grantee
  ON resource_permissions(grantee_type, grantee_id);
```

#### 9.3.5 Permission Enforcement

```typescript
// Permission decorator for API routes
export function requirePermission(
  resourceType: string,
  action: string,
  getResourceId: (req: NextApiRequest) => string
) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextFunction
  ) {
    const resourceId = getResourceId(req);
    const userId = req.user.id;

    const hasPermission = await permissionResolver.checkPermission(
      userId,
      resourceType,
      resourceId,
      action
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: "Insufficient permissions",
      });
    }

    return next();
  };
}

// Client-side permission hook
export function usePermissions(resourceType: string, resourceId: string) {
  const [permissions, setPermissions] = useState<ResolvedPermissions | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      const resolved = await permissionResolver.resolvePermissions(
        userId,
        resourceType,
        resourceId
      );
      setPermissions(resolved);
      setLoading(false);
    };

    loadPermissions();
  }, [resourceType, resourceId]);

  return { permissions, loading };
}
```

#### 9.3.6 Permission UI Components

```typescript
// Permission-aware button
interface PermissionButtonProps {
  resourceType: string;
  resourceId: string;
  requiredPermission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

function PermissionButton({
  resourceType,
  resourceId,
  requiredPermission,
  fallback = null,
  children,
}: PermissionButtonProps) {
  const { permissions, loading } = usePermissions(resourceType, resourceId);

  if (loading) return null;

  if (!permissions?.[requiredPermission]) {
    return fallback;
  }

  return children;
}

// Permission-aware section
function PermissionSection({
  resourceType,
  resourceId,
  requiredPermission,
  children,
}: PermissionSectionProps) {
  const { permissions, loading } = usePermissions(resourceType, resourceId);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!permissions?.[requiredPermission]) {
    return null;
  }

  return <div>{children}</div>;
}
```

### 9.4 Automation System

#### 9.4.1 Automation Model

```typescript
interface Automation {
  id: string;
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  enabled: boolean;
  workspace_id: string;
  project_id?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

interface AutomationTrigger {
  type:
    | "status_change"
    | "date_reached"
    | "field_update"
    | "task_created"
    | "comment_added"
    | "recurring";
  config: Record<string, any>;
}

interface AutomationCondition {
  type: "field_value" | "user_role" | "date_range" | "custom";
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "greater_than"
    | "less_than"
    | "custom";
  value: any;
  config?: Record<string, any>;
}

interface AutomationAction {
  type:
    | "update_field"
    | "create_task"
    | "send_notification"
    | "move_item"
    | "external_webhook";
  config: Record<string, any>;
}
```

#### 9.4.2 Database Structure

```sql
-- Automations
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  trigger JSONB NOT NULL,
  conditions JSONB DEFAULT '[]'::jsonb,
  actions JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation Logs
CREATE TABLE automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_id UUID REFERENCES automations(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL,
  status TEXT NOT NULL,
  error TEXT,
  details JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_automations_workspace ON automations(workspace_id);
CREATE INDEX idx_automations_project ON automations(project_id);
CREATE INDEX idx_automation_logs_automation ON automation_logs(automation_id);
```

#### 9.4.3 Automation Engine

```typescript
class AutomationEngine {
  private queue: AutomationQueue;
  private executor: AutomationExecutor;
  private logger: AutomationLogger;

  async handleEvent(event: AutomationEvent): Promise<void> {
    // Find matching automations
    const automations = await this.findMatchingAutomations(event);

    // Queue automation runs
    for (const automation of automations) {
      await this.queue.enqueue({
        automationId: automation.id,
        event,
        context: this.buildContext(event),
      });
    }
  }

  private async findMatchingAutomations(
    event: AutomationEvent
  ): Promise<Automation[]> {
    // Find automations with matching triggers
    // Check conditions
    // Return matching automations
  }

  private buildContext(event: AutomationEvent): AutomationContext {
    // Build execution context with event data
    // Include relevant metadata
    // Return context object
  }
}

class AutomationExecutor {
  async execute(run: AutomationRun): Promise<void> {
    try {
      // Check conditions
      if (!(await this.checkConditions(run))) {
        return;
      }

      // Execute actions in sequence
      for (const action of run.automation.actions) {
        await this.executeAction(action, run.context);
      }

      // Log successful execution
      await this.logger.logSuccess(run);
    } catch (error) {
      // Log error and potentially retry
      await this.logger.logError(run, error);
    }
  }
}
```

#### 9.4.4 Built-in Automation Actions

```typescript
// Action Handlers
const actionHandlers: Record<string, ActionHandler> = {
  update_field: async (config, context) => {
    const { taskId, field, value } = config;
    await updateTaskField(taskId, field, value);
  },

  create_task: async (config, context) => {
    const { projectId, template } = config;
    await createTask(projectId, {
      ...template,
      // Interpolate variables from context
      title: interpolate(template.title, context),
      description: interpolate(template.description, context),
    });
  },

  send_notification: async (config, context) => {
    const { type, recipients, template } = config;
    await sendNotification({
      type,
      recipients,
      subject: interpolate(template.subject, context),
      body: interpolate(template.body, context),
    });
  },

  external_webhook: async (config, context) => {
    const { url, method, headers, body } = config;
    await axios({
      method,
      url,
      headers,
      data: interpolate(body, context),
    });
  },
};
```

#### 9.4.5 Automation Builder UI

```typescript
interface AutomationBuilderProps {
  workspace_id: string;
  project_id?: string;
  onSave: (automation: Automation) => void;
}

function AutomationBuilder({
  workspace_id,
  project_id,
  onSave,
}: AutomationBuilderProps) {
  const [automation, setAutomation] = useState<Partial<Automation>>({
    workspace_id,
    project_id,
    trigger: { type: "status_change", config: {} },
    conditions: [],
    actions: [],
  });

  // Builder UI components
  return (
    <div className="automation-builder">
      <TriggerSelector
        value={automation.trigger}
        onChange={(trigger) => setAutomation({ ...automation, trigger })}
      />

      <ConditionBuilder
        conditions={automation.conditions}
        onChange={(conditions) => setAutomation({ ...automation, conditions })}
      />

      <ActionBuilder
        actions={automation.actions}
        onChange={(actions) => setAutomation({ ...automation, actions })}
      />

      <Button onClick={() => onSave(automation as Automation)}>
        Save Automation
      </Button>
    </div>
  );
}
```

#### 9.4.6 Automation Testing

```typescript
interface AutomationTester {
  testAutomation(
    automation: Automation,
    testEvent: AutomationEvent
  ): Promise<TestResult>;
  validateAutomation(automation: Automation): ValidationResult;
}

class AutomationTestRunner implements AutomationTester {
  async testAutomation(
    automation: Automation,
    testEvent: AutomationEvent
  ): Promise<TestResult> {
    const context = this.buildTestContext(testEvent);
    const results: TestResult = {
      conditions: await this.testConditions(automation.conditions, context),
      actions: await this.testActions(automation.actions, context),
      performance: await this.measurePerformance(automation, context),
    };
    return results;
  }

  private async testConditions(
    conditions: AutomationCondition[],
    context: AutomationContext
  ) {
    // Test each condition
    return Promise.all(
      conditions.map((condition) => this.evaluateCondition(condition, context))
    );
  }

  private async testActions(
    actions: AutomationAction[],
    context: AutomationContext
  ) {
    // Test each action in dry-run mode
    return Promise.all(
      actions.map((action) => this.simulateAction(action, context))
    );
  }
}
```

### 9.5 Data Import/Export System

#### 9.5.1 Import System

```typescript
interface ImportConfig {
  source: "monday" | "asana" | "jira" | "trello" | "csv" | "excel";
  workspace_id: string;
  options: {
    includeAttachments: boolean;
    includeHistory: boolean;
    preserveIds: boolean;
    mappings: FieldMapping[];
  };
}

interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformer?: (value: any) => any;
}

class ImportManager {
  async import(config: ImportConfig, file: File): Promise<ImportResult> {
    // Create import job
    const job = await this.createImportJob(config);

    try {
      // Parse and validate data
      const data = await this.parseImportFile(file, config.source);

      // Transform data according to mappings
      const transformed = await this.transformData(
        data,
        config.options.mappings
      );

      // Batch import
      const result = await this.batchImport(transformed, job.id);

      return result;
    } catch (error) {
      await this.markJobFailed(job.id, error);
      throw error;
    }
  }

  private async batchImport(data: any[], jobId: string): Promise<ImportResult> {
    // Import in batches of 100
    const batches = chunk(data, 100);
    let progress = 0;

    for (const batch of batches) {
      await this.importBatch(batch, jobId);
      progress += batch.length;
      await this.updateJobProgress(jobId, progress, data.length);
    }

    return this.getImportResult(jobId);
  }
}
```

#### 9.5.2 Export System

```typescript
interface ExportConfig {
  format: "csv" | "excel" | "json";
  workspace_id: string;
  project_ids: string[];
  options: {
    includeAttachments: boolean;
    includeHistory: boolean;
    dateRange?: DateRange;
    fields: string[];
  };
}

class ExportManager {
  async export(config: ExportConfig): Promise<ExportResult> {
    // Create export job
    const job = await this.createExportJob(config);

    try {
      // Gather data
      const data = await this.gatherExportData(config);

      // Transform according to format
      const transformed = await this.transformForExport(data, config.format);

      // Generate file
      const file = await this.generateExportFile(transformed, config);

      // Store for download
      const downloadUrl = await this.storeExportFile(file, job.id);

      return { downloadUrl, ...job };
    } catch (error) {
      await this.markJobFailed(job.id, error);
      throw error;
    }
  }

  private async gatherExportData(config: ExportConfig): Promise<any[]> {
    // Gather data in batches
    const data = [];
    for (const projectId of config.project_ids) {
      const projectData = await this.gatherProjectData(
        projectId,
        config.options
      );
      data.push(projectData);
    }
    return data;
  }
}
```

#### 9.5.3 Database Structure

```sql
-- Import Jobs
CREATE TABLE import_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  source TEXT NOT NULL,
  config JSONB NOT NULL,
  progress INTEGER DEFAULT 0,
  total INTEGER,
  error TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Export Jobs
CREATE TABLE export_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  format TEXT NOT NULL,
  config JSONB NOT NULL,
  file_url TEXT,
  error TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_import_jobs_workspace ON import_jobs(workspace_id);
CREATE INDEX idx_export_jobs_workspace ON export_jobs(workspace_id);
```

#### 9.5.4 Platform-Specific Importers

```typescript
// Monday.com Importer
class MondayImporter implements PlatformImporter {
  async validateCredentials(credentials: MondayCredentials): Promise<boolean> {
    // Validate API token
    return true;
  }

  async fetchWorkspaces(credentials: MondayCredentials): Promise<Workspace[]> {
    // Fetch available workspaces
    return [];
  }

  async importWorkspace(
    credentials: MondayCredentials,
    workspaceId: string,
    config: ImportConfig
  ): Promise<ImportResult> {
    // Import workspace data
    return { success: true };
  }
}

// Asana Importer
class AsanaImporter implements PlatformImporter {
  // Similar implementation for Asana
}

// Jira Importer
class JiraImporter implements PlatformImporter {
  // Similar implementation for Jira
}
```

#### 9.5.5 Import/Export UI

```typescript
function ImportExportManager() {
  const [importConfig, setImportConfig] = useState<ImportConfig>({
    source: "monday",
    workspace_id: "",
    options: {
      includeAttachments: true,
      includeHistory: true,
      preserveIds: false,
      mappings: [],
    },
  });

  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: "csv",
    workspace_id: "",
    project_ids: [],
    options: {
      includeAttachments: true,
      includeHistory: true,
      fields: [],
    },
  });

  return (
    <div className="import-export-manager">
      <Tabs>
        <TabPanel title="Import">
          <ImportConfigForm
            config={importConfig}
            onChange={setImportConfig}
            onSubmit={handleImport}
          />
        </TabPanel>

        <TabPanel title="Export">
          <ExportConfigForm
            config={exportConfig}
            onChange={setExportConfig}
            onSubmit={handleExport}
          />
        </TabPanel>
      </Tabs>

      <JobsList />
    </div>
  );
}
```

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

### 11.1 Short-Term Goals (1-2 months)

- Project management core functionality
  - Project CRUD operations
  - Basic table view
  - Task management
  - Real-time updates
  - Authentication system
- Basic user settings and preferences
- Initial deployment and testing

### 11.2 Mid-Term Goals (2-4 months)

- Advanced project features
  - Kanban view implementation
  - View templates system
  - Comments and activity tracking
  - File attachments
  - Advanced filtering
- Performance optimization
- Mobile responsiveness

### 11.3 Long-Term Vision (4-6 months)

- Enterprise-grade features
  - Timeline/Gantt view
  - Dashboard customization
  - Custom fields
  - Automation system
  - Advanced integrations
  - White-label options
- API development
- Advanced analytics

## 12. Technical Architecture Details

### 12.1 State Management

```typescript
// Store types
interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  views: View[];
  loading: boolean;
  error: Error | null;

  // Actions
  fetchProjects: () => Promise<void>;
  createProject: (data: ProjectInput) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // View management
  switchView: (viewId: string) => void;
  updateViewConfig: (viewId: string, config: ViewConfig) => Promise<void>;

  // Real-time
  subscribeToUpdates: () => void;
  unsubscribeFromUpdates: () => void;
}

// Store implementation
export const useProjectStore = create<ProjectStore>((set, get) => ({
  // ... store implementation
}));
```

### 12.2 Real-time Implementation

```typescript
// Real-time subscription setup
const setupRealtimeSubscriptions = (projectId: string) => {
  const channel = supabase
    .channel(`project:${projectId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tasks",
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => {
        handleRealtimeUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Optimistic updates handler
const handleRealtimeUpdate = (payload: RealtimePayload) => {
  const { new: newRecord, old: oldRecord, eventType } = payload;

  switch (eventType) {
    case "INSERT":
      // Add to local state
      break;
    case "UPDATE":
      // Update local state
      break;
    case "DELETE":
      // Remove from local state
      break;
  }
};
```

## 13. Performance Optimization

### 13.1 Frontend Optimization

- **Code Organization**:

  - Atomic component design
  - Lazy-loaded views
  - Optimized bundle splitting
  - Tree-shakeable modules

- **State Management**:

  - Normalized store structure
  - Selective subscriptions
  - Optimistic updates
  - Efficient memoization

- **Rendering Optimization**:
  - Virtual scrolling for large lists
  - Debounced updates
  - Skeleton loading states
  - Progressive image loading

### 13.2 Backend Optimization

- **Database**:

  - Efficient indexing
  - Query optimization
  - Connection pooling
  - Materialized views

- **API Layer**:
  - Edge function deployment
  - Response caching
  - Batch operations
  - Rate limiting

## 14. Testing Strategy

### 14.1 Testing Levels

- **Unit Tests**:

  - Component testing
  - Store testing
  - Utility function testing
  - > 80% coverage target

- **Integration Tests**:

  - View integration
  - Store integration
  - API integration
  - Real-time testing

- **E2E Tests**:
  - Critical user paths
  - Cross-browser testing
  - Mobile testing
  - Performance testing

### 14.2 Testing Implementation

```typescript
// Component test example
describe("TaskList", () => {
  it("renders tasks correctly", () => {
    const tasks = mockTasks();
    render(<TaskList tasks={tasks} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(tasks.length);
  });

  it("handles task updates", async () => {
    const onUpdate = vi.fn();
    render(<TaskList onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    // ... test implementation
  });
});

// Store test example
describe("projectStore", () => {
  it("updates project state correctly", async () => {
    const store = useProjectStore.getState();
    await store.updateProject("123", { title: "New Title" });

    expect(store.currentProject?.title).toBe("New Title");
  });
});
```

## 15. Deployment Strategy

### 15.1 Infrastructure

- **Frontend**:

  - Netlify deployment
  - Edge functions
  - CDN distribution
  - Automatic SSL

- **Backend**:
  - Supabase cloud
  - Database backups
  - Monitoring setup
  - Logging system

### 15.2 CI/CD Pipeline

```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: netlify/actions/cli@master
      - run: netlify deploy --prod
```

## 16. Documentation

### 16.1 Technical Documentation

- API documentation
- Component documentation
- Database schema
- Architecture diagrams
- Security guidelines

### 16.2 User Documentation

- Getting started guide
- Feature guides
- Best practices
- Video tutorials
- FAQ section

## 17. Project Structure

```
pmtools.pro/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── projects/       # Project routes
│   │   │   ├── [id]/      # Project-specific routes
│   │   │   │   ├── table/     # Table view
│   ���   │   │   ├── kanban/    # Kanban view
│   │   │   │   └── settings/  # Project settings
��   │   │   ├── new/       # New project
│   │   │   └── page.tsx   # Projects list
│   │   └── account/       # Account routes
│   ├── components/        # React components
│   │   ├── projects/     # Project components
│   │   ├── views/        # View components
│   │   └── common/       # Shared components
│   ├── hooks/            # Custom hooks
│   ├── stores/           # Zustand stores
│   ├── lib/             # Utilities
│   └── types/           # TypeScript types
├── public/              # Static assets
├── tests/              # Test files
���── docs/              # Documentation
```

---

**Version**: 1.0
**Last Updated**: [Current Date]
**Status**: Development Planning

### 9.6 Mobile Experience

#### 9.6.1 Responsive Design System

```typescript
// Breakpoint configuration
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// Hook for responsive design
function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(getBreakpoint());

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}

// Responsive component wrapper
function Responsive({ breakpoint, children, fallback }: ResponsiveProps) {
  const currentBreakpoint = useBreakpoint();

  if (currentBreakpoint >= breakpoints[breakpoint]) {
    return children;
  }

  return fallback;
}
```

#### 9.6.2 Mobile-Specific Views

```typescript
// Mobile view configurations
interface MobileViewConfig {
  simplified: boolean;
  touchOptimized: boolean;
  gestureEnabled: boolean;
  compactMode: boolean;
}

// Mobile-optimized components
const MobileTaskList = styled(TaskList)`
  // Touch-friendly spacing
  row-gap: 16px;

  // Larger touch targets
  .task-item {
    min-height: 64px;
    padding: 12px;
  }

  // Optimized for thumb reach
  .actions {
    position: absolute;
    right: 16px;
    bottom: 16px;
  }
`;

const MobileKanbanBoard = styled(KanbanBoard)`
  // Horizontal scrolling for columns
  .columns-container {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }

  // Column sizing
  .column {
    min-width: 85vw;
    scroll-snap-align: start;
  }
`;
```

#### 9.6.3 Touch Interactions

```typescript
interface TouchHandler {
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void;
  onPinch?: (scale: number) => void;
  onRotate?: (angle: number) => void;
  onLongPress?: () => void;
}

// Touch gesture hook
function useTouch(ref: RefObject<HTMLElement>, handlers: TouchHandler) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const hammer = new Hammer(element);

    // Configure recognizers
    hammer.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
    hammer.get("pinch").set({ enable: true });

    // Add listeners
    if (handlers.onSwipe) {
      hammer.on("swipe", (e) => {
        const direction = getSwipeDirection(e);
        handlers.onSwipe?.(direction);
      });
    }

    // Clean up
    return () => hammer.destroy();
  }, [ref, handlers]);
}
```

#### 9.6.4 Offline Support

```typescript
interface OfflineConfig {
  tables: string[];
  maxCacheSize: number;
  syncInterval: number;
  conflictResolution: "client-wins" | "server-wins" | "manual";
}

class OfflineManager {
  private db: IDBDatabase;
  private syncQueue: SyncQueue;

  async initialize(config: OfflineConfig) {
    // Initialize IndexedDB
    this.db = await this.setupDatabase(config.tables);

    // Setup sync queue
    this.syncQueue = new SyncQueue(config.conflictResolution);

    // Start periodic sync
    this.startPeriodicSync(config.syncInterval);
  }

  private async setupDatabase(tables: string[]) {
    // Create object stores for each table
    // Setup indexes
    // Configure versioning
  }

  async handleOfflineOperation(operation: OfflineOperation) {
    // Store operation in IndexedDB
    await this.storeOperation(operation);

    // Add to sync queue
    this.syncQueue.enqueue(operation);

    // Update UI optimistically
    this.updateUI(operation);
  }
}

class SyncQueue {
  private queue: OfflineOperation[] = [];

  async sync() {
    while (this.queue.length > 0) {
      const operation = this.queue[0];

      try {
        // Attempt to sync with server
        await this.syncOperation(operation);

        // Remove from queue if successful
        this.queue.shift();
      } catch (error) {
        if (this.shouldRetry(error)) {
          // Move to end of queue
          this.queue.push(this.queue.shift()!);
        } else {
          // Handle permanent failure
          this.handleFailure(operation, error);
        }
      }
    }
  }
}
```

#### 9.6.5 Performance Optimization

```typescript
// Mobile-specific optimizations
const mobileOptimizations = {
  // Reduce bundle size
  dynamicImports: {
    enabled: true,
    threshold: 30 * 1024, // 30KB
  },

  // Optimize images
  imageOptimization: {
    maxWidth: 828, // iPhone Plus width
    quality: 80,
    formats: ["webp", "jpeg"],
  },

  // Minimize re-renders
  renderOptimization: {
    windowVirtualization: true,
    debouncedUpdates: true,
    lazyComponents: true,
  },

  // Reduce network requests
  networkOptimization: {
    batchRequests: true,
    cacheFirst: true,
    compressionEnabled: true,
  },
};

// Performance monitoring
class MobilePerformanceMonitor {
  measureTTI() {
    // Measure Time to Interactive
  }

  measureFCP() {
    // Measure First Contentful Paint
  }

  measureFID() {
    // Measure First Input Delay
  }

  measureCLS() {
    // Measure Cumulative Layout Shift
  }
}
```

#### 9.6.6 Mobile Navigation

```typescript
interface MobileNavConfig {
  bottomNav: boolean;
  gestureNav: boolean;
  compactHeader: boolean;
}

const MobileNavigation = styled.nav<MobileNavConfig>`
  // Bottom navigation bar
  ${(props) =>
    props.bottomNav &&
    css`
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: var(--surface);
      border-top: 1px solid var(--border);

      display: flex;
      justify-content: space-around;
      align-items: center;

      // Safe area padding
      padding-bottom: env(safe-area-inset-bottom);
    `}

  // Compact header
  ${(props) =>
    props.compactHeader &&
    css`
      .header {
        height: 48px;
        padding: 0 16px;

        .title {
          font-size: 16px;
        }
      }
    `}
`;
```

### 9.7 Error Handling System

#### 9.7.1 Error Types

```typescript
// Base error type
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public httpStatus: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

// Specific error types
class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

class PermissionError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "PERMISSION_ERROR", 403, details);
    this.name = "PermissionError";
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, "NOT_FOUND", 404, { resource, id });
    this.name = "NotFoundError";
  }
}
```

#### 9.7.2 Error Handling Middleware

```typescript
// API error handling
export function errorHandler(
  error: Error,
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextFunction
) {
  // Log error
  logger.error({
    error,
    request: {
      url: req.url,
      method: req.method,
      headers: req.headers,
      query: req.query,
      body: req.body,
    },
  });

  // Handle known errors
  if (error instanceof AppError) {
    return res.status(error.httpStatus).json(error.toJSON());
  }

  // Handle Supabase errors
  if (error instanceof PostgrestError) {
    return res.status(400).json({
      code: "DATABASE_ERROR",
      message: "Database operation failed",
      details: error.details,
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred",
  });
}

// Client-side error boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    errorMonitor.captureError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

#### 9.7.3 Error Recovery

```typescript
class ErrorRecoveryManager {
  private retryQueue: Map<string, RetryOperation>;
  private recoveryStrategies: Map<string, RecoveryStrategy>;

  async handleError(error: AppError, context: ErrorContext) {
    // Get recovery strategy
    const strategy = this.getRecoveryStrategy(error);

    if (strategy) {
      try {
        // Attempt recovery
        await strategy.execute(error, context);
      } catch (recoveryError) {
        // Recovery failed
        this.handleRecoveryFailure(error, recoveryError);
      }
    } else {
      // No recovery strategy available
      this.handleUnrecoverableError(error);
    }
  }

  private getRecoveryStrategy(error: AppError): RecoveryStrategy | undefined {
    return this.recoveryStrategies.get(error.code);
  }
}

interface RecoveryStrategy {
  execute(error: AppError, context: ErrorContext): Promise<void>;
  shouldRetry(error: AppError): boolean;
  getRetryDelay(attempt: number): number;
}
```

#### 9.7.4 Error Monitoring

```typescript
class ErrorMonitor {
  private buffer: ErrorEvent[] = [];
  private flushInterval: number = 5000; // 5 seconds

  constructor() {
    // Setup periodic flush
    setInterval(() => this.flush(), this.flushInterval);
  }

  captureError(error: Error, context?: any) {
    const event = this.createErrorEvent(error, context);

    // Add to buffer
    this.buffer.push(event);

    // Flush immediately if critical
    if (this.isCriticalError(error)) {
      this.flush();
    }
  }

  private async flush() {
    if (this.buffer.length === 0) return;

    try {
      // Send to monitoring service
      await this.sendEvents(this.buffer);

      // Clear buffer
      this.buffer = [];
    } catch (error) {
      // Handle flush failure
      console.error("Failed to flush error events:", error);
    }
  }
}
```

#### 9.7.5 User Feedback

```typescript
interface ErrorFeedback {
  title: string;
  message: string;
  action?: {
    label: string;
    handler: () => void;
  };
  severity: "error" | "warning" | "info";
}

function ErrorDisplay({ error }: { error: AppError }) {
  const feedback = useErrorFeedback(error);

  return (
    <Alert severity={feedback.severity}>
      <AlertTitle>{feedback.title}</AlertTitle>
      <AlertMessage>{feedback.message}</AlertMessage>
      {feedback.action && (
        <AlertAction onClick={feedback.action.handler}>
          {feedback.action.label}
        </AlertAction>
      )}
    </Alert>
  );
}

function useErrorFeedback(error: AppError): ErrorFeedback {
  // Get user-friendly error message
  const message = getErrorMessage(error);

  // Get appropriate action
  const action = getErrorAction(error);

  // Determine severity
  const severity = getErrorSeverity(error);

  return {
    title: getErrorTitle(error),
    message,
    action,
    severity,
  };
}
```

#### 9.7.6 Error Prevention

```typescript
// Input validation
const validateTask = yup.object({
  title: yup.string().required().max(200),
  description: yup.string().nullable(),
  status: yup.string().oneOf(["todo", "in_progress", "done"]),
  assignee: yup.string().uuid().nullable(),
  due_date: yup.date().nullable().min(new Date()),
});

// Type-safe API calls
async function apiCall<T>(
  endpoint: string,
  options: ApiOptions
): Promise<ApiResponse<T>> {
  try {
    // Validate input
    await validateApiInput(options);

    // Make request
    const response = await fetch(endpoint, options);

    // Validate response
    const data = await validateApiResponse<T>(response);

    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    // Transform error
    throw transformApiError(error);
  }
}

// Defensive programming
function safeOperation<T>(
  operation: () => T,
  fallback: T,
  errorHandler?: (error: Error) => void
): T {
  try {
    return operation();
  } catch (error) {
    errorHandler?.(error as Error);
    return fallback;
  }
}
```

## 6. Storage Configuration

### 6.1 Storage Buckets

```sql
-- Create storage buckets
SELECT supabase_storage.create_bucket('avatars', {'public': false});
SELECT supabase_storage.create_bucket('workspace-assets', {'public': false});
SELECT supabase_storage.create_bucket('task-attachments', {'public': false});
SELECT supabase_storage.create_bucket('exports', {'public': false});

-- Storage RLS Policies

-- Avatars bucket policies
CREATE POLICY "Avatar access for users"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'avatars' AND
  (auth.uid() = owner OR EXISTS (
    SELECT 1 FROM workspace_members wm
    WHERE wm.user_id = auth.uid()
    AND wm.workspace_id = ANY(string_to_array(path, '/', 1)::uuid[])
  ))
);

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid() = owner AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Workspace assets bucket policies
CREATE POLICY "Workspace assets access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'workspace-assets' AND
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE user_id = auth.uid()
    AND workspace_id = (storage.foldername(name))[1]::uuid
  )
);

CREATE POLICY "Workspace admins can manage assets"
ON storage.objects FOR ALL
USING (
  bucket_id = 'workspace-assets' AND
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE user_id = auth.uid()
    AND workspace_id = (storage.foldername(name))[1]::uuid
    AND role IN ('owner', 'admin')
  )
);

-- Task attachments bucket policies
CREATE POLICY "Task attachment access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'task-attachments' AND
  EXISTS (
    SELECT 1 FROM workspace_members wm
    JOIN projects p ON p.workspace_id = wm.workspace_id
    JOIN tasks t ON t.project_id = p.id
    WHERE wm.user_id = auth.uid()
    AND t.id = (storage.foldername(name))[2]::uuid
  )
);

CREATE POLICY "Project members can add attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'task-attachments' AND
  EXISTS (
    SELECT 1 FROM workspace_members wm
    JOIN projects p ON p.workspace_id = wm.workspace_id
    JOIN tasks t ON t.project_id = p.id
    WHERE wm.user_id = auth.uid()
    AND t.id = (storage.foldername(name))[2]::uuid
  )
);

-- Exports bucket policies
CREATE POLICY "Users can access their exports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'exports' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 6.2 File Configuration

```typescript
// File upload configurations
export const fileConfig = {
  // Global limits
  maxFileSize: {
    free: 5 * 1024 * 1024, // 5MB
    pro: 100 * 1024 * 1024, // 100MB
    enterprise: 500 * 1024 * 1024, // 500MB
  },

  // Allowed file types by bucket
  allowedTypes: {
    avatars: ["image/jpeg", "image/png", "image/gif"],
    "workspace-assets": ["image/jpeg", "image/png", "image/svg+xml"],
    "task-attachments": [
      // Images
      "image/jpeg",
      "image/png",
      "image/gif",
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // Archives
      "application/zip",
      "application/x-rar-compressed",
    ],
    exports: ["application/json", "text/csv", "application/vnd.ms-excel"],
  },

  // Storage limits by tier
  storageLimits: {
    free: 1 * 1024 * 1024 * 1024, // 1GB
    pro: 50 * 1024 * 1024 * 1024, // 50GB
    enterprise: 1024 * 1024 * 1024 * 1024, // 1TB
  },

  // Image processing
  imageProcessing: {
    avatar: {
      maxDimension: 256,
      quality: 0.8,
      format: "webp",
    },
    workspaceLogo: {
      maxDimension: 512,
      quality: 0.9,
      format: "webp",
    },
    taskAttachment: {
      maxDimension: 2048,
      quality: 0.8,
      format: "webp",
    },
  },

  // Virus scanning configuration
  virusScan: {
    enabled: true,
    maxScanSize: 100 * 1024 * 1024, // 100MB
    quarantineBucket: "quarantine",
    scanTimeout: 30000, // 30 seconds
  },

  // File naming
  naming: {
    pattern: "${timestamp}-${uuid}-${sanitizedName}",
    maxLength: 255,
    sanitization: {
      replacements: [[/[^a-zA-Z0-9-_.]/g, "-"]],
      maxConsecutiveDashes: 1,
    },
  },
};

// File upload handler
export async function handleFileUpload(
  file: File,
  bucket: string,
  path: string,
  options: UploadOptions
): Promise<UploadResult> {
  // Validate file size
  const tier = await getUserTier(auth.uid());
  if (file.size > fileConfig.maxFileSize[tier]) {
    throw new ValidationError("File size exceeds limit");
  }

  // Validate file type
  if (!fileConfig.allowedTypes[bucket].includes(file.type)) {
    throw new ValidationError("File type not allowed");
  }

  // Check storage quota
  const currentUsage = await getStorageUsage(auth.uid());
  if (currentUsage + file.size > fileConfig.storageLimits[tier]) {
    throw new ValidationError("Storage quota exceeded");
  }

  // Process image if applicable
  let processedFile = file;
  if (file.type.startsWith("image/")) {
    processedFile = await processImage(
      file,
      fileConfig.imageProcessing[bucket]
    );
  }

  // Scan for viruses if enabled
  if (
    fileConfig.virusScan.enabled &&
    file.size <= fileConfig.virusScan.maxScanSize
  ) {
    const isSafe = await scanFile(processedFile);
    if (!isSafe) {
      throw new SecurityError("File failed security scan");
    }
  }

  // Generate safe filename
  const fileName = generateFileName(file.name, fileConfig.naming);

  // Upload file
  const result = await supabase.storage
    .from(bucket)
    .upload(`${path}/${fileName}`, processedFile, {
      cacheControl: "3600",
      upsert: false,
    });

  return result;
}
```

## 7. Edge Functions

### 7.1 Edge Function Setup

```sql
-- Create edge function schema
CREATE SCHEMA IF NOT EXISTS edge;

-- Create edge function logging table
CREATE TABLE edge.function_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  function_name TEXT NOT NULL,
  status TEXT NOT NULL,
  duration INTEGER NOT NULL,
  error TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for monitoring
CREATE INDEX idx_edge_function_logs ON edge.function_logs(function_name, status, created_at);
```

### 7.2 Core Edge Functions

```typescript
// Project Analytics Function
export async function projectAnalytics(req: Request) {
  const { projectId, timeRange, metrics } = await req.json();

  try {
    const startTime = performance.now();

    // Fetch raw data
    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .gte("created_at", timeRange.start)
      .lte("created_at", timeRange.end);

    // Complex computations
    const analytics = await Promise.all(
      metrics.map(async (metric) => {
        switch (metric) {
          case "velocity":
            return calculateVelocity(tasks);
          case "cycletime":
            return calculateCycleTime(tasks);
          case "burndown":
            return generateBurndownData(tasks);
          // ... other metrics
        }
      })
    );

    // Log success
    await logEdgeFunction("projectAnalytics", {
      duration: performance.now() - startTime,
      status: "success",
      metadata: { projectId, metrics },
    });

    return new Response(JSON.stringify(analytics), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log error
    await logEdgeFunction("projectAnalytics", {
      duration: performance.now() - startTime,
      status: "error",
      error: error.message,
      metadata: { projectId, metrics },
    });

    throw error;
  }
}

// PDF Export Function
export async function generateProjectPDF(req: Request) {
  const { projectId, template, options } = await req.json();

  try {
    const startTime = performance.now();

    // Fetch project data
    const projectData = await fetchProjectData(projectId);

    // Generate PDF using Puppeteer
    const pdf = await generatePDF(projectData, template, options);

    // Upload to storage
    const { data: file } = await supabase.storage
      .from("exports")
      .upload(`${auth.uid()}/${projectId}/${Date.now()}.pdf`, pdf);

    // Log success
    await logEdgeFunction("generateProjectPDF", {
      duration: performance.now() - startTime,
      status: "success",
      metadata: { projectId, template },
    });

    return new Response(JSON.stringify({ fileUrl: file.publicUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log error
    await logEdgeFunction("generateProjectPDF", {
      duration: performance.now() - startTime,
      status: "error",
      error: error.message,
      metadata: { projectId, template },
    });

    throw error;
  }
}

// Notification Dispatcher Function
export async function dispatchNotifications(req: Request) {
  const { notifications } = await req.json();

  try {
    const startTime = performance.now();

    // Group notifications by type
    const grouped = groupNotificationsByType(notifications);

    // Process each type in parallel
    await Promise.all([
      // Email notifications
      processEmailNotifications(grouped.email),

      // Push notifications
      processPushNotifications(grouped.push),

      // Slack notifications
      processSlackNotifications(grouped.slack),

      // In-app notifications
      processInAppNotifications(grouped.inApp),
    ]);

    // Log success
    await logEdgeFunction("dispatchNotifications", {
      duration: performance.now() - startTime,
      status: "success",
      metadata: { count: notifications.length },
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log error
    await logEdgeFunction("dispatchNotifications", {
      duration: performance.now() - startTime,
      status: "error",
      error: error.message,
      metadata: { count: notifications.length },
    });

    throw error;
  }
}

// Webhook Handler Function
export async function handleWebhook(req: Request) {
  const { integration, payload, signature } = await req.json();

  try {
    const startTime = performance.now();

    // Verify webhook signature
    verifyWebhookSignature(payload, signature, integration);

    // Process webhook based on integration
    const result = await processWebhook(integration, payload);

    // Log success
    await logEdgeFunction("handleWebhook", {
      duration: performance.now() - startTime,
      status: "success",
      metadata: { integration, type: payload.type },
    });

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log error
    await logEdgeFunction("handleWebhook", {
      duration: performance.now() - startTime,
      status: "error",
      error: error.message,
      metadata: { integration, type: payload.type },
    });

    throw error;
  }
}
```

### 7.3 Edge Function Utilities

```typescript
// Edge function logging utility
async function logEdgeFunction(
  functionName: string,
  { duration, status, error = null, metadata = {} }: EdgeFunctionLog
) {
  await supabase.from("edge.function_logs").insert({
    function_name: functionName,
    status,
    duration: Math.round(duration),
    error,
    metadata,
  });
}

// Error handling wrapper
function withErrorHandling(fn: EdgeFunction): EdgeFunction {
  return async (req: Request) => {
    const startTime = performance.now();
    try {
      const result = await fn(req);
      return result;
    } catch (error) {
      await logEdgeFunction(fn.name, {
        duration: performance.now() - startTime,
        status: "error",
        error: error.message,
      });

      return new Response(
        JSON.stringify({
          error: error.message,
          code: error.code || "INTERNAL_ERROR",
        }),
        {
          status: error.status || 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}

// Rate limiting middleware
function withRateLimit(
  fn: EdgeFunction,
  { max, window }: RateLimitOptions
): EdgeFunction {
  return async (req: Request) => {
    const ip = req.headers.get("x-real-ip");
    const key = `ratelimit:${fn.name}:${ip}`;

    // Check rate limit
    const current = (await KV.get(key)) || 0;
    if (current >= max) {
      throw new RateLimitError();
    }

    // Increment counter
    await KV.incr(key);
    await KV.expire(key, window);

    return fn(req);
  };
}
```

// ... continue with sections 8 (Subscription & Payment) and beyond ...

## 8. Subscription & Payment System

### 8.1 Subscription Tables

```sql
-- Create subscription schema
CREATE SCHEMA IF NOT EXISTS billing;

-- Subscription Plans
CREATE TABLE billing.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  features JSONB NOT NULL,
  limits JSONB NOT NULL,
  price_monthly INTEGER NOT NULL,
  price_yearly INTEGER NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace Subscriptions
CREATE TABLE billing.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES billing.plans(id),
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_method_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription Invoices
CREATE TABLE billing.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES billing.subscriptions(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  stripe_invoice_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  billing_reason TEXT,
  invoice_pdf TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Records
CREATE TABLE billing.usage_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES billing.subscriptions(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_subscriptions_workspace ON billing.subscriptions(workspace_id);
CREATE INDEX idx_subscriptions_status ON billing.subscriptions(status);
CREATE INDEX idx_invoices_subscription ON billing.invoices(subscription_id);
CREATE INDEX idx_invoices_workspace ON billing.invoices(workspace_id);
CREATE INDEX idx_usage_records_workspace ON billing.usage_records(workspace_id);
CREATE INDEX idx_usage_records_metric ON billing.usage_records(metric, recorded_at);
```

### 8.2 Subscription RLS Policies

```sql
-- Plans Security
ALTER TABLE billing.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public plans are viewable by all"
  ON billing.plans FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admins can manage plans"
  ON billing.plans FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.is_admin = true
    )
  );

-- Subscriptions Security
ALTER TABLE billing.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view subscriptions"
  ON billing.subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = billing.subscriptions.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace admins can manage subscriptions"
  ON billing.subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = billing.subscriptions.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- Invoices Security
ALTER TABLE billing.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view invoices"
  ON billing.invoices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = billing.invoices.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Usage Records Security
ALTER TABLE billing.usage_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view usage"
  ON billing.usage_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = billing.usage_records.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );
```

### 8.3 Stripe Integration

```typescript
// Stripe webhook handler
export async function handleStripeWebhook(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const payload = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCancellation(event.data.object);
        break;

      case "invoice.paid":
        await handleSuccessfulPayment(event.data.object);
        break;

      case "invoice.payment_failed":
        await handleFailedPayment(event.data.object);
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Webhook Error" }), {
      status: 400,
    });
  }
}

// Subscription management
export class SubscriptionManager {
  async createSubscription(
    workspaceId: string,
    planCode: string,
    paymentMethodId: string
  ) {
    // Get workspace and plan details
    const [workspace, plan] = await Promise.all([
      this.getWorkspace(workspaceId),
      this.getPlan(planCode),
    ]);

    // Get or create Stripe customer
    let stripeCustomerId = workspace.billing?.stripe_customer_id;
    if (!stripeCustomerId) {
      const customer = await this.createStripeCustomer(workspace);
      stripeCustomerId = customer.id;
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: plan.stripe_price_id }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      metadata: {
        workspace_id: workspaceId,
      },
    });

    // Save subscription details
    await this.saveSubscription(subscription);

    return subscription;
  }

  async cancelSubscription(workspaceId: string) {
    const subscription = await this.getActiveSubscription(workspaceId);

    if (!subscription) {
      throw new Error("No active subscription found");
    }

    // Cancel at period end
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Update local record
    await supabase
      .from("billing.subscriptions")
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id);
  }

  async updateSubscription(workspaceId: string, planCode: string) {
    const [subscription, newPlan] = await Promise.all([
      this.getActiveSubscription(workspaceId),
      this.getPlan(planCode),
    ]);

    if (!subscription) {
      throw new Error("No active subscription found");
    }

    // Update subscription
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        items: [
          {
            id: subscription.stripe_subscription_item_id,
            price: newPlan.stripe_price_id,
          },
        ],
        proration_behavior: "always_invoice",
      }
    );

    // Update local record
    await this.saveSubscription(updatedSubscription);

    return updatedSubscription;
  }
}

// Usage tracking
export class UsageTracker {
  async trackUsage(workspaceId: string, metric: string, quantity: number) {
    // Record usage
    await supabase.from("billing.usage_records").insert({
      workspace_id: workspaceId,
      metric,
      quantity,
    });

    // Check if usage exceeds limits
    const exceeded = await this.checkUsageLimits(workspaceId, metric);
    if (exceeded) {
      await this.notifyUsageLimit(workspaceId, metric);
    }
  }

  async getUsageSummary(
    workspaceId: string,
    timeRange: { start: Date; end: Date }
  ) {
    const { data: records } = await supabase
      .from("billing.usage_records")
      .select("*")
      .eq("workspace_id", workspaceId)
      .gte("recorded_at", timeRange.start.toISOString())
      .lte("recorded_at", timeRange.end.toISOString());

    return this.summarizeUsage(records);
  }
}

// Invoice generation
export class InvoiceGenerator {
  async generateInvoice(invoiceId: string) {
    const invoice = await this.getInvoice(invoiceId);

    // Generate PDF
    const pdf = await this.createInvoicePDF(invoice);

    // Upload to storage
    const { data: file } = await supabase.storage
      .from("invoices")
      .upload(`${invoice.workspace_id}/${invoice.id}.pdf`, pdf, {
        contentType: "application/pdf",
      });

    // Update invoice record
    await supabase
      .from("billing.invoices")
      .update({
        invoice_pdf: file.path,
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);

    return file.path;
  }
}
```

### 8.4 Plan Configuration

```typescript
// Plan definitions
export const plans = {
  free: {
    name: "Free",
    code: "free",
    features: {
      projects: true,
      views: ["table", "kanban"],
      storage: "1GB",
      members: "5",
      history: "30 days",
    },
    limits: {
      projects: 2,
      storage_mb: 1024,
      members_per_workspace: 5,
      history_days: 30,
    },
    price_monthly: 0,
    price_yearly: 0,
  },
  pro: {
    name: "Pro",
    code: "pro",
    features: {
      projects: true,
      views: ["table", "kanban", "timeline", "calendar", "dashboard"],
      storage: "50GB",
      members: "Unlimited",
      history: "1 year",
      customFields: true,
      automations: true,
      api: true,
    },
    limits: {
      projects: -1,
      storage_mb: 51200,
      members_per_workspace: -1,
      history_days: 365,
      custom_fields_per_project: 50,
      automations_per_workspace: 100,
      api_requests_per_day: 10000,
    },
    price_monthly: 1000, // $10.00
    price_yearly: 9600, // $96.00 ($8.00/month)
  },
  enterprise: {
    name: "Enterprise",
    code: "enterprise",
    features: {
      projects: true,
      views: ["table", "kanban", "timeline", "calendar", "dashboard"],
      storage: "1TB",
      members: "Unlimited",
      history: "Unlimited",
      customFields: true,
      automations: true,
      api: true,
      sso: true,
      audit: true,
      dedicated: true,
    },
    limits: {
      projects: -1,
      storage_mb: 1048576,
      members_per_workspace: -1,
      history_days: -1,
      custom_fields_per_project: -1,
      automations_per_workspace: -1,
      api_requests_per_day: -1,
    },
    price_monthly: null, // Custom pricing
    price_yearly: null,
  },
};

// Feature flag system
export class FeatureManager {
  async hasFeature(workspaceId: string, feature: string): Promise<boolean> {
    const subscription = await this.getActiveSubscription(workspaceId);
    if (!subscription) {
      return this.hasFeatureInPlan("free", feature);
    }
    return this.hasFeatureInPlan(subscription.plan_code, feature);
  }

  async checkLimit(
    workspaceId: string,
    limit: string,
    value: number
  ): Promise<boolean> {
    const subscription = await this.getActiveSubscription(workspaceId);
    const plan = subscription ? subscription.plan_code : "free";
    const limitValue = plans[plan].limits[limit];

    // -1 means unlimited
    if (limitValue === -1) return true;

    return value <= limitValue;
  }
}
```

### 8.5 Payment Processing

```typescript
// Payment handler
export class PaymentProcessor {
  async handlePaymentIntent(paymentIntentId: string, workspaceId: string) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      await this.processSuccessfulPayment(paymentIntent, workspaceId);
    } else if (paymentIntent.status === "requires_payment_method") {
      await this.handleFailedPayment(paymentIntent, workspaceId);
    }

    return paymentIntent;
  }

  async createSetupIntent(workspaceId: string) {
    const workspace = await this.getWorkspace(workspaceId);

    // Get or create customer
    let stripeCustomerId = workspace.billing?.stripe_customer_id;
    if (!stripeCustomerId) {
      const customer = await this.createStripeCustomer(workspace);
      stripeCustomerId = customer.id;
    }

    // Create setup intent
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      metadata: {
        workspace_id: workspaceId,
      },
    });

    return setupIntent;
  }

  async updatePaymentMethod(workspaceId: string, paymentMethodId: string) {
    const subscription = await this.getActiveSubscription(workspaceId);

    if (!subscription) {
      throw new Error("No active subscription found");
    }

    // Update default payment method
    await stripe.customers.update(subscription.stripe_customer_id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Update subscription
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      default_payment_method: paymentMethodId,
    });

    // Update local record
    await supabase
      .from("billing.subscriptions")
      .update({
        payment_method_id: paymentMethodId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id);
  }
}
```

// ... continue with remaining sections ...

## 9. Real-time Notification System

### 9.1 Notification Tables

```sql
-- Create notification schema
CREATE SCHEMA IF NOT EXISTS notifications;

-- Notification Templates
CREATE TABLE notifications.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  title_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  actions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Notifications
CREATE TABLE notifications.user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES notifications.templates(id),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  actions JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification Preferences
CREATE TABLE notifications.preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, workspace_id, category)
);

-- Notification Channels
CREATE TABLE notifications.channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_notifications_user ON notifications.user_notifications(user_id, created_at DESC);
CREATE INDEX idx_user_notifications_workspace ON notifications.user_notifications(workspace_id);
CREATE INDEX idx_notification_preferences_user ON notifications.preferences(user_id);
CREATE INDEX idx_notification_preferences_workspace ON notifications.preferences(workspace_id);
CREATE INDEX idx_notification_channels_user ON notifications.channels(user_id);
```

### 9.2 Notification RLS Policies

```sql
-- Templates Security
ALTER TABLE notifications.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by all authenticated users"
  ON notifications.templates FOR SELECT
  USING (auth.role() = 'authenticated');

-- User Notifications Security
ALTER TABLE notifications.user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications.user_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications.user_notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Preferences Security
ALTER TABLE notifications.preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their notification preferences"
  ON notifications.preferences FOR ALL
  USING (auth.uid() = user_id);

-- Channels Security
ALTER TABLE notifications.channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their notification channels"
  ON notifications.channels FOR ALL
  USING (auth.uid() = user_id);
```

### 9.3 Notification Manager

```typescript
// Notification manager class
export class NotificationManager {
  private readonly templates: Map<string, NotificationTemplate>;
  private readonly channels: Map<string, NotificationChannel>;

  constructor() {
    this.templates = new Map();
    this.channels = new Map();
    this.loadTemplates();
    this.initializeChannels();
  }

  async notify(userId: string, templateCode: string, data: NotificationData) {
    const template = this.templates.get(templateCode);
    if (!template) {
      throw new Error(`Template ${templateCode} not found`);
    }

    // Get user preferences
    const preferences = await this.getUserPreferences(
      userId,
      data.workspace_id,
      template.category
    );

    // Create notification content
    const content = this.createNotificationContent(template, data);

    // Send through enabled channels
    const deliveryPromises = [];

    if (preferences.in_app_enabled) {
      deliveryPromises.push(
        this.createInAppNotification(userId, content, data)
      );
    }

    if (preferences.email_enabled) {
      deliveryPromises.push(this.sendEmailNotification(userId, content, data));
    }

    if (preferences.push_enabled) {
      deliveryPromises.push(this.sendPushNotification(userId, content, data));
    }

    // Wait for all deliveries to complete
    await Promise.all(deliveryPromises);

    // Track delivery
    await this.trackNotificationDelivery(userId, templateCode, data);
  }

  async markAsRead(userId: string, notificationId: string) {
    await supabase
      .from("notifications.user_notifications")
      .update({
        read_at: new Date().toISOString(),
      })
      .match({
        id: notificationId,
        user_id: userId,
      });
  }

  async archiveNotification(userId: string, notificationId: string) {
    await supabase
      .from("notifications.user_notifications")
      .update({
        archived_at: new Date().toISOString(),
      })
      .match({
        id: notificationId,
        user_id: userId,
      });
  }

  async updatePreferences(
    userId: string,
    workspaceId: string,
    preferences: NotificationPreferences
  ) {
    const { data, error } = await supabase
      .from("notifications.preferences")
      .upsert({
        user_id: userId,
        workspace_id: workspaceId,
        ...preferences,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    return data;
  }

  async addChannel(userId: string, channel: NotificationChannel) {
    const { data, error } = await supabase
      .from("notifications.channels")
      .insert({
        user_id: userId,
        type: channel.type,
        name: channel.name,
        config: channel.config,
      });

    if (error) throw error;
    return data;
  }

  private async createInAppNotification(
    userId: string,
    content: NotificationContent,
    data: NotificationData
  ) {
    const { error } = await supabase
      .from("notifications.user_notifications")
      .insert({
        user_id: userId,
        workspace_id: data.workspace_id,
        title: content.title,
        body: content.body,
        category: content.category,
        icon: content.icon,
        color: content.color,
        actions: content.actions,
        metadata: data,
      });

    if (error) throw error;

    // Broadcast real-time notification
    await supabase
      .from("user_notifications")
      .on("INSERT", { event: "notification", user_id: userId })
      .subscribe();
  }

  private async sendEmailNotification(
    userId: string,
    content: NotificationContent,
    data: NotificationData
  ) {
    const emailChannel = this.channels.get("email");
    if (!emailChannel) return;

    const user = await this.getUser(userId);
    if (!user.email) return;

    await emailChannel.send({
      to: user.email,
      subject: content.title,
      html: await this.renderEmailTemplate(content, data),
    });
  }

  private async sendPushNotification(
    userId: string,
    content: NotificationContent,
    data: NotificationData
  ) {
    const pushChannel = this.channels.get("push");
    if (!pushChannel) return;

    const tokens = await this.getPushTokens(userId);
    if (!tokens.length) return;

    await pushChannel.send({
      tokens,
      title: content.title,
      body: content.body,
      data: {
        category: content.category,
        workspace_id: data.workspace_id,
        ...data,
      },
    });
  }

  private createNotificationContent(
    template: NotificationTemplate,
    data: NotificationData
  ): NotificationContent {
    return {
      title: this.renderTemplate(template.title_template, data),
      body: this.renderTemplate(template.body_template, data),
      category: template.category,
      icon: template.icon,
      color: template.color,
      actions: template.actions,
    };
  }

  private renderTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\${(\w+)}/g, (_, key) => data[key] || "");
  }

  private async trackNotificationDelivery(
    userId: string,
    templateCode: string,
    data: NotificationData
  ) {
    await supabase.rpc("track_notification_delivery", {
      p_user_id: userId,
      p_template_code: templateCode,
      p_workspace_id: data.workspace_id,
      p_metadata: data,
    });
  }
}

// Notification templates
const notificationTemplates = {
  task_assigned: {
    code: "task_assigned",
    title_template: "${assigner_name} assigned you a task",
    body_template: 'You have been assigned "${task_name}" in ${project_name}',
    category: "task",
    icon: "assignment",
    color: "#4CAF50",
    actions: [
      {
        label: "View Task",
        url: "/projects/${project_id}/tasks/${task_id}",
      },
    ],
  },
  task_commented: {
    code: "task_commented",
    title_template: "${commenter_name} commented on a task",
    body_template:
      '${commenter_name} commented on "${task_name}": ${comment_preview}',
    category: "task",
    icon: "comment",
    color: "#2196F3",
    actions: [
      {
        label: "View Comment",
        url: "/projects/${project_id}/tasks/${task_id}#comment-${comment_id}",
      },
    ],
  },
  due_date_approaching: {
    code: "due_date_approaching",
    title_template: "Task due soon: ${task_name}",
    body_template: 'The task "${task_name}" is due in ${time_until_due}',
    category: "reminder",
    icon: "schedule",
    color: "#FF9800",
    actions: [
      {
        label: "View Task",
        url: "/projects/${project_id}/tasks/${task_id}",
      },
    ],
  },
  project_milestone: {
    code: "project_milestone",
    title_template: "Project milestone reached: ${milestone_name}",
    body_template:
      'The project "${project_name}" has reached the milestone: ${milestone_name}',
    category: "project",
    icon: "flag",
    color: "#9C27B0",
    actions: [
      {
        label: "View Project",
        url: "/projects/${project_id}",
      },
    ],
  },
  workspace_invitation: {
    code: "workspace_invitation",
    title_template: "${inviter_name} invited you to ${workspace_name}",
    body_template:
      'You have been invited to join the workspace "${workspace_name}"',
    category: "workspace",
    icon: "group_add",
    color: "#673AB7",
    actions: [
      {
        label: "Accept Invitation",
        url: "/invitations/${invitation_id}",
      },
    ],
  },
};

// Email templates
const emailTemplates = {
  task_assigned: {
    subject: "${assigner_name} assigned you a task",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Task Assignment</h2>
        <p>Hi ${user_name},</p>
        <p>${assigner_name} has assigned you a task in ${project_name}:</p>
        <div style="margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 5px;">
          <h3 style="margin: 0;">${task_name}</h3>
          <p style="margin: 10px 0 0;">${task_description}</p>
          <p style="margin: 10px 0 0;"><strong>Due Date:</strong> ${due_date}</p>
        </div>
        <a href="${task_url}" style="display: inline-block; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
          View Task
        </a>
      </div>
    `,
  },
  // ... other email templates
};

// Push notification configuration
const pushConfig = {
  vapid: {
    subject: "mailto:support@pmtools.pro",
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  },
};
```

### 9.4 Real-time Updates

````typescript
// Real-time update manager
export class RealtimeManager {
  private readonly channels: Map<string, RealtimeChannel>;
  private readonly subscriptions: Map<string, RealtimeSubscription>;

  constructor() {
    this.channels = new Map();
    this.subscriptions = new Map();
  }

  async subscribe(channelId: string, callback: (payload: any) => void) {
    // Create subscription
    const subscription = supabase
      .channel(channelId)
      .on("broadcast", { event: "update" }, callback)
      .subscribe();

    // Store subscription
    this.subscriptions.set(channelId, subscription);

    return () => this.unsubscribe(channelId);
  }

  async unsubscribe(channelId: string) {
    const subscription = this.subscriptions.get(channelId);
    if (subscription) {
      await subscription.unsubscribe();
      this.subscriptions.delete(channelId);
    }
  }

  async broadcast(channelId: string, payload: any) {
    const channel = this.channels.get(channelId);
    if (!channel) {
      throw new Error(`Channel ${channelId} not found`);
    }

    await channel.send({
      type: "broadcast",
      event: "update",
      payload,
    });
  }

  getWorkspaceChannel(workspaceId: string): string {
    return `workspace:${workspaceId}`;
  }

  getProjectChannel(projectId: string): string {
    return `project:${projectId}`;
  }

  getTaskChannel(taskId: string): string {
    return `task:${taskId}`;
  }

  getUserChannel(userId: string): string {
    return `user:${userId}`;
  }
}

// Database change listeners
export class DatabaseChangeListener {
  private readonly realtimeManager: RealtimeManager;

  constructor(realtimeManager: RealtimeManager) {
    this.realtimeManager = realtimeManager;
  }

  async initialize() {
    // Listen for task changes
    supabase
      .from("tasks")
      .on("*", async (payload) => {
        const { new: newRecord, old: oldRecord, eventType } = payload;

        // Broadcast to project channel
        await this.realtimeManager.broadcast(
          this.realtimeManager.getProjectChannel(newRecord.project_id),
          {
            type: "task",
            event: eventType,
            data: {
              old: oldRecord,
              new: newRecord,
            },
          }
        );

        // Broadcast to task channel
        await this.realtimeManager.broadcast(
          this.realtimeManager.getTaskChannel(newRecord.id),
          {
            type: "task",
            event: eventType,
            data: {
              old: oldRecord,
              new: newRecord,
            },
          }
        );
      })
      .subscribe();

    // Listen for project changes
    supabase
      .from("projects")
      .on("*", async (payload) => {
        const { new: newRecord, old: oldRecord, eventType } = payload;

        // Broadcast to workspace channel
        await this.realtimeManager.broadcast(
          this.realtimeManager.getWorkspaceChannel(newRecord.workspace_id),
          {
            type: "project",
            event: eventType,
            data: {
              old: oldRecord,
              new: newRecord,
            },
          }
        );

        // Broadcast to project channel
        await this.realtimeManager.broadcast(
          this.realtimeManager.getProjectChannel(newRecord.id),
          {
            type: "project",
            event: eventType,
            data: {
              old: oldRecord,
              new: newRecord,
            },
          }
        );
      })
      .subscribe();

    // Listen for workspace changes
    supabase
      .from("workspaces")
      .on("*", async (payload) => {
        const { new: newRecord, old: oldRecord, eventType } = payload;

        // Broadcast to workspace channel
        await this.realtimeManager.broadcast(
          this.realtimeManager.getWorkspaceChannel(newRecord.id),
          {
            type: "workspace",
            event: eventType,
            data: {
              old: oldRecord,
              new: newRecord,
            },
          }
        );
      })
      .subscribe();
  }
}

// Client-side real-time handler
export class RealtimeHandler {
  private readonly realtimeManager: RealtimeManager;
  private readonly store: Store;

  constructor(realtimeManager: RealtimeManager, store: Store) {
    this.realtimeManager = realtimeManager;
    this.store = store;
  }

  async subscribeToWorkspace(workspaceId: string) {
    return this.realtimeManager.subscribe(
      this.realtimeManager.getWorkspaceChannel(workspaceId),
      (payload) => {
        switch (payload.type) {
          case "project":
            this.handleProjectUpdate(payload);
            break;
          case "member":
            this.handleMemberUpdate(payload);
            break;
          // ... handle other workspace-level updates
        }
      }
    );
  }

  async subscribeToProject(projectId: string) {
    return this.realtimeManager.subscribe(
      this.realtimeManager.getProjectChannel(projectId),
      (payload) => {
        switch (payload.type) {
          case "task":
            this.handleTaskUpdate(payload);
            break;
          case "comment":
            this.handleCommentUpdate(payload);
            break;
          // ... handle other project-level updates
        }
      }
    );
  }

  private handleProjectUpdate(payload: any) {
    const { event, data } = payload;
    switch (event) {
      case "INSERT":
        this.store.dispatch("projects/addProject", data.new);
        break;
      case "UPDATE":
        this.store.dispatch("projects/updateProject", data.new);
        break;
      case "DELETE":
        this.store.dispatch("projects/removeProject", data.old.id);
        break;
    }
  }

  private handleTaskUpdate(payload: any) {
    const { event, data } = payload;
    switch (event) {
      case "INSERT":
        this.store.dispatch("tasks/addTask", data.new);
        break;
      case "UPDATE":
        this.store.dispatch("tasks/updateTask", data.new);
        break;
      case "DELETE":
        this.store.dispatch("tasks/removeTask", data.old.id);
        break;
    }
  }
}

// ... continue with remaining sections ...

## 10. Integration System

### 10.1 Integration Tables

```sql
-- Create integration schema
CREATE SCHEMA IF NOT EXISTS integrations;

-- Integration Providers
CREATE TABLE integrations.providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  config_schema JSONB NOT NULL,
  features JSONB NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace Integrations
CREATE TABLE integrations.workspace_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES integrations.providers(id),
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  status TEXT NOT NULL,
  last_sync_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration Webhooks
CREATE TABLE integrations.webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_id UUID REFERENCES integrations.workspace_integrations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration Sync Logs
CREATE TABLE integrations.sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_id UUID REFERENCES integrations.workspace_integrations(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_workspace_integrations_workspace ON integrations.workspace_integrations(workspace_id);
CREATE INDEX idx_workspace_integrations_provider ON integrations.workspace_integrations(provider_id);
CREATE INDEX idx_webhooks_integration ON integrations.webhooks(integration_id);
CREATE INDEX idx_sync_logs_integration ON integrations.sync_logs(integration_id, created_at DESC);
````

### 10.2 Integration RLS Policies

```sql
-- Providers Security
ALTER TABLE integrations.providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers are viewable by all authenticated users"
  ON integrations.providers FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    is_enabled = true
  );

-- Workspace Integrations Security
ALTER TABLE integrations.workspace_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view integrations"
  ON integrations.workspace_integrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = integrations.workspace_integrations.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace admins can manage integrations"
  ON integrations.workspace_integrations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = integrations.workspace_integrations.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- Webhooks Security
ALTER TABLE integrations.webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace admins can manage webhooks"
  ON integrations.webhooks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN integrations.workspace_integrations wi ON wi.workspace_id = wm.workspace_id
      WHERE wi.id = integrations.webhooks.integration_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
    )
  );

-- Sync Logs Security
ALTER TABLE integrations.sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view sync logs"
  ON integrations.sync_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN integrations.workspace_integrations wi ON wi.workspace_id = wm.workspace_id
      WHERE wi.id = integrations.sync_logs.integration_id
      AND wm.user_id = auth.uid()
    )
  );
```

### 10.3 Integration Manager

```typescript
// Integration manager class
export class IntegrationManager {
  private readonly providers: Map<string, IntegrationProvider>;
  private readonly syncHandlers: Map<string, SyncHandler>;

  constructor() {
    this.providers = new Map();
    this.syncHandlers = new Map();
    this.initializeProviders();
  }

  async createIntegration(
    workspaceId: string,
    providerCode: string,
    config: IntegrationConfig
  ) {
    const provider = this.providers.get(providerCode);
    if (!provider) {
      throw new Error(`Provider ${providerCode} not found`);
    }

    // Validate config against schema
    this.validateConfig(config, provider.config_schema);

    // Create integration
    const { data: integration, error } = await supabase
      .from("integrations.workspace_integrations")
      .insert({
        workspace_id: workspaceId,
        provider_id: provider.id,
        name: config.name || provider.name,
        config,
        status: "pending",
      })
      .single();

    if (error) throw error;

    // Initialize integration
    await this.initializeIntegration(integration.id);

    return integration;
  }

  async syncIntegration(integrationId: string, syncType: string = "full") {
    const integration = await this.getIntegration(integrationId);
    const provider = this.providers.get(integration.provider_code);

    // Start sync
    const syncLog = await this.createSyncLog(integrationId, syncType);

    try {
      const handler = this.syncHandlers.get(integration.provider_code);
      if (!handler) {
        throw new Error(`No sync handler for ${integration.provider_code}`);
      }

      // Perform sync
      await handler.sync(integration, syncType);

      // Update sync log
      await this.completeSyncLog(syncLog.id, "success");

      // Update integration
      await this.updateIntegrationStatus(integrationId, "active");
    } catch (error) {
      // Log error
      await this.completeSyncLog(syncLog.id, "error", error.message);

      // Update integration
      await this.updateIntegrationStatus(integrationId, "error", error.message);

      throw error;
    }
  }

  async createWebhook(integrationId: string, eventType: string, url: string) {
    const secret = this.generateWebhookSecret();

    const { data: webhook, error } = await supabase
      .from("integrations.webhooks")
      .insert({
        integration_id: integrationId,
        event_type: eventType,
        url,
        secret,
      })
      .single();

    if (error) throw error;
    return webhook;
  }

  async handleWebhook(webhookId: string, payload: any, signature: string) {
    const webhook = await this.getWebhook(webhookId);

    // Verify signature
    this.verifyWebhookSignature(payload, signature, webhook.secret);

    // Process webhook
    const integration = await this.getIntegration(webhook.integration_id);
    const handler = this.syncHandlers.get(integration.provider_code);

    if (!handler) {
      throw new Error(`No webhook handler for ${integration.provider_code}`);
    }

    await handler.handleWebhook(webhook.event_type, payload);

    // Update webhook
    await this.updateWebhookStatus(webhookId);
  }

  private async initializeIntegration(integrationId: string) {
    const integration = await this.getIntegration(integrationId);
    const handler = this.syncHandlers.get(integration.provider_code);

    if (!handler) {
      throw new Error(
        `No initialization handler for ${integration.provider_code}`
      );
    }

    await handler.initialize(integration);
  }

  private validateConfig(config: any, schema: JSONSchema) {
    const validate = ajv.compile(schema);
    if (!validate(config)) {
      throw new ValidationError("Invalid configuration", validate.errors);
    }
  }

  private generateWebhookSecret(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  private verifyWebhookSignature(
    payload: any,
    signature: string,
    secret: string
  ) {
    const hmac = crypto.createHmac("sha256", secret);
    const expectedSignature = hmac
      .update(JSON.stringify(payload))
      .digest("hex");

    if (signature !== expectedSignature) {
      throw new SecurityError("Invalid webhook signature");
    }
  }
}

// Integration providers
const integrationProviders = {
  github: {
    code: "github",
    name: "GitHub",
    description: "Integrate with GitHub repositories",
    icon: "github",
    config_schema: {
      type: "object",
      required: ["installation_id"],
      properties: {
        installation_id: {
          type: "string",
          title: "GitHub App Installation ID",
        },
        repositories: {
          type: "array",
          items: {
            type: "string",
          },
          title: "Repositories to sync",
        },
      },
    },
    features: {
      issue_sync: true,
      pr_sync: true,
      commit_sync: true,
      webhook_support: true,
    },
  },
  jira: {
    code: "jira",
    name: "Jira",
    description: "Integrate with Jira projects",
    icon: "jira",
    config_schema: {
      type: "object",
      required: ["domain", "email", "api_token"],
      properties: {
        domain: {
          type: "string",
          title: "Jira Domain",
        },
        email: {
          type: "string",
          format: "email",
          title: "Email",
        },
        api_token: {
          type: "string",
          title: "API Token",
        },
        projects: {
          type: "array",
          items: {
            type: "string",
          },
          title: "Projects to sync",
        },
      },
    },
    features: {
      issue_sync: true,
      comment_sync: true,
      status_sync: true,
      webhook_support: true,
    },
  },
  slack: {
    code: "slack",
    name: "Slack",
    description: "Integrate with Slack workspaces",
    icon: "slack",
    config_schema: {
      type: "object",
      required: ["workspace_id", "bot_token"],
      properties: {
        workspace_id: {
          type: "string",
          title: "Slack Workspace ID",
        },
        bot_token: {
          type: "string",
          title: "Bot User OAuth Token",
        },
        channels: {
          type: "array",
          items: {
            type: "string",
          },
          title: "Channels to post to",
        },
      },
    },
    features: {
      notifications: true,
      commands: true,
      message_actions: true,
      webhook_support: true,
    },
  },
};

// Integration sync handlers
class GitHubSyncHandler implements SyncHandler {
  async initialize(integration: Integration) {
    // Verify installation
    const installation = await this.getInstallation(
      integration.config.installation_id
    );

    // Setup webhooks
    await this.setupWebhooks(integration, installation);

    // Perform initial sync
    await this.sync(integration, "full");
  }

  async sync(integration: Integration, syncType: string) {
    const { repositories } = integration.config;

    // Sync each repository
    await Promise.all(
      repositories.map(async (repo) => {
        // Sync issues
        await this.syncIssues(integration, repo);

        // Sync pull requests
        await this.syncPullRequests(integration, repo);

        // Sync commits if full sync
        if (syncType === "full") {
          await this.syncCommits(integration, repo);
        }
      })
    );
  }

  async handleWebhook(eventType: string, payload: any) {
    switch (eventType) {
      case "issues":
        await this.handleIssueEvent(payload);
        break;
      case "pull_request":
        await this.handlePullRequestEvent(payload);
        break;
      case "push":
        await this.handlePushEvent(payload);
        break;
    }
  }
}

class JiraSyncHandler implements SyncHandler {
  async initialize(integration: Integration) {
    // Verify credentials
    await this.verifyCredentials(integration.config);

    // Setup webhooks
    await this.setupWebhooks(integration);

    // Perform initial sync
    await this.sync(integration, "full");
  }

  async sync(integration: Integration, syncType: string) {
    const { projects } = integration.config;

    // Sync each project
    await Promise.all(
      projects.map(async (project) => {
        // Sync issues
        await this.syncIssues(integration, project);

        // Sync comments
        await this.syncComments(integration, project);

        // Sync attachments if full sync
        if (syncType === "full") {
          await this.syncAttachments(integration, project);
        }
      })
    );
  }

  async handleWebhook(eventType: string, payload: any) {
    switch (eventType) {
      case "jira:issue_created":
        await this.handleIssueCreated(payload);
        break;
      case "jira:issue_updated":
        await this.handleIssueUpdated(payload);
        break;
      case "jira:issue_deleted":
        await this.handleIssueDeleted(payload);
        break;
    }
  }
}

class SlackSyncHandler implements SyncHandler {
  async initialize(integration: Integration) {
    // Verify bot token
    await this.verifyBotToken(integration.config.bot_token);

    // Join channels
    await this.joinChannels(integration.config.channels);

    // Setup event subscriptions
    await this.setupEventSubscriptions(integration);
  }

  async sync(integration: Integration, syncType: string) {
    // No sync needed for Slack
    return;
  }

  async handleWebhook(eventType: string, payload: any) {
    switch (eventType) {
      case "url_verification":
        return this.handleUrlVerification(payload);
      case "event_callback":
        return this.handleEventCallback(payload);
      case "slash_command":
        return this.handleSlashCommand(payload);
    }
  }
}
```

### 10.4 Integration Events

```typescript
// Integration event types
export interface IntegrationEvent {
  integration_id: string;
  event_type: string;
  payload: any;
  created_at: Date;
}

// Event handlers
export class IntegrationEventHandler {
  private readonly handlers: Map<string, EventHandler>;

  constructor() {
    this.handlers = new Map();
    this.registerHandlers();
  }

  async handleEvent(event: IntegrationEvent) {
    const handler = this.handlers.get(event.event_type);
    if (!handler) {
      throw new Error(`No handler for event type ${event.event_type}`);
    }

    await handler.handle(event);
  }

  private registerHandlers() {
    // GitHub handlers
    this.handlers.set("github:issue", new GitHubIssueHandler());
    this.handlers.set("github:pr", new GitHubPullRequestHandler());
    this.handlers.set("github:commit", new GitHubCommitHandler());

    // Jira handlers
    this.handlers.set("jira:issue", new JiraIssueHandler());
    this.handlers.set("jira:comment", new JiraCommentHandler());
    this.handlers.set("jira:status", new JiraStatusHandler());

    // Slack handlers
    this.handlers.set("slack:message", new SlackMessageHandler());
    this.handlers.set("slack:reaction", new SlackReactionHandler());
    this.handlers.set("slack:command", new SlackCommandHandler());
  }
}

// Event processors
class GitHubIssueHandler implements EventHandler {
  async handle(event: IntegrationEvent) {
    const { action, issue } = event.payload;

    switch (action) {
      case "opened":
        await this.createTask(issue);
        break;
      case "closed":
        await this.closeTask(issue);
        break;
      case "reopened":
        await this.reopenTask(issue);
        break;
      case "assigned":
        await this.assignTask(issue);
        break;
      case "labeled":
        await this.updateTaskLabels(issue);
        break;
    }
  }
}

class JiraIssueHandler implements EventHandler {
  async handle(event: IntegrationEvent) {
    const { webhookEvent, issue } = event.payload;

    switch (webhookEvent) {
      case "jira:issue_created":
        await this.createTask(issue);
        break;
      case "jira:issue_updated":
        await this.updateTask(issue);
        break;
      case "jira:issue_deleted":
        await this.deleteTask(issue);
        break;
    }
  }
}

class SlackMessageHandler implements EventHandler {
  async handle(event: IntegrationEvent) {
    const { type, message } = event.payload;

    switch (type) {
      case "message_created":
        await this.handleNewMessage(message);
        break;
      case "message_updated":
        await this.handleMessageUpdate(message);
        break;
      case "message_deleted":
        await this.handleMessageDelete(message);
        break;
    }
  }
}
```

### 10.5 Integration Utilities

```typescript
// Integration helper functions
export class IntegrationUtils {
  // Data mapping utilities
  static mapGitHubIssueToTask(issue: any): Task {
    return {
      title: issue.title,
      description: issue.body,
      status: issue.state === "open" ? "todo" : "done",
      assignee: issue.assignee?.login,
      labels: issue.labels.map((l) => l.name),
      external_id: `github:${issue.id}`,
      external_url: issue.html_url,
      metadata: {
        source: "github",
        repository: issue.repository.full_name,
        number: issue.number,
      },
    };
  }

  static mapJiraIssueToTask(issue: any): Task {
    return {
      title: issue.fields.summary,
      description: issue.fields.description,
      status: this.mapJiraStatus(issue.fields.status.name),
      assignee: issue.fields.assignee?.emailAddress,
      labels: issue.fields.labels,
      external_id: `jira:${issue.id}`,
      external_url: issue.self,
      metadata: {
        source: "jira",
        project: issue.fields.project.key,
        key: issue.key,
      },
    };
  }

  // Status mapping
  private static mapJiraStatus(status: string): string {
    const statusMap: Record<string, string> = {
      "To Do": "todo",
      "In Progress": "in_progress",
      Done: "done",
    };
    return statusMap[status] || "todo";
  }

  // Webhook utilities
  static generateWebhookUrl(integrationId: string, eventType: string): string {
    return `${process.env.API_URL}/webhooks/${integrationId}/${eventType}`;
  }

  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(payload).digest("hex");
    return signature === digest;
  }

  // Error handling
  static async handleIntegrationError(integration: Integration, error: Error) {
    // Log error
    console.error(`Integration error for ${integration.id}:`, error.message);

    // Update integration status
    await supabase
      .from("integrations.workspace_integrations")
      .update({
        status: "error",
        error_message: error.message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", integration.id);

    // Notify workspace admins
    await notificationManager.notify(
      integration.workspace_id,
      "integration_error",
      {
        integration_name: integration.name,
        error_message: error.message,
      }
    );
  }

  // Rate limiting
  static async checkRateLimit(integration: Integration): Promise<boolean> {
    const key = `ratelimit:integration:${integration.id}`;
    const limit = await redis.get(key);

    if (limit && parseInt(limit) >= 5000) {
      throw new RateLimitError("Integration rate limit exceeded");
    }

    await redis.incr(key);
    await redis.expire(key, 3600); // 1 hour

    return true;
  }
}
```

// ... continue with remaining sections ...

## 11. Analytics System

### 11.1 Analytics Tables

```sql
-- Create analytics schema
CREATE SCHEMA IF NOT EXISTS analytics;

-- Event Tracking
CREATE TABLE analytics.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  workspace_id UUID REFERENCES workspaces(id),
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}'::jsonb,
  context JSONB DEFAULT '{}'::jsonb,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page Views
CREATE TABLE analytics.page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  workspace_id UUID REFERENCES workspaces(id),
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  duration INTEGER,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature Usage
CREATE TABLE analytics.feature_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  workspace_id UUID REFERENCES workspaces(id),
  feature_name TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Metrics
CREATE TABLE analytics.performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  workspace_id UUID REFERENCES workspaces(id),
  metric_name TEXT NOT NULL,
  value FLOAT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Error Tracking
CREATE TABLE analytics.errors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  workspace_id UUID REFERENCES workspaces(id),
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_events_user ON analytics.events(user_id, created_at DESC);
CREATE INDEX idx_events_workspace ON analytics.events(workspace_id, created_at DESC);
CREATE INDEX idx_events_name ON analytics.events(event_name, created_at DESC);
CREATE INDEX idx_page_views_user ON analytics.page_views(user_id, created_at DESC);
CREATE INDEX idx_page_views_path ON analytics.page_views(path, created_at DESC);
CREATE INDEX idx_feature_usage_feature ON analytics.feature_usage(feature_name, created_at DESC);
CREATE INDEX idx_performance_metrics_metric ON analytics.performance_metrics(metric_name, created_at DESC);
CREATE INDEX idx_errors_type ON analytics.errors(error_type, created_at DESC);
```

### 11.2 Analytics RLS Policies

```sql
-- Events Security
ALTER TABLE analytics.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace admins can view workspace events"
  ON analytics.events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = analytics.events.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- Page Views Security
ALTER TABLE analytics.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace admins can view workspace page views"
  ON analytics.page_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = analytics.page_views.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- Feature Usage Security
ALTER TABLE analytics.feature_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace admins can view workspace feature usage"
  ON analytics.feature_usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = analytics.feature_usage.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- Performance Metrics Security
ALTER TABLE analytics.performance_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace admins can view workspace performance metrics"
  ON analytics.performance_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = analytics.performance_metrics.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- Errors Security
ALTER TABLE analytics.errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace admins can view workspace errors"
  ON analytics.errors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = analytics.errors.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
  );
```

### 11.3 Analytics Manager

```typescript
// Analytics manager class
export class AnalyticsManager {
  private readonly eventQueue: Queue;
  private readonly batchSize: number = 100;
  private readonly flushInterval: number = 5000; // 5 seconds

  constructor() {
    this.eventQueue = new Queue();
    this.startFlushInterval();
  }

  async trackEvent(
    eventName: string,
    properties: Record<string, any> = {},
    context: Record<string, any> = {}
  ) {
    const event = {
      user_id: auth.uid(),
      workspace_id: this.getCurrentWorkspaceId(),
      event_name: eventName,
      properties,
      context: {
        ...context,
        ...this.getDefaultContext(),
      },
      session_id: this.getSessionId(),
      created_at: new Date().toISOString(),
    };

    this.eventQueue.push(event);

    if (this.eventQueue.size >= this.batchSize) {
      await this.flush();
    }
  }

  async trackPageView(path: string, referrer?: string) {
    const pageView = {
      user_id: auth.uid(),
      workspace_id: this.getCurrentWorkspaceId(),
      path,
      referrer,
      user_agent: navigator.userAgent,
      session_id: this.getSessionId(),
      created_at: new Date().toISOString(),
    };

    await supabase.from("analytics.page_views").insert(pageView);
  }

  async trackFeatureUsage(
    featureName: string,
    action: string,
    metadata: Record<string, any> = {}
  ) {
    const usage = {
      user_id: auth.uid(),
      workspace_id: this.getCurrentWorkspaceId(),
      feature_name: featureName,
      action,
      metadata,
      created_at: new Date().toISOString(),
    };

    await supabase.from("analytics.feature_usage").insert(usage);
  }

  async trackPerformanceMetric(
    metricName: string,
    value: number,
    metadata: Record<string, any> = {}
  ) {
    const metric = {
      user_id: auth.uid(),
      workspace_id: this.getCurrentWorkspaceId(),
      metric_name: metricName,
      value,
      metadata,
      created_at: new Date().toISOString(),
    };

    await supabase.from("analytics.performance_metrics").insert(metric);
  }

  async trackError(error: Error, metadata: Record<string, any> = {}) {
    const errorRecord = {
      user_id: auth.uid(),
      workspaceid: this.getCurrentWorkspaceId(),
      error_type: error.name,
      error_message: error.message,
      stack_trace: error.stack,
      metadata: {
        ...metadata,
        ...this.getErrorContext(),
      },
      created_at: new Date().toISOString(),
    };

    await supabase.from("analytics.errors").insert(errorRecord);
  }

  private async flush() {
    if (this.eventQueue.isEmpty()) return;

    const events = [];
    while (!this.eventQueue.isEmpty() && events.length < this.batchSize) {
      events.push(this.eventQueue.pop());
    }

    try {
      await supabase.from("analytics.events").insert(events);
    } catch (error) {
      console.error("Failed to flush events:", error);
      // Re-queue failed events
      events.forEach((event) => this.eventQueue.push(event));
    }
  }

  private startFlushInterval() {
    setInterval(() => {
      this.flush().catch(console.error);
    }, this.flushInterval);
  }

  private getDefaultContext(): Record<string, any> {
    return {
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
  }

  private getErrorContext(): Record<string, any> {
    return {
      ...this.getDefaultContext(),
      memory: performance.memory?.usedJSHeapSize,
      network: {
        type: (navigator as any).connection?.type,
        effectiveType: (navigator as any).connection?.effectiveType,
      },
    };
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem("analytics_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("analytics_session_id", sessionId);
    }
    return sessionId;
  }
}
```

### 11.4 Analytics Reports

```typescript
// Analytics report generator
export class AnalyticsReporter {
  async generateWorkspaceReport(
    workspaceId: string,
    timeRange: { start: Date; end: Date }
  ): Promise<WorkspaceReport> {
    const [userActivity, featureUsage, performanceMetrics, errorSummary] =
      await Promise.all([
        this.getUserActivity(workspaceId, timeRange),
        this.getFeatureUsage(workspaceId, timeRange),
        this.getPerformanceMetrics(workspaceId, timeRange),
        this.getErrorSummary(workspaceId, timeRange),
      ]);

    return {
      workspace_id: workspaceId,
      time_range: timeRange,
      user_activity: userActivity,
      feature_usage: featureUsage,
      performance_metrics: performanceMetrics,
      error_summary: errorSummary,
      generated_at: new Date().toISOString(),
    };
  }

  private async getUserActivity(
    workspaceId: string,
    timeRange: { start: Date; end: Date }
  ) {
    const { data } = await supabase.rpc("get_user_activity", {
      p_workspace_id: workspaceId,
      p_start_date: timeRange.start,
      p_end_date: timeRange.end,
    });

    return data;
  }

  private async getFeatureUsage(
    workspaceId: string,
    timeRange: { start: Date; end: Date }
  ) {
    const { data } = await supabase.rpc("get_feature_usage", {
      p_workspace_id: workspaceId,
      p_start_date: timeRange.start,
      p_end_date: timeRange.end,
    });

    return data;
  }

  private async getPerformanceMetrics(
    workspaceId: string,
    timeRange: { start: Date; end: Date }
  ) {
    const { data } = await supabase.rpc("get_performance_metrics", {
      p_workspace_id: workspaceId,
      p_start_date: timeRange.start,
      p_end_date: timeRange.end,
    });

    return data;
  }

  private async getErrorSummary(
    workspaceId: string,
    timeRange: { start: Date; end: Date }
  ) {
    const { data } = await supabase.rpc("get_error_summary", {
      p_workspace_id: workspaceId,
      p_start_date: timeRange.start,
      p_end_date: timeRange.end,
    });

    return data;
  }
}

// Analytics dashboard components
export class AnalyticsDashboard {
  private readonly reporter: AnalyticsReporter;
  private readonly cache: Cache;

  constructor() {
    this.reporter = new AnalyticsReporter();
    this.cache = new Cache();
  }

  async getWorkspaceOverview(
    workspaceId: string,
    timeRange: { start: Date; end: Date }
  ) {
    const cacheKey = `workspace_overview:${workspaceId}:${timeRange.start}:${timeRange.end}`;

    // Try to get from cache
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // Generate report
    const report = await this.reporter.generateWorkspaceReport(
      workspaceId,
      timeRange
    );

    // Cache for 1 hour
    await this.cache.set(cacheKey, report, 3600);

    return report;
  }

  async getUserInsights(
    workspaceId: string,
    userId: string,
    timeRange: { start: Date; end: Date }
  ) {
    const { data } = await supabase.rpc("get_user_insights", {
      p_workspace_id: workspaceId,
      p_user_id: userId,
      p_start_date: timeRange.start,
      p_end_date: timeRange.end,
    });

    return data;
  }

  async getFeatureAdoption(
    workspaceId: string,
    timeRange: { start: Date; end: Date }
  ) {
    const { data } = await supabase.rpc("get_feature_adoption", {
      p_workspace_id: workspaceId,
      p_start_date: timeRange.start,
      p_end_date: timeRange.end,
    });

    return data;
  }

  async getRetentionAnalysis(
    workspaceId: string,
    timeRange: { start: Date; end: Date }
  ) {
    const { data } = await supabase.rpc("get_retention_analysis", {
      p_workspace_id: workspaceId,
      p_start_date: timeRange.start,
      p_end_date: timeRange.end,
    });

    return data;
  }
}
```

### 11.5 Analytics Functions

```sql
-- User activity analysis
CREATE OR REPLACE FUNCTION analytics.get_user_activity(
  p_workspace_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
  date DATE,
  active_users INTEGER,
  total_events INTEGER,
  avg_session_duration INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH daily_stats AS (
    SELECT
      DATE_TRUNC('day', e.created_at)::DATE AS date,
      COUNT(DISTINCT e.user_id) AS active_users,
      COUNT(*) AS total_events,
      AVG(pv.duration) AS avg_session_duration
    FROM analytics.events e
    LEFT JOIN analytics.page_views pv
      ON e.session_id = pv.session_id
      AND e.created_at::DATE = pv.created_at::DATE
    WHERE e.workspace_id = p_workspace_id
      AND e.created_at BETWEEN p_start_date AND p_end_date
    GROUP BY DATE_TRUNC('day', e.created_at)::DATE
  )
  SELECT
    date,
    active_users,
    total_events,
    COALESCE(avg_session_duration::INTEGER, 0)
  FROM daily_stats
  ORDER BY date;
END;
$$ LANGUAGE plpgsql;

-- Feature usage analysis
CREATE OR REPLACE FUNCTION analytics.get_feature_usage(
  p_workspace_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
  feature_name TEXT,
  total_usage INTEGER,
  unique_users INTEGER,
  avg_usage_per_user FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fu.feature_name,
    COUNT(*) AS total_usage,
    COUNT(DISTINCT fu.user_id) AS unique_users,
    COUNT(*)::FLOAT / COUNT(DISTINCT fu.user_id) AS avg_usage_per_user
  FROM analytics.feature_usage fu
  WHERE fu.workspace_id = p_workspace_id
    AND fu.created_at BETWEEN p_start_date AND p_end_date
  GROUP BY fu.feature_name
  ORDER BY total_usage DESC;
END;
$$ LANGUAGE plpgsql;

-- Performance metrics analysis
CREATE OR REPLACE FUNCTION analytics.get_performance_metrics(
  p_workspace_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
  metric_name TEXT,
  avg_value FLOAT,
  min_value FLOAT,
  max_value FLOAT,
  p95_value FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pm.metric_name,
    AVG(pm.value) AS avg_value,
    MIN(pm.value) AS min_value,
    MAX(pm.value) AS max_value,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY pm.value) AS p95_value
  FROM analytics.performance_metrics pm
  WHERE pm.workspace_id = p_workspace_id
    AND pm.created_at BETWEEN p_start_date AND p_end_date
  GROUP BY pm.metric_name;
END;
$$ LANGUAGE plpgsql;

-- Error summary analysis
CREATE OR REPLACE FUNCTION analytics.get_error_summary(
  p_workspace_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
  error_type TEXT,
  error_count INTEGER,
  affected_users INTEGER,
  first_seen TIMESTAMPTZ,
  last_seen TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.error_type,
    COUNT(*) AS error_count,
    COUNT(DISTINCT e.user_id) AS affected_users,
    MIN(e.created_at) AS first_seen,
    MAX(e.created_at) AS last_seen
  FROM analytics.errors e
  WHERE e.workspace_id = p_workspace_id
    AND e.created_at BETWEEN p_start_date AND p_end_date
  GROUP BY e.error_type
  ORDER BY error_count DESC;
END;
$$ LANGUAGE plpgsql;

-- User insights analysis
CREATE OR REPLACE FUNCTION analytics.get_user_insights(
  p_workspace_id UUID,
  p_user_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
  total_sessions INTEGER,
  avg_session_duration INTEGER,
  most_used_features TEXT[],
  common_paths TEXT[],
  last_active TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  WITH user_stats AS (
    SELECT
      COUNT(DISTINCT pv.session_id) AS total_sessions,
      AVG(pv.duration) AS avg_session_duration,
      ARRAY_AGG(DISTINCT fu.feature_name ORDER BY COUNT(*) DESC) FILTER (WHERE fu.feature_name IS NOT NULL) AS most_used_features,
      ARRAY_AGG(DISTINCT pv.path ORDER BY COUNT(*) DESC) FILTER (WHERE pv.path IS NOT NULL) AS common_paths,
      MAX(GREATEST(pv.created_at, fu.created_at)) AS last_active
    FROM analytics.page_views pv
    FULL OUTER JOIN analytics.feature_usage fu
      ON pv.user_id = fu.user_id
      AND pv.created_at::DATE = fu.created_at::DATE
    WHERE pv.workspace_id = p_workspace_id
      AND pv.user_id = p_user_id
      AND pv.created_at BETWEEN p_start_date AND p_end_date
    GROUP BY pv.user_id
  )
  SELECT
    total_sessions,
    avg_session_duration::INTEGER,
    most_used_features,
    common_paths,
    last_active
  FROM user_stats;
END;
$$ LANGUAGE plpgsql;

-- Feature adoption analysis
CREATE OR REPLACE FUNCTION analytics.get_feature_adoption(
  p_workspace_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
  feature_name TEXT,
  adoption_rate FLOAT,
  retention_rate FLOAT,
  avg_frequency FLOAT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_counts AS (
    SELECT COUNT(DISTINCT user_id) AS total_users
    FROM workspace_members
    WHERE workspace_id = p_workspace_id
  ),
  feature_stats AS (
    SELECT
      fu.feature_name,
      COUNT(DISTINCT fu.user_id) AS users_count,
      COUNT(DISTINCT CASE
        WHEN fu.created_at >= p_start_date + INTERVAL '7 days'
        THEN fu.user_id
        END
      ) AS retained_users,
      COUNT(*) AS total_usage
    FROM analytics.feature_usage fu
    WHERE fu.workspace_id = p_workspace_id
      AND fu.created_at BETWEEN p_start_date AND p_end_date
    GROUP BY fu.feature_name
  )
  SELECT
    fs.feature_name,
    (fs.users_count::FLOAT / uc.total_users) AS adoption_rate,
    (fs.retained_users::FLOAT / NULLIF(fs.users_count, 0)) AS retention_rate,
    (fs.total_usage::FLOAT / NULLIF(fs.users_count, 0)) AS avg_frequency
  FROM feature_stats fs
  CROSS JOIN user_counts uc
  ORDER BY adoption_rate DESC;
END;
$$ LANGUAGE plpgsql;

-- Retention analysis
CREATE OR REPLACE FUNCTION analytics.get_retention_analysis(
  p_workspace_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
  cohort_date DATE,
  cohort_size INTEGER,
  week_1 FLOAT,
  week_2 FLOAT,
  week_3 FLOAT,
  week_4 FLOAT
) AS $$
BEGIN
  RETURN QUERY
  WITH cohorts AS (
    SELECT
      DATE_TRUNC('week', MIN(created_at))::DATE AS cohort_date,
      user_id,
      COUNT(DISTINCT DATE_TRUNC('week', created_at)) AS weeks_active
    FROM analytics.events
    WHERE workspace_id = p_workspace_id
      AND created_at BETWEEN p_start_date AND p_end_date
    GROUP BY user_id
  ),
  retention_data AS (
    SELECT
      cohort_date,
      COUNT(*) AS cohort_size,
      SUM(CASE WHEN weeks_active >=2 THEN 1 ELSE 0 END)::FLOAT / COUNT(*) AS week_1,
      SUM(CASE WHEN weeks_active >=3 THEN 1 ELSE 0 END)::FLOAT / COUNT(*) AS week_2,
      SUM(CASE WHEN weeks_active >=4 THEN 1 ELSE 0 END)::FLOAT / COUNT(*) AS week_3,
      SUM(CASE WHEN weeks_active >=5 THEN 1 ELSE 0 END)::FLOAT / COUNT(*) AS week_4
    FROM cohorts
    GROUP BY cohort_date
  )
  SELECT *
  FROM retention_data
  ORDER BY cohort_date;
END;
$$ LANGUAGE plpgsql;
```

// ... continue with remaining sections ...

## 12. Search System

### 12.1 Search Tables

```sql
-- Create search schema
CREATE SCHEMA IF NOT EXISTS search;

-- Search Documents
CREATE TABLE search.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  object_type TEXT NOT NULL,
  object_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  searchable_text TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('english', COALESCE(content, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(metadata->>'tags', '')), 'C')
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search Synonyms
CREATE TABLE search.synonyms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  synonyms TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search History
CREATE TABLE search.history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}'::jsonb,
  result_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_search_documents_workspace ON search.documents(workspace_id);
CREATE INDEX idx_search_documents_object ON search.documents(object_type, object_id);
CREATE INDEX idx_search_documents_fts ON search.documents USING GIN(searchable_text);
CREATE INDEX idx_search_synonyms_workspace ON search.synonyms(workspace_id);
CREATE INDEX idx_search_synonyms_term ON search.synonyms(term);
CREATE INDEX idx_search_history_user ON search.history(user_id, created_at DESC);
CREATE INDEX idx_search_history_workspace ON search.history(workspace_id, created_at DESC);
```

### 12.2 Search RLS Policies

```sql
-- Documents Security
ALTER TABLE search.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can search documents"
  ON search.documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = search.documents.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Synonyms Security
ALTER TABLE search.synonyms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view synonyms"
  ON search.synonyms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = search.synonyms.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace admins can manage synonyms"
  ON search.synonyms FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = search.synonyms.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- History Security
ALTER TABLE search.history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own search history"
  ON search.history FOR SELECT
  USING (auth.uid() = user_id);
```

### 12.3 Search Manager

```typescript
// Search manager class
export class SearchManager {
  private readonly synonymsCache: Map<string, string[]>;
  private readonly cacheTimeout: number = 300000; // 5 minutes

  constructor() {
    this.synonymsCache = new Map();
    this.startCacheCleanup();
  }

  async search(
    workspaceId: string,
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResults> {
    // Expand query with synonyms
    const expandedQuery = await this.expandQueryWithSynonyms(
      workspaceId,
      query
    );

    // Build search query
    const searchQuery = this.buildSearchQuery(expandedQuery, options);

    // Execute search
    const { data: documents, error } = await supabase
      .from("search.documents")
      .select("*")
      .eq("workspace_id", workspaceId)
      .textSearch("searchable_text", searchQuery)
      .filter("object_type", "in", options.types || [])
      .order("ts_rank(searchable_text, plainto_tsquery($1))", {
        ascending: false,
        foreignTable: "documents",
      })
      .range(
        options.offset || 0,
        (options.offset || 0) + (options.limit || 20)
      );

    if (error) throw error;

    // Record search history
    await this.recordSearchHistory(
      workspaceId,
      query,
      options,
      documents.length
    );

    return {
      query,
      total: documents.length,
      results: documents.map((doc) => ({
        ...doc,
        highlights: this.generateHighlights(doc, expandedQuery),
      })),
    };
  }

  async indexDocument(workspaceId: string, document: SearchDocument) {
    const { error } = await supabase.from("search.documents").upsert({
      workspace_id: workspaceId,
      object_type: document.object_type,
      object_id: document.object_id,
      title: document.title,
      content: document.content,
      metadata: document.metadata,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
  }

  async deleteDocument(
    workspaceId: string,
    objectType: string,
    objectId: string
  ) {
    const { error } = await supabase.from("search.documents").delete().match({
      workspace_id: workspaceId,
      object_type: objectType,
      object_id: objectId,
    });

    if (error) throw error;
  }

  async addSynonyms(workspaceId: string, term: string, synonyms: string[]) {
    const { error } = await supabase.from("search.synonyms").upsert({
      workspace_id: workspaceId,
      term,
      synonyms,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    // Update cache
    this.synonymsCache.set(this.getCacheKey(workspaceId, term), synonyms);
  }

  async getSynonyms(workspaceId: string, term: string): Promise<string[]> {
    // Check cache
    const cacheKey = this.getCacheKey(workspaceId, term);
    const cached = this.synonymsCache.get(cacheKey);
    if (cached) return cached;

    // Get from database
    const { data, error } = await supabase
      .from("search.synonyms")
      .select("synonyms")
      .eq("workspace_id", workspaceId)
      .eq("term", term)
      .single();

    if (error) throw error;

    // Update cache
    if (data) {
      this.synonymsCache.set(cacheKey, data.synonyms);
      return data.synonyms;
    }

    return [];
  }

  async getSearchHistory(
    userId: string,
    workspaceId: string,
    limit: number = 10
  ) {
    const { data, error } = await supabase
      .from("search.history")
      .select("*")
      .eq("user_id", userId)
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  private async expandQueryWithSynonyms(
    workspaceId: string,
    query: string
  ): Promise<string> {
    const terms = query.toLowerCase().split(/\s+/);
    const expandedTerms = await Promise.all(
      terms.map(async (term) => {
        const synonyms = await this.getSynonyms(workspaceId, term);
        return synonyms.length ? `(${[term, ...synonyms].join("|")})` : term;
      })
    );
    return expandedTerms.join(" ");
  }

  private buildSearchQuery(query: string, options: SearchOptions): string {
    let searchQuery = query;

    // Add filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([field, value]) => {
        searchQuery += ` & ${field}:${value}`;
      });
    }

    return searchQuery;
  }

  private async recordSearchHistory(
    workspaceId: string,
    query: string,
    options: SearchOptions,
    resultCount: number
  ) {
    const { error } = await supabase.from("search.history").insert({
      user_id: auth.uid(),
      workspace_id: workspaceId,
      query,
      filters: options.filters || {},
      result_count: resultCount,
    });

    if (error) {
      console.error("Failed to record search history:", error);
    }
  }

  private generateHighlights(
    document: SearchDocument,
    query: string
  ): SearchHighlight[] {
    const highlights: SearchHighlight[] = [];
    const terms = query.toLowerCase().split(/\s+/);

    // Helper function to find and highlight matches
    const findMatches = (text: string, weight: number) => {
      if (!text) return;

      terms.forEach((term) => {
        let index = text.toLowerCase().indexOf(term);
        while (index !== -1) {
          highlights.push({
            text: text.slice(index, index + term.length),
            field: "content",
            position: index,
            length: term.length,
            weight,
          });
          index = text.toLowerCase().indexOf(term, index + 1);
        }
      });
    };

    // Find matches in title (weight: 1.0)
    findMatches(document.title, 1.0);

    // Find matches in content (weight: 0.8)
    findMatches(document.content, 0.8);

    // Find matches in metadata (weight: 0.6)
    if (document.metadata?.tags) {
      findMatches(document.metadata.tags.join(" "), 0.6);
    }

    return highlights;
  }

  private getCacheKey(workspaceId: string, term: string): string {
    return `${workspaceId}:${term}`;
  }

  private startCacheCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, { timestamp }] of this.synonymsCache.entries()) {
        if (now - timestamp > this.cacheTimeout) {
          this.synonymsCache.delete(key);
        }
      }
    }, this.cacheTimeout);
  }
}
```

### 12.4 Search Triggers

```sql
-- Auto-update timestamps
CREATE OR REPLACE FUNCTION search.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_search_documents_timestamp
  BEFORE UPDATE ON search.documents
  FOR EACH ROW
  EXECUTE FUNCTION search.update_timestamp();

CREATE TRIGGER update_search_synonyms_timestamp
  BEFORE UPDATE ON search.synonyms
  FOR EACH ROW
  EXECUTE FUNCTION search.update_timestamp();

-- Auto-index projects
CREATE OR REPLACE FUNCTION search.index_project()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO search.documents (
      workspace_id,
      object_type,
      object_id,
      title,
      content,
      metadata
    ) VALUES (
      NEW.workspace_id,
      'project',
      NEW.id,
      NEW.name,
      NEW.description,
      jsonb_build_object(
        'status', NEW.status,
        'tags', NEW.tags,
        'created_by', NEW.created_by
      )
    )
    ON CONFLICT (object_type, object_id) DO UPDATE SET
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      metadata = EXCLUDED.metadata,
      updated_at = NOW();
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM search.documents
    WHERE object_type = 'project' AND object_id = OLD.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER index_project_changes
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION search.index_project();

-- Auto-index tasks
CREATE OR REPLACE FUNCTION search.index_task()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO search.documents (
      workspace_id,
      object_type,
      object_id,
      title,
      content,
      metadata
    )
    SELECT
      p.workspace_id,
      'task',
      NEW.id,
      NEW.title,
      NEW.description,
      jsonb_build_object(
        'project_id', NEW.project_id,
        'status', NEW.status,
        'assignee', NEW.assignee_id,
        'due_date', NEW.due_date,
        'tags', NEW.tags
      )
    FROM projects p
    WHERE p.id = NEW.project_id
    ON CONFLICT (object_type, object_id) DO UPDATE SET
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      metadata = EXCLUDED.metadata,
      updated_at = NOW();
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM search.documents
    WHERE object_type = 'task' AND object_id = OLD.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER index_task_changes
  AFTER INSERT OR UPDATE OR DELETE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION search.index_task();

-- Auto-index comments
CREATE OR REPLACE FUNCTION search.index_comment()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO search.documents (
      workspace_id,
      object_type,
      object_id,
      title,
      content,
      metadata
    )
    SELECT
      p.workspace_id,
      'comment',
      NEW.id,
      substring(NEW.content from 1 for 50),
      NEW.content,
      jsonb_build_object(
        'task_id', NEW.task_id,
        'project_id', t.project_id,
        'author', NEW.user_id,
        'created_at', NEW.created_at
      )
    FROM tasks t
    JOIN projects p ON p.id = t.project_id
    WHERE t.id = NEW.task_id
    ON CONFLICT (object_type, object_id) DO UPDATE SET
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      metadata = EXCLUDED.metadata,
      updated_at = NOW();
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM search.documents
    WHERE object_type = 'comment' AND object_id = OLD.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER index_comment_changes
  AFTER INSERT OR UPDATE OR DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION search.index_comment();
```

### 12.5 Search Functions

```sql
-- Full-text search function
CREATE OR REPLACE FUNCTION search.search_documents(
  p_workspace_id UUID,
  p_query TEXT,
  p_filters JSONB DEFAULT '{}'::jsonb,
  p_types TEXT[] DEFAULT NULL,
  p_offset INTEGER DEFAULT 0,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  object_type TEXT,
  object_id UUID,
  title TEXT,
  content TEXT,
  metadata JSONB,
  rank FLOAT4,
  highlight_title TEXT[],
  highlight_content TEXT[]
) AS $$
DECLARE
  v_tsquery tsquery;
BEGIN
  -- Convert search query to tsquery
  v_tsquery := plainto_tsquery('english', p_query);

  RETURN QUERY
  WITH ranked_documents AS (
    SELECT
      d.*,
      ts_rank(d.searchable_text, v_tsquery) as rank
    FROM search.documents d
    WHERE d.workspace_id = p_workspace_id
      AND (p_types IS NULL OR d.object_type = ANY(p_types))
      AND d.searchable_text @@ v_tsquery
      AND CASE
        WHEN p_filters ? 'status'
        THEN d.metadata->>'status' = p_filters->>'status'
        ELSE true
      END
      AND CASE
        WHEN p_filters ? 'assignee'
        THEN d.metadata->>'assignee' = p_filters->>'assignee'
        ELSE true
      END
  )
  SELECT
    d.id,
    d.object_type,
    d.object_id,
    d.title,
    d.content,
    d.metadata,
    d.rank,
    ts_headline('english', d.title, v_tsquery, 'StartSel=<<,StopSel=>>,MaxWords=50,MinWords=15') as highlight_title,
    ts_headline('english', d.content, v_tsquery, 'StartSel=<<,StopSel=>>,MaxWords=50,MinWords=15') as highlight_content
  FROM ranked_documents d
  ORDER BY d.rank DESC
  OFFSET p_offset
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Suggest similar terms
CREATE OR REPLACE FUNCTION search.suggest_similar_terms(
  p_workspace_id UUID,
  p_term TEXT,
  p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
  term TEXT,
  similarity FLOAT4
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.term,
    similarity(p_term, s.term) as similarity
  FROM (
    SELECT DISTINCT term
    FROM search.synonyms
    WHERE workspace_id = p_workspace_id
    UNION
    SELECT DISTINCT unnest(synonyms)
    FROM search.synonyms
    WHERE workspace_id = p_workspace_id
  ) s
  WHERE similarity(p_term, s.term) > 0.3
  ORDER BY similarity DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get popular searches
CREATE OR REPLACE FUNCTION search.get_popular_searches(
  p_workspace_id UUID,
  p_days INTEGER DEFAULT 7,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  query TEXT,
  search_count INTEGER,
  avg_results FLOAT4
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    h.query,
    COUNT(*) as search_count,
    AVG(h.result_count::float4) as avg_results
  FROM search.history h
  WHERE h.workspace_id = p_workspace_id
    AND h.created_at >= NOW() - (p_days || ' days')::interval
  GROUP BY h.query
  HAVING COUNT(*) > 1
  ORDER BY search_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
```

// ... continue with remaining sections ...

## 13. Caching System

### 13.1 Cache Configuration

```typescript
// Cache configuration
export const cacheConfig = {
  // Cache layers
  layers: {
    memory: {
      enabled: true,
      maxSize: 100 * 1024 * 1024, // 100MB
      ttl: 300, // 5 minutes
    },
    redis: {
      enabled: true,
      maxSize: 1024 * 1024 * 1024, // 1GB
      ttl: 3600, // 1 hour
    },
  },

  // Cache keys
  keys: {
    workspace: (id: string) => `workspace:${id}`,
    project: (id: string) => `project:${id}`,
    task: (id: string) => `task:${id}`,
    user: (id: string) => `user:${id}`,
    projectList: (workspaceId: string) => `projects:${workspaceId}`,
    taskList: (projectId: string) => `tasks:${projectId}`,
    searchResults: (query: string, filters: any) =>
      `search:${query}:${JSON.stringify(filters)}`,
    integrationConfig: (workspaceId: string, provider: string) =>
      `integration:${workspaceId}:${provider}`,
  },

  // Cache groups for invalidation
  groups: {
    workspace: (id: string) => [
      `workspace:${id}`,
      `projects:${id}`,
      `members:${id}`,
    ],
    project: (id: string, workspaceId: string) => [
      `project:${id}`,
      `tasks:${id}`,
      `projects:${workspaceId}`,
    ],
    task: (id: string, projectId: string) => [
      `task:${id}`,
      `tasks:${projectId}`,
    ],
  },
};

// Cache manager class
export class CacheManager {
  private readonly memoryCache: Map<string, CacheEntry>;
  private readonly redisClient: Redis;
  private readonly config: typeof cacheConfig;

  constructor() {
    this.memoryCache = new Map();
    this.redisClient = new Redis(process.env.REDIS_URL);
    this.config = cacheConfig;
    this.startMemoryCleanup();
  }

  async get<T>(key: string): Promise<T | null> {
    // Try memory cache first
    if (this.config.layers.memory.enabled) {
      const memoryResult = this.getFromMemory<T>(key);
      if (memoryResult) return memoryResult;
    }

    // Try Redis cache
    if (this.config.layers.redis.enabled) {
      const redisResult = await this.getFromRedis<T>(key);
      if (redisResult) {
        // Update memory cache
        this.setInMemory(key, redisResult);
        return redisResult;
      }
    }

    return null;
  }

  async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<void> {
    const ttl = options.ttl || this.config.layers.redis.ttl;

    // Set in memory cache
    if (this.config.layers.memory.enabled) {
      this.setInMemory(key, value, ttl);
    }

    // Set in Redis cache
    if (this.config.layers.redis.enabled) {
      await this.setInRedis(key, value, ttl);
    }
  }

  async invalidate(keys: string[]): Promise<void> {
    // Remove from memory cache
    keys.forEach((key) => {
      this.memoryCache.delete(key);
    });

    // Remove from Redis cache
    if (this.config.layers.redis.enabled) {
      await this.redisClient.del(...keys);
    }
  }

  async invalidateGroup(group: string): Promise<void> {
    const keys = this.config.groups[group] || [];
    await this.invalidate(keys);
  }

  async clear(): Promise<void> {
    // Clear memory cache
    this.memoryCache.clear();

    // Clear Redis cache
    if (this.config.layers.redis.enabled) {
      await this.redisClient.flushdb();
    }
  }

  private getFromMemory<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  private async getFromRedis<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  private setInMemory<T>(
    key: string,
    value: T,
    ttl: number = this.config.layers.memory.ttl
  ): void {
    this.memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    });
  }

  private async setInRedis<T>(
    key: string,
    value: T,
    ttl: number = this.config.layers.redis.ttl
  ): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), "EX", ttl);
  }

  private startMemoryCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.memoryCache.entries()) {
        if (now > entry.expiresAt) {
          this.memoryCache.delete(key);
        }
      }
    }, 60000); // Clean up every minute
  }
}
```

### 13.2 Cache Decorators

```typescript
// Cache decorators for methods
export function Cached(
  keyGenerator: (args: any[]) => string,
  options: CacheOptions = {}
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cache = Container.get(CacheManager);
      const key = keyGenerator(args);

      // Try to get from cache
      const cached = await cache.get(key);
      if (cached) return cached;

      // Execute method and cache result
      const result = await originalMethod.apply(this, args);
      await cache.set(key, result, options);

      return result;
    };

    return descriptor;
  };
}

// Cache invalidation decorators
export function InvalidateCache(keyGenerator: (args: any[]) => string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cache = Container.get(CacheManager);
      const result = await originalMethod.apply(this, args);
      const keys = keyGenerator(args);
      await cache.invalidate(keys);
      return result;
    };

    return descriptor;
  };
}

export function InvalidateCacheGroup(group: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cache = Container.get(CacheManager);
      const result = await originalMethod.apply(this, args);
      await cache.invalidateGroup(group);
      return result;
    };

    return descriptor;
  };
}
```

// ... continue with remaining sections ...

### 13.3 Cache Invalidation Strategies

The system implements several cache invalidation approaches:

- **Pattern-based invalidation**: Predefined patterns for common update scenarios
- **Time-based expiration**: Default TTL values with configurable overrides
- **Cascading invalidation**: Automatic invalidation of related caches
- **Manual invalidation**: API for explicit cache clearing

### 13.4 Cache Warming Procedures

Cache warming is implemented for frequently accessed data:

- **Startup warming**: Critical data loaded on system startup
- **Predictive warming**: Based on user behavior patterns
- **Background warming**: Periodic refresh of stale cache entries
- **On-demand warming**: Manual cache population for specific scenarios

### 13.5 Distributed Caching Considerations

The distributed caching architecture ensures:

- **Consistency**: Write-through caching with eventual consistency
- **Partitioning**: Consistent hashing for data distribution
- **Replication**: Configurable replication factor for reliability
- **Failover**: Automatic failover with Redis Sentinel

### 13.6 Cache Monitoring

Key metrics tracked for cache performance:

- Hit/miss ratios
- Memory usage
- Eviction rates
- Operation latency
- Cache size
- Invalidation frequency

### 13.7 Cache Optimization

Optimization strategies include:

- Automatic TTL adjustment based on access patterns
- Memory usage optimization
- Eviction policy tuning
- Regular performance analysis and adjustment

## 14. Deployment Pipeline Details

[To be completed]

## 15. Monitoring & Observability

[To be completed]

## 16. Disaster Recovery

[To be completed]

## 17. Performance Benchmarks

[To be completed]

## 18. API Documentation

[To be completed]

## 19. Client-Side Architecture

[To be completed]

## 20. Mobile Strategy

[To be completed]

## 21. Testing Strategy

[To be completed]

### 🟡 3.10 Import/Export System

#### 🟡 3.10.1 Import System

```typescript
interface ImportConfig {
  source: "monday" | "asana" | "jira" | "trello" | "csv" | "excel";
  workspace_id: string;
  options: {
    includeAttachments: boolean;
    includeHistory: boolean;
    preserveIds: boolean;
    mappings: FieldMapping[];
  };
}

interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformer?: (value: any) => any;
}
```

- 🟡 **Import Features**:
  - ✅ JSON data format support
  - 🟡 CSV/Excel import (in progress)
  - ❌ Platform-specific importers
  - ❌ Attachment import
  - ❌ History import

#### ✅ 3.10.2 Export System

```typescript
interface ExportConfig {
  format: "csv" | "excel" | "json";
  workspace_id: string;
  project_ids: string[];
  options: {
    includeAttachments: boolean;
    includeHistory: boolean;
    dateRange?: DateRange;
    fields: string[];
  };
}
```

- ✅ **Export Features**:
  - ✅ JSON data export
  - ✅ Project data export
  - ✅ Task data export
  - ✅ View configurations export
  - ✅ Comments export

#### ✅ 3.10.3 Database Structure

```sql
-- Import Jobs
CREATE TABLE import_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  source TEXT NOT NULL,
  config JSONB NOT NULL,
  progress INTEGER DEFAULT 0,
  total INTEGER,
  error TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Export Jobs
CREATE TABLE export_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  format TEXT NOT NULL,
  config JSONB NOT NULL,
  file_url TEXT,
  error TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 🟡 3.10.4 Platform-Specific Importers

- ❌ **Monday.com**:

  - ❌ API integration
  - ❌ Data mapping
  - ❌ Attachment handling

- ❌ **Asana**:

  - ❌ OAuth authentication
  - ❌ Workspace sync
  - ❌ Task import

- ❌ **Jira**:
  - ❌ Server/Cloud support
  - ❌ Issue mapping
  - ❌ Custom field support

#### 🟡 3.10.5 Import/Export UI

- 🟡 **Import Interface**:

  - ✅ File upload
  - 🟡 Source selection (in progress)
  - ❌ Field mapping
  - ❌ Preview and validation
  - ❌ Progress tracking

- ✅ **Export Interface**:
  - ✅ Format selection
  - ✅ Data selection
  - ✅ Export configuration
  - ✅ Download handling
  - ✅ Job history
