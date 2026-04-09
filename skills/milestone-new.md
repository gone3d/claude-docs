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

$ARGUMENTS must contain a milestone number. It may optionally contain a project folder override:

| Invocation | Behavior |
|---|---|
| `/milestone-new 25` | Use session BASE_DIR, milestone = 25 |
| `/milestone-new 25.1` | Use session BASE_DIR, milestone = 25.1 |
| `/milestone-new hourlings-ui 25` | Override BASE_DIR, milestone = 25 |

If no milestone number is found in $ARGUMENTS, prompt: "Which milestone number? (e.g. `/milestone-new 25`)"

---

## Step 3: Get Current Versions

Read version numbers from package.json files:

```bash
# UI version
cat [BASE_DIR]/package.json | grep '"version"'

# API version (if API_DIR is set)
cat [API_DIR]/package.json | grep '"version"'
```

Calculate the milestone starting version for the UI:
- Take current version (e.g. `0.8.11.3`)
- Increment PATCH by 1, reset BUILD to 0 → `0.8.12.0`
- This is the version assigned to Task 0

The API version stays at its current value unless API tasks are planned.

---

## Step 4: Create the Milestone File

1. Read `BASE_DIR/tasks/MilestoneTemplate.md`
2. If `BASE_DIR/tasks/Milestone[number].md` already exists, warn before overwriting
3. Create `BASE_DIR/tasks/Milestone[number].md` filling in:
   - Milestone number in the title and throughout
   - **Date Created**: today's date
   - **Current UI version**: from package.json
   - **Current API version**: from package.json (or "N/A, no API changes planned")
   - **Starting milestone version**: calculated above
   - **Branch names** using today's date: `don-MMDDYY-milestone-[number]-ui` and `don-MMDDYY-milestone-[number]-api`
   - Leave all task names and descriptions as template placeholders. Don't invent tasks

---

## Step 5: Report

```
Session: [label] ([TERMINAL_ID 8 chars])
────────────────────────────────────────
Created: BASE_DIR/tasks/Milestone[number].md

UI:  [current version] → [milestone start version]  ([BASE_DIR])
API: [current version] (unchanged until API tasks begin)  ([API_DIR or "not set"])

Branch names for Task 0:
  UI:  don-[MMDDYY]-milestone-[number]-ui
  API: don-[MMDDYY]-milestone-[number]-api

Next: Open the file and fill in the objective, scope, and task list.
      Run /session-start when ready to begin.
```

Do NOT create branches. That is Task 0 and requires explicit user approval first.
