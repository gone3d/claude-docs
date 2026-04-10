# Tutorial API

Backend REST API for the Tutorial App. Provides CRUD endpoints for tasks and categories with data validation and persistence.

This repo is used as a walkthrough for the [claude-docs skill system](../../docs/Tutorial.md).

## Tech Stack

- Node.js + Express + TypeScript
- PostgreSQL (via pg or Prisma, TBD)
- Deployed to Railway (TBD)

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

## Query Parameters

### GET /api/tasks

| Parameter | Type | Default | Description |
|---|---|---|---|
| status | string | (all) | Filter by status: todo, in_progress, done |
| priority | string | (all) | Filter by priority: low, medium, high, critical |
| category_id | UUID | (all) | Filter by category |
| sort | string | created_at | Sort field: created_at, due_date, priority, title |
| order | string | desc | Sort order: asc, desc |
| limit | integer | 50 | Max results per page |
| offset | integer | 0 | Pagination offset |

## Response Format

All endpoints return a consistent JSON structure:

```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```
