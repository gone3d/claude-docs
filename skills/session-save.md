Save the current working context so it can be restored in a future session. Captures which projects are active, what milestone is in progress, what's done, what's next, and any notes the user provides.

---

## Step 1: Load Session Context

Run this to get the current terminal ID:

```bash
echo "${TERM_SESSION_ID:-${ITERM_SESSION_ID:-$$}}"
```

Read `[CWD]/.claude-sessions/[TERMINAL_ID].json` to get project directories.

- If the session file exists, use it for project info
- If no session file exists for this terminal, stop and report:

```
No active session found for this terminal.
Run /session-start [project-folder] first, then /session-save.
```

Do not fall back to guessing or using $ARGUMENTS as a project folder. A session must exist to save it.

---

## Step 2: Read Project State

From the session's primary project (BASE_DIR):

1. Read `package.json` for the current version
2. Read `TASKS.md` for the milestone dashboard
3. Find the active milestone file in `tasks/` (the one marked In Progress, or the most recently modified)
4. Read the milestone's Progress Summary table to get task completion status

If an API project is registered, read its `package.json` version too.

---

## Step 3: Parse User Notes

$ARGUMENTS may contain a free-text note the user wants to save alongside the state. If present, include it as the `notes` field. If empty, that's fine. Skip it.

Examples:
- `/session-save` - save state, no notes
- `/session-save stopped mid-refactor on the auth service, need to finish before moving to task 3` - save state with context

---

## Step 4: Write the State File

Create `[CWD]/.claude-sessions/saved-state.md` with this structure.

First, get the current date and time:

```bash
date "+%Y-%m-%d %H:%M"
```

Use the actual output as the saved timestamp below.

```markdown
# Saved Session State

**Saved**: [output from the date command above, e.g. 2026-04-21 14:32]
**Label**: [session label]
**Projects**: [project folders, comma-separated]

## Projects

[Copy the `projects` object from the session JSON exactly, so /session-resume can reconstruct it]

```json
{
  "ui": "[folder]",
  "api": "[folder]"
}
```

or for single-project sessions:

```json
{
  "primary": "[folder]"
}
```

## Active Work

**Primary project**: [folder name] v[version]
**API project**: [folder name] v[version] (omit if none)

**Milestone**: [version] - [title]
**Status**: [X] of [Y] tasks complete ([Z]%)

### Task Progress

[Copy the Progress Summary table from the milestone file]

**Next task**: Task [N]: [name] ([priority])

## Notes

[User's free-text notes from $ARGUMENTS, or "None"]
```

If a `saved-state.md` already exists, overwrite it. This is a snapshot, not a log.

---

## Step 5: Confirm

```
Session state saved to .claude-sessions/saved-state.md

  Projects:  [folders]
  Milestone: [version] - [title]
  Progress:  [X] of [Y] tasks ([Z]%)
  Next:      Task [N]: [name]
  Notes:     [notes or "None"]

Restore with /session-resume when you're back.
```
