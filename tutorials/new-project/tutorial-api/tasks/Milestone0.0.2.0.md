# Milestone 0.0.2.0 - Database Schema, Migrations, and Types

**Version:** 0.0.2.0
**Date Created:** 2026-04-10
**Date Started:** 2026-04-10
**Date Completed:** 2026-04-10
**Status:** ✅ Complete
**Based on:** README.md database schema, ARCHITECTURE.md types, PRD.md MVP requirements

Create the PostgreSQL database tables, update TypeScript types to match the full schema spec, build a migration/seed runner, and verify end-to-end database operations.

---

## Version Information

**Current Version (at milestone start):**

- **tutorial-api:** `0.0.1.6`

**Target Version (after milestone completion):**

- **tutorial-api:** `0.0.2.5` (5 tasks)

**Task-Level Versioning:**
Each task completion increments the BUILD number (4th digit) by 1:

- Task 0 complete: 0.0.2.0
- Task 1 complete: 0.0.2.1
- Task 2 complete: 0.0.2.2
- Task 3 complete: 0.0.2.3
- Task 4 complete: 0.0.2.4
- Task 5 complete: 0.0.2.5

**Git Branch:**

- **tutorial-api:** `don-041026-0.0.2.0-api`

---

## Progress Summary

**Completion:** 6 of 6 tasks complete (100%)

| Task | Priority | Status | Version | Deployed |
|---|---|---|---|---|
| Task 0: Milestone Initialization | SETUP | ✅ Complete | 0.0.2.0 | - |
| Task 1: Create database migration SQL | HIGH | ✅ Complete | 0.0.2.1 | - |
| Task 2: Update TypeScript types to match schema | HIGH | ✅ Complete | 0.0.2.2 | - |
| Task 3: Build migration runner script | HIGH | ✅ Complete | 0.0.2.3 | - |
| Task 4: Create seed data script | MEDIUM | ✅ Complete | 0.0.2.4 | - |
| Task 5: Run migrations and seeds, verify database | MEDIUM | ✅ Complete | 0.0.2.5 | - |

---

## Overview

**Objective:** Create the PostgreSQL database schema (categories and tasks tables) with proper indexes and constraints, align TypeScript types with the full spec, and build tooling to run migrations and seed data.

**Scope:**

- SQL migration file with categories and tasks tables, indexes, and CHECK constraints
- TypeScript types updated to match schema (UUIDs, status/priority enums, due_date, color, sort_order)
- npm scripts for running migrations and seeding data
- Seed data for 4 default categories
- End-to-end verification that tables exist and queries work

**Dependencies:**

- Milestone 0.0.1.0 (Complete) — project scaffolding and PostgreSQL connection
- PostgreSQL must be running locally
- Database `tutorial` must exist (`createdb tutorial`)

---

## Git Workflow Policy

**CRITICAL: Claude Code must NOT commit or push code to GitHub.**

**Claude Code Responsibilities:**

- Write and modify code files
- Run TypeScript compilation to verify changes
- Run tests if requested
- Prepare code for review
- Create feature branches ONLY (git checkout -b, git push -u origin)

**User Responsibilities:**

- Review code changes in GitHub Desktop (or preferred git tool)
- Create commits with appropriate messages
- Push commits to feature branch
- Create pull requests
- Manage branches and merges

**The ONLY Git Exception:**
Branch creation for milestones:

- `git checkout -b don-041026-0.0.2.0-api`
- `git push -u origin don-041026-0.0.2.0-api`

All other git operations are handled by the developer.

---

## Task 0: Milestone Initialization (SETUP)

**Purpose:** Initialize milestone by confirming starting state and creating the feature branch
**Estimated Time:** 5-10 minutes
**Status:** ✅ Complete

### Step 0.1: Confirm Starting State

Confirm package.json version is `0.0.1.6` and PostgreSQL is running locally.

### Step 0.2: Create Feature Branch

**Branch Naming Format:** `don-041026-0.0.2.0-api`

