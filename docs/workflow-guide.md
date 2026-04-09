# Multi-Repo Workflow Guide

> How to work effectively across multiple repositories, frontend, backend, and beyond, using Claude Code in the terminal.

---

## The Problem With Single-Repo Thinking

Most Claude Code tutorials assume one project, one folder, one terminal. Real development isn't like that. A frontend and a backend that talk to each other need to be worked on together. API contracts change, types need to stay in sync, migrations affect both sides.

This guide covers how to structure your environment so Claude has the context it needs without you repeating yourself every session.

---

## Start From Your GitHub Root

Instead of `cd`-ing into a specific project before launching Claude, start from the folder that contains all your repos:

```bash
cd ~/Projects/GitHub   # or wherever your repos live
claude
```

From here, Claude can access any repo as a subdirectory. This is the same as setting your entire GitHub folder as a VS Code workspace: everything is reachable.

**Why this matters:** If you start Claude inside `hourlings-ui/`, it can't see `hourlings-api/` without being explicitly told. Starting from the root gives Claude visibility across all projects without any extra configuration.

---

## Session Context: Tell Claude Once Per Terminal

Once you're at the GitHub root, run `/session-start` to register which projects you're working on:

```bash
# UI + API pair
/session-start hourlings-ui hourlings-api

# Single project
/session-start tech-review

# No arguments, uses current directory (only if you started inside a project)
/session-start
```

This writes a session file keyed to your terminal's unique ID. Every other skill, `/milestone-status`, `/task-complete`, `/milestone-new`, reads that file automatically. You don't pass folder names again for the rest of the session.

### Multiple Terminals, No Conflicts

If you have two terminals open for different projects, each gets its own session file:

```
Terminal 1: /session-start hourlings-ui hourlings-api
Terminal 2: /session-start tech-review
```

The session files are named by terminal ID (`~/.claude-sessions/[TERMINAL_ID].json`). They never overwrite each other.

---

## The UI + API Pattern

The most common multi-repo scenario: a frontend that talks to a backend. Here's how to work across both effectively.

### Project Structure Assumption

```
GitHub/
├── my-app-ui/          # Frontend, management docs live here
│   ├── CLAUDE.md
│   ├── ARCHITECTURE.md
│   ├── PRD.md
│   ├── TASKS.md
│   └── tasks/
└── my-app-api/         # Backend, code only
    └── (no management docs)
```

Management docs live in the primary repo (usually the frontend). The backend repo is code-only. This keeps things centralized and avoids duplication.

### Type Sync Workflow

When the API changes a response shape, you need to update the frontend types to match. With both repos visible from the root, Claude can read the API types and update the frontend in one operation:

```
I've updated the /api/submissions endpoint to include a word_count field. 
Update the frontend types in hourlings-ui/src/types/submissions.types.ts 
to match the response type in hourlings-api/lib/types/submissions.types.ts
```

No context-switching, no copy-pasting. Claude reads both files directly.

### Migration Workflow

Database migrations often require coordinated changes: a new column in the API schema, a new field in the frontend form, updated types on both sides. From the GitHub root with an active session:

```
Run Milestone 5, Task 2. Adds the word_count column. 
This requires changes to the migration file, the API response, 
and the frontend type definitions.
```

Claude knows where both repos are and can make all three changes in sequence.

---

## Adding a Directory Mid-Session

If you need to pull in a repo that isn't part of your active session, use `--add-dir` at startup:

```bash
claude --add-dir ../reference-project
```

Or from within a session:
```
/add-dir ../reference-project
```

Useful when you need to reference a third repo for patterns without making it part of the session context.

---

## Branch Management Across Repos

The milestone system uses paired branches, one per repo, named to match:

```
don-040826-milestone-5-ui    # hourlings-ui
don-040826-milestone-5-api   # hourlings-api
```

Both branches are created in Task 0 of each milestone. Claude creates the branches (the one git operation it's allowed to do), but you handle all commits and merges via GitHub Desktop or your preferred git tool.

**Why Claude doesn't commit:** You want to review every change before it goes into the repo. GitHub Desktop gives you a visual diff before each commit. Claude prepares the code, you verify it.

---

## Terminal Organization

A practical setup for active development on a UI + API project:

| Terminal | Purpose | Session |
|---|---|---|
| Terminal 1 | Claude Code (GitHub root) | `/session-start my-app-ui my-app-api` |
| Terminal 2 | Frontend dev server | `cd my-app-ui && npm run dev` |
| Terminal 3 | Backend dev server | `cd my-app-api && npm run dev` |

Claude Code gets its own terminal. Dev servers run independently. Claude doesn't start or manage them. This separation keeps Claude from getting stuck waiting on server processes and gives you clean restarts when needed.

---

## When to Use /add-dir vs Session Context

| Scenario | Approach |
|---|---|
| Primary working repos for this project | `/session-start ui-folder api-folder` |
| Reference project for patterns | `/add-dir ../reference-project` |
| Legacy codebase for comparison | `/add-dir ../old-project` |
| Temporary lookup | Just reference the path directly in your message |

Session context is for repos you're actively modifying. `--add-dir` is for repos you're reading from.

---

## Session Lifecycle

```
Open terminal
    ↓
cd ~/Projects/GitHub
claude
    ↓
/session-start my-app-ui my-app-api     ← do this once
    ↓
[work: /milestone-status, /task-complete, etc.]
    ↓
[end of day, close terminal]
    ↓
[next day, open new terminal]
    ↓
/session-start my-app-ui my-app-api     ← do it again (new terminal = new session ID)
```

The session file from yesterday is stale (>24 hours old). Skills will warn you. Re-running `/session-start` takes 10 seconds and ensures Claude has current project state.
