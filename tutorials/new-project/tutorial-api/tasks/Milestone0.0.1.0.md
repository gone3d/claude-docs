# Milestone 0.0.1.0 - Project Setup and Scaffolding

**Version:** 0.0.1.0
**Date Created:** 2026-04-10
**Date Started:** 2026-04-10
**Date Completed:** 2026-04-10
**Status:** ✅ Complete
**Based on:** Project initialization for Tutorial API

Set up the Node.js + Express + TypeScript project with all core dependencies, database connection, and a clean development environment.

---

## Version Information

**Current Version (at milestone start):**

- **tutorial-api:** `0.0.0.0` (no package.json yet)

**Target Version (after milestone completion):**

- **tutorial-api:** `0.0.1.6` (6 tasks)

**Task-Level Versioning:**
Each task completion increments the BUILD number (4th digit) by 1:

- Task 0 complete: 0.0.1.0
- Task 1 complete: 0.0.1.1
- Task 2 complete: 0.0.1.2
- Task 3 complete: 0.0.1.3
- Task 4 complete: 0.0.1.4
- Task 5 complete: 0.0.1.5
- Task 6 complete: 0.0.1.6

**Git Branch:**

- **tutorial-api:** `don-041026-0.0.1.0-api`

---

## Progress Summary

**Completion:** 7 of 7 tasks complete (100%)

| Task | Priority | Status | Version | Deployed |
|---|---|---|---|---|
| Task 0: Milestone Initialization | SETUP | Complete | 0.0.1.0 | - |
| Task 1: Initialize Node.js + TypeScript project | HIGH | ✅ Complete | 0.0.1.1 | - |
| Task 2: Install core dependencies | HIGH | ✅ Complete | 0.0.1.2 | - |
| Task 3: Configure TypeScript and development scripts | HIGH | ✅ Complete | 0.0.1.3 | - |
| Task 4: Set up Express server with health endpoint | HIGH | ✅ Complete | 0.0.1.4 | - |
| Task 5: Configure PostgreSQL connection | MEDIUM | ✅ Complete | 0.0.1.5 | - |
| Task 6: Verify dev environment runs cleanly | MEDIUM | ✅ Complete | 0.0.1.6 | - |

---

## Overview

**Objective:** Bootstrap the tutorial-api project so it builds, runs, connects to PostgreSQL, and is ready for endpoint development.

**Scope:**

- Initialize a Node.js + TypeScript project with Express
- Install and configure all core dependencies
- Set up TypeScript compilation and dev scripts (tsx/nodemon)
- Create a running Express server with health check endpoint
- Configure PostgreSQL database connection
- Create the feature branch
- Verify the full stack starts cleanly

**Dependencies:**

- PostgreSQL must be installed and running locally

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

- `git checkout -b don-MMDDYY-0.0.1.0-api`
- `git push -u origin don-MMDDYY-0.0.1.0-api`

All other git operations are handled by the developer.

---

## Task 0: Milestone Initialization (SETUP)

**Purpose:** Initialize milestone by confirming starting state and creating the feature branch
**Estimated Time:** 5-10 minutes
**Status:** ✅ Complete

### Step 0.1: Confirm Starting State

No package.json exists yet. Starting version is 0.0.0.0. This milestone will produce version 0.0.1.0 through 0.0.1.6.

### Step 0.2: Create Feature Branch

**Branch Naming Format:** `don-MMDDYY-0.0.1.0-api`

```bash
cd "tutorials/new-project/tutorial-api"
git checkout -b don-MMDDYY-0.0.1.0-api
git push -u origin don-MMDDYY-0.0.1.0-api
```

### Step 0.3: Update Milestone Header

Update this document with confirmed Date Started.

### Success Criteria

- Feature branch created and pushed
- Milestone header updated with Date Started
- Ready to proceed with Task 1

---

## Task 1: Initialize Node.js + TypeScript Project (HIGH)

**Estimated Time:** 10 minutes
**Actual Time:**
**Status:** ✅ Complete
**Version:** 0.0.1.1
**Dependencies:** Task 0

### Description

Create the Node.js project with package.json and TypeScript configuration.

### Implementation Steps

1. Run `npm init -y` in the tutorial-api directory
2. Set the version in package.json to `0.0.1.1`
3. Set `"type": "module"` in package.json for ES module support
4. Install TypeScript: `npm install -D typescript @types/node`
5. Create `tsconfig.json` with strict mode, ES2022 target, NodeNext module resolution

### Affected Files

- `package.json` (new)
- `tsconfig.json` (new)

### Testing

- [ ] `npx tsc --version` shows TypeScript installed
- [ ] package.json has correct version and type

### Success Criteria

- Clean Node.js + TypeScript project exists
- package.json version is `0.0.1.1`
- tsconfig.json configured with strict mode

---

## Task 2: Install Core Dependencies (HIGH)

**Estimated Time:** 10 minutes
**Actual Time:**
**Status:** ✅ Complete
**Version:** 0.0.1.2
**Dependencies:** Task 1

### Description

Install Express, PostgreSQL client, CORS, and development dependencies.

### Implementation Steps

1. `npm install express cors pg dotenv`
2. `npm install -D @types/express @types/cors @types/pg tsx`
3. Update package.json version to `0.0.1.2`

### Affected Files

- `package.json`
- `package-lock.json`

### Testing

- [ ] `npm install` completes without errors
- [ ] All dependencies listed in package.json

