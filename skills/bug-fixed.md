Mark a bug fix as resolved. Updates the status, fills in the resolution date, and shows session-help.

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

$ARGUMENTS must contain a bug number.

| Invocation | Behavior |
|---|---|
| `/bug-fixed 3` | Resolve bug 0003 |
| `/bug-fixed 0003` | Resolve bug 0003 |
| `/bug-fixed hourlings-ui 3` | Override BASE_DIR, resolve bug 0003 |

If $ARGUMENTS is a folder name that exists as a directory, treat it as a BASE_DIR override and expect the bug number to follow.

If no bug number found, list open bugs from `BASE_DIR/bugs/` and prompt for clarification.

---

## Step 3: Find the Bug File

Look in `BASE_DIR/bugs/` for a file matching `Bug_[NNNN]_*.md` where NNNN matches the provided number (zero-padded to 4 digits).

If no matching file found, report: "No bug file found for bug [number] in [BASE_DIR]/bugs/."

---

## Step 4: Get Current Date

```bash
date "+%Y-%m-%d"
```

Use the actual output as DATE_RESOLVED.

---

## Step 5: Update the Bug File

Make these changes to the bug file:

1. **Status**: Change `pending` or `in progress` to `resolved`
2. **Date Resolved**: Fill in with DATE_RESOLVED

If the status is already `resolved`, report: "Bug [number] is already resolved (resolved [Date Resolved])." and stop.

---

## Step 6: Prompt for Resolution Notes

If the Resolution Notes section is empty (still has placeholder text or is blank), ask the user:

"Any resolution notes? (brief description of the fix, or press Enter to skip)"

If they provide notes, fill in the Resolution Notes section. If they skip, leave it.

---

## Step 7: Report and Show Session Help

```
Session: [label] ([TERMINAL_ID 8 chars])
────────────────────────────────────────
Resolved: Bug [NNNN] - [Title]
  [priority] | Created [Date Created] | Resolved [DATE_RESOLVED]
```

Then output the full `/session-help` display (header, command list with arrows, footer) using the same logic defined in `session-help.md`. This gives the user immediate context on what to do next.
