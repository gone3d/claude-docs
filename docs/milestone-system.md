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
├── tasks/
│   ├── MilestoneTemplate.md     # Template for new milestones
│   ├── Milestone0.0.1.0.md      # Project initialization
│   └── Milestone0.0.2.0.md      # First feature milestone
├── bugs/
│   └── BugFixTemplate.md        # Template for bug fix tracking
└── screenshots/                 # Bug fix screenshots
```

**The rule**: All implementation detail, session notes, and task-level decisions belong in milestone files. Root-level docs (`CLAUDE.md`, `ARCHITECTURE.md`, `PRD.md`) stay lean and reference-sized. They don't grow with every session.

---

## Version Numbering

```
MAJOR . MINOR . PATCH . BUILD
  0   .   3   .   5   .   2
```

| Digit | When it changes | Example |
|---|---|---|
| **BUILD** | Each task completion within a milestone | 0.3.5.0 -> 0.3.5.1 -> 0.3.5.2 |
| **PATCH** | New milestone starts (BUILD resets to 0) | 0.3.5.N -> 0.3.6.0 |
| **MINOR** | Major feature or significant enhancement | 0.3.N.N -> 0.4.0.0 |
| **MAJOR** | Breaking changes, production release | 0.N.N.N -> 1.0.0.0 |

**Why BUILD-level versioning?** Each task completion gets its own version, which means each task can be independently deployed for testing. You can verify one task works before starting the next.

**Development phases:**

| Range | Phase | Notes |
|---|---|---|
| 0.0.x.x | Project setup and early development | First milestone is always 0.0.1.0 |
| 0.1.x.x through 0.8.x.x | Active development, pre-MVP | Bump MINOR for significant features. Stay here as long as needed. |
| 0.9.x.x | Beta / MVP testing | Viable product in production with real users |
| 1.0.x.x | Production release | First stable public release |

The MINOR digit can go as high as needed. 0.8.50.0 or 0.8.100.0 is fine. Don't rush to 0.9 until the product is genuinely ready for beta testing.

---

## Milestone Naming

**Milestones are named after the version they produce.** The milestone name IS the starting version number.

To determine the next milestone:

1. Read `package.json` for the current version (e.g. `0.3.5.2`)
2. Bump PATCH by 1, reset BUILD to 0: `0.3.6.0`
3. File name: `Milestone0.3.6.0.md`
4. Each task bumps BUILD: 0.3.6.1, 0.3.6.2, etc.

**Examples:**

| Current Version | Next Milestone | File | Task 1 | Task 2 |
|---|---|---|---|---|
| 0.0.0.0 (new) | 0.0.1.0 | Milestone0.0.1.0.md | 0.0.1.1 | 0.0.1.2 |
| 0.0.2.3 | 0.0.3.0 | Milestone0.0.3.0.md | 0.0.3.1 | 0.0.3.2 |
| 0.3.12.5 | 0.3.13.0 | Milestone0.3.13.0.md | 0.3.13.1 | 0.3.13.2 |

---

## Milestone File Structure

Every milestone file follows the template. Key sections:

### Header
```markdown
# Milestone 0.3.6.0 - [Title]

**Version**: 0.3.6.0
**Status**: In Progress
**Date Created**: 2026-04-10
**Date Started**: 2026-04-10
```

### Progress Summary Table
The first thing you see, current completion at a glance:

```markdown
## Progress Summary

**Completion**: 2 of 5 tasks complete (40%)

| Task                        | Priority | Status      | Version   | Deployed |
|-----------------------------|----------|-------------|-----------|----------|
| Task 0: Initialization      | SETUP    | Complete    | 0.3.6.0   | -        |
| Task 1: [Name]              | HIGH     | Complete    | 0.3.6.1   | Yes      |
| Task 2: [Name]              | HIGH     | In Progress | 0.3.6.2   | -        |
| Task 3: [Name]              | MEDIUM   | Pending     | 0.3.6.3   | -        |
| Task 4: [Name]              | LOW      | Pending     | 0.3.6.4   | -        |
```

### Task 0: Milestone Initialization (Always First)

Task 0 is the setup task every milestone starts with. It ensures version numbers are accurate (milestones are often planned before they're started, so versions change between planning and execution):

- **0.1**: Read `package.json` to get current version
- **0.2**: Create feature branch
- **0.3**: Update milestone header with confirmed versions

For multi-repo projects, add steps for each additional repo (read version, create branch).

**Claude creates the branches. You commit everything else.**

### Individual Tasks

Each task has:
- Status, priority, estimated time, version target
- Description and affected files
- Implementation steps
- Testing checklist
- Success criteria

---

## Branch Naming

```
[developer]-[MMDDYY]-[VERSION]-[repo-suffix]
```

Examples:
```
don-041026-0.3.6.0-ui
don-041026-0.3.6.0-api
```

Branches are created from `main`, pushed immediately, and all work for that milestone happens on that branch.

---

## The Skills

The milestone system is supported by slash commands:

### `/session-start [folder(s)]`
Run at the start of every terminal session. Reads `CLAUDE.md`, `TASKS.md`, and the active milestone file, then gives you a current-state briefing.

### `/milestone-status [version]`
Shows the active milestone's progress table, next task, and blockers.

### `/milestone-new`
Scaffolds a new milestone file from the template. Reads `package.json` to calculate the next version automatically. Names the file accordingly.

### `/task-complete [number]`
Marks a task complete, updates the progress table, bumps `package.json` version to match. Does not commit anything. You review and commit via GitHub Desktop.

### `/bugfix-status`
Shows open bug fixes from the `bugs/` directory.

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
  /milestone-new               <- scaffold the file (version auto-calculated)
  [fill in tasks manually]     <- you define what needs to be done

Starting
  /session-start my-app-ui my-app-api
  /milestone-status            <- confirm Task 0 is next
  [review Task 0 steps]
  [approve branch creation]    <- Claude creates branches with your OK

Development
  [Claude implements tasks]
  /task-complete 1             <- marks done, bumps version
  [you commit via GitHub Desktop]
  /task-complete 2
  [you commit]
  ...

Completion
  /task-complete [last]        <- all tasks done
  [update TASKS.md: move milestone to Completed table]
  [update CLAUDE.md: update current status]
  [you merge PR, deploy]
```

---

## When to Split a Milestone

If a milestone grows beyond 7-8 tasks, split it. Each part gets its own version:

```
Current version: 0.3.5.0
Part 1: Milestone0.3.6.0.md (tasks 1-4)
Part 2: Milestone0.3.7.0.md (tasks 5-8)
```

Each gets its own branch, version sequence, and file. This keeps milestones deployable in a reasonable timeframe.

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