### Success Criteria

- express, cors, pg, dotenv installed as dependencies
- TypeScript types and tsx installed as dev dependencies
- package.json version is `0.0.1.2`

---

## Task 3: Configure TypeScript and Development Scripts (HIGH)

**Estimated Time:** 10 minutes
**Actual Time:**
**Status:** ✅ Complete
**Version:** 0.0.1.3
**Dependencies:** Task 2

### Description

Set up development scripts for running the server with hot reload, building for production, and type checking.

### Implementation Steps

1. Add scripts to package.json:
   - `"dev": "tsx watch src/index.ts"` (hot reload dev server)
   - `"build": "tsc"` (production build)
   - `"start": "node dist/index.js"` (run production build)
   - `"typecheck": "tsc --noEmit"` (type checking only)
2. Create `src/` directory
3. Create a minimal `src/index.ts` placeholder
4. Update package.json version to `0.0.1.3`

### Affected Files

- `package.json`
- `src/index.ts` (new)

### Testing

- [ ] `npm run typecheck` passes
- [ ] `npm run dev` starts without crashing (placeholder OK)

### Success Criteria

- All four scripts defined in package.json
- src/ directory created with entry point
- package.json version is `0.0.1.3`

---

## Task 4: Set Up Express Server with Health Endpoint (HIGH)

**Estimated Time:** 15 minutes
**Actual Time:**
**Status:** ✅ Complete
**Version:** 0.0.1.4
**Dependencies:** Task 3

### Description

Create the Express application with CORS configuration, JSON parsing, and the /api/health endpoint.

### Implementation Steps

1. Create `src/index.ts` with Express app setup:
   - JSON body parsing middleware
   - CORS middleware (allow localhost:5173)
   - GET /api/health returning `{ success: true, data: { status: "ok" } }`
   - Listen on PORT from environment (default 3001)
2. Create `.env` with `PORT=3001` and database URL placeholder
3. Add `.env` to `.gitignore`
4. Create `.env.example` with same variables (no secrets)
5. Update package.json version to `0.0.1.4`

### Affected Files

- `src/index.ts`
- `.env` (new)
- `.env.example` (new)
- `.gitignore` (new or updated)

### Testing

- [ ] `npm run dev` starts the server on port 3001
- [ ] `curl http://localhost:3001/api/health` returns `{ "success": true, "data": { "status": "ok" } }`
- [ ] CORS headers present in response

### Success Criteria

- Express server starts and listens on port 3001
- Health endpoint responds correctly
- CORS configured for Tutorial UI origin
- Environment variables loaded from .env
- package.json version is `0.0.1.4`

---

## Task 5: Configure PostgreSQL Connection (MEDIUM)

**Estimated Time:** 15 minutes
**Actual Time:**
**Status:** ✅ Complete
**Version:** 0.0.1.5
**Dependencies:** Task 4

### Description

Set up the PostgreSQL connection pool and verify connectivity. Create the project directory structure for routes, controllers, services, middleware, models, and types.

### Implementation Steps

1. Add `DATABASE_URL=postgresql://localhost:5432/tutorial` to `.env`
2. Create `src/db/index.ts` with pg Pool configuration from DATABASE_URL
3. Create the `src/` subdirectories: `routes/`, `controllers/`, `services/`, `middleware/`, `models/`, `types/`, `db/`
4. Create `src/types/index.ts` with shared TypeScript types (Task, Category, TaskCreate, TaskUpdate, etc.)
5. Add database connection test to server startup (log success/failure)
6. Update package.json version to `0.0.1.5`

### Affected Files

- `.env`
- `.env.example`
- `src/db/index.ts` (new)
- `src/types/index.ts` (new)
- `src/index.ts` (add DB connection test)
- Various empty directories

### Testing

- [ ] Server starts and logs database connection status
- [ ] If PostgreSQL is running, connection succeeds
- [ ] If PostgreSQL is not running, server starts but logs connection error gracefully
- [ ] `npm run typecheck` passes

### Success Criteria

- PostgreSQL connection pool configured
- Server logs DB connection status on startup
- Project directory structure in place
- Shared types defined
- package.json version is `0.0.1.5`

---

## Task 6: Verify Dev Environment Runs Cleanly (MEDIUM)

**Estimated Time:** 10 minutes
**Actual Time:**
**Status:** ✅ Complete
**Version:** 0.0.1.6
**Dependencies:** Task 5

### Description

Final verification that the entire development environment is working. Ensure TypeScript compiles, the server starts, the health endpoint responds, and the database connects.

### Implementation Steps

1. Run `npx tsc --noEmit` to verify TypeScript compilation
2. Start the server with `npm run dev`
3. Test the health endpoint with curl
4. Verify database connection logs
5. Confirm the response format matches the spec: `{ success: true, data: { status: "ok" } }`
6. Update package.json version to `0.0.1.6`

### Affected Files

- `package.json` (version bump only)

### Testing

- [ ] `npx tsc --noEmit` passes with no errors
- [ ] `npm run dev` starts without errors
- [ ] Health endpoint returns correct response format
- [ ] Database connection established (or graceful failure logged)
- [ ] No unhandled promise rejections in console

### Success Criteria

- Dev server runs cleanly with no errors
- TypeScript compiles without errors
- Health endpoint responds correctly
- Database connection verified
- package.json version is `0.0.1.6`
- Project is ready for endpoint development

---

**End of Milestone 0.0.1.0 Specification**
