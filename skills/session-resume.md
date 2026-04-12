Restore context from a previously saved session. Reads the saved state file, re-initializes the session, and presents a full briefing so you can pick up where you left off.

---

## Step 1: Look for Saved State

Read `[CWD]/.claude-sessions/saved-state.md`.

- If the file exists, continue to Step 2
- If it doesn't exist, report: "No saved state found. Nothing to resume. Use `/session-save` to save your working context before ending a session."

---

## Step 2: Parse the Saved State

Extract from the file:

- **Projects**: the project folders that were active
- **Milestone**: version, title, and progress
- **Task progress**: the full progress table
- **Next task**: what was queued up next
- **Notes**: any context the user saved
- **Saved timestamp**: when the state was captured

Check the age of the saved state. If older than 7 days, warn: "This state was saved [N] days ago. Project files may have changed since then."

---

## Step 3: Re-initialize Session

Using the project folders from the saved state, run the same logic as `/session-start`:

1. Get the terminal ID:

```bash
echo "${TERM_SESSION_ID:-${ITERM_SESSION_ID:-$$}}"
```

2. Write a new `[CWD]/.claude-sessions/[TERMINAL_ID].json` using the `projects` JSON block from the saved state (preserving the `ui`/`api` or `primary` key structure exactly)
3. Read current `CLAUDE.md`, `TASKS.md`, and the active milestone from the primary project

This ensures the session file is fresh for this terminal, so all other skills work immediately.

---

## Step 4: Verify State

Compare the saved state against the current project files:

- Is the milestone file still present in `tasks/`?
- Does the current `package.json` version match what was saved?
- Has the milestone's progress changed since the save (someone else worked on it, or the user committed changes outside of Claude)?

If anything differs, note the discrepancy in the report. Use the current file state as truth, but show what was saved for reference.

---

## Step 5: Report

```
Session restored from saved state ([saved timestamp])
────────────────────────────────────────
Session: [label] ([TERMINAL_ID 8 chars])
Projects: [folders]

Milestone [version]: [title]
Progress: [X] of [Y] tasks complete ([Z]%)

[Progress Summary table from current milestone file]

Next: Task [N]: [name] ([priority])

Notes from last session:
  [saved notes, or "None"]

[If discrepancies found:]
Changes since save:
  - [description of what changed]

Ready to continue. Run /milestone-start to begin the next task.
```

---

## Step 6: Clean Up

Do NOT delete `saved-state.md` after restoring. The user may want to reference it again, or resume in a different terminal. It gets overwritten the next time `/session-save` runs.
