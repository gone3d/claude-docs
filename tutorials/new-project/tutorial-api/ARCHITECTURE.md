# ARCHITECTURE.md: Tutorial API

> Technical reference. Read this to understand how the system is built and why.

---

## System Overview

Tutorial API is an Express REST server that provides CRUD operations for tasks and categories. It validates input, manages PostgreSQL persistence, and returns structured JSON responses. The Tutorial UI frontend is its sole consumer.

### Architecture Diagram (text)
```
[Tutorial UI @ localhost:5173]
        ↓ REST API (JSON)
[Tutorial API: Express + TypeScript @ localhost:3001]
        ↓ SQL queries
[PostgreSQL Database]
```

---

## Tech Stack

### Backend (tutorial-api)
- **Runtime**: Node.js
- **Framework**: Express + TypeScript
- **Auth**: None (tutorial app)
- **Testing**: TBD (Vitest recommended)
- **Deployment**: TBD (Railway considered)

### Frontend (tutorial-ui — sibling repo)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6

### Database
- **Platform**: PostgreSQL
- **ORM/Query**: TBD (pg or Prisma)

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Health check |
| GET | /api/tasks | List all tasks (supports filtering and sorting) |
| GET | /api/tasks/:id | Get a single task |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |
| GET | /api/categories | List all categories |
| GET | /api/categories/:id | Get a category with its tasks |
| POST | /api/categories | Create a category |
| PUT | /api/categories/:id | Update a category |
| DELETE | /api/categories/:id | Delete a category |

### Query Parameters (GET /api/tasks)

| Parameter | Type | Default | Description |
|---|---|---|---|
| status | string | (all) | Filter by status: todo, in_progress, done |
| priority | string | (all) | Filter by priority: low, medium, high, critical |
| category_id | UUID | (all) | Filter by category |
| sort | string | created_at | Sort field: created_at, due_date, priority, title |
| order | string | desc | Sort order: asc, desc |
| limit | integer | 50 | Max results per page |
| offset | integer | 0 | Pagination offset |

### Response Format

All endpoints return a consistent JSON structure:

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string }
```

---

## Backend Architecture

### API Structure
```
src/
├── routes/        # Route handlers
├── controllers/   # Request/response logic
├── services/      # Business logic
├── middleware/     # CORS, validation, error handling
├── models/        # Database models / queries
├── types/         # TypeScript type definitions
├── db/            # Database connection, migrations, seeds
└── index.ts       # Entry point
```

### TypeScript Types

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

### Key Patterns
_(Add patterns here as they are established)_

---

## Database Schema

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

**Indexes:**
- `idx_tasks_status` on (status)
- `idx_tasks_priority` on (priority)
- `idx_tasks_due_date` on (due_date)
- `idx_tasks_category_id` on (category_id)

### categories

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique category identifier |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Category name |
| color | VARCHAR(7) | NULLABLE, DEFAULT '#6B7280' | Hex color for UI display |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 | Display order in UI |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modification time |

**Indexes:**
- `idx_categories_sort_order` on (sort_order)

### SQL

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#6B7280',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_sort_order ON categories(sort_order);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'todo'
    CHECK (status IN ('todo', 'in_progress', 'done')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  due_date TIMESTAMP,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_category_id ON tasks(category_id);
```

### Seed Data

```sql
INSERT INTO categories (name, color, sort_order) VALUES
  ('Work', '#3B82F6', 1),
  ('Personal', '#10B981', 2),
  ('Urgent', '#EF4444', 3),
  ('Ideas', '#8B5CF6', 4);
```

---

## Architectural Decisions (ADR Log)

> Record decisions here when they are final and architectural in scope.
> Task-level decisions belong in the milestone file where they were made.

_(Add ADRs as decisions are made)_
