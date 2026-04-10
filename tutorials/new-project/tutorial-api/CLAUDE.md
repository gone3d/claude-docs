# CLAUDE.md: Tutorial API Development Guide

## Project Overview

Tutorial API is the backend REST API for a task management application, built with Node.js + Express + TypeScript. It provides CRUD endpoints for tasks and categories with data validation, filtering, sorting, and PostgreSQL persistence.

**Key Architecture**: Express REST API serving the Tutorial UI frontend. Two separate repos, strongly coupled through shared response format and TypeScript types.

**Repository Locations:**
- **tutorial-ui**: `tutorials/new-project/tutorial-ui/` ⭐ Management docs live there
- **tutorial-api**: `tutorials/new-project/tutorial-api/` ⭐ Management docs also here (API-specific)

**Deployment:**
- Local: http://localhost:3001
- Production: TBD (Railway considered)

---

## Current Status

**Phase**: Milestone 0.0.1.0 complete
**Last Updated**: 2026-04-10
**Version**: 0.0.1.6

### Completed Milestones
- **Milestone 0.0.1.0**: Project setup and scaffolding (2026-04-10)

### Active Milestone
_(none — run `/milestone-new` to create the next one)_

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express + TypeScript |
| Database | PostgreSQL |
| ORM/Query | TBD (pg or Prisma) |
| Hosting | TBD (Railway considered) |

---

## Workflow Rules

**Git Policy:**
- Claude does NOT run `git add`, `git commit`, `git push`, or create PRs
- Exception: creating feature branches only (`git checkout -b` + `git push -u origin`)
- Developer handles all commits and merges via GitHub Desktop / CLI

**Branch Naming:**
- `don-MMDDYY-[VERSION]-api`
- Example: `don-041026-0.0.1.0-api`

**Version Bumping:**
- Each task completion: BUILD +1 (e.g. `0.0.1.0` -> `0.0.1.1`)
- Each new milestone: PATCH +1, BUILD resets to 0 (e.g. `0.0.1.N` -> `0.0.2.0`)

**Session Start:**
Run `/session-start tutorial-ui tutorial-api` at the start of every terminal session.

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
