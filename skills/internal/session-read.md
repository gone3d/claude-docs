Internal helper used by all skills to load the current session context.

This is not a user-facing command. Reference these instructions whenever a skill needs to resolve project directories.

---

## Reading Session Context

Run this to get the current terminal ID:

```bash
echo "${TERM_SESSION_ID:-${ITERM_SESSION_ID:-$$}}"
```

Then look for `[CWD]/.claude-sessions/[TERMINAL_ID].json`.

**If the session file exists:** Load it. Use `projects.ui` (or `projects.primary`) as BASE_DIR for the primary project, and `projects.api` as the API directory if present.

**If the session file does not exist:** Fall back to explicit $ARGUMENTS. If $ARGUMENTS also doesn't provide a folder, prompt: "No active session found. Run `/session-start [project-folder]` first, or pass the project folder as an argument."

**If the session file is older than 24 hours:** Warn the user: "Session started [X hours] ago. Run `/session-start` again to refresh if you're in a new terminal." Then continue with the stale data unless it's clearly wrong.

---

## Resolved Values

After reading, the following should be known:

- `BASE_DIR`: absolute or relative path to the primary/UI project
- `API_DIR`: path to the API project (may be undefined)
- `SESSION_LABEL`: human-readable session name for display
- `TERMINAL_ID`: truncated to 8 chars for display purposes
