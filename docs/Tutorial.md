# Tutorial: Setting Up a New Project with Claude Code Skills

> A step-by-step walkthrough using two empty repos (tutorial-ui and tutorial-api) to demonstrate the full skill workflow. Assumes skills are already installed per [INSTALL.md](../INSTALL.md).

---

## Prerequisites

- Claude Code installed and authenticated
- Skills installed to `~/.claude/commands/` (see [INSTALL.md](../INSTALL.md))
- Two new repos created in your GitHub root directory:
  - `tutorial-ui/` (frontend, contains only .gitignore and README.md)
  - `tutorial-api/` (backend, contains only .gitignore and README.md)
- Each repo should have a `package.json` with `"version": "0.0.0.0"`. If not, create one:

```bash
cd tutorial-ui && npm init -y && cd ..
cd tutorial-api && npm init -y && cd ..
```

Then set the version in each `package.json` to `"0.0.0.0"`.

---

## Step 1: Start Claude Code from your GitHub root

Open a terminal and navigate to the folder that contains both repos:

```bash
cd ~/Projects/GitHub   # or wherever your repos live
claude
```

Starting from the parent directory gives Claude visibility into both repos.

---

## Step 2: Scaffold the UI project

Run `/project-new` with the UI project details provided up front. This prevents the skill from asking questions interactively.

```
/project-new tutorial-ui

Project name: Tutorial App
What are you building? A simple task management app with a React frontend. Users can create, edit, and delete tasks organized by category. It demonstrates the milestone-based development workflow.
Who is it for? Developers learning the claude-docs skill system. The app itself is secondary to the workflow.
Tech stack:
  - Frontend: React + TypeScript + Tailwind CSS + Vite
  - Backend: Node + Express (separate repo: tutorial-api)
  - Database: SQLite via better-sqlite3
  - Hosting: Vercel (frontend), Railway (backend)
Repository structure: Two repos. tutorial-ui is the frontend and primary management hub. tutorial-api is the backend API (code + API-specific milestones).
MVP definition:
  1. Create and delete tasks
  2. Organize tasks by category
  3. Mark tasks complete/incomplete
  4. Filter by category and status
  5. Persist to database via API
Reference projects: none
Developer name: dev
```

Claude will generate all project management files in `tutorial-ui/`:

```
tutorial-ui/
├── CLAUDE.md                    # Session guide
├── ARCHITECTURE.md              # Technical architecture
├── PRD.md                       # Product requirements
├── TASKS.md                     # Milestone dashboard
├── tasks/
│   ├── Milestone0.0.1.0.md      # Project setup milestone
│   └── MilestoneTemplate.md     # Template for future milestones
├── bugs/
│   └── BugFixTemplate.md        # Bug fix template
└── screenshots/                 # Empty, for bug fix screenshots
```

**Review the generated files.** The skill creates them from your answers, but you should verify the architecture and PRD match your intent. Adjust anything that doesn't look right before proceeding.

---

## Step 3: Scaffold the API project

Run `/project-new` again for the API repo. The API is a standalone service, so the answers are different:

```
/project-new tutorial-api

Project name: Tutorial API
What are you building? A REST API backend for the Tutorial App. Provides CRUD endpoints for tasks and categories. Handles data validation and persistence.
Who is it for? The tutorial-ui frontend consumes this API. Admin users can also manage data directly via API calls.
Tech stack:
  - Frontend: none (API only)
  - Backend: Node + Express + TypeScript
  - Database: SQLite via better-sqlite3
  - Hosting: Railway
Repository structure: Single repo. tutorial-api is standalone. Management docs for the overall project live in tutorial-ui.
MVP definition:
  1. CRUD endpoints for tasks (/api/tasks)
  2. CRUD endpoints for categories (/api/categories)
  3. Input validation and error handling
  4. Database schema and seed data
  5. Health check endpoint
Reference projects: none
Developer name: dev
```

