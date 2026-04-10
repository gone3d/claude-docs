Scaffold a complete project management document set for a new project. Generates lean, structured files that serve as living reference, not growing logs. All session history and implementation detail stays in milestone files.

**This skill is proactive.** Read existing files first, extract what you can, only ask about what's missing, then generate all files and report. Do not stop after asking questions. The goal is to go from an empty (or near-empty) repo to a fully scaffolded project in one conversation.

---

## Step 1: Load Session + Parse Arguments

Get terminal ID and load session context if available:
```bash
echo "${TERM_SESSION_ID:-${ITERM_SESSION_ID:-$$}}"
```

$ARGUMENTS may contain a project folder name. If so, generate files there. If not, and a session is active, confirm with the user which folder to use.

---

## Step 2: Read Existing Files

Read ALL existing files in the target folder before asking any questions. Look for:

- `README.md` (often contains project description, tech stack, API endpoints, DB schema)
- `package.json` (project name, version, dependencies reveal tech stack)
- Any other `.md` files (architecture docs, planning docs, etc.)
- Any existing `src/` or `functions/` structure (reveals framework choices)

Extract as much as possible:
- Project name (from package.json name field, README title, or folder name)
- Tech stack (from dependencies, README, or file structure)
- Database schema (from README, SQL files, or migration folders)
- API endpoints (from README, route files, or existing docs)
- Who it's for (from README description)
- MVP features (from README feature lists)

---

## Step 3: Present Findings and Fill Gaps

Show the user what you found:

```
Based on your existing files, here's what I have:

Project name: [extracted or folder name]
Description: [from README or "not found"]
Tech stack: [from package.json/README or "not found"]
Database: [from README schema or "not found"]
Repository structure: [from sibling folders or "single repo"]
Developer name: [from git config or "not found"]

Missing information I need from you:
- [only list what's genuinely missing]
```

**Rules:**
- If the README has a clear project description, don't ask "what are you building?"
- If package.json has React in dependencies, don't ask about the frontend framework
- If the README has a DB schema, don't ask about the database
- If there's only one folder and no sibling repos, assume single repo
- For developer name, try `git config user.name` first
- For starting version, default to `0.0.0.0` if no package.json exists. If package.json exists, use its version.

**Only ask the user about information you genuinely cannot determine from existing files.**

If everything is covered by existing files, confirm the summary and proceed directly to generation. Do not ask questions you already know the answers to.

---

## Step 4: Confirm and Generate

After filling gaps, show a final summary:

```
Ready to generate project files with these settings:

Project: [name]
Description: [one line]
Tech: [frontend] + [backend] + [database]
Repos: [structure]
Starting version: [version]
Developer: [name]

I'll create: CLAUDE.md, ARCHITECTURE.md, PRD.md, TASKS.md, 
tasks/MilestoneTemplate.md, tasks/Milestone0.0.1.0.md,
bugs/BugFixTemplate.md, screenshots/

Proceed? (yes to generate, or tell me what to change)
```

Wait for confirmation, then generate all files.

---

## Step 5: Generate Files

Create the following files in the target project folder. Each file has a defined scope. Do not add content that belongs in another file.

**Use everything you learned from existing files.** If the README has a DB schema, put it in ARCHITECTURE.md. If it has API endpoints, reference them in ARCHITECTURE.md and PRD.md. If it has TypeScript types, include them in the architecture.

---

### CLAUDE.md

**Scope**: Project overview, current status, workflow rules. This is what Claude reads at the start of every session. It should be scannable in under 2 minutes.

**What it does NOT contain**: Session history (stays in milestone files), implementation specifics (stays in milestone files), full ADR records (stays in ARCHITECTURE.md).

