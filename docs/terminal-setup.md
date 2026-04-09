# Claude Code Terminal Setup

> Getting the terminal experience closer to the VS Code extension. These are the highest-impact changes. Each one is independent, do what's useful and skip what isn't.

---

## The Core Problem

The VS Code extension renders in a webview with full HTML: formatted markdown, collapsible tool results, clean redraws. The terminal uses ANSI escape codes and a scrolling buffer, which means text can overwrite itself, tool output is noisy, and the input prompt behaves like a standard shell.

Most of this is fixable.

---

## 1. Fix the Rendering (Do This First)

The single biggest improvement. Add this to your `~/.zshrc` or `~/.bashrc`:

```bash
export CLAUDE_CODE_NO_FLICKER=1
```

Apply it immediately:
```bash
source ~/.zshrc
```

Then restart Claude Code.

**What this changes:**
- Full-screen rendering, no more text overwriting itself mid-stream
- Tool results collapse/expand on click (like the VS Code sidebar)
- Mouse support: click to position cursor in the input, select text, open URLs
- Transcript viewer with search (`Ctrl+O`, then `/` to search)

---

## 2. Fix Line Breaks

By default, `Enter` submits. To get multi-line input like VS Code:

**iTerm2, Ghostty, Kitty, WezTerm**: run `/terminal-setup` once inside Claude Code. After that, `Shift+Enter` inserts a newline.

**macOS Terminal.app**: `Shift+Enter` sends the same signal as `Enter`, so it can't be used for newlines. Use `Option+Enter` instead:

1. **Enable Option as Meta key**: Terminal.app → Settings → Profiles → Keyboard → check "Use Option as Meta key"
2. **Create the keybinding file** at `~/.claude/keybindings.json`:

```json
{
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "alt+enter": "chat:newline"
      }
    }
  ]
}
```

3. **Restart Terminal.app** (required for the Meta key setting to take effect)
4. **Test**: Open Claude Code and press `Option+Enter`. It should insert a newline.

> **Note**: `Cmd+Enter` doesn't work in any terminal emulator. The Cmd modifier isn't passed through to CLI apps. `Option+Enter` is the best Mac-native alternative.

---

## 3. Add a Status Line

A persistent bar at the bottom showing model and context usage, similar to the VS Code status bar.

Run inside Claude Code:
```
/statusline
```

Describe what you want, for example:
```
show model name and context usage percentage
```

This generates a script at `~/.claude/statusline.sh` that runs automatically. The output is minimal by default: one line showing current model and context percentage.

---

## 4. Font (macOS Terminal.app)

Claude Code doesn't control the font. Your terminal app does. You're limited to monospace fonts (proportional fonts break code alignment), but there are much cleaner options than the defaults.

**In macOS Terminal.app**: Settings → Profiles → your profile → Font button.

Recommended options already on your Mac:
- **SF Mono**: Apple's cleanest monospace, already installed

Worth downloading:
- **JetBrains Mono**: rounded, very readable at small sizes
- **Fira Code**: ligatures (`=>`, `!=`, `->`) that reduce visual noise
- **Cascadia Code**: Microsoft's, clean and modern

Pick one at 13–14pt. The rendering difference is noticeable.

---

## 5. Key Shortcuts

These work out of the box, no configuration needed:

| Key | Action |
|---|---|
| `Shift+Enter` or `Option+Enter` | New line (see section 2) |
| `Ctrl+O` | Toggle full transcript view with search |
| `Ctrl+T` | Toggle task list |
| `Ctrl+R` | Search prompt history |
| `Esc Esc` | Rewind / summarize conversation |
| `Shift+Tab` | Cycle through permission modes |
| `Alt+P` | Switch models |
| `Alt+T` | Toggle extended thinking |
| `!` prefix | Run a shell command directly (e.g. `! ls`) |

---

## 6. Working Directory Strategy

Instead of navigating into individual project folders, start Claude Code from your GitHub root directory, the folder that contains all your repos. This mirrors how VS Code's workspace feature works.

```bash
cd ~/Projects/GitHub
claude
```

From here, Claude can see all repos as subdirectories. Reference files with paths like `hourlings-ui/src/components/...` without changing directories.

When you're working across a UI and API repo, start your session with:
```
/session-start hourlings-ui hourlings-api
```

This sets up session context so all subsequent commands know which folders to work in. See [Workflow Guide](workflow-guide.md) for the full multi-repo pattern.

---

## 7. Notifications

Get notified when Claude finishes a long task.

**macOS Terminal.app**: Settings → Profiles → Terminal → enable "Notify when done" or check "Notification Center Alerts". Filter by "bell" alerts.

**iTerm2**: Profiles → Terminal → Notifications → Send notification on bell.

**Ghostty / Kitty**: Works out of the box.

---

## 8. Vim Mode (Optional)

If you prefer vim keybindings for text input:

```
/config
```

Navigate to Editor Mode → set to `vim`. Gives you normal/insert mode switching, `hjkl` navigation, and text objects in the input field.

---

## Summary Checklist

```
[ ] Add CLAUDE_CODE_NO_FLICKER=1 to ~/.zshrc and source it
[ ] Set up multi-line input (section 2, varies by terminal)
[ ] Run /statusline and describe what you want
[ ] Change font in Terminal.app settings (SF Mono or download JetBrains Mono)
[ ] Set working directory to GitHub root before launching claude
```

Each item is independent. Start with `CLAUDE_CODE_NO_FLICKER=1`. It's the highest return on time invested.
