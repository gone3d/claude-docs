# Tutorial: Bootstrapping an Existing App with Claude Code Skills

> How to add the milestone-based workflow to a project that already has code, a package.json, and possibly months or years of development history. Assumes skills are already installed per [INSTALL.md](../INSTALL.md).

---

## When to Use This

You have an existing application. It has code, a package.json with a version, maybe deployment pipelines, maybe some documentation. You want to start using the milestone skill system without disrupting what's already working.

This is different from [Tutorial.md](Tutorial.md), which starts from empty repos.

---

## What You Need Before Starting

- Claude Code installed and authenticated
- Skills installed to `~/.claude/commands/`
- An existing repo with a `package.json` that has a `"version"` field
- The repo should be on the `main` branch with a clean working tree (no uncommitted changes)

---

## Step 1: Understand Your Starting Point

Before running any skills, take stock of what you have:

```bash
cd ~/Projects/GitHub/my-existing-app
cat package.json | grep '"version"'
```

Note the current version. This is your starting point. The first milestone will bump PATCH +1 and reset BUILD to 0.

**Examples:**

| Current version | First milestone | File name |
|---|---|---|
| `1.2.3` (3-digit semver) | `1.2.3.0` (add BUILD digit) | Milestone1.2.3.0.md |
| `0.5.0` (3-digit) | `0.5.0.0` (add BUILD digit) | Milestone0.5.0.0.md |
| `2.0.0.0` (already 4-digit) | `2.0.1.0` (PATCH +1) | Milestone2.0.1.0.md |

If your project uses 3-digit semver (MAJOR.MINOR.PATCH), you'll need to add the BUILD digit. Update `package.json` to the 4-digit format before running skills:

```json
// Before
"version": "1.2.3"

// After
"version": "1.2.3.0"
```

Commit this change before proceeding.

---

## Step 2: Decide What Goes Where

For a single repo, everything lives in that repo. For multi-repo projects, decide which repo is the management hub.

**Single repo:**
```
my-app/
├── CLAUDE.md          <- new
├── ARCHITECTURE.md    <- new (or update existing)
├── PRD.md             <- new
├── TASKS.md           <- new
├── tasks/             <- new
├── bugs/              <- new
├── screenshots/       <- new
├── package.json       <- existing
└── src/               <- existing code
```

**Multi-repo (pick one as the hub):**
```
my-app-ui/             <- management hub
├── CLAUDE.md
├── ARCHITECTURE.md
├── PRD.md
├── TASKS.md
├── tasks/
├── bugs/
└── src/

my-app-api/            <- code + API-specific milestones
├── CLAUDE.md          <- lean, points to hub
├── TASKS.md           <- API milestones only
├── tasks/
├── bugs/
└── src/
```

---

## Step 3: Run /project-new

Start Claude Code from your GitHub root directory:

```bash
cd ~/Projects/GitHub
claude
```

Run the skill with your existing app's folder and answers:

```
/project-new my-existing-app

Project name: My Existing App
What are you building? [Describe your app in one paragraph. What it does, why it exists.]
Who is it for? [Target users and their primary use cases]
Tech stack:
  - Frontend: [your actual stack]
  - Backend: [your actual stack, or "none" if single repo]
  - Database: [your actual database]
  - Hosting: [where it's deployed]
Repository structure: [single repo / multi-repo, folder names and roles]
MVP definition:
  1. [Already shipped? List what's working]
  2. [Or list what's next if pre-MVP]
  3. [3-5 items]
Reference projects: none
Developer name: [your name for branch naming]
```

The skill will create CLAUDE.md, ARCHITECTURE.md, PRD.md, TASKS.md, templates, and the project setup milestone.

**Important:** The skill doesn't touch your existing code. It only creates management files.

---

## Step 4: Review and Fix the Generated Files

This is the most important step. The skill generates files from your answers, but it doesn't know your codebase. You need to verify and adjust:

### ARCHITECTURE.md
The generated version will be generic based on your tech stack answers. For an existing app, you should:

- Add your actual directory structure (not the template placeholder)
- Document established patterns (state management, API conventions, component structure)
- Add any ADRs (architectural decisions) that are already in effect
- Reference existing documentation if you have any

### PRD.md
The generated version captures your answers about what you're building. Review:

- Is the MVP definition accurate? For existing apps, the MVP may already be shipped
- Update the "In scope" checklist to reflect what's done vs what's planned
- Add any constraints or requirements specific to your project

### CLAUDE.md
The generated version is a clean template. Customize:

