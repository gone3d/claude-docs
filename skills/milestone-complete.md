Close out a finished milestone. Verifies all tasks are complete, updates the milestone file, TASKS.md, and CLAUDE.md, then shows session help.

---

## Step 1: Load Session Context

Run this to get the current terminal ID:

```bash
echo "${TERM_SESSION_ID:-${ITERM_SESSION_ID:-$$}}"
```

Read `[CWD]/.claude-sessions/[TERMINAL_ID].json` to get project directories.

- If the session file exists, use `projects.ui` (or `projects.primary`) as BASE_DIR
- If no session file, fall back to parsing $ARGUMENTS for a project folder
- If neither, prompt: "No active session. Run `/session-start [project-folder]` first."

---

## Step 2: Parse Arguments

$ARGUMENTS may contain an optional milestone version or project folder override:

| Invocation | Behavior |
|---|---|
| `/milestone-complete` | Auto-detect active milestone from session's BASE_DIR |
| `/milestone-complete 0.3.6.0` | Complete `tasks/Milestone0.3.6.0.md` specifically |
| `/milestone-complete hourlings-ui` | Override BASE_DIR, auto-detect milestone |

If $ARGUMENTS is a folder name that exists as a directory, treat it as a BASE_DIR override. If it matches a version pattern, treat it as a milestone version.

---

## Step 3: Find the Milestone

If no milestone version given:
1. Read `BASE_DIR/TASKS.md` for the milestone marked "In Progress"
2. Read that milestone file from `BASE_DIR/tasks/`

If a milestone version was given, read `BASE_DIR/tasks/Milestone[version].md` directly.

If no milestone file is found, report: "No active milestone found. Nothing to complete."

---

## Step 4: Verify All Tasks Complete

Read the milestone's Progress Summary table. Check every task row.

**If all tasks are marked Complete (✅):** Continue to Step 5.

**If any tasks are NOT complete:** Report the incomplete tasks and stop:

```
Milestone [version]: [title]
Cannot complete: [N] tasks still pending

| Task                    | Status      |
|-------------------------|-------------|
| Task 3: [name]          | ⏳ Pending  |
| Task 5: [name]          | 🚧 In Progress |

Run /milestone-start to continue working, or /task-complete [N] to mark tasks done.
```

Do not proceed. The developer must finish or explicitly mark all tasks complete first.

---

## Step 5: Get Current Date

```bash
date "+%Y-%m-%d"
```

Use the actual output as DATE_COMPLETED.

---

## Step 6: Update the Milestone File

Make these changes to the milestone file:

1. **Status field**: Change `In Progress` to `Complete`
2. **Date Completed field**: Fill in with DATE_COMPLETED. If no Date Completed field exists, add one after Date Started: `**Date Completed**: [DATE_COMPLETED]`
3. **Completion line**: Verify it reads "[total] of [total] tasks complete (100%)"

---

## Step 7: Update TASKS.md

Read `BASE_DIR/TASKS.md`. This file has a table of milestones. Find the row for the completed milestone and update its status:

1. Change the milestone's status from "In Progress" to "✅ Complete"
2. If the table has a "Date Completed" column, fill it in with DATE_COMPLETED
3. If TASKS.md uses separate "Active" and "Completed" sections/tables, move the milestone row from the active table to the completed table

Preserve the existing table format. Do not restructure or reformat other rows.

---

## Step 8: Update CLAUDE.md

Read `BASE_DIR/CLAUDE.md`. Find the "Current Status" or equivalent section. Update it to reflect:

1. The completed milestone is done (e.g. "Post-Milestone [version]: [title]")
2. The current version from `package.json`

Keep the update minimal. One line describing the completed milestone. Do not rewrite or restructure other sections of CLAUDE.md.

---

## Step 9: Archive (Optional)

Check if `BASE_DIR/tasks/reference/` exists.

**If the reference directory exists:** Ask the user:

```
Move Milestone[version].md to tasks/reference/? (yes/no)
```

If yes, move the file. If no, leave it in `tasks/`.

**If the reference directory does not exist:** Skip this step. Do not create the directory or ask about archiving.

---

## Step 10: Report and Show Session Help

```
Session: [label] ([TERMINAL_ID 8 chars])
────────────────────────────────────────
Milestone complete: [version] - [title]
  [total] tasks | Completed [DATE_COMPLETED]
  Version: [final version from package.json]

Updated:
  ✓ Milestone file status set to Complete
  ✓ TASKS.md milestone moved to completed
  ✓ CLAUDE.md current status updated
  [✓ Milestone file moved to tasks/reference/  ← only if archived]
```

Then output the full `/session-help` display (header, command list with arrows, footer) using the same logic defined in `session-help.md`. The arrow should point to `/milestone-new` since the natural next step is scaffolding the next milestone.