Claude generates the same file structure in `tutorial-api/`. Since this is an API-only repo, review the generated `MilestoneTemplate.md` and verify it reflects a single-repo setup (one branch, no UI references).

---

## Step 4: Initialize a session

Now that both projects are scaffolded, start a session:

```
/session-start tutorial-ui tutorial-api
```

Claude reads both repos' `CLAUDE.md` and `TASKS.md`, finds the active milestone (0.0.1.0 in tutorial-ui), and gives you a briefing:

```
Session: tutorial (A1B2C3D4)
Projects: tutorial-ui + tutorial-api
─────────────────────────────────────
Project:          Tutorial App v0.0.0.0
Current Phase:    Milestone 0.0.1.0: Project Setup
In Progress:      Task 0: Milestone Initialization
Blockers:         None
Key Rules:        Do not commit. Branch creation only.
```

---

## Step 5: Check milestone status

```
/milestone-status
```

This shows the progress table for the active milestone. You should see Task 0 (Milestone Initialization) as the next step.

---

## Step 6: Run Task 0 (Initialization)

Task 0 is always the same: verify the current version and create the feature branch. Tell Claude to proceed:

```
Let's run Task 0 for Milestone 0.0.1.0 in tutorial-ui.
```

Claude will:
1. Read `package.json` to confirm the version (0.0.0.0)
2. Ask for approval to create the branch: `dev-041026-0.0.1.0-ui`
3. Create and push the branch
4. Update the milestone file with the confirmed version

**You approve the branch creation.** Then commit the milestone file changes via GitHub Desktop.

Repeat for tutorial-api if it has its own Milestone 0.0.1.0.

---

## Step 7: Mark Task 0 complete

```
/task-complete 0
```

This updates the milestone's progress table, marks Task 0 as complete, and bumps `package.json` to 0.0.1.0. Review and commit via GitHub Desktop.

---

## Step 8: Work through tasks

For each remaining task in the milestone:

1. Tell Claude what to implement (or let the milestone file guide it)
2. Claude writes the code
3. You review in GitHub Desktop
4. You commit
5. Run `/task-complete N` to mark it done and bump the version

---

## Step 9: Create the next milestone

When all tasks are complete:

```
/milestone-new
```

Claude reads `package.json` (now at 0.0.1.N), bumps PATCH +1 to 0.0.2.0, and creates `tasks/Milestone0.0.2.0.md` from the template. Open the file, fill in the objective and tasks, and start the next cycle.

---

## Step 10: Track bug fixes

If you find a bug during development, use `/bugfix-status` to check existing bugs:

```
/bugfix-status
```

To create a new bug fix, copy `bugs/BugFixTemplate.md` to a new file (e.g. `bugs/BugFix-001-broken-filter.md`), fill in the details, and create a branch:

```
dev-041026-bugfix-001-broken-filter
```

Bug fixes follow the same review-and-commit workflow. When resolved, update the status in the bug fix file.

---

## Workflow Summary

```
/project-new [folder]           <- scaffold project files (once per repo)
/session-start [ui] [api]       <- orient Claude (once per terminal session)
/milestone-status               <- check progress
/task-complete [N]              <- mark task done, bump version
/milestone-new                  <- scaffold next milestone (auto-versioned)
/bugfix-status                  <- check open bugs
```

---

## Tips

- **Always start with `/session-start`.** Every new terminal session needs it. Takes seconds, prevents Claude from guessing.
- **Review generated files.** The skills create good scaffolding, but your project is unique. Adjust ARCHITECTURE.md and PRD.md before starting real work.
- **Adapt the templates.** The MilestoneTemplate.md in each repo should match that repo's structure. A single-repo API doesn't need UI branch steps.
- **Keep CLAUDE.md lean.** Session history belongs in milestone files, not in CLAUDE.md. One line per completed milestone.
- **Commit after every `/task-complete`.** The skill bumps `package.json` but doesn't commit. You review and commit via GitHub Desktop.
- **Bug fixes are separate from milestones.** They get their own branch and tracking file. Use them for production issues, not planned feature work.
