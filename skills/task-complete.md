Mark a task as complete in the active milestone, update the progress table, and optionally bump the version in package.json.

---

## Step 1: Load Session Context

Run this to get the current terminal ID:

```bash
echo "${TERM_SESSION_ID:-${ITERM_SESSION_ID:-$$}}"
```

Read `[CWD]/.claude-sessions/[TERMINAL_ID].json` to get:
- `BASE_DIR`: primary/UI project folder
- `API_DIR`: API project folder (may be undefined)

If no session file, fall back to $ARGUMENTS for a project folder. If neither, prompt: "No active session. Run `/session-start [project-folder]` first."

---

## Step 2: Parse Arguments

$ARGUMENTS must contain a task number. It may optionally contain a project folder override:

| Invocation | Behavior |
|---|---|
| `/task-complete 1` | Use session BASE_DIR, mark Task 1 complete |
| `/task-complete 0.3` | Use session BASE_DIR, mark Task 0.3 complete |
| `/task-complete hourlings-ui 1` | Override BASE_DIR, mark Task 1 complete |

If $ARGUMENTS is a folder name that exists as a directory, treat it as a BASE_DIR override and expect the task number to follow. If $ARGUMENTS is a number, treat it as the task number.

If no task number found, list the available tasks from the active milestone's Progress Summary table and prompt for clarification.

---

## Step 3: Find the Active Milestone

Read `BASE_DIR/TASKS.md` and find the milestone currently marked "In Progress". Open `BASE_DIR/tasks/[milestone-file].md`.

---

## Step 4: Update the Milestone File

Locate "Task [number]" in the file and make these changes:

1. **Task Status field**: Change `⏳ Pending` or `🚧 In Progress` → `✅ Complete`
2. **Actual Time field**: Fill in if empty (prompt the user for a value, or leave blank if they don't want to track it)
3. **Progress Summary table**: Update that task's row. Status emoji → ✅, fill Version column if empty using the task's Version field value
4. **Completion count**: Recalculate: "X of Y tasks complete (Z%)"

---

## Step 5: Bump Version (if applicable)

If the completed task has a Version field with a version number:
1. Update `BASE_DIR/package.json` version to match
2. If the task affects the API repo, update `API_DIR/package.json` as well
3. Do NOT run `git add`, `git commit`, or `git push`. User handles this via GitHub Desktop

---

## Step 6: Update Session File

Update `[CWD]/.claude-sessions/[TERMINAL_ID].json`:
- Set `"activeMilestone"` to the current milestone number (if it was null)
- No other changes needed

---

## Step 7: Report

```
Session: [label] ([TERMINAL_ID 8 chars])
────────────────────────────────────────
✅ Task [N] complete: [task name]
   [old status] → ✅ Complete

Progress: [X] of [Y] tasks complete ([Z]%)
Version:  [old] → [new]  (package.json updated, commit via GitHub Desktop)

Next: Task [N+1]: [name] ([priority])
```

If no version was bumped, omit the Version line.

Reminder: Do not run git add, git commit, or git push. The user reviews and commits all changes via GitHub Desktop.
