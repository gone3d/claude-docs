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

$ARGUMENTS may contain an optional bug number or filter:

| Invocation | Behavior |
|---|---|
| `/bug-status` | Show all open bugs from session's BASE_DIR |
| `/bug-status 42` | Show details for bug 42 specifically |
| `/bug-status all` | Show all bugs including resolved |
| `/bug-status hourlings-ui` | Override BASE_DIR (ignores session file) |

If $ARGUMENTS is a folder name that exists as a directory, treat it as a BASE_DIR override. If it's a number, treat it as a bug number. If it's "all", show resolved bugs too.

---

## Step 3: Find Bug Files

Look in `BASE_DIR/bugs/` for files matching the pattern `Bug_????_*.md`. Skip `BugFixTemplate.md`.

If no `bugs/` directory exists, report: "No bugs/ directory found in [BASE_DIR]. Run `/bug-add` to create your first bug, or `/project-new` to scaffold the full project structure."

---

## Step 4: Read and Parse

For each bug file, extract from the header:
- **Number and title** from the `# Bug ####: [Title]` heading
- **Status**: pending, in progress, resolved
- **Priority**: CRITICAL, HIGH, MEDIUM, LOW
- **Date Created**
- **Date Resolved** (if applicable)
- **Branch** name

---

## Step 5: Report

### Single Bug (number provided)

If a specific bug number was given, show full detail:

```
Session: [label] ([TERMINAL_ID 8 chars]), [BASE_DIR]
────────────────────────────────────────
Bug 0042: [Title]
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

### All Bugs (default or "all")

Show a summary table. By default, only show open bugs (pending + in progress). If "all" was passed, include resolved.

```
Session: [label] ([TERMINAL_ID 8 chars]), [BASE_DIR]
────────────────────────────────────────
Bugs: [X] open, [Y] resolved

| #    | Title              | Priority | Status      | Created    |
|------|--------------------|----------|-------------|------------|
| 0042 | Login timeout      | HIGH     | in progress | 2026-04-09 |
| 0041 | Missing avatar     | MEDIUM   | pending     | 2026-04-08 |
| 0040 | CSS overflow       | LOW      | resolved    | 2026-04-05 |

Next: Bug 0042: Login timeout (HIGH, in progress)
```

If no open bugs exist, report: "No open bugs. Nice work."

### Status Display

| Status | Display |
|---|---|
| pending | pending |
| in progress | in progress |
| resolved | resolved |
