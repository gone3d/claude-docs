Scaffold a new milestone file from the project template, with version numbers auto-populated from package.json.

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

$ARGUMENTS is optional. The version is auto-calculated from package.json. A project folder override may be provided:

| Invocation | Behavior |
|---|---|
| `/milestone-new` | Use session BASE_DIR, auto-calculate version from package.json |
| `/milestone-new my-app-ui` | Override BASE_DIR, auto-calculate version |

The milestone version is always derived from package.json (PATCH +1, BUILD reset to 0). It is not provided as an argument.

---

## Step 3: Get Current Versions

Read version numbers from package.json files:

```bash
# UI version
cat [BASE_DIR]/package.json | grep '"version"'

# API version (if API_DIR is set)
cat [API_DIR]/package.json | grep '"version"'
```

Calculate the milestone starting version:
- Take current version (e.g. `0.3.5.2`)
- Increment PATCH by 1, reset BUILD to 0: `0.3.6.0`
- This is the version assigned to Task 0
- The milestone file is named `Milestone0.3.6.0.md`

The API version stays at its current value unless API tasks are planned.

---

## Step 4: Create the Milestone File

1. Read `BASE_DIR/tasks/MilestoneTemplate.md`
2. If `BASE_DIR/tasks/Milestone[VERSION].md` already exists, warn before overwriting
3. Create `BASE_DIR/tasks/Milestone[VERSION].md` filling in:
   - Version number in the title and throughout
   - **Date Created**: today's date
   - **Current version**: from package.json
   - **Starting milestone version**: calculated above
   - **Branch names** using today's date: `{developer}-MMDDYY-[VERSION]-[repo-suffix]`
   - Leave all task names and descriptions as template placeholders. Don't invent tasks

---

## Step 5: Report

```
Session: [label] ([TERMINAL_ID 8 chars])
────────────────────────────────────────
Created: BASE_DIR/tasks/Milestone[VERSION].md

Version: [current] -> [milestone start]  ([BASE_DIR])

Branch name for Task 0:
  {developer}-[MMDDYY]-[VERSION]-[suffix]

Next: Open the file and fill in the objective, scope, and task list.
      Run /session-start when ready to begin.
```

Do NOT create branches. That is Task 0 and requires explicit user approval first.