```bash
cd "tutorials/new-project/tutorial-api"
git checkout -b don-041026-0.0.2.0-api
git push -u origin don-041026-0.0.2.0-api
```

### Step 0.3: Update Milestone Header

Update this document with confirmed Date Started.

### Success Criteria

- Feature branch created and pushed
- Milestone header updated with Date Started
- Ready to proceed with Task 1

---

## Task 1: Create Database Migration SQL (HIGH)

**Estimated Time:** 15 minutes
**Actual Time:**
**Status:** ✅ Complete
**Version:** 0.0.2.1
**Dependencies:** Task 0

### Description

Create the SQL migration file that defines the categories and tasks tables with all columns, constraints, indexes, and the uuid-ossp extension. This follows the schema defined in README.md and ARCHITECTURE.md exactly.

### Affected Files

- `src/db/migrations/001_create_tables.sql` (new)

### Implementation Steps

1. Create `src/db/migrations/` directory
2. Create `001_create_tables.sql` with:
   - `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
   - `categories` table: id (UUID PK), name (VARCHAR(100) UNIQUE NOT NULL), color (VARCHAR(7) default '#6B7280'), sort_order (INTEGER NOT NULL default 0), created_at, updated_at
   - `tasks` table: id (UUID PK), title (VARCHAR(255) NOT NULL), description (TEXT nullable), status (VARCHAR(20) NOT NULL default 'todo' with CHECK), priority (VARCHAR(20) NOT NULL default 'medium' with CHECK), due_date (TIMESTAMP nullable), category_id (UUID FK to categories ON DELETE SET NULL), created_at, updated_at
   - All indexes: idx_tasks_status, idx_tasks_priority, idx_tasks_due_date, idx_tasks_category_id, idx_categories_sort_order
3. Update package.json version to `0.0.2.1`

### Testing

- [ ] SQL file is valid (can be reviewed manually or run against a test DB)
- [ ] All columns, constraints, and indexes match README.md spec

### Success Criteria

- Migration SQL file exists with complete schema
- Schema matches README.md and ARCHITECTURE.md exactly
- package.json version is `0.0.2.1`

---

## Task 2: Update TypeScript Types to Match Schema (HIGH)

**Estimated Time:** 15 minutes
**Actual Time:**
**Status:** ✅ Complete
**Version:** 0.0.2.2
**Dependencies:** Task 1

### Description

The types created in Milestone 0.0.1.0 (`src/types/index.ts`) used placeholder types (numeric ids, boolean completed). Replace them with the full types from ARCHITECTURE.md: UUID strings, status/priority enums, due_date, color, sort_order, etc.

### Affected Files

- `src/types/index.ts`

### Implementation Steps

1. Define `TaskStatus` and `TaskPriority` union types
2. Update `Task` interface: id (string UUID), title, description, status (TaskStatus), priority (TaskPriority), due_date (string | null), category_id (string | null), created_at (string), updated_at (string)
3. Update `TaskCreate` interface: title required, optional description, status, priority, due_date, category_id
4. Update `TaskUpdate` interface: all fields optional, description/due_date/category_id allow null
5. Update `Category` interface: id (string UUID), name, color (string | null), sort_order (number), created_at, updated_at
6. Update `CategoryCreate`: name required, optional color, sort_order
7. Add `CategoryUpdate`: optional name, color, sort_order
8. Keep `ApiResponse<T>` generic type
9. Run `npm run typecheck` to verify
10. Update package.json version to `0.0.2.2`

### Testing

- [ ] `npm run typecheck` passes
- [ ] Types match ARCHITECTURE.md spec exactly

### Success Criteria

- All types match the database schema and ARCHITECTURE.md
- TypeScript compilation passes
- package.json version is `0.0.2.2`

---

## Task 3: Build Migration Runner Script (HIGH)

**Estimated Time:** 15 minutes
**Actual Time:**
**Status:** ✅ Complete
**Version:** 0.0.2.3
**Dependencies:** Task 1

### Description

Create a TypeScript script that reads SQL migration files from `src/db/migrations/` and executes them against the database. Add an npm script to run it.

### Affected Files

- `src/db/migrate.ts` (new)
- `package.json` (add `migrate` script)

### Implementation Steps

1. Create `src/db/migrate.ts` that:
   - Loads dotenv config
   - Connects to PostgreSQL using DATABASE_URL
   - Reads all `.sql` files from `src/db/migrations/` in sorted order
   - Executes each file's contents
   - Logs success/failure for each migration
   - Exits cleanly
2. Add `"migrate": "tsx src/db/migrate.ts"` to package.json scripts
3. Update package.json version to `0.0.2.3`

### Testing

- [ ] `npm run typecheck` passes
- [ ] `npm run migrate` executes without TypeScript errors (DB test in Task 5)

### Success Criteria

- Migration runner script exists and compiles
- `npm run migrate` script defined in package.json
- package.json version is `0.0.2.3`

---

## Task 4: Create Seed Data Script (MEDIUM)

**Estimated Time:** 10 minutes
**Actual Time:**
**Status:** ✅ Complete
**Version:** 0.0.2.4
**Dependencies:** Task 3

### Description

Create a script that inserts the default category seed data (Work, Personal, Urgent, Ideas) as defined in README.md. Add an npm script to run it.

### Affected Files

- `src/db/seed.ts` (new)
- `src/db/seeds/001_categories.sql` (new)
- `package.json` (add `seed` script)

### Implementation Steps

1. Create `src/db/seeds/` directory
2. Create `001_categories.sql` with the INSERT statements from README.md:
   - Work (#3B82F6, sort 1), Personal (#10B981, sort 2), Urgent (#EF4444, sort 3), Ideas (#8B5CF6, sort 4)
3. Create `src/db/seed.ts` that:
   - Loads dotenv config
   - Connects to PostgreSQL
   - Reads and executes `.sql` files from `src/db/seeds/`
   - Logs success/failure
   - Exits cleanly
4. Add `"seed": "tsx src/db/seed.ts"` to package.json scripts
5. Update package.json version to `0.0.2.4`

### Testing

- [ ] `npm run typecheck` passes
- [ ] `npm run seed` script defined

### Success Criteria

- Seed SQL and runner script exist and compile
- `npm run seed` script defined in package.json
- Seed data matches README.md exactly
- package.json version is `0.0.2.4`

---

## Task 5: Run Migrations and Seeds, Verify Database (MEDIUM)

**Estimated Time:** 15 minutes
**Actual Time:**
**Status:** ✅ Complete
**Version:** 0.0.2.5
**Dependencies:** Task 4

### Description

Execute the migration and seed scripts against the local PostgreSQL database and verify everything works end-to-end: tables created, indexes exist, seed data inserted, server starts and connects.

### Affected Files

- `package.json` (version bump only)

### Implementation Steps

1. Ensure the `tutorial` database exists: `createdb tutorial` (if not already)
2. Run `npm run migrate` — verify tables created
3. Run `npm run seed` — verify categories inserted
4. Run `npm run dev` and confirm:
   - Server starts on port 3001
   - Database connection succeeds
   - Health endpoint responds
5. Query the database directly to verify:
   - `categories` table has 4 rows
   - `tasks` table exists (empty)
   - All indexes present
6. Update package.json version to `0.0.2.5`

### Testing

- [ ] `npm run migrate` completes without errors
- [ ] `npm run seed` completes without errors
- [ ] `psql tutorial -c "SELECT * FROM categories"` returns 4 rows
- [ ] `psql tutorial -c "\d tasks"` shows correct schema
- [ ] `npm run dev` starts with successful DB connection
- [ ] Health endpoint responds correctly

### Success Criteria

- Database schema fully created and matches README.md
- Seed data loaded (4 categories)
- Dev server connects to database successfully
- Project is ready for CRUD endpoint development
- package.json version is `0.0.2.5`

---

**End of Milestone 0.0.2.0 Specification**
