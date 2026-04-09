Scaffold a complete project management document set for a new project. Generates lean, structured files that serve as living reference, not growing logs. All session history and implementation detail stays in milestone files.

---

## Step 1: Load Session + Parse Arguments

Get terminal ID and load session context if available:
```bash
echo "${TERM_SESSION_ID:-${ITERM_SESSION_ID:-$$}}"
```

$ARGUMENTS may contain a project folder name. If so, generate files there. If not, and a session is active, confirm with the user which folder to use.

---

## Step 2: Gather Project Information

Ask for any information not already provided. Gather all answers before generating. Do not generate files one at a time between questions.

Ask these questions (skip any already answered in $ARGUMENTS):

1. **Project name**: what is it called?
2. **What are you building?** One paragraph describing the product and its purpose
3. **Who is it for?** Target users and their primary use cases
4. **Tech stack:**
   - Frontend: framework, language, styling (e.g. React + TypeScript + Tailwind + Vite)
   - Backend: runtime, framework (e.g. Cloudflare Workers + Hono, Node + Express, none)
   - Database: type and platform (e.g. Cloudflare D1/SQLite, PostgreSQL, Supabase, none)
   - Hosting/deployment: (e.g. Cloudflare Pages, Vercel, Railway)
5. **Repository structure?** How many repos, and what role does each play? Not every project needs an API, and some may need more than two repos (e.g. a UI, an API, and an AI service). List folder names and their purpose (e.g. `my-app-ui` = frontend, `my-app-api` = backend, `my-app-ai` = ML pipeline)
6. **MVP definition**: what is the smallest useful version of this product? List 3–5 core features only.
7. **Reference projects**: any existing repos to pull patterns from? (optional)
8. **Developer name**: used for branch naming convention (e.g. `don`)

Once all answers are collected, confirm the list with the user before generating.

---

## Step 3: Determine Starting Version

Ask: "What version should this project start at?" Default is `0.1.0.0` if they don't have a preference. Explain the versioning convention if they seem unfamiliar:
- `MAJOR.MINOR.PATCH.BUILD`
- BUILD increments with each task completion (allows incremental deployment)
- PATCH increments with each new milestone
- v0.x.x.x = development, v0.9.x.x = beta/MVP, v1.0.x.x = production

---

## Step 4: Generate Files

Create the following files in the target project folder. Each file has a defined scope. Do not add content that belongs in another file.

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