- Update "Current Status" to reflect where your project actually is
- Add your actual deployment URLs
- If your project has existing workflow rules or conventions, add them

### TASKS.md
This starts empty (just the Milestone 0.0.1.0 or equivalent). You have two options for representing past work:

**Option A: Start fresh (recommended).** Don't try to retroactively create milestones for past work. The completed milestones table starts empty. Your first real milestone picks up from the current version. Past history lives in git.

**Option B: Add key milestones retroactively.** If there are significant past milestones worth tracking (major releases, migrations, rewrites), add them to the Completed table with approximate dates. Don't create milestone files for them.

```markdown
## Completed Milestones

| Milestone | Status | Date Completed | Description |
|-----------|--------|----------------|-------------|
| Pre-skills | Complete | 2025-12 | Initial development (before skill system) |
| 1.0.0.0 | Complete | 2026-01 | Production launch |
| 1.1.0.0 | Complete | 2026-03 | Authentication overhaul |
```

---

## Step 5: Adjust the Version

The `/project-new` skill creates `tasks/Milestone0.0.1.0.md` assuming a new project. For an existing app, you need to:

1. Delete `tasks/Milestone0.0.1.0.md` (it's for fresh projects)
2. Check your `package.json` version (e.g. `1.2.3.0`)
3. Your first real milestone will be the next PATCH bump: `1.2.4.0`

Don't create this milestone yet. You'll use `/milestone-new` when you're ready to start actual work.

---

## Step 6: Customize the MilestoneTemplate

The generated `tasks/MilestoneTemplate.md` is generic. Adjust it for your project:

- Replace placeholder repo names with your actual folder names
- Update paths in Task 0 steps to match your project location
- Adjust branch naming if your team has an existing convention
- Remove sections that don't apply (multi-repo steps for a single repo, database rollback for a frontend-only app)

---

## Step 7: Initialize a Session

```
/session-start my-existing-app
```

Or for multi-repo:

```
/session-start my-app-ui my-app-api
```

Claude reads your customized CLAUDE.md and TASKS.md and orients to the project.

---

## Step 8: Create Your First Real Milestone

```
/milestone-new
```

Claude reads `package.json`, calculates the next version, and creates the milestone file. Open it, define your tasks, and start working.

---

## Common Scenarios

### Existing app with 3-digit semver

Add the BUILD digit to package.json before starting:

```json
"version": "2.1.0" -> "version": "2.1.0.0"
```

The skill system uses 4-digit versioning (MAJOR.MINOR.PATCH.BUILD). The BUILD digit enables per-task version tracking within a milestone.

### Existing app with no package.json

Create one first:

```bash
npm init -y
```

Set the version to reflect your project's maturity:

| Project state | Suggested starting version |
|---|---|
| Just started, no users | 0.0.0.0 |
| Working prototype | 0.1.0.0 |
| In active development | 0.5.0.0 |
| Production with users | 1.0.0.0 |

### Existing app with extensive documentation

You don't need to throw away existing docs. Options:

- **Merge into ARCHITECTURE.md**: If your existing docs cover architecture, patterns, or technical decisions, fold them into the generated ARCHITECTURE.md
- **Move to docs/**: Create a `docs/` folder for reference documentation that doesn't fit the management file structure
- **Archive to docs/old/**: If existing docs are outdated or redundant with the generated files, archive them

### Monorepo (frontend + backend in one repo)

Treat it as a single repo. One set of management files, one TASKS.md, one milestone sequence. The milestone files reference paths within the monorepo (e.g. `src/frontend/`, `src/backend/`).

### Team with existing git workflow

The skill system assumes Claude creates branches and the developer handles all commits. If your team has a different workflow (trunk-based, feature flags, etc.), update the Git Workflow Policy section in CLAUDE.md and MilestoneTemplate.md to match.

---

## Checklist

```
[ ] package.json has 4-digit version (MAJOR.MINOR.PATCH.BUILD)
[ ] /project-new run and files generated
[ ] ARCHITECTURE.md reviewed and updated with actual project structure
[ ] PRD.md reviewed and adjusted for existing app state
[ ] CLAUDE.md customized with current status and deployment info
[ ] TASKS.md updated (fresh start or retroactive milestones)
[ ] Milestone0.0.1.0.md deleted (not needed for existing apps)
[ ] MilestoneTemplate.md customized for your repo structure
[ ] /session-start tested and working
[ ] Ready to /milestone-new for first real milestone
```
