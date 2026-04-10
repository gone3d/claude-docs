# Milestone 0.0.1.0 - Project Setup and Scaffolding

**Version:** 0.0.1.0
**Date Created:** 2026-04-10
**Date Started:**
**Date Completed:**
**Status:** Planning
**Based on:** Project initialization for Tutorial UI

Set up the React + TypeScript + Vite project with all core dependencies, Tailwind CSS configuration, and a clean development environment.

---

## Version Information

**Current Version (at milestone start):**

- **tutorial-ui:** `0.0.0.0` (no package.json yet)

**Target Version (after milestone completion):**

- **tutorial-ui:** `0.0.1.5` (5 tasks)

**Task-Level Versioning:**
Each task completion increments the BUILD number (4th digit) by 1:

- Task 0 complete: 0.0.1.0
- Task 1 complete: 0.0.1.1
- Task 2 complete: 0.0.1.2
- Task 3 complete: 0.0.1.3
- Task 4 complete: 0.0.1.4
- Task 5 complete: 0.0.1.5

**Git Branch:**

- **tutorial-ui:** `don-MMDDYY-0.0.1.0-ui`

---

## Progress Summary

**Completion:** 0 of 6 tasks complete (0%)

| Task | Priority | Status | Version | Deployed |
|---|---|---|---|---|
| Task 0: Milestone Initialization | SETUP | Pending | - | - |
| Task 1: Initialize Vite + React + TypeScript project | HIGH | Pending | 0.0.1.1 | - |
| Task 2: Install core dependencies | HIGH | Pending | 0.0.1.2 | - |
| Task 3: Configure Tailwind CSS | HIGH | Pending | 0.0.1.3 | - |
| Task 4: Configure development environment | MEDIUM | Pending | 0.0.1.4 | - |
| Task 5: Verify dev environment runs cleanly | MEDIUM | Pending | 0.0.1.5 | - |

---

## Overview

**Objective:** Bootstrap the tutorial-ui project so it builds, runs, and is ready for feature development.

**Scope:**

- Scaffold a Vite + React + TypeScript project
- Install and configure Tailwind CSS, React Router, and Zustand
- Set up TypeScript config, linting, and environment variables
- Create the feature branch
- Verify `npm run dev` serves a clean page

**Dependencies:**

- None (this is the first milestone)

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

- `git checkout -b don-MMDDYY-0.0.1.0-ui`
- `git push -u origin don-MMDDYY-0.0.1.0-ui`

All other git operations are handled by the developer.

---

## Task 0: Milestone Initialization (SETUP)

**Purpose:** Initialize milestone by confirming starting state and creating the feature branch
**Estimated Time:** 5-10 minutes
**Status:** Pending

### Step 0.1: Confirm Starting State

No package.json exists yet. Starting version is 0.0.0.0. This milestone will produce version 0.0.1.0 through 0.0.1.5.

### Step 0.2: Create Feature Branch

**Branch Naming Format:** `don-MMDDYY-0.0.1.0-ui`

```bash
cd "tutorials/new-project/tutorial-ui"
git checkout -b don-MMDDYY-0.0.1.0-ui
git push -u origin don-MMDDYY-0.0.1.0-ui
```

### Step 0.3: Update Milestone Header

Update this document with confirmed Date Started.

### Success Criteria

- Feature branch created and pushed
- Milestone header updated with Date Started
- Ready to proceed with Task 1

---

## Task 1: Initialize Vite + React + TypeScript Project (HIGH)

**Estimated Time:** 15 minutes
**Actual Time:**
**Status:** Pending
**Version:** 0.0.1.1
**Dependencies:** Task 0

### Description

Scaffold a new React + TypeScript project using Vite. This creates the project structure, package.json, tsconfig, and default files.

### Implementation Steps

1. Run `npm create vite@latest . -- --template react-ts` in the tutorial-ui directory
2. Set the version in package.json to `0.0.1.1`
3. Remove Vite boilerplate (default App.tsx content, App.css, default assets)
4. Keep the project structure but clear placeholder content

### Testing

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts the Vite dev server
- [ ] Browser loads at localhost:5173

### Success Criteria

- Clean Vite + React + TypeScript project exists
- package.json version is `0.0.1.1`
- No boilerplate content remains

---

## Task 2: Install Core Dependencies (HIGH)

**Estimated Time:** 10 minutes
**Actual Time:**
**Status:** Pending
**Version:** 0.0.1.2
**Dependencies:** Task 1

### Description