```markdown
# CLAUDE.md: [Project Name] Development Guide

## Project Overview

[Project name] is [one-paragraph description].

**Key Architecture**: [e.g. "React frontend + Cloudflare Workers backend, strongly coupled"]

**Repository Locations:**
- [Primary repo label]: `[path]` ⭐ Management docs live here
- [Other repos if any]: `[path]` (code only)

**Deployment:**
- Local: localhost
- Production: [URLs if known, or TBD]

---

## Current Status

**Phase**: Milestone 0.0.1.0, Project Initialization
**Last Updated**: [today's date]
**Version**: [starting version]

### Completed Milestones
_(none yet)_

### Active Milestone
- **Milestone 0.0.1.0**: Project setup and scaffolding

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | [stack] |
| Backend | [stack or N/A] |
| Database | [stack or N/A] |
| Hosting | [platform] |

---

## Workflow Rules

**Git Policy:**
- Claude does NOT run `git add`, `git commit`, `git push`, or create PRs
- Exception: creating feature branches only (`git checkout -b` + `git push -u origin`)
- Developer handles all commits and merges via [GitHub Desktop / CLI / preference]

**Branch Naming:**
- `[developer]-MMDDYY-[VERSION]-[ui|api]`
- Example: `[developer]-041026-0.0.1.0-ui`

**Version Bumping:**
- Each task completion: BUILD +1 (e.g. `0.0.1.0` -> `0.0.1.1`)
- Each new milestone: PATCH +1, BUILD resets to 0 (e.g. `0.0.1.N` -> `0.0.2.0`)

**Session Start:**
Run `/session-start [folder(s)]` at the start of every terminal session.

**Milestone Workflow:**
- Task 0 of every milestone: check versions, create branches (with user approval)
- All detail, session notes, and implementation specifics go in milestone files
- This file stays concise. It is a reference, not a log

---

## Key Files

| File | Purpose |
|---|---|
| `CLAUDE.md` | This file. Session guide and workflow reference |
| `ARCHITECTURE.md` | Technical architecture, patterns, ADR log |
| `PRD.md` | Product requirements: vision, goals, users, MVP |
| `TASKS.md` | Milestone status dashboard |
| `./tasks/` | Detailed milestone files. All implementation detail lives here |
| `./bugs/` | Bug fix tracking files |
| `./screenshots/` | Bug fix screenshots |
```

---

### ARCHITECTURE.md

**Scope**: Technical architecture, established patterns, component/API reference, and architectural decisions (ADRs). This is where another developer (or Claude in a new session) would go to understand how the system is built.

**What it does NOT contain**: Session notes, task-level decisions (those stay in milestone files until they graduate to being truly architectural), implementation steps.

**Important**: If the README or other existing files contain database schemas, API endpoint lists, TypeScript types, or component structures, incorporate that content into the appropriate sections. Do not leave sections as "TBD" when the information is available.

```markdown
# ARCHITECTURE.md: [Project Name]

> Technical reference. Read this to understand how the system is built and why.

---

## System Overview

[2-3 sentence description of the overall architecture, what talks to what]

### Architecture Diagram (text)
```
[Browser] -> [Frontend: platform/URL]
                ↓ REST API
           [Backend: platform/URL]
                ↓
           [Database: type/platform]
```

---

## Tech Stack

### Frontend ([repo name])
- **Framework**: [e.g. React 18 + TypeScript + Vite]
- **Styling**: [e.g. Tailwind CSS]
- **State Management**: [e.g. Zustand v5]
- **Routing**: [e.g. React Router v6.4+]
- **Testing**: [e.g. Vitest]
- **Deployment**: [e.g. Vercel, auto-deploy from main]

### Backend ([repo name or N/A])
- **Runtime**: [e.g. Node.js]
- **Framework**: [e.g. Express]
- **Auth**: [e.g. Session token + RBAC]
- **Testing**: [e.g. Vitest]
- **Deployment**: [e.g. Railway, auto-deploy from main]

### Database
- **Platform**: [e.g. PostgreSQL]
- **Schema**: [include full schema if found in README or existing files]
- **ORM/Query**: [e.g. Prisma, raw SQL]

---

## Frontend Architecture

### Component Structure
```
src/
├── components/    # Reusable UI components
│   └── ui/        # Design system components
├── pages/         # Route-level page components
├── stores/        # State management
├── hooks/         # Custom React hooks
├── services/      # API service layer
└── types/         # TypeScript type definitions
```

### Key Patterns
_(Add patterns here as they are established)_

---

## Backend Architecture

### API Endpoints
[If found in README, include the full endpoint table here]

### API Structure
```
src/
├── routes/        # Route handlers
├── controllers/   # Request/response logic
├── services/      # Business logic
├── middleware/     # Auth, CORS, validation
├── models/        # Database models
└── types/         # TypeScript types
```

### Key Patterns
_(Add patterns here as they are established)_

---

## Database Schema

[If found in README or SQL files, include the full schema here with tables, columns, types, constraints, and indexes]

---

## Architectural Decisions (ADR Log)

> Record decisions here when they are final and architectural in scope.
> Task-level decisions belong in the milestone file where they were made.

_(Add ADRs as decisions are made)_
```

---

### PRD.md

**Scope**: Product requirements, the "what and why". This document is stable. It changes only when the product direction genuinely changes, not when implementation details are discovered.

