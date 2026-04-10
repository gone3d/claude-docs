Show the current status of the active milestone for this session's project.

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

$ARGUMENTS may contain an optional milestone number:

| Invocation | Behavior |
|---|---|
| `/milestone-status` | Auto-detect active milestone from session's BASE_DIR |
| `/milestone-status 0.3.6.0` | Read `BASE_DIR/tasks/Milestone0.3.6.0.md` specifically |
| `/milestone-status hourlings-ui` | Override BASE_DIR (ignores session file) |
| `/milestone-status hourlings-ui 24` | Override BASE_DIR + specific milestone |

If $ARGUMENTS is a folder name that exists as a directory, treat it as a BASE_DIR override. If it's a number, treat it as a milestone number.

---

## Step 3: Find the Milestone

If no milestone number given:
1. Read `BASE_DIR/TASKS.md` for the milestone marked "In Progress"
2. Read that milestone file from `BASE_DIR/tasks/`

If a milestone number was given, read `BASE_DIR/tasks/Milestone[number].md` directly.

---

## Step 4: Report

Output:

```
Session: [label] ([TERMINAL_ID 8 chars]), [BASE_DIR]
────────────────────────────────────────
Milestone [number]: [title]
Version: [current] → [target]
Progress: [X] of [Y] tasks complete ([Z]%)

[Full progress table with emoji status]

Next: Task [N]: [name] ([priority])
[one-line description of what the task involves]

Blockers: [any listed, or "None"]
```

Status emoji reference: ⏳ Pending · 🚧 In Progress · ✅ Complete · 🚀 Deployed
