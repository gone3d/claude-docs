Begin working on a milestone. Reads the milestone file, confirms the current state, and starts executing the next pending task. If the milestone is partially complete, picks up where you left off.

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
| `/milestone-start` | Auto-detect active milestone from session's BASE_DIR |
| `/milestone-start 0.3.6.0` | Start or resume `tasks/Milestone0.3.6.0.md` |
| `/milestone-start tutorial-api` | Override BASE_DIR, auto-detect milestone |
| `/milestone-start tutorial-api 0.3.6.0` | Override BASE_DIR, specific milestone |

If $ARGUMENTS is a folder name that exists as a directory, treat it as a BASE_DIR override. If it matches a version pattern, treat it as a milestone version.

---

## Step 3: Find the Milestone

If no milestone version given:
1. Read `BASE_DIR/TASKS.md` for the milestone marked "In Progress" or the first "Pending" milestone
2. Read that milestone file from `BASE_DIR/tasks/`

If a milestone version was given, read `BASE_DIR/tasks/Milestone[version].md` directly.

If no milestone file is found, report: "No active or pending milestones found. Run `/milestone-new` to create one."

---

## Step 4: Determine Starting Point

Read the milestone's Progress Summary table. Find the first task that is NOT Complete:

- If Task 0 is Pending, this is a fresh milestone. Start with Task 0 (version check + branch creation).
- If Task 0 is Complete but Task 1 is Pending, the milestone is initialized. Start with Task 1.
- If some tasks are Complete, resume at the first incomplete task.
- If all tasks are Complete, report: "All tasks in this milestone are complete. Run `/milestone-new` to create the next one."

---

## Step 5: Confirm and Begin

Show the user what you're about to do:

```
Session: [label] ([TERMINAL_ID 8 chars]), [BASE_DIR]
────────────────────────────────────────
Milestone [version]: [title]
Progress: [X] of [Y] tasks complete ([Z]%)

Starting: Task [N]: [task name] ([priority])
[one-line description of what the task involves]

Ready to begin? (yes to proceed, or specify a different task number)
```

Wait for confirmation, then begin executing the task. Read the full task section from the milestone file and follow the implementation steps.

**For Task 0 specifically:**
- Read package.json to get the current version
- Ask for approval before creating the branch
- Update the milestone header with confirmed versions
- Report the branch name and confirmed version

**For all other tasks:**
- Read the task's description, affected files, and implementation steps
- Execute the implementation
- When complete, prompt the user: "Task [N] is done. Review the changes in GitHub Desktop, commit, then run `/task-complete [N]` to update the milestone."

---

## Step 6: After Task Completion

When a task is finished, always end with a clear next action:

```
Task [N] complete: [task name]

Next: 
  1. Review changes in GitHub Desktop
  2. Commit with a meaningful message
  3. Run /task-complete [N] to update the milestone and bump the version
```

Do NOT automatically advance to the next task. The user needs to review, commit, and explicitly advance. This is the checkpoint that keeps the developer in control.
