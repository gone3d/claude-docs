Show the current status of the active milestone for this session's project. Includes a suggested next action so the user always knows what to do next.

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
| `/milestone-status` | Auto-detect active milestone from session's BASE_DIR |
| `/milestone-status 0.3.6.0` | Read `BASE_DIR/tasks/Milestone0.3.6.0.md` specifically |
| `/milestone-status my-app-ui` | Override BASE_DIR (ignores session file) |
| `/milestone-status my-app-ui 0.3.6.0` | Override BASE_DIR + specific milestone |

If $ARGUMENTS is a folder name that exists as a directory, treat it as a BASE_DIR override. If it matches a version pattern, treat it as a milestone version.

---

## Step 3: Find the Milestone

If no milestone version given:
1. Read `BASE_DIR/TASKS.md` for the milestone marked "In Progress"
2. If none in progress, find the first "Pending" milestone
3. Read that milestone file from `BASE_DIR/tasks/`

If a milestone version was given, read `BASE_DIR/tasks/Milestone[version].md` directly.

---

## Step 4: Report

Output the milestone status with a clear next action:

```
Session: [label] ([TERMINAL_ID 8 chars]), [BASE_DIR]
────────────────────────────────────────
Milestone [version]: [title]
Version: [current] -> [target]
Progress: [X] of [Y] tasks complete ([Z]%)

[Full progress table]

Blockers: [any listed, or "None"]
```

---

## Step 5: Suggest Next Action

Always end with a concrete suggestion based on the milestone state:

**If the milestone has not been started (Task 0 is Pending):**
```
Ready to start: Run /milestone-start to begin Task 0
```

**If the milestone is partially complete (some tasks done, some pending):**
```
Pick up at: Task [N]: [name] ([priority])
[one-line description]

Run /milestone-start to continue, or /task-complete [N-1] if you just finished a task
```

**If all tasks are complete:**
```
All tasks complete. Next steps:
  1. Review and commit any remaining changes
  2. Merge the feature branch to main
  3. Run /milestone-new to scaffold the next milestone
```

**If no active milestone was found:**
```
No active milestones. Run /milestone-new to create one, or check TASKS.md for pending milestones.
```