**Phase**: Milestone 0, Project Initialization
**Last Updated**: [today's date]
**Version**: [starting version]

### Completed Milestones
_(none yet)_

### Active Milestone
- **Milestone 0**: Project setup and scaffolding. 🚧 In Progress

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
- `[developer]-MMDDYY-milestone-[number]-[ui|api]`
- Example: `don-040826-milestone-1-ui`

**Version Bumping:**
- Each task completion: BUILD +1 (e.g. `0.1.0.0` → `0.1.0.1`)
- Each new milestone: PATCH +1, BUILD resets to 0 (e.g. `0.1.0.N` → `0.1.1.0`)

**Session Start:**
Run `/session-start [folder(s)]` at the start of every terminal session.

**Milestone Workflow:**
- Task 0 of every milestone: check versions, create branches (with user approval)
- All detail, session notes, and implementation specifics go in `./tasks/MilestoneX.X.md`
- This file stays concise. It is a reference, not a log

---

## Key Files

| File | Purpose |
|---|---|
| `CLAUDE.md` | This file. Session guide and workflow reference |
| `ARCHITECTURE.md` | Technical architecture, patterns, component library, ADR log |
| `PRD.md` | Product requirements: vision, goals, users, MVP |
| `TASKS.md` | Milestone status dashboard |
| `./tasks/` | Detailed milestone files. All implementation detail lives here |
```

---

### ARCHITECTURE.md

**Scope**: Technical architecture, established patterns, component/API reference, and architectural decisions (ADRs). This is where another developer (or Claude in a new session) would go to understand how the system is built.

**What it does NOT contain**: Session notes, task-level decisions (those stay in milestone files until they graduate to being truly architectural), implementation steps.

**File management**: Add to this file only when something becomes an established pattern or a decision is final. Prefer referencing milestone files for in-progress decisions.

```markdown
# ARCHITECTURE.md: [Project Name]

> Technical reference. Read this to understand how the system is built and why.

---

## System Overview

[2–3 sentence description of the overall architecture, what talks to what]

### Architecture Diagram (text)
```
[Browser] → [Frontend: platform/URL]
                ↓ REST API
           [Backend: platform/URL]
                ↓
           [Database: type/platform]
```

---

## Tech Stack

### Frontend ([repo name])
- **Framework**: [e.g. React 18 + TypeScript + Vite]
- **Styling**: [e.g. Tailwind CSS with custom theme system]
- **State Management**: [e.g. Zustand v5]
- **Routing**: [e.g. React Router v6.4+]
- **Testing**: [e.g. Vitest]
- **Deployment**: [e.g. Cloudflare Pages, auto-deploy from main]

### Backend ([repo name or N/A])
- **Runtime**: [e.g. Cloudflare Workers]
- **Framework**: [e.g. Hono]
- **Auth**: [e.g. Session token + RBAC]
- **Testing**: [e.g. none yet]
- **Deployment**: [e.g. Cloudflare Workers, auto-deploy from main]

### Database
- **Platform**: [e.g. Cloudflare D1 / SQLite]
- **Schema**: [e.g. `migrations/INIT_DB.sql`]
- **ORM/Query**: [e.g. raw SQL via D1 binding]

---

## Frontend Architecture

### Component Structure
```
src/
├── components/    # Reusable UI components
│   └── ui/        # Design system components
├── pages/         # Route-level page components
├── stores/        # Zustand state stores
├── hooks/         # Custom React hooks
├── services/      # API service layer
└── types/         # TypeScript type definitions
```

### Key Patterns
_(Add patterns here as they are established)_

---

## Backend Architecture

### API Structure
```
functions/
├── api/     # Public endpoints
└── admin/   # Protected endpoints
lib/
├── database/    # Repositories
├── services/    # Business logic
├── middleware/  # Auth, CORS, rate limiting
└── types/       # TypeScript types
```

### Key Patterns
_(Add patterns here as they are established)_

---

## Architectural Decisions (ADR Log)

> Record decisions here when they are final and architectural in scope.
> Task-level decisions belong in the milestone file where they were made.

### ADR-001: [First major decision]
**Date**: [date]
**Status**: Accepted
**Context**: [What problem, what constraints]
**Decision**: [What was decided]
**Consequences**: [Trade-offs]

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
- [e.g. Must run on Cloudflare free tier]
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

**Scope**: Milestone status dashboard only. No task details here. Those live in `./tasks/MilestoneX.X.md`. This file stays short permanently.

```markdown
# TASKS.md: [Project Name] Milestone Tracker

## Status

### Completed Milestones
| Status | Milestone | Completed | Tasks | Description |
|---|---|---|---|---|
| _(none yet)_ | | | | |

### Active Milestones
| Status | Milestone | Priority | Description |
|---|---|---|---|
| 🚧 | [Milestone 0: Project Setup](./tasks/Milestone0.md) | SETUP | Initialize project, create branches, verify dev environment |

### Planned Milestones
| Status | Milestone | Priority | Description |
|---|---|---|---|
| ⏳ | Milestone 1: [Name] | HIGH | [Brief description] |
| ⏳ | Milestone 2: [Name] | HIGH | [Brief description] |

---

_Milestone details, task lists, and session notes live in `./tasks/`. This file is the dashboard. Keep it lean._
```

---

### tasks/Milestone0.md

Generate a filled-in Milestone 0 using the project's specific paths, developer name, and starting version. Task 0 is always project initialization:

- 0.1: Verify current versions from package.json
- 0.2: Create UI feature branch
- 0.3: Create API feature branch (if applicable)
- 0.4: Verify local dev environment starts cleanly
- 0.5: Confirm deployment targets are configured

### tasks/MilestoneTemplate.md

Follow the instructions in `/internal:CreateTemplates` to generate the milestone template. Read `claude-docs/docs/MilestoneTemplate.md` as the source and replace bracketed placeholders with project-specific values. If the source file is not accessible, generate a minimal template following the established format.

### bugs/BugFixTemplate.md

Follow the instructions in `/internal:CreateTemplates` to generate the bug fix template. Read `claude-docs/docs/BugFixTemplate.md` as the source. No placeholder replacements are needed.

### screenshots/ (empty directory)

Create `[project]/screenshots/` as an empty directory. Bug fix files reference screenshots here.

---

## Step 5: Report

After all files are created:

```
Project: [name]
────────────────────────────────────────
Files created in [folder]:
  ✓ CLAUDE.md
  ✓ ARCHITECTURE.md
  ✓ PRD.md
  ✓ TASKS.md
  ✓ tasks/Milestone0.md
  ✓ tasks/MilestoneTemplate.md
  ✓ bugs/BugFixTemplate.md
  ✓ screenshots/ (empty)

Starting version: [version]
First branch (when ready): [developer]-[MMDDYY]-milestone-0-[ui suffix]

Next steps:
1. Review ARCHITECTURE.md and verify it reflects your actual repo structure
   - Not every project needs an API. Some need more than two repos.
   - If you have additional services (AI, workers, integrations), add them now.
   - Make sure the architecture aligns with the milestones you plan to build.
   - The templates assume a UI + API pair, but adapt them to your structure.
2. Review and fill in the placeholder sections in PRD.md
3. Run /session-start [folder(s)] to initialize your session
4. Begin Milestone 0, Task 0.1: verify versions and create branches
```

Do NOT create branches. That is Task 0 and requires explicit user review of the generated files first.

**Important**: The generated templates assume a common two-repo pattern (UI + API), but your project may differ. Review MilestoneTemplate.md and adjust the Task 0 steps, branch naming, and version tracking sections to match your actual repository structure before starting your first milestone.
