# ARCHITECTURE.md: Tutorial UI

> Technical reference. Read this to understand how the system is built and why.

---

## System Overview

Tutorial UI is a React single-page application that communicates with the Tutorial API over REST. The frontend handles all presentation and user interaction. The API handles data validation, persistence, and business logic. The database is PostgreSQL, managed entirely by the API.

### Architecture Diagram (text)
```
[Browser] -> [Frontend: React + Vite @ localhost:5173]
                ↓ REST API (VITE_API_URL)
           [Backend: Express + TypeScript @ localhost:3001]
                ↓
           [Database: PostgreSQL]
```

---

## Tech Stack

### Frontend (tutorial-ui)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Testing**: TBD (Vitest recommended)
- **Deployment**: TBD

### Backend (tutorial-api)
- **Runtime**: Node.js
- **Framework**: Express + TypeScript
- **Auth**: None (tutorial app)
- **Testing**: TBD
- **Deployment**: TBD (Railway considered)

### Database
- **Platform**: PostgreSQL
- **ORM/Query**: TBD (pg or Prisma)

---

## Frontend Architecture

### Component Structure
```
src/
├── components/        # Reusable UI components
│   ├── TaskCard       # Task in list view: priority badge, due date, status
│   ├── TaskForm       # Create/edit form with validation
│   ├── CategoryBadge  # Colored pill showing category name
│   ├── PriorityBadge  # Color-coded priority indicator
│   ├── StatusTabs     # Tab bar: All / Todo / In Progress / Done
│   ├── FilterBar      # Priority, category, and sort dropdowns
│   └── ConfirmDialog  # Reusable confirmation modal
├── pages/             # Route-level page components
│   ├── TaskListPage   # / — main view with filtering and sorting
│   ├── TaskCreatePage # /tasks/new — create task form
│   ├── TaskDetailPage # /tasks/:id — view/edit single task
│   └── CategoriesPage # /categories — manage categories
├── stores/            # Zustand state management
├── hooks/             # Custom React hooks
├── services/          # API service layer
└── types/             # TypeScript type definitions
```

### Routes

| Route | Component | Description |
|---|---|---|
| / | TaskListPage | Main view. Lists tasks with filtering, sorting, status tabs |
| /tasks/new | TaskCreatePage | Form to create a new task |
| /tasks/:id | TaskDetailPage | View/edit a single task |
| /categories | CategoriesPage | Manage categories (list, create, edit, delete) |

### Priority Colors

| Priority | Tailwind Class | Hex |
|---|---|---|
| Low | gray-400 | #9CA3AF |
| Medium | blue-500 | #3B82F6 |
| High | orange-500 | #F97316 |
| Critical | red-500 | #EF4444 |

### Key Patterns
_(Add patterns here as they are established)_

---

## API Integration

### Environment Variables

```
VITE_API_URL=http://localhost:3001
```

Accessed via `import.meta.env.VITE_API_URL`.

### API Response Format

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string }
```

### API Endpoints Consumed

| Method | Endpoint | UI Usage |
|---|---|---|
| GET | /api/health | Connection status indicator on load |
| GET | /api/tasks | Task list page (supports query params for filtering/sorting) |
| GET | /api/tasks/:id | Task detail/edit view |
| POST | /api/tasks | Create task form submission |
| PUT | /api/tasks/:id | Edit task form submission |
| DELETE | /api/tasks/:id | Delete confirmation action |
| GET | /api/categories | Category filter dropdown, category management page |
| GET | /api/categories/:id | Category detail with task count |
| POST | /api/categories | Create category form |
| PUT | /api/categories/:id | Edit category form |
| DELETE | /api/categories/:id | Delete category (tasks get category_id set to null) |

### Query Parameters (GET /api/tasks)

| Parameter | Type | Default | UI Component |
|---|---|---|---|
| status | string | (all) | Status filter tabs: All, Todo, In Progress, Done |
| priority | string | (all) | Priority filter dropdown |
| category_id | UUID | (all) | Category filter dropdown |
| sort | string | created_at | Sort dropdown: Date Created, Due Date, Priority, Title |
| order | string | desc | Sort direction toggle |
| limit | integer | 50 | Pagination |
| offset | integer | 0 | Pagination |

### TypeScript Types (shared with API)

```typescript
type TaskStatus = 'todo' | 'in_progress' | 'done'
type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null     // ISO 8601 timestamp
  category_id: string | null
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  name: string
  color: string | null        // hex color, e.g. '#3B82F6'
  sort_order: number
  created_at: string
  updated_at: string
}

interface TaskCreate {
  title: string
  description?: string
  status?: TaskStatus         // defaults to 'todo'
  priority?: TaskPriority     // defaults to 'medium'
  due_date?: string
  category_id?: string
}

interface TaskUpdate {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string | null
  category_id?: string | null
}
```

---

## Database Schema

The database is managed entirely by the tutorial-api. Included here for frontend reference.

### tasks

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique task identifier |
| title | VARCHAR(255) | NOT NULL | Task title |
| description | TEXT | NULLABLE | Detailed description |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'todo' | One of: todo, in_progress, done |
| priority | VARCHAR(20) | NOT NULL, DEFAULT 'medium' | One of: low, medium, high, critical |
| due_date | TIMESTAMP | NULLABLE | Optional deadline |
| category_id | UUID | NULLABLE, REFERENCES categories(id) ON DELETE SET NULL | Optional category grouping |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modification time |

**Indexes:** idx_tasks_status, idx_tasks_priority, idx_tasks_due_date, idx_tasks_category_id

### categories

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique category identifier |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Category name |
| color | VARCHAR(7) | NULLABLE, DEFAULT '#6B7280' | Hex color for UI display |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 | Display order in UI |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modification time |

**Indexes:** idx_categories_sort_order

### Seed Categories

| Name | Color | Sort Order |
|---|---|---|
| Work | #3B82F6 | 1 |
| Personal | #10B981 | 2 |
| Urgent | #EF4444 | 3 |
| Ideas | #8B5CF6 | 4 |

---

## Architectural Decisions (ADR Log)

> Record decisions here when they are final and architectural in scope.
> Task-level decisions belong in the milestone file where they were made.

_(Add ADRs as decisions are made)_
