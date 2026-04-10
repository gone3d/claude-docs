Initialize a Claude Code session with project context. Writes a session file keyed to this terminal so all other skills know which projects to work with. No need to pass folder names on every command.

---

## Step 1: Get the Terminal ID

Run this bash command to identify the current terminal:

```bash
echo "${TERM_SESSION_ID:-${ITERM_SESSION_ID:-$$}}"
```

This tries `$TERM_SESSION_ID` (macOS Terminal.app) first, then `$ITERM_SESSION_ID` (iTerm2), then falls back to `$$` (shell PID). Store the result as TERMINAL_ID.

---

## Step 2: Parse Arguments

$ARGUMENTS contains the project folders for this session, space-separated. Parse them in order:

- **Single project**: `/session-start hourlings-ui`
  - `primary` = `hourlings-ui`
  - Derive label from the primary project name
  
- **UI + API pair**: `/session-start hourlings-ui hourlings-api`
  - `ui` = `hourlings-ui`
  - `api` = `hourlings-api`
  - Label = the UI project name (strip `-ui` suffix if present: `hourlings`)

- **No arguments**: Use `./` as the primary project, label as `default`

The label is a short human-readable name used to identify this session in output. Derived automatically, not something the user needs to type.

---

## Step 3: Write the Session File

Create the directory `[CWD]/.claude-sessions/` if it doesn't exist.

Write `[CWD]/.claude-sessions/[TERMINAL_ID].json` with this structure:

```json
{
  "terminalId": "[TERMINAL_ID]",
  "label": "[derived label]",
  "baseDir": "[absolute path of CWD]",
  "projects": {
    "ui": "[ui folder or primary folder]",
    "api": "[api folder, or omit if not provided]"
  },
  "startedAt": "[ISO 8601 timestamp]",
  "activeMilestone": null
}
```

If only one project was provided, use `"primary"` as the key instead of `"ui"`.

---

## Step 4: Orient to Project State

Read the following files from the primary/UI project folder (skip any that don't exist):

- `[ui-folder]/CLAUDE.md`
- `[ui-folder]/TASKS.md`
- `[ui-folder]/PLANNING.md`

Also read the most recently modified file in `[ui-folder]/tasks/` for task-level detail.

If an API project was provided, note its current version from `[api-folder]/package.json`.

---

## Step 5: Report

Output a session summary:

```
Session: [label] ([TERMINAL_ID truncated to 8 chars])
Projects: [ui-folder] + [api-folder, if set]
─────────────────────────────────────
Project: [name and version]
Current Phase: [active milestone or stage]
Last Completed: [most recently finished work]
In Progress / Up Next: [active or next task]
Blockers: [any flagged dependencies]
Key Rules: [workflow constraints: git policy, commit rules, etc.]
```

Keep each section to one or two sentences. The goal is a 30-second orientation, not a full briefing.
