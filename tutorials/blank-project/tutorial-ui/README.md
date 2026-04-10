# Tutorial UI

Frontend for the Tutorial App. A simple task management application built with React + TypeScript + Tailwind CSS + Vite.

This repo is used as a walkthrough for the [claude-docs skill system](../../docs/Tutorial.md).

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS for styling
- React Router v6 for navigation
- Zustand for state management (lightweight, no boilerplate)

## API Integration

The frontend consumes the Tutorial API at `http://localhost:3001` during development. All data is persisted server-side. The UI makes no direct database calls.

### Environment Variables

```
VITE_API_URL=http://localhost:3001
```

Create a `.env` file in the project root with the above. Vite exposes this as `import.meta.env.VITE_API_URL`.

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

### API Response Format

All API responses follow this structure:

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string }
```

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

## Pages

| Route | Component | Description |
|---|---|---|
| / | TaskListPage | Main view. Lists all tasks with filtering, sorting, and status tabs |
| /tasks/new | TaskCreatePage | Form to create a new task |
| /tasks/:id | TaskDetailPage | View/edit a single task |
| /categories | CategoriesPage | Manage categories (list, create, edit, delete) |

## UI Components

| Component | Purpose |
|---|---|
| TaskCard | Displays a task in the list with priority badge, due date, and status |
| TaskForm | Create/edit form with validation (title required, due date optional) |
| CategoryBadge | Colored pill showing category name |
| PriorityBadge | Color-coded priority indicator (gray/blue/orange/red) |
| StatusTabs | Tab bar for filtering by status (All / Todo / In Progress / Done) |
| FilterBar | Dropdowns for priority, category, and sort options |
| ConfirmDialog | Reusable confirmation modal for destructive actions |

## Priority Colors

| Priority | Tailwind Class | Hex |
|---|---|---|
| Low | gray-400 | #9CA3AF |
| Medium | blue-500 | #3B82F6 |
| High | orange-500 | #F97316 |
| Critical | red-500 | #EF4444 |

## Development

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`. Requires the [tutorial-api](../tutorial-api) running on port 3001.
