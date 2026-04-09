Show the current status of all bug fixes for this session's project.

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

$ARGUMENTS may contain an optional bug fix number or filter:

| Invocation | Behavior |
|---|---|
| `/bugfix-status` | Show all open bug fixes from session's BASE_DIR |
| `/bugfix-status 42` | Show details for bug fix 42 specifically |
| `/bugfix-status all` | Show all bug fixes including resolved |
| `/bugfix-status hourlings-ui` | Override BASE_DIR (ignores session file) |

If $ARGUMENTS is a folder name that exists as a directory, treat it as a BASE_DIR override. If it's a number, treat it as a bug fix number. If it's "all", show resolved bugs too.

---

## Step 3: Find Bug Fix Files

Look in `BASE_DIR/bugs/` for files matching the pattern `BugFix-*.md`. Skip `BugFixTemplate.md`.

If no `bugs/` directory exists, report: "No bugs/ directory found in [BASE_DIR]. Run `/bug-fix` to create your first bug fix, or `/project-new` to scaffold the full project structure."

---

## Step 4: Read and Parse

For each bug fix file, extract from the header:
- **Number and title** from the `# Bug Fix NNN: [Title]` heading
- **Status**: pending, in progress, resolved
- **Priority**: CRITICAL, HIGH, MEDIUM, LOW
- **Date Created**
- **Date Resolved** (if applicable)
- **Branch** name

---

## Step 5: Report

### Single Bug Fix (number provided)

If a specific bug fix number was given, show full detail:

```
Session: [label] ([TERMINAL_ID 8 chars]), [BASE_DIR]
────────────────────────────────────────
Bug Fix 42: [Title]
Status:   [status]
Priority: [priority]
Branch:   [branch name]
Created:  [date]

Summary:
[Summary paragraph from the file]

Fix Plan:
- [ ] [Step 1]
- [ ] [Step 2]

Affected Files:
- path/to/file1
- path/to/file2
```

### All Bug Fixes (default or "all")

Show a summary table. By default, only show open bugs (pending + in progress). If "all" was passed, include resolved.

```
Session: [label] ([TERMINAL_ID 8 chars]), [BASE_DIR]
────────────────────────────────────────
Bug Fixes: [X] open, [Y] resolved

| #   | Title              | Priority | Status      | Created    |
|-----|--------------------|----------|-------------|------------|
| 42  | Login timeout      | HIGH     | in progress | 2026-04-09 |
| 41  | Missing avatar     | MEDIUM   | pending     | 2026-04-08 |
| 40  | CSS overflow       | LOW      | resolved    | 2026-04-05 |

Next: Bug Fix 42: Login timeout (HIGH, in progress)
```

If no open bug fixes exist, report: "No open bug fixes. Nice work."

### Status Display

| Status | Display |
|---|---|
| pending | pending |
| in progress | in progress |
| resolved | resolved |