```markdown
# PRD.md: [Project Name] Product Requirements

> What we're building, why, and for whom. Updated only when product direction changes.
> Implementation specifics belong in ARCHITECTURE.md and milestone files.

---

## Vision

[One sentence: what is the long-term vision for this product?]

## Problem Statement

[What problem does this solve? Who has this problem? Why does it matter?]

---

## Target Users

| User Type | Description | Primary Needs |
|---|---|---|
| [e.g. Admin] | [description] | [what they need most] |
| [e.g. Member] | [description] | [what they need most] |

---

## MVP Definition

The smallest version of this product that delivers real value.

**In scope for MVP:**
- [ ] [Core feature 1]
- [ ] [Core feature 2]
- [ ] [Core feature 3]

**Out of scope for MVP (future):**
- [Feature A]
- [Feature B]

---

## Core Features

### [Feature Area 1]
[Brief description of this feature area and what it enables]

### [Feature Area 2]
[Brief description]

---

## Success Criteria

How we know the MVP is working:

- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
- [ ] [Measurable outcome 3]

---

## Constraints & Requirements

**Technical constraints:**
- [e.g. Must run on free tier]
- [e.g. Must work offline]

**Non-functional requirements:**
- Performance: [e.g. page loads under 2s]
- Security: [e.g. session auth, no PII in logs]
- Accessibility: [e.g. WCAG 2.1 AA]

---

**Last updated**: [date]
**Status**: [Draft | Approved | In Development]
```

---

### TASKS.md

**Scope**: Milestone status dashboard only. No task details here. Those live in `./tasks/Milestone[VERSION].md`. This file stays short permanently.

```markdown
# TASKS.md: [Project Name] Milestone Tracker

**Last Updated**: [date]
**Current Version**: [version]

---

## Completed Milestones

| Milestone | Status | Date Completed | Tasks | Description |
|---|---|---|---|---|
| _(none yet)_ | | | | |

---

## Active / In Progress

| Milestone | Status | Priority | Description |
|---|---|---|---|
| [0.0.1.0](./tasks/Milestone0.0.1.0.md) | In Progress | SETUP | Project setup and scaffolding |

---

## Pending

| Milestone | Status | Priority | Description |
|---|---|---|---|
| _(plan milestones as needed)_ | | | |

---

_Milestone details, task lists, and session notes live in `./tasks/`. This file is the dashboard. Keep it lean._
```

---

### tasks/Milestone0.0.1.0.md

Generate a filled-in Milestone 0.0.1.0 using the project's specific paths, developer name, and starting version. This is the project setup milestone. Tasks should cover:

- 0.1: Initialize the application (e.g. `npm create vite@latest`, `npm init`, framework setup)
- 0.2: Install core dependencies (framework, styling, routing, state management)
- 0.3: Configure development environment (linting, TypeScript config, environment variables)
- 0.4: Create feature branch
- 0.5: Verify local dev environment starts cleanly

Tailor the tasks to the specific tech stack. A React + Vite project has different setup steps than a Node + Express API.

### tasks/MilestoneTemplate.md

Follow the instructions in `/internal:CreateTemplates` to generate the milestone template. Read `claude-docs/docs/MilestoneTemplate.md` as the source and replace bracketed placeholders with project-specific values. If the source file is not accessible, generate a minimal template following the established format.

### bugs/BugFixTemplate.md

Follow the instructions in `/internal:CreateTemplates` to generate the bug fix template. Read `claude-docs/docs/BugFixTemplate.md` as the source. No placeholder replacements are needed.

### screenshots/ (empty directory)

Create `[project]/screenshots/` as an empty directory. Bug fix files reference screenshots here.

---

## Step 6: Report

After all files are created, report what was generated and what to do next:

```
Project: [name]
────────────────────────────────────────
Files created in [folder]:
  ✓ CLAUDE.md
  ✓ ARCHITECTURE.md
  ✓ PRD.md
  ✓ TASKS.md
  ✓ tasks/Milestone0.0.1.0.md
  ✓ tasks/MilestoneTemplate.md
  ✓ bugs/BugFixTemplate.md
  ✓ screenshots/ (empty)

Starting version: [version]
First branch (when ready): [developer]-[MMDDYY]-0.0.1.0-[suffix]

Next steps:
1. Review ARCHITECTURE.md and verify it reflects your actual repo structure
   - Not every project needs an API. Some need more than two repos.
   - If you have additional services (AI, workers, integrations), add them now.
   - Make sure the architecture aligns with the milestones you plan to build.
   - The templates assume a UI + API pair, but adapt them to your structure.
2. Review and fill in the placeholder sections in PRD.md
3. Run /session-start [folder(s)] to initialize your session
4. Begin Milestone 0.0.1.0, Task 0.1: initialize the application
```

Do NOT create branches. That is a Task 0 step and requires explicit user review of the generated files first.

**Important**: The generated templates assume a common two-repo pattern (UI + API), but your project may differ. Review MilestoneTemplate.md and adjust the Task 0 steps, branch naming, and version tracking sections to match your actual repository structure before starting your first milestone.
