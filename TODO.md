# Claude Docs TODO

Improvements and fixes for the Claude Code skills and project management system.

---

## 1. Per-Project Session Save

**Priority**: High
**Status**: Not Started
**Affects**: `session-save`, `session-resume`, `session-start`, `project-new`

### Problem

`saved-state.md` is a single shared file in `.claude-sessions/`. Whichever project saves last overwrites the previous project's state. Switching between projects (e.g., hourlings and thesus-bt) loses the other project's saved context.

### Solution

Save state per project using a project slug as the filename: `.claude-sessions/saved-state-[slug].md`

### Changes Required

**project-new**:
- Add a `slug` field to the session file (e.g., `"slug": "hourlings"`)
- The slug should be a unique, URL-safe identifier derived from the project name (lowercase, hyphens, no spaces)
- Prompt the user to confirm or customize the slug during project scaffolding
- Store the slug in the session JSON so all skills can reference it

**session-start**:
- Read the slug from the project's session file or CLAUDE.md
- For existing projects without a slug, derive one from the session label

**session-save**:
- Write to `.claude-sessions/saved-state-[slug].md` instead of `saved-state.md`
- Each project gets its own file that persists independently

**session-resume**:
- Accept a project slug or label as an argument: `/session-resume hourlings`
- If no argument, list available saved states and let the user pick
- Read from `.claude-sessions/saved-state-[slug].md`

**session-help**:
- Show saved state timestamp for the current project's slug, not the shared file
- Optionally show other saved projects: "Other saved sessions: thesus-bt (2 days ago)"

### Migration

Existing `saved-state.md` can be renamed to `saved-state-[slug].md` on next save. No breaking change needed.

---

## 2. Milestone Update Skill

**Priority**: Medium
**Status**: Not Started
**Affects**: New skill `milestone-update`

Mid-milestone task restructuring happens frequently (tasks merge, split, reorder, scope changes). Currently requires manual markdown editing. A `/milestone-update` skill would parse the progress table, apply changes, and keep version/completion counts consistent.

See: `docs/ToDoMilestoneUpdate.md` for full spec.

---

## 3. Per-Repo Session Info (Multi-Repo Projects)

**Priority**: Medium
**Status**: Not Started
**Affects**: `session-start`, `session-save`, `session-resume`, `milestone-status`, `milestone-start`, `task-complete`, `milestone-complete`

### Problem

A single project can span multiple repos (e.g., **hourlings** = `hourlings-ui` + `hourlings-api`). The current session JSON only stores `projects.primary` (one repo), so:

- A session can't track an *active milestone per repo* — only one milestone is "in progress" at a time from the session's POV
- Working on `Milestone21.8c` (UI) in one terminal and `Milestone21.8b` (API) in another forces two completely separate sessions with no shared project-level identity
- `/milestone-status` resolves against the single `primary` repo; switching to the other repo means re-running `/session-start [other-repo]`, which loses any state for the first repo

This is distinct from #1 (Per-Project Session Save). #1 handles **cross-project** switching (hourlings vs thesus-bt). This handles **intra-project multi-repo** workflow.

### Solution

Session file supports multiple repos under one project, each with its own active-milestone state:

```json
{
  "label": "hourlings",
  "slug": "hourlings",
  "projects": {
    "ui":  { "dir": "hourlings-ui",  "activeMilestone": "21.8c" },
    "api": { "dir": "hourlings-api", "activeMilestone": "21.8b" }
  }
}
```

Skills disambiguate which repo to act on based on CWD (preferred) or an explicit arg (`/milestone-status api`). `/session-start` accepts multiple repos: `/session-start hourlings-ui hourlings-api` already exists in the prompt examples but isn't fully wired through the skill set.

### Changes Required

**session-start**:
- Already accepts multiple repo args — extend to populate `projects.ui` / `projects.api` (or named keys) instead of just `projects.primary`
- Detect repo role automatically (UI vs API) by inspecting `package.json` and folder name, or prompt

**milestone-status / milestone-start / task-complete / milestone-complete**:
- Resolve target repo from CWD when run inside one of the project's repos
- Accept explicit repo arg as override (`/milestone-status ui`, `/milestone-status api`)
- Update the correct `projects.{repo}.activeMilestone` field

**session-save / session-resume**:
- Capture and restore active milestone *per repo*, not as a single value

### Migration

Existing single-repo sessions stay valid — `projects.primary` can coexist with the new shape. New `/session-start` runs use the multi-repo shape; old runs migrate on next save.

---
