# Skill Reference Manual

> API-style reference for Claude Code slash commands. Each entry documents syntax, parameters, argument patterns, and usage examples.

---

## Table of Contents

- [Overview](#overview)
  - [Philosophy](#philosophy)
  - [How Skills Work](#how-skills-work)
  - [Skill Organization](#skill-organization)
  - [Session Context System](#session-context-system)
  - [Project Directory Resolution](#project-directory-resolution)
  - [Argument Conventions](#argument-conventions)
- [Skills](#skills)
  - [/session-start](#session-start)
  - [/milestone-status](#milestone-status)
  - [/milestone-new](#milestone-new)
  - [/task-complete](#task-complete)
  - [/project-new](#project-new)
  - [/bugfix-status](#bugfix-status)
- [Internal Helpers](#internal-helpers)
  - [/internal:session-read](#internalsession-read)
  - [/internal:CreateTemplates](#internalcreatetemplates)

---

## Overview

### Philosophy

These skills are built around a single idea: **Claude should orient itself, not guess**. Rather than assuming project structure or state, each skill reads the authoritative source files: `CLAUDE.md`, `TASKS.md`, milestone files. It works from what's actually there.

Skills are deliberately simple markdown instructions, not code. They're readable, editable, and improvable without tooling. If a skill doesn't behave the way you want, open the source file in `claude-docs/skills/`, adjust the instructions, and reinstall.

### How Skills Work

Skills are markdown files stored in `~/.claude/commands/`. Claude Code loads them at startup and makes them available as `/slash-commands`. When invoked, Claude reads the skill's instructions and executes them in the context of the current session.

- **Source of truth**: `claude-docs/skills/*.md`
- **Installed location**: `~/.claude/commands/*.md`
- **Install/update**: Run `./install.sh` from the `claude-docs/` root
- **Changes take effect**: On the next Claude Code session start

```
claude-docs/skills/session-start.md          →  ~/.claude/commands/session-start.md          →  /session-start
claude-docs/skills/internal/session-read.md  →  ~/.claude/commands/internal/session-read.md  →  /internal:session-read
```

### Skill Organization

Skills are organized into two tiers:

| Location | Installed to | Command pattern | Purpose |
|---|---|---|---|
| `skills/*.md` | `~/.claude/commands/` | `/command-name` | User-facing, appear in autocomplete |
| `skills/internal/*.md` | `~/.claude/commands/internal/` | `/internal:command-name` | Helper docs, referenced by other skills, not surfaced in main list |

This is a convention established here, not a formal Claude Code standard. Subdirectory namespacing is a supported feature. `internal/` keeps helper files from cluttering the user-facing command list.

---

### Session Context System

The most important concept in this skill set. Run `/session-start` once per terminal and every other skill knows which projects to work with. No need to pass folder names on every command.

#### How It Works

`/session-start` reads the current terminal's unique ID from the shell environment, writes a small JSON file keyed to that ID, and stores it in `.claude-sessions/` at the working directory root. Every other skill reads that file automatically.

```
Terminal 1                               Terminal 2
────────────────────────────────────     ────────────────────────────────────
$ claude  (started in GitHub root)       $ claude  (started in GitHub root)

/session-start hourlings-ui \            /session-start tech-review
               hourlings-api

Writes:                                  Writes:
.claude-sessions/                        .claude-sessions/
  A1B2C3D4.json ←─ Terminal 1 only        F5E6G7H8.json ←─ Terminal 2 only

/milestone-status                        /milestone-status
→ reads $TERM_SESSION_ID = A1B2...       → reads $TERM_SESSION_ID = F5E6...
→ opens A1B2C3D4.json                    → opens F5E6G7H8.json
→ looks in hourlings-ui/tasks/           → looks in tech-review/tasks/

No collision. No overwriting.
```

#### Terminal ID Resolution

The terminal ID is read from the shell environment in priority order:

| Variable | Terminal |
|---|---|
| `$TERM_SESSION_ID` | macOS Terminal.app (primary) |
| `$ITERM_SESSION_ID` | iTerm2 |
| `$$` | Shell PID, fallback, works anywhere |

#### Session File Structure

Stored at `[GitHub-root]/.claude-sessions/[TERMINAL_ID].json`:

```json
{
  "terminalId": "A1B2C3D4-E5F6-...",
  "label": "hourlings",
  "baseDir": "/Users/don/Projects 2/GitHub",
  "projects": {
    "ui": "hourlings-ui",
    "api": "hourlings-api"
  },
  "startedAt": "2026-04-08T10:30:00",
  "activeMilestone": null
}
```

For single-project sessions, `"primary"` is used as the key instead of `"ui"`:

```json
{
  "projects": {
    "primary": "tech-review"
  }
}
```

#### Session Staleness

If a session file is older than 24 hours, skills will warn before using it. Run `/session-start` again at the start of a new working day or whenever you open a new terminal.

---

### Project Directory Resolution

Each skill resolves a `BASE_DIR` in this order:

1. **Session file**: read `[TERMINAL_ID].json`, use `projects.ui` or `projects.primary`
2. **Explicit argument**: if `$ARGUMENTS` starts with a folder name, use that (overrides session)
3. **Current directory**: fall back to `./` if neither is available
4. **Prompt**: if the intent is ambiguous, ask rather than guess

### Argument Conventions

```
/skill-name [optional-override-folder] [skill-specific-args]
```

- With an active session: most skills need **no arguments at all**
- Folder override comes first when needed, skill-specific args follow
- Numeric-only args (e.g. `24`) are never interpreted as folder names

---

## Skills

---

### /session-start

Initialize a working session. Identifies the current terminal, writes a session context file, then orients Claude to the project's current state by reading key documentation.

**Source file**: `skills/session-start.md`

---

#### Syntax

```
/session-start [project-folders...]
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `project-folders` | string(s) | Recommended | One or two folder names. First is UI/primary, second is API. Omit only if running from inside a project directory. |

#### Argument Patterns

| Invocation | Result |
|---|---|
| `/session-start hourlings-ui hourlings-api` | UI + API session, label = `hourlings` |
| `/session-start hourlings-ui` | Single project session, label = `hourlings-ui` |
| `/session-start tech-review` | Single project session, label = `tech-review` |
| `/session-start` | Uses `./`, works only when Claude started inside a project |

#### What It Does

1. Gets terminal ID from `$TERM_SESSION_ID` → `$ITERM_SESSION_ID` → `$$`
2. Parses project folder arguments
3. Derives a human-readable label (strips `-ui` suffix if present)
4. Writes `.claude-sessions/[TERMINAL_ID].json`
5. Reads `CLAUDE.md`, `TASKS.md`, `PLANNING.md`, `DECISIONS.md` from the primary project
6. Reads the most recently modified milestone file from `tasks/`
7. Reports a structured session summary

#### Output

```
Session: hourlings (A1B2C3D4)
Projects: hourlings-ui + hourlings-api
─────────────────────────────────────
Project:          Hourlings v0.8.11.0
Current Phase:    Milestone 24: [title]
Last Completed:   Milestone 21.5: Zustand migration
In Progress:      Task 1: [description]
Blockers:         None
Key Rules:        Do not commit. Branch creation only. User handles all git via GitHub Desktop.
```

#### Examples

```
# Standard multi-repo session from GitHub root
/session-start hourlings-ui hourlings-api

# Single repo session
/session-start tech-review

# From inside a project directory
/session-start
```

#### Notes

- Run this at the start of every terminal session. It takes seconds and prevents Claude from operating on stale or missing context.
- The session file persists between Claude Code restarts in the same terminal. You don't need to re-run it if you quit and relaunch Claude in the same terminal window.
- Label is derived automatically. `hourlings-ui` → `hourlings`, `tech-review` → `tech-review`.

---

### /milestone-status

Show the progress of the active milestone for this session's project. Reads the milestone file and formats a structured progress report.

**Source file**: `skills/milestone-status.md`

---

#### Syntax

```
/milestone-status [milestone-number]
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `milestone-number` | string | No | Specific milestone to read (e.g. `24`, `24.1`). Omit to auto-detect from `TASKS.md`. |

Project directory is resolved automatically from the session file. Pass a folder name as the first argument only if you need to override the session.

#### Argument Patterns

| Invocation | Behavior |
|---|---|
| `/milestone-status` | Auto-detect active milestone using session project |
| `/milestone-status 24` | Read `tasks/Milestone24.md` in session project |
| `/milestone-status hourlings-ui` | Override project folder, auto-detect milestone |
| `/milestone-status hourlings-ui 24` | Override project folder, specific milestone |

#### Output

```
Session: hourlings (A1B2C3D4), hourlings-ui
────────────────────────────────────────────
Milestone 24: [Title]
Version: 0.8.11.0 → 0.8.12.0
Progress: 2 of 6 tasks complete (33%)

| Task                        | Priority | Status      | Version    |
|-----------------------------|----------|-------------|------------|
| Task 0: Initialization      | SETUP    | ✅ Complete | 0.8.12.0   |
| Task 1: [Name]              | HIGH     | ✅ Complete | 0.8.12.1   |
| Task 2: [Name]              | HIGH     | ⏳ Pending  | 0.8.12.2   |
| Task 3: [Name]              | MEDIUM   | ⏳ Pending  | 0.8.12.3   |

Next: Task 2: [Name] (HIGH)
[One-line description]

Blockers: None
```

#### Status Emoji Reference

| Emoji | Meaning |
|---|---|
| ⏳ | Pending, not started |
| 🚧 | In Progress, currently being worked |
| ✅ | Complete, implementation finished |
| 🚀 | Deployed, live in production |

#### Examples

```
# With active session, no args needed
/milestone-status

# Check a specific milestone
/milestone-status 24

# Override project (ignores session)
/milestone-status hourlings-ui 24
```

---

### /milestone-new

Scaffold a new milestone file from `MilestoneTemplate.md`. Reads current version numbers from both repos automatically and calculates target versions.

**Source file**: `skills/milestone-new.md`

---

#### Syntax

```
/milestone-new <milestone-number>
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `milestone-number` | string | **Yes** | The new milestone identifier. Will prompt if missing. |

Project directories (both UI and API) are resolved from the session file, enabling automatic version calculation across both repos.

#### Argument Patterns

| Invocation | Behavior |
|---|---|
| `/milestone-new 25` | Create `tasks/Milestone25.md` using session projects |
| `/milestone-new 25.1` | Create `tasks/Milestone25.1.md` |
| `/milestone-new hourlings-ui 25` | Override project folder |

#### Version Calculation

| Repo | Example Current | Milestone Start |
|---|---|---|
| UI | `0.8.11.3` | `0.8.12.0`: PATCH +1, BUILD reset to 0 |
| API | `0.8.11.2` | `0.8.11.2`: unchanged until API tasks begin |

Each completed task during the milestone increments BUILD by 1.

#### Output

```
Session: hourlings (A1B2C3D4)
────────────────────────────────────────
Created: hourlings-ui/tasks/Milestone25.md

UI:  0.8.11.3 → 0.8.12.0  (hourlings-ui)
API: 0.8.11.2 unchanged    (hourlings-api)

Branch names for Task 0:
  UI:  don-040826-milestone-25-ui
  API: don-040826-milestone-25-api

Next: Open the file, fill in objective, scope, and tasks, then run /session-start.
```

#### Examples

```
# With active session, just the milestone number
/milestone-new 25
/milestone-new 25.1

# Override project
/milestone-new hourlings-ui 25
```

#### Notes

- Does **not** create branches. Branch creation is Task 0 and requires explicit user approval.
- Does **not** invent task names. Template placeholders are left for the developer to fill in.
- Warns before overwriting an existing milestone file.

---

### /task-complete

Mark a task as complete in the active milestone. Updates the task status, progress table, completion count, and optionally bumps `package.json` version. Does not commit anything.

**Source file**: `skills/task-complete.md`

---

#### Syntax

```
/task-complete <task-number>
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `task-number` | string | **Yes** | Task to mark complete (e.g. `1`, `2`, `0.3`). Will list available tasks if missing or not found. |

Project directory and active milestone are resolved from the session file.

#### Argument Patterns

| Invocation | Behavior |
|---|---|
| `/task-complete 1` | Mark Task 1 complete in session's active milestone |
| `/task-complete 0.3` | Mark Task 0.3 complete (sub-step of milestone initialization) |
| `/task-complete hourlings-ui 1` | Override project folder |

#### What Gets Updated

| Location | Change |
|---|---|
| Task `Status` field | `⏳ Pending` or `🚧 In Progress` → `✅ Complete` |
| Task `Actual Time` field | Filled in if empty |
| Progress Summary table | Status emoji → ✅, Version column filled if empty |
| Completion count | Recalculated as "X of Y tasks complete (Z%)" |
| `package.json` (UI) | Bumped to match task's Version field, not committed |
| `package.json` (API) | Bumped if the task is API-specific, not committed |
| Session file | `activeMilestone` updated if it was null |

#### Output

```
Session: hourlings (A1B2C3D4)
────────────────────────────────────────
✅ Task 1 complete: [Task Name]
   ⏳ Pending → ✅ Complete

Progress: 2 of 6 tasks complete (33%)
Version:  0.8.12.0 → 0.8.12.1  (package.json updated, commit via GitHub Desktop)

Next: Task 2: [Name] (HIGH)
```

#### Examples

```
# With active session, just the task number
/task-complete 1
/task-complete 0.3

# Override project
/task-complete hourlings-ui 2
```

#### Notes

- If the task number isn't found, the skill lists all tasks from the Progress Summary so you can clarify.
- Version bumps are staged in `package.json` but **not committed**. Review in GitHub Desktop before committing.
- Never runs `git add`, `git commit`, or `git push`.

---

### /project-new

Scaffold a complete project management document set for a new project. Generates lean, structured files that serve as living reference, not growing logs. Gathers project information interactively, then creates all files in one pass.

**Source file**: `skills/project-new.md`

---

#### Syntax

```
/project-new [project-folder]
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `project-folder` | string | No | Target folder for generated files. If omitted and a session is active, prompts for confirmation. |

#### What It Creates

| File | Purpose |
|---|---|
| `CLAUDE.md` | Session guide and workflow reference |
| `ARCHITECTURE.md` | Technical architecture, patterns, ADR log |
| `PRD.md` | Product requirements: vision, goals, users, MVP |
| `TASKS.md` | Milestone status dashboard |
| `tasks/Milestone0.md` | Project initialization milestone |
| `tasks/MilestoneTemplate.md` | Template for future milestones |
| `bugs/BugFixTemplate.md` | Template for bug fix tracking |
| `screenshots/` | Empty directory for bug fix screenshots |

#### Information Gathered

The skill asks these questions before generating (skips any already provided):

1. Project name
2. What you're building (one paragraph)
3. Target users and use cases
4. Tech stack (frontend, backend, database, hosting)
5. Repository structure: how many repos, what role each plays (not every project needs an API, some need more than two repos)
6. MVP definition (3-5 core features)
7. Reference projects (optional)
8. Developer name (for branch naming)

#### Post-Generation

After scaffolding, the developer should:

1. Review ARCHITECTURE.md and verify it reflects the actual repo structure. The templates assume a UI + API pair but should be adapted to match.
2. Fill in placeholder sections in PRD.md
3. Run `/session-start [folder(s)]` to initialize
4. Begin Milestone 0

#### Examples

```
# Scaffold into a specific folder
/project-new my-new-app

# With active session, prompts for folder
/project-new
```

#### Notes

- Does **not** create branches. That is Milestone 0, Task 0.
- Does **not** invent task names or milestone content. Templates use placeholders.
- References `/internal:CreateTemplates` for template generation logic.
- The generated MilestoneTemplate.md and BugFixTemplate.md should be reviewed and adapted to the project's actual repo structure before use.

---

### /bugfix-status

Show the current status of bug fixes for this session's project. Reads bug fix files from the `bugs/` directory and displays a summary.

**Source file**: `skills/bugfix-status.md`

---

#### Syntax

```
/bugfix-status [bug-number | "all" | project-folder]
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `bug-number` | number | No | Show details for a specific bug fix |
| `"all"` | string | No | Include resolved bugs in the listing |
| `project-folder` | string | No | Override BASE_DIR from session |

Project directory is resolved automatically from the session file. Pass a folder name as the first argument only if you need to override the session.

#### Argument Patterns

| Invocation | Behavior |
|---|---|
| `/bugfix-status` | Show all open bug fixes using session project |
| `/bugfix-status 42` | Show full details for bug fix 42 |
| `/bugfix-status all` | Show all bugs including resolved |
| `/bugfix-status hourlings-ui` | Override project folder |

#### Output (summary)

```
Session: [label] ([TERMINAL_ID 8 chars]), [BASE_DIR]
────────────────────────────────────────
Bug Fixes: [X] open, [Y] resolved

| #   | Title              | Priority | Status      | Created    |
|-----|--------------------|----------|-------------|------------|
| 42  | Login timeout      | HIGH     | in progress | 2026-04-09 |
| 41  | Missing avatar     | MEDIUM   | pending     | 2026-04-08 |

Next: Bug Fix 42: Login timeout (HIGH, in progress)
```

#### Output (single bug)

```
Session: [label] ([TERMINAL_ID 8 chars]), [BASE_DIR]
────────────────────────────────────────
Bug Fix 42: Login timeout
Status:   in progress
Priority: HIGH
Branch:   don-040926-bugfix-42-login-timeout
Created:  2026-04-09

Summary:
[Summary paragraph from the file]

Fix Plan:
- [ ] Diagnose root cause
- [ ] Implement fix

Affected Files:
- src/services/auth.ts
- src/pages/LoginPage.tsx
```

#### Examples

```
# With active session, show open bugs
/bugfix-status

# Details on a specific bug
/bugfix-status 42

# Include resolved bugs
/bugfix-status all
```

#### Notes

- Reads files matching `BugFix-*.md` in `BASE_DIR/bugs/`. Skips `BugFixTemplate.md`.
- If no `bugs/` directory exists, suggests running `/bug-fix` or `/project-new`.
- Default view shows only open bugs (pending + in progress). Pass `all` to include resolved.

---

## Internal Helpers

Internal skills are installed to `~/.claude/commands/internal/` and accessible as `/internal:name`. They are not user-facing commands. They serve as reference documents for the logic shared across multiple user-facing skills.

---

### /internal:session-read

Documents the standard session context resolution logic used by all skills. Not invoked directly by users.

**Source file**: `skills/internal/session-read.md`

---

#### Purpose

Defines how skills locate and load the session file, resolve `BASE_DIR` and `API_DIR`, and handle missing or stale sessions. All user-facing skills follow this pattern to ensure consistent behavior.

#### Resolution Steps

1. Run `echo "${TERM_SESSION_ID:-${ITERM_SESSION_ID:-$$}}"` to get terminal ID
2. Read `[CWD]/.claude-sessions/[TERMINAL_ID].json`
3. Extract `projects.ui` (or `projects.primary`) as `BASE_DIR`
4. Extract `projects.api` as `API_DIR` (may be undefined)
5. If no session file: fall back to explicit `$ARGUMENTS`, then prompt

#### Fallback Behavior

| Condition | Behavior |
|---|---|
| Session file found, fresh | Use it |
| Session file found, >24h old | Warn, continue with stale data |
| No session file, args provided | Use args |
| No session file, no args | Prompt: "Run `/session-start [project]` first" |

---

---

### /internal:CreateTemplates

Defines how to generate MilestoneTemplate.md and BugFixTemplate.md when scaffolding a new project. Referenced by `/project-new` and `/bug-fix`.

**Source file**: `skills/internal/CreateTemplates.md`

---

#### Purpose

Provides a single source of truth for template generation. Specifies where to read canonical templates (`claude-docs/docs/`), what placeholders to replace, and what folder structure to create.

#### Templates

| Template | Source | Installed to | Placeholders |
|---|---|---|---|
| MilestoneTemplate.md | `claude-docs/docs/MilestoneTemplate.md` | `[project]/tasks/` | `[ui-repo]`, `[api-repo]`, `[github-root]`, URLs, credentials, platform names |
| BugFixTemplate.md | `claude-docs/docs/BugFixTemplate.md` | `[project]/bugs/` | None (already generic) |

#### Folder Structure Created

```
[project]/
├── tasks/
│   └── MilestoneTemplate.md
├── bugs/
│   └── BugFixTemplate.md
└── screenshots/
```

---

*This document expands as new skills are added. See [README.md](README.md) for installation and project structure.*
