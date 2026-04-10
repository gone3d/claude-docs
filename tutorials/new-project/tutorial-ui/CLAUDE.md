# CLAUDE.md: Tutorial UI Development Guide

## Project Overview

Tutorial UI is the frontend for a task management application, built with React + TypeScript + Tailwind CSS + Vite. It consumes the Tutorial API for all data persistence and provides CRUD interfaces for tasks and categories with filtering, sorting, and status management.

**Key Architecture**: React SPA frontend consuming a REST API backend. Two separate repos, strongly coupled through shared TypeScript types.

**Repository Locations:**
- **tutorial-ui**: `tutorials/new-project/tutorial-ui/` ⭐ Management docs live here
- **tutorial-api**: `tutorials/new-project/tutorial-api/` (code only)

**Deployment:**
- Local: http://localhost:5173 (UI), http://localhost:3001 (API)
- Production: TBD

---

## Current Status

**Phase**: Milestone 0.0.1.0, Project Initialization
**Last Updated**: 2026-04-10
**Version**: 0.0.0.0

### Completed Milestones
_(none yet)_

### Active Milestone
- **Milestone 0.0.1.0**: Project setup and scaffolding

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| State | Zustand |
| Backend | Node.js + Express + TypeScript (tutorial-api) |
| Database | PostgreSQL (tutorial-api) |
| Hosting | TBD |

---

## Workflow Rules

**Git Policy:**
- Claude does NOT run `git add`, `git commit`, `git push`, or create PRs
- Exception: creating feature branches only (`git checkout -b` + `git push -u origin`)
- Developer handles all commits and merges via GitHub Desktop / CLI

**Branch Naming:**
- `don-MMDDYY-[VERSION]-[ui|api]`
- Example: `don-041026-0.0.1.0-ui`

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