Install the runtime and dev dependencies for the project: React Router for navigation, Zustand for state management.

### Implementation Steps

1. `npm install react-router-dom zustand`
2. Update package.json version to `0.0.1.2`

### Affected Files

- `package.json`
- `package-lock.json`

### Testing

- [ ] `npm install` completes without errors
- [ ] `npm run dev` still starts cleanly
- [ ] Dependencies appear in package.json

### Success Criteria

- react-router-dom and zustand installed and listed in dependencies
- package.json version is `0.0.1.2`

---

## Task 3: Configure Tailwind CSS (HIGH)

**Estimated Time:** 15 minutes
**Actual Time:**
**Status:** Pending
**Version:** 0.0.1.3
**Dependencies:** Task 2

### Description

Install and configure Tailwind CSS v4 for the project.

### Implementation Steps

1. `npm install tailwindcss @tailwindcss/vite`
2. Add the Tailwind Vite plugin to `vite.config.ts`
3. Add `@import "tailwindcss"` to the main CSS file
4. Verify Tailwind utility classes work by adding a test class to App.tsx
5. Update package.json version to `0.0.1.3`

### Affected Files

- `package.json`
- `vite.config.ts`
- `src/index.css`
- `src/App.tsx` (verification)

### Testing

- [ ] `npm run dev` starts without errors
- [ ] Tailwind utility classes render correctly in the browser

### Success Criteria

- Tailwind CSS is installed and functional
- Utility classes apply styles correctly
- package.json version is `0.0.1.3`

---

## Task 4: Configure Development Environment (MEDIUM)

**Estimated Time:** 15 minutes
**Actual Time:**
**Status:** Pending
**Version:** 0.0.1.4
**Dependencies:** Task 3

### Description

Set up environment variables, TypeScript strict mode, and basic project structure directories.

### Implementation Steps

1. Create `.env` with `VITE_API_URL=http://localhost:3001`
2. Add `.env` to `.gitignore` (if not already there)
3. Create `.env.example` with the same variable (no sensitive values)
4. Verify tsconfig.json has strict mode enabled
5. Create the `src/` subdirectories: `components/`, `pages/`, `stores/`, `hooks/`, `services/`, `types/`
6. Create `src/types/index.ts` with the shared TypeScript types (Task, Category, etc.)
7. Update package.json version to `0.0.1.4`

### Affected Files

- `.env` (new)
- `.env.example` (new)
- `.gitignore`
- `tsconfig.json`
- `src/types/index.ts` (new)
- Various empty directories

### Testing

- [ ] `import.meta.env.VITE_API_URL` resolves in the app
- [ ] TypeScript compiles with strict mode
- [ ] Directory structure is in place

### Success Criteria

- Environment variable configured and accessible
- TypeScript strict mode enabled
- Project directory structure created
- Shared types defined
- package.json version is `0.0.1.4`

---

## Task 5: Verify Dev Environment Runs Cleanly (MEDIUM)

**Estimated Time:** 10 minutes
**Actual Time:**
**Status:** Pending
**Version:** 0.0.1.5
**Dependencies:** Task 4

### Description

Final verification that the entire development environment is working. Create a minimal App.tsx that proves routing, Tailwind, and the API URL config all work.

### Implementation Steps

1. Set up React Router in `src/main.tsx` with BrowserRouter
2. Create a minimal `src/App.tsx` with a route structure matching the planned pages
3. Add placeholder page components that display the route name
4. Verify Tailwind classes render on the placeholder pages
5. Confirm `VITE_API_URL` is accessible from a component
6. Run `npx tsc --noEmit` to verify TypeScript compilation
7. Update package.json version to `0.0.1.5`

### Affected Files

- `src/main.tsx`
- `src/App.tsx`
- `src/pages/TaskListPage.tsx` (placeholder)
- `src/pages/TaskCreatePage.tsx` (placeholder)
- `src/pages/TaskDetailPage.tsx` (placeholder)
- `src/pages/CategoriesPage.tsx` (placeholder)

### Testing

- [ ] `npm run dev` starts without errors
- [ ] All four routes render their placeholder content
- [ ] Tailwind classes are applied visually
- [ ] `npx tsc --noEmit` passes with no errors
- [ ] Browser console shows no errors

### Success Criteria

- Dev server runs cleanly with no errors
- All planned routes are accessible
- Tailwind CSS is visually confirmed working
- TypeScript compiles without errors
- package.json version is `0.0.1.5`
- Project is ready for feature development

---

**End of Milestone 0.0.1.0 Specification**
