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
- ✅ **Drag and Drop**: @hello-pangea/dnd

### ✅ 2.2 Architectural Principles

- ✅ Project-centric architecture
- ✅ Real-time collaboration using Supabase subscriptions
- ✅ Serverless backend design using Next.js API routes
- ✅ Comprehensive SEO optimization
- ✅ Performance-first approach
- ✅ Accessibility compliance (WCAG 2.1)
- ✅ Automated maintenance through GitHub Actions

### 2.3 Drag and Drop Implementation

The application uses @hello-pangea/dnd for all drag-and-drop functionality, chosen for:

- **Performance**: Optimized for React with minimal re-renders
- **Accessibility**: Built-in keyboard support and ARIA attributes
- **Cross-Platform**: Full feature support across browsers and devices
- **Virtualization Support**: Compatible with virtual scrolling implementations
- **TypeScript Support**: Full type definitions included

Key drag-and-drop features:

- Task/item dragging with customizable previews
- Column and group reordering
- External file drag-and-drop support
- Automatic scrolling during drag operations
- Cross-view drag and drop support

Implementation approach:

- DragDropContext for managing drag state
- Droppable areas for valid drop targets
- Draggable items with custom previews
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

## ✅ 2.4 Design System

### ✅ 2.4.1 Color Palette

The color system is designed to be accessible, professional, and distinctive while maintaining excellent contrast ratios and supporting both light and dark modes.

#### Primary Colors

- ✅ **Primary**: Rich Teal (#0A7B83)
  - Light mode: Used for primary actions, links, and brand elements
  - Dark mode: Adjusted for better visibility while maintaining brand identity
- ✅ **Primary Foreground**: White in light mode, slightly off-white in dark mode

#### Secondary Colors

- ✅ **Secondary**: Complementary teal shades
  - Light mode: Lighter teal tints for backgrounds and accents
  - Dark mode: Darker teal shades for depth and hierarchy

#### Status Colors

- ✅ **Success**: Professional green
- ✅ **Warning**: Clear amber
- ✅ **Destructive**: Clear red
- ✅ **Info**: Bright blue

#### UI Colors

- ✅ **Background**:
  - Light mode: Pure white (#FFFFFF)
  - Dark mode: Rich dark background (#0F172A)
- ✅ **Foreground**:
  - Light mode: Near black (#020817)
  - Dark mode: Off-white (#F8FAFC)
- ✅ **Muted**: Subtle teal tints for backgrounds
- ✅ **Muted Foreground**: Subdued text color
- ✅ **Border**: Subtle borders matching the theme
- ✅ **Ring**: Focus rings using primary color

#### ✅ Color Usage Guidelines

- ✅ Primary color for main CTAs and important interactive elements
- ✅ Secondary color for less prominent actions and hover states
- ✅ Status colors reserved for their specific meanings
- ✅ Muted colors for backgrounds and disabled states
- ✅ All color combinations meet WCAG 2.1 contrast requirements
- ✅ Optimized for colorblind accessibility
- ✅ Consistent visual hierarchy in both light and dark modes

### ✅ 2.4.2 Theme System

#### Theme Implementation

- ✅ **Theme Toggle**: Implemented with smooth transitions
- ✅ **System Preference Detection**: Automatically matches system theme
- ✅ **Persistent Theme Choice**: Saves user preference
- ✅ **Dark Mode Optimization**:
  - ✅ Enhanced readability
  - ✅ Proper contrast between sections
  - ✅ Maintained visual hierarchy
  - ✅ Optimized for reduced eye strain

#### ✅ Component Theming

- ✅ **Cards and Sections**:
  - Light mode: Subtle shadows and borders
  - Dark mode: Subtle background shifts for depth
- ✅ **Interactive Elements**:
  - Consistent hover and focus states
  - Clear active states
  - Accessible focus indicators
- ✅ **Typography**:
  - Optimized contrast ratios
  - Maintained readability in both modes

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

- ✅ **Tables**:
  - ✅ Collapsible tables
  - Table-level summaries
  - ✅ Custom table styling
  - ✅ Drag-and-drop reordering
- ✅ **Columns**:
  - ✅ Custom column types (text, status, person, date implemented)
  - ✅ Column visibility controls
  - ✅ Column resizing and reordering
  - ✅ Column-specific filters
  - ✅ Horizontal scrolling with fixed width constraints
- ✅ **Status Column Implementation**:
  - ✅ Special column type that drives kanban view
  - ✅ Default statuses provided (Not Started, In Progress, Done)
  - ✅ Custom status creation with color picker
  - ✅ Status order preserved across views
  - ✅ Status changes sync between table and kanban

### 🟡 3.3 Task Management

- 🟡 **Task Modal**:

  - ✅ Single-page layout (no tabs)
  - ✅ Rich text description
  - ❌ File attachments with previews
  - ✅ Collapsible activity log
  - ✅ Integrated comments section
  - ✅ Custom fields display (status, person, date)
  - ❌ Quick actions sidebar

- 🟡 **Comments & Updates**:
  - ✅ Basic text support
  - ❌ @mentions
  - ❌ File attachments
  - ❌ Emoji reactions
  - ❌ Comment resolution
  - ❌ Email notifications

### ✅ 3.4 Real-time Collaboration

- ✅ **Live Updates**:

  - ✅ Instant task changes
  - ✅ Real-time field updates
  - ✅ Task position updates
  - ✅ Column width persistence
  - ✅ User presence indicators
  - ✅ Concurrent editing support

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
  - ✅ Table settings
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

[SQL code for status configuration has been moved to schema.sql]

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

[SQL code for column storage has been moved to schema.sql]

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

[SQL code for workspace tables has been moved to schema.sql]

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

## 5. Database Schema

The complete database schema, including all tables, functions, triggers, and policies, can be found in `supabase/schema.sql`.

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
  - ✅ Google (✓ Implemented)
    - Google Cloud Console Configuration:
      - Project: PMTools.pro
      - Authorized JavaScript origins: https://pmtools.pro
      - Authorized redirect URIs: https://pmtools.pro/auth/callback
      - OAuth consent screen configured
      - Client ID and Secret generated
    - Supabase Configuration:
      - Provider: Google
      - Client ID and Secret configured
      - Redirect URL verified
      - OAuth scopes: profile, email
      - Additional settings:
        - Access type: offline
        - Prompt: consent
  - ✅ GitHub (✓ Implemented)
    - GitHub OAuth App Configuration:
      - Application name: PMTools.pro
      - Homepage URL: https://pmtools.pro
      - Authorization callback URL: https://pmtools.pro/auth/callback
      - Client ID and Secret generated
    - Supabase Configuration:
      - Provider: GitHub
      - Client ID and Secret configured
      - Redirect URL verified
      - OAuth scopes: read:user, user:email
  - ✅ Microsoft Azure AD (✓ Implemented)
    - Azure AD App Configuration:
      - Application name: PMTools
      - Client ID and Secret generated
      - Permissions configured:
        - email
        - openid
        - profile
        - User.Read
      - Token configuration:
        - Email claims added for ID and Access tokens
    - Supabase Configuration:
      - Provider: Azure
      - Client ID and Secret configured
      - Redirect URL verified
      - OAuth scopes: openid, email, profile, User.Read
  - Magic Link (Passwordless):
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

[SQL code for permission tables has been moved to schema.sql]

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
│   │   │   │   ├── kanban/    # Kanban view
│   │   │   │   └── settings/  # Project settings
│   │   │   ├── new/       # New project
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
└── docs/              # Documentation
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
