Show available skills with context-aware suggestions based on the current session state. Highlights the most useful next steps so the user always knows where to go.

---

## Step 1: Detect Session State

Run this to get the current terminal ID:

```bash
echo "${TERM_SESSION_ID:-${ITERM_SESSION_ID:-$$}}"
```

Then check for these files and conditions. Record each as true/false:

| Check | How |
|---|---|
| **has_session** | `[CWD]/.claude-sessions/[TERMINAL_ID].json` exists |
| **has_saved_state** | `[CWD]/.claude-sessions/saved-state.md` exists |
| **saved_timestamp** | If has_saved_state, extract the `**Saved**:` timestamp from saved-state.md |
| **has_project_docs** | `CLAUDE.md` exists in the session's BASE_DIR (or CWD if no session) |
| **has_milestone** | TASKS.md has a milestone marked "In Progress" or "Pending" |
| **milestone_info** | If has_milestone, read the milestone file for: title, task count, completed count |
| **all_tasks_done** | milestone completed count equals total count |
| **has_bugs** | `BASE_DIR/bugs/` contains any `Bug_????_*.md` files |
| **open_bug_count** | Count of bug files with status "pending" or "in progress" |

If has_session is true, also extract `label` and `TERMINAL_ID` (truncated to 8 chars) from the session file.

---

## Step 2: Build the Header

Display the session context at the top. Adapt based on what's available:

**If has_session and has_milestone:**
```
Session: [label] ([TERMINAL_ID 8 chars])
Milestone: [version] - [title] ([completed]/[total] tasks, [percent]%)
Last saved: [saved_timestamp or "never"]
```

**If has_session but no milestone:**
```
Session: [label] ([TERMINAL_ID 8 chars])
Milestone: none active
Last saved: [saved_timestamp or "never"]
```

**If no session:**
```
Session: none active
Last saved: [saved_timestamp or "never"]
```

---

## Step 3: Determine Suggestions

Use the state from Step 1 to decide which commands get the `→` indicator. A command gets `→` when it is a natural next step. Multiple commands can be suggested at once.

### Suggestion Rules

**No session active, no saved state:**
- → `/session-start`

**No session active, saved state exists:**
- → `/session-resume`

**Session active, no project docs:**
- → `/project-new`

**Session active, no milestone:**
- → `/milestone-new`

**Session active, milestone in progress, tasks remaining:**
- → `/milestone-start` (add hint: "Continue from Task [N]")
- → `/milestone-status`
- → `/task-complete`
- → `/session-save` if saved_timestamp is empty, or older than 4 hours

**Session active, all tasks complete:**
- → `/milestone-complete` (add hint: "Close out the milestone")
- → `/session-save` if saved_timestamp is empty, or older than 4 hours

**Open bugs exist:**
- → `/bug-status` (always suggest when there are open bugs, regardless of other state)

---

## Step 4: Build the Command List

Display commands in groups separated by blank lines. Each command gets either `→` (suggested) or four spaces (not suggested). Add a parenthetical hint after commands where context is useful.

Use this exact layout structure, adapting hints based on current state:

```
    /session-start     Initialize a new session with project context
    /session-resume    Restore a previously saved session
    /session-save      Save current session for later
    /session-help      This screen

    /project-new       Scaffold project docs for a new or existing repo

    /milestone-status    Show active milestone progress
    /milestone-start     Begin or resume milestone work
    /task-complete       Mark a task done and bump version
    /milestone-complete  Close out a finished milestone
    /milestone-new       Scaffold a new milestone file

    /bug-status        Show open bug fixes
    /bug-add           Create a new bug fix from template
    /bug-fixed         Mark a bug fix as resolved
```

### Hint Rules

Add parenthetical context after a command when useful. Keep hints short. Examples:

| Command | State | Hint |
|---|---|---|
| `/session-start` | session already active | (current session active) |
| `/session-resume` | no saved state | (no saved state found) |
| `/session-save` | never saved | (never saved) |
| `/session-save` | saved recently | (saved today) |
| `/session-save` | saved days ago | (last saved [N] days ago) |
| `/milestone-start` | tasks remaining | (continue from Task [N]) |
| `/milestone-start` | all done | (all tasks complete) |
| `/milestone-complete` | all tasks done | (close out the milestone) |
| `/milestone-new` | milestone completed | (scaffold the next milestone) |
| `/milestone-new` | no milestone | (scaffold a new milestone) |
| `/task-complete` | all done | (all tasks complete) |
| `/bug-status` | bugs exist | ([N] open) |
| `/bug-status` | no bugs dir or no bugs | (no open bugs) |

Only add hints where the context differs from the default description. If a command is in its normal/expected state, no hint needed.

---

## Step 5: Output

Combine the header and command list with a footer explaining the arrow:

```
[Header from Step 2]

[Command list from Step 4, with → indicators and hints]

→ = suggested next step based on current session state
```

---

## When Called from Other Skills

Other skills (`/task-complete`, `/milestone-complete`, `/bug-fixed`, `/session-save`) may include session-help output at the end of their own output. When this happens, the calling skill handles state detection and passes context. The output format is the same: header, command list, footer. No additional separator is needed between the calling skill's output and the session-help block.
