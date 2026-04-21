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
  - [/milestone-start](#milestone-start)
  - [/milestone-new](#milestone-new)
  - [/task-complete](#task-complete)
  - [/milestone-complete](#milestone-complete)
  - [/project-new](#project-new)
  - [/session-help](#session-help)
  - [/bug-status](#bug-status)
  - [/bug-add](#bug-add)
  - [/bug-fixed](#bug-fixed)
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
5. Reads `CLAUDE.md`, `TASKS.md` from the primary project
6. Reads the most recently modified milestone file from `tasks/`
7. Reports a structured session summary

#### Output

```
Session: hourlings (A1B2C3D4)
Projects: hourlings-ui + hourlings-api
─────────────────────────────────────
Project:          [name] v0.3.6.0
Current Phase:    Milestone 0.3.6.0: [title]
Last Completed:   Milestone 0.3.5.0: [previous milestone title]
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
| `milestone-version` | string | No | Specific milestone version to read (e.g. `0.3.6.0`). Omit to auto-detect from `TASKS.md`. |

Project directory is resolved automatically from the session file. Pass a folder name as the first argument only if you need to override the session.

#### Argument Patterns

| Invocation | Behavior |
|---|---|
| `/milestone-status` | Auto-detect active milestone using session project |
| `/milestone-status 0.3.6.0` | Read `tasks/Milestone0.3.6.0.md` in session project |
| `/milestone-status my-app-ui` | Override project folder, auto-detect milestone |
| `/milestone-status my-app-ui 0.3.6.0` | Override project folder, specific milestone |

#### Output

```
Session: [label] ([TERMINAL_ID 8 chars]), [BASE_DIR]
────────────────────────────────────────────
Milestone 0.3.6.0: [Title]
Version: 0.3.5.2 -> 0.3.6.0
Progress: 2 of 6 tasks complete (33%)

| Task                        | Priority | Status      | Version    |
|-----------------------------|----------|-------------|------------|
| Task 0: Initialization      | SETUP    | Complete    | 0.3.6.0    |
| Task 1: [Name]              | HIGH     | Complete    | 0.3.6.1    |
| Task 2: [Name]              | HIGH     | Pending     | 0.3.6.2    |
| Task 3: [Name]              | MEDIUM   | Pending     | 0.3.6.3    |

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
/milestone-status 0.3.6.0

# Override project (ignores session)
/milestone-status my-app-ui 0.3.6.0
```

---

### /milestone-start

Begin working on a milestone. Reads the milestone file, determines the next pending task, confirms with the user, and starts executing. If the milestone is partially complete, picks up where you left off. After each task, asks whether to continue to the next.

**Source file**: `skills/milestone-start.md`

---

#### Syntax

```
/milestone-start [milestone-version | project-folder]
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `milestone-version` | string | No | Specific milestone version to start or resume (e.g. `0.3.6.0`). Omit to auto-detect from `TASKS.md`. |

Project directory is resolved automatically from the session file. Pass a folder name as the first argument only if you need to override the session.

#### Argument Patterns

| Invocation | Behavior |
|---|---|
| `/milestone-start` | Auto-detect active milestone using session project |
| `/milestone-start 0.3.6.0` | Start or resume `tasks/Milestone0.3.6.0.md` |
| `/milestone-start tutorial-api` | Override project folder, auto-detect milestone |
| `/milestone-start tutorial-api 0.3.6.0` | Override project folder, specific milestone |

#### What It Does

1. Loads session context (terminal ID, project directories)
2. Finds the active or specified milestone file
3. Reads the Progress Summary to find the first incomplete task
4. Shows the user what it's about to do and waits for confirmation
5. Executes the task following the implementation steps in the milestone file
6. After completion, asks the user whether to continue to the next task

#### Task 0 Handling

For Task 0 (Milestone Initialization), the skill:
- Reads `package.json` to get the current version
- Asks for approval before creating the branch
- Updates the milestone header with confirmed versions
- Reports the branch name and confirmed version

#### Continuation Flow

After each task completes:

```
Task [N] complete: [task name]

Next steps:
  1. Review changes in GitHub Desktop
  2. Commit with a meaningful message
  3. Run /task-complete [N] to update the milestone and bump the version

Continue to Task [N+1]: [next task name]? (yes/no)
```

If the user says yes, the skill runs `/task-complete [N]` and immediately begins the next task. If the user says no, it ends with the next steps list. Running `/milestone-start` later picks up where you left off.

#### Examples

```
# With active session, auto-detect milestone
/milestone-start

# Start a specific milestone
/milestone-start 0.3.6.0

# Override project
/milestone-start tutorial-api

# Override project and specify milestone
/milestone-start tutorial-api 0.3.6.0
```

#### Notes

- Requires an active session or explicit project folder argument.
- If all tasks are complete, suggests running `/milestone-new` to create the next one.
- If no milestone file is found, suggests running `/milestone-new`.
- The continuation prompt keeps momentum going through multiple tasks in a single session without forcing it.

---

### /milestone-new

Scaffold a new milestone file from `MilestoneTemplate.md`. Reads `package.json` to auto-calculate the next version, names the file accordingly.

**Source file**: `skills/milestone-new.md`

---

#### Syntax

```
/milestone-new <milestone-number>
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (none) | | | Version is auto-calculated from package.json. No arguments needed with an active session. |

Project directories are resolved from the session file, enabling automatic version calculation.

#### How It Works

1. Reads `package.json` to get current version (e.g. `0.3.5.2`)
2. Bumps PATCH by 1, resets BUILD to 0: `0.3.6.0`
3. Creates `tasks/Milestone0.3.6.0.md` from the template
4. Fills in version numbers and branch names automatically

#### Argument Patterns

| Invocation | Behavior |
|---|---|
| `/milestone-new` | Auto-calculate version from session project's package.json |
| `/milestone-new my-app-ui` | Override project folder |

#### Output

```
Session: [label] ([TERMINAL_ID 8 chars])
────────────────────────────────────────
Created: [project]/tasks/Milestone0.3.6.0.md

Version: 0.3.5.2 -> 0.3.6.0  ([project])

Branch name for Task 0:
  don-041026-0.3.6.0-[suffix]

Next: Open the file, fill in objective, scope, and tasks, then run /session-start.
```

#### Examples

```
# With active session, version auto-calculated
/milestone-new

# Override project
/milestone-new my-app-ui
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
Version:  0.3.6.0 -> 0.3.6.1  (package.json updated, commit via GitHub Desktop)

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

### /milestone-complete

Close out a finished milestone. Verifies all tasks are complete, updates the milestone file, TASKS.md, and CLAUDE.md, optionally archives to `tasks/reference/`, then shows session help.

**Source file**: `skills/milestone-complete.md`

---

#### Syntax

```
/milestone-complete [version | project-folder]
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `version` | string | No | Milestone version to complete (auto-detects if omitted) |
| `project-folder` | string | No | Override BASE_DIR from session |

#### Argument Patterns

| Invocation | Behavior |
|---|---|
| `/milestone-complete` | Complete the active "In Progress" milestone |
| `/milestone-complete 0.3.6.0` | Complete Milestone 0.3.6.0 specifically |
| `/milestone-complete hourlings-ui` | Override BASE_DIR, auto-detect milestone |

#### Output

```
Session: [label] ([TERMINAL_ID 8 chars])
────────────────────────────────────────
Milestone complete: 0.3.6.0 - Feature Name
  5 tasks | Completed 2026-04-21
  Version: 0.3.6.5

Updated:
  ✓ Milestone file status set to Complete
  ✓ TASKS.md milestone moved to completed
  ✓ CLAUDE.md current status updated

[session-help output follows]
```

#### Notes

- Refuses to complete a milestone with pending or in-progress tasks. Lists the incomplete tasks so you can finish them.
- Updates three files: the milestone file (status + date), TASKS.md (moves to completed table), and CLAUDE.md (current status line).
- If `tasks/reference/` exists, offers to archive the milestone file there.
- Appends full `/session-help` output with `→` pointing to `/milestone-new`.

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

### /session-help

Show available skills with context-aware suggestions based on current session state. Highlights the most useful next steps with a `→` indicator.

**Source file**: `skills/session-help.md`

---

#### Syntax

```
/session-help
```

#### Parameters

None. Reads all state automatically from session files, project files, and bug directory.

#### Output

```
Session: hourlings (a1b2c3d4)
Milestone: 21.8 - Accessibility (3/7 tasks, 43%)
Last saved: 2026-04-18 14:32

    /session-start     Initialize a new session with project context
    /session-resume    Restore a previously saved session
  → /session-save      Save current session (last saved 3 days ago)
    /session-help      This screen

    /project-new       Scaffold project docs for a new or existing repo

  → /milestone-status  Show active milestone progress
  → /milestone-start   Continue from Task 4
  → /task-complete     Mark a task done and bump version
    /milestone-new     Scaffold a new milestone file

    /bug-status        Show open bugs
    /bug-add           Create a new bug from template
    /bug-fixed         Mark a bug as resolved

→ = suggested next step based on current session state
```

#### Notes

- The `→` indicator is context-sensitive. It changes based on session state, milestone progress, saved state age, and open bugs.
- Parenthetical hints appear after commands when extra context is useful (e.g. "last saved 3 days ago", "continue from Task 4").
- Other skills (`/task-complete`, `/bug-fixed`, `/session-save`) append session-help output at the end of their own output.

---

### /bug-status

Show the current status of bugs for this session's project. Reads bug files from the `bugs/` directory and displays a summary.

**Source file**: `skills/bug-status.md`

---

#### Syntax

```
/bug-status [bug-number | "all" | project-folder]
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `bug-number` | number | No | Show details for a specific bug |
| `"all"` | string | No | Include resolved bugs in the listing |
| `project-folder` | string | No | Override BASE_DIR from session |

#### Argument Patterns

| Invocation | Behavior |
|---|---|
| `/bug-status` | Show all open bugs using session project |
| `/bug-status 42` | Show full details for bug 0042 |
| `/bug-status all` | Show all bugs including resolved |
| `/bug-status hourlings-ui` | Override project folder |

#### Output (summary)

```
Session: [label] ([TERMINAL_ID 8 chars]), [BASE_DIR]
────────────────────────────────────────
Bugs: [X] open, [Y] resolved

| #    | Title              | Priority | Status      | Created    |
|------|--------------------|----------|-------------|------------|
| 0042 | Login timeout      | HIGH     | in progress | 2026-04-09 |
| 0041 | Missing avatar     | MEDIUM   | pending     | 2026-04-08 |

Next: Bug 0042: Login timeout (HIGH, in progress)
```

#### Output (single bug)

```
Session: [label] ([TERMINAL_ID 8 chars]), [BASE_DIR]
────────────────────────────────────────
Bug 0042: Login timeout
Status:   in progress
Priority: HIGH
Branch:   don-040926-bug-0042-login-timeout
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

#### Notes

- Reads files matching `Bug_????_*.md` in `BASE_DIR/bugs/`. Skips `BugFixTemplate.md`.
- If no `bugs/` directory exists, suggests running `/bug-add` or `/project-new`.
- Default view shows only open bugs (pending + in progress). Pass `all` to include resolved.

---

### /bug-add

Create a new bug file from the project's BugFixTemplate.md with an auto-incremented number.

**Source file**: `skills/bug-add.md`

---

#### Syntax

```
/bug-add [title]
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | No | Short title for the bug. If omitted, prompts interactively. |

#### Argument Patterns

| Invocation | Behavior |
|---|---|
| `/bug-add` | Prompt for title, priority, summary |
| `/bug-add login timeout on slow connections` | Use title from arguments, prompt for priority and summary |

#### Output

```
Session: [label] ([TERMINAL_ID 8 chars])
────────────────────────────────────────
Created: bugs/Bug_0003_login-timeout-slow-connections.md

  Bug:      0003 - Login timeout on slow connections
  Priority: HIGH
  Version:  0.8.15.4
  Branch:   don-042126-bug-0003-login-timeout-slow-connections

Fill in Steps to Reproduce and begin investigation.
Run /bug-status 3 to review, /bug-fixed 3 when resolved.
```

#### Notes

- Auto-increments bug number by finding the highest existing `Bug_????_*.md` and adding 1. Starts at 0001.
- Reads `BugFixTemplate.md` from `BASE_DIR/bugs/`. Falls back to a minimal built-in template if not found.
- Only prompts for title, priority, and summary. All other sections (Steps to Reproduce, Root Cause, Fix Plan, etc.) are left as template placeholders.

---

### /bug-fixed

Mark a bug as resolved. Updates status, fills in resolution date, and shows session help.

**Source file**: `skills/bug-fixed.md`

---

#### Syntax

```
/bug-fixed [number]
```

#### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `number` | number | Yes | The bug number to resolve (e.g. 3 or 0003) |

#### Argument Patterns

| Invocation | Behavior |
|---|---|
| `/bug-fixed 3` | Resolve bug 0003 |
| `/bug-fixed 0003` | Resolve bug 0003 |
| `/bug-fixed hourlings-ui 3` | Override BASE_DIR, resolve bug 0003 |

#### Output

```
Session: [label] ([TERMINAL_ID 8 chars])
────────────────────────────────────────
Resolved: Bug 0003 - Login timeout on slow connections
  HIGH | Created 2026-04-09 | Resolved 2026-04-21

[session-help output follows]
```

#### Notes

- If no bug number provided, lists open bugs and prompts for selection.
- If the bug is already resolved, reports the existing resolution date and stops.
- Prompts for resolution notes if the Resolution Notes section is still empty.
- Appends full `/session-help` output after the resolution confirmation.

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

Defines how to generate MilestoneTemplate.md and BugFixTemplate.md when scaffolding a new project. Referenced by `/project-new` and `/bug-add`.

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
