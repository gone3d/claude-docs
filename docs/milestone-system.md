# The Milestone System

> A structured approach to managing development work with Claude Code. Milestones are the unit of work, each one a self-contained deliverable with version tracking, branch management, and detailed task records.

---

## Why Milestones

Claude Code doesn't retain memory between sessions. Without structure, each session starts from scratch. You spend time re-explaining context instead of building.

The milestone system solves this by keeping all project state in files that Claude reads at the start of every session. Your progress, decisions, and in-progress work are always in the milestone file, not in Claude's memory.

---

## File Structure

```
your-project/
├── CLAUDE.md                    # Session guide: current status, workflow rules
├── ARCHITECTURE.md              # Technical reference: patterns, ADRs
├── PRD.md                       # Product requirements: vision, goals, MVP
├── TASKS.md                     # Milestone dashboard: links only, no detail
└── tasks/
    ├── MilestoneTemplate.md     # Template for new milestones
    ├── Milestone0.md            # Project initialization
    ├── Milestone1.md            # First feature milestone
    └── Milestone1.1.md          # Sub-milestone (if a milestone gets large)
```

**The rule**: All implementation detail, session notes, and task-level decisions belong in milestone files. Root-level docs (`CLAUDE.md`, `ARCHITECTURE.md`, `PRD.md`) stay lean and reference-sized. They don't grow with every session.

---

## Version Numbering

```
MAJOR . MINOR . PATCH . BUILD
  0   .   8   .  12   .   3
```

| Digit | When it changes | Example |
|---|---|---|
| **BUILD** | Each task completion | `0.8.12.0` → `0.8.12.1` → `0.8.12.2` |
| **PATCH** | New milestone starts | `0.8.12.N` → `0.8.13.0` |
| **MINOR** | Major feature or significant enhancement | `0.8.x.x` → `0.9.0.0` |
| **MAJOR** | Breaking changes, major releases | `0.x.x.x` → `1.0.0.0` |

**Why BUILD-level versioning?** Each task completion gets its own version, which means each task can be independently deployed for browser testing. You can verify one task works before starting the next.

**Version conventions:**
- `v0.x.x.x`: development phase (can go to `v0.8.100.0` if needed, that's fine)
- `v0.9.x.x`: beta / MVP release
- `v1.0.x.x`: production release

---

## Milestone File Structure

Every milestone file follows the same template. Key sections:

### Header
```markdown
# Milestone 5.1: [Title]

**Status**: 🚧 In Progress
**Date Created**: 2026-04-08
**Date Started**: 2026-04-08
**Version**: 0.8.13.0 (starting)
```

### Progress Summary Table
The first thing you see, current completion at a glance:

```markdown
## Progress Summary

**Completion**: 2 of 5 tasks complete (40%)

| Task                        | Priority | Status      | Version   | Deployed |
|-----------------------------|----------|-------------|-----------|----------|
| Task 0: Initialization      | SETUP    | ✅ Complete | 0.8.13.0  | -        |
| Task 1: [Name]              | HIGH     | ✅ Complete | 0.8.13.1  | ✅       |
| Task 2: [Name]              | HIGH     | 🚧 In Progress | 0.8.13.2 | -      |
| Task 3: [Name]              | MEDIUM   | ⏳ Pending  | 0.8.13.3  | -        |
| Task 4: [Name]              | LOW      | ⏳ Pending  | 0.8.13.4  | -        |
```

### Task 0: Milestone Initialization (Always First)

Task 0 is the setup task every milestone starts with. It ensures version numbers are accurate (milestones are often planned before they're started, so versions change between planning and execution):

- **0.1**: Read `package.json` to get current UI version
- **0.2**: Read API `package.json` if applicable
- **0.3**: Create UI feature branch
- **0.4**: Create API feature branch (if needed)
- **0.5**: Update milestone header with confirmed versions

**Claude creates the branches. You commit everything else.**

### Individual Tasks

Each task has:
- Status, priority, estimated time, version target
- Description and affected files
- Implementation steps
- Testing checklist
- Success criteria
- Rollback plan (for risky changes)

---

## Branch Naming

```
[developer]-[MMDDYY]-milestone-[number]-[ui|api]
```

Examples:
```
don-040826-milestone-5-ui
don-040826-milestone-5-api
don-040826-milestone-5.1-ui    # sub-milestone
```

Branches are created from `main`, pushed immediately, and all work for that milestone happens on that branch.

---

## The Skills

The milestone system is supported by four slash commands:

### `/session-start [ui-folder] [api-folder]`
Run at the start of every terminal session. Reads `CLAUDE.md`, `TASKS.md`, and the active milestone file, then gives you a current-state briefing. Writes a session context file so other skills know which projects you're working on.

### `/milestone-status [number]`
Shows the active milestone's progress table, next task, and blockers. Pass a number to check a specific milestone instead of the active one.

### `/milestone-new [number]`
Scaffolds a new milestone file from the template. Reads both repos' `package.json` files to calculate starting versions automatically. Fills in branch names with today's date.

### `/task-complete [number]`
Marks a task complete, updates the progress table, bumps `package.json` version to match. Does not commit anything. You review and commit via GitHub Desktop.

---

## Git Workflow

**What Claude does:**
- Creates feature branches (`git checkout -b` + `git push -u origin`)
- Writes and modifies code files
- Updates milestone files and version numbers

**What you do:**
- Review changes in GitHub Desktop (or your preferred tool)
- Stage and commit with meaningful messages
- Push commits to the feature branch
- Create pull requests
- Merge to main
- Deploy

This separation keeps you in control of what goes into the repo. Claude prepares; you verify and commit.

---

## Milestone Lifecycle

```
Planning
  /milestone-new 5          ← scaffold the file
  [fill in tasks manually]  ← you define what needs to be done

Starting
  /session-start my-app-ui my-app-api
  /milestone-status          ← confirm Task 0 is next
  [review Task 0 steps]
  [approve branch creation]  ← Claude creates branches with your OK

Development
  [Claude implements tasks]
  /task-complete 1           ← marks done, bumps version
  [you commit via GitHub Desktop]
  /task-complete 2
  [you commit]
  ...

Completion
  /task-complete [last]      ← all tasks done
  [update TASKS.md: move milestone to Completed table]
  [update CLAUDE.md: update current status]
  [you merge PR, deploy]
```

---

## When to Create a Sub-Milestone

If a milestone grows beyond 7–8 tasks, split it:

```
Milestone 7     → becomes →    Milestone 7.1 + Milestone 7.2
```

Each sub-milestone gets its own branch, its own version sequence, and its own file. This keeps individual milestones deployable in a reasonable timeframe.

---

## Keeping Root Docs Lean

The most common mistake: letting `CLAUDE.md` grow into a session log. Resist this.

| Content | Where it goes |
|---|---|
| What was built this session | Milestone file completion summary |
| A decision made during a task | Milestone file, under the task |
| An architectural decision that's now final | ARCHITECTURE.md ADR section |
| Current project status | CLAUDE.md (brief, one line per milestone) |
| Implementation specifics | Milestone file |
| Product direction change | PRD.md |

When a milestone is complete, `CLAUDE.md` gets a single-line entry in the Completed Milestones table. That's it. The detail lives in the milestone file permanently.
