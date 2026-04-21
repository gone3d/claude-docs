Create a new bug fix file from the project's BugFixTemplate.md.

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

## Step 2: Determine the Next Bug Number

Look in `BASE_DIR/bugs/` for existing files matching `Bug_????_*.md`.

Extract the 4-digit number from each filename. Find the highest number, add 1. If no bug files exist, start at 0001.

Store as NEXT_NUM, zero-padded to 4 digits (e.g. 0001, 0042).

---

## Step 3: Gather Bug Details

$ARGUMENTS may contain a short title or description. If provided, use it as the bug title.

If $ARGUMENTS is empty or only contains a project folder override, prompt for:

1. **Title**: Short name for the bug (e.g. "Login timeout on slow connections")

Then ask for these, but accept brief answers:

2. **Priority**: CRITICAL, HIGH, MEDIUM, or LOW (default: MEDIUM)
3. **Summary**: One paragraph describing the bug, impact, and who is affected

Do not ask for steps to reproduce, root cause, affected files, or fix plan. Those get filled in during investigation.

---

## Step 4: Get Current Date

```bash
date "+%Y-%m-%d"
```

Use the actual output as DATE_CREATED.

---

## Step 5: Get Current Version

Read `BASE_DIR/package.json` and extract the version field. Store as CURRENT_VERSION.

---

## Step 6: Generate the Filename

Convert the title to a filename slug:
- Lowercase
- Replace spaces with hyphens
- Remove special characters
- Truncate to 40 characters max

Result: `Bug_[NEXT_NUM]_[slug].md`

Example: `Bug_0003_login-timeout-slow-connections.md`

---

## Step 7: Read the Template

Read `BASE_DIR/bugs/BugFixTemplate.md`.

If it doesn't exist, use this minimal template:

```markdown
# Bug ####: [Title]

**Status**: pending
**Priority**: [PRIORITY]
**Date Created**: [DATE]
**Date Started**: 
**Date Resolved**: 
**Branch**: `[developer]-MMDDYY-bug-####-[slug]`
**Version**: [version at time of fix]

---

## Summary

[Summary]

---

## Steps to Reproduce

1. [Step 1]

**Expected behavior**: [What should happen]
**Actual behavior**: [What actually happens]

---

## Root Cause

[Leave blank until diagnosed.]

---

## Affected Files

| File | Change Description |
|---|---|
| `path/to/file` | [What needs to change and why] |

---

## Fix Plan

- [ ] Diagnose and confirm root cause
- [ ] Implement fix
- [ ] Test fix locally
- [ ] Verify original reproduction steps no longer fail

---

## Resolution Notes

[Leave blank until resolved.]
```

---

## Step 8: Fill In the Template

Replace the placeholders in the template:
- `####` or `NNN` in the heading and branch name with NEXT_NUM (zero-padded, 4 digits)
- `[Title]` or `[Short Title]` with the bug title
- `[PRIORITY]` or the priority placeholder with the chosen priority
- `[DATE]` or `YYYY-MM-DD` in Date Created with DATE_CREATED
- `[version at time of fix]` or version placeholder with CURRENT_VERSION
- `[Summary]` with the user's summary paragraph
- `[slug]` or `short-title` in the branch name with the filename slug

Leave all other sections (Steps to Reproduce, Root Cause, Affected Files, Fix Plan, Resolution Notes) with their template placeholders. The user fills these in during investigation.

---

## Step 9: Write the File

Write the filled template to `BASE_DIR/bugs/Bug_[NEXT_NUM]_[slug].md`.

---

## Step 10: Report

```
Session: [label] ([TERMINAL_ID 8 chars])
────────────────────────────────────────
Created: bugs/Bug_[NEXT_NUM]_[slug].md

  Bug:      [NEXT_NUM] - [Title]
  Priority: [priority]
  Version:  [CURRENT_VERSION]
  Branch:   [suggested branch name]

Fill in Steps to Reproduce and begin investigation.
Run /bug-status [NEXT_NUM] to review, /bug-fixed [NEXT_NUM] when resolved.
```
