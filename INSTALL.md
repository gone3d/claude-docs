# Installation

The skills in this repo are installed by copying the `skills/*.md` files to `~/.claude/commands/`, the directory Claude Code watches for user-level slash commands.

Rather than a shell script, you can install using Claude Code itself. It's a good first test that your Claude Code setup is working correctly.

---

## Prerequisites

- [Claude Code](https://claude.ai/code) installed and authenticated
- Git

### Which environment?

Claude Code runs in two environments. The skills in this repo work in both. Pick whichever fits your setup:

| | **VS Code Extension** | **Terminal (CLI)** |
|---|---|---|
| **How to get it** | Install the Claude Code extension in VS Code | `npm install -g @anthropic-ai/claude-code` |
| **Multi-line input** | `Shift+Enter`, works out of the box | Requires one-time setup (see [Post-Install](#post-install-environment-setup)) |
| **Rendering** | Native VS Code UI | Needs `CLAUDE_CODE_NO_FLICKER=1` for best experience |
| **Best for** | Teams (Claude Code Team plans), IDE-integrated workflow | Solo devs, multi-repo workflows, terminal-native users |

You only need one. If you're on a team plan with VS Code, you can skip the terminal setup sections entirely. If you're a terminal user, the [Post-Install](#post-install-environment-setup) section walks you through the extra configuration.

---

## Install

**Step 1: Clone the repo**

```bash
git clone https://github.com/gone3d/claude-docs.git
cd claude-docs
```

**Step 2: Run Claude Code with the install prompt**

```bash
claude "Copy each .md file from ./skills/ into ~/.claude/commands/, creating that directory if it doesn't exist. Only copy the files in ./skills/. Do not delete or modify any other files already in ~/.claude/commands/. List each file as it's installed, then confirm the slash commands that are now available."
```

Claude will create the commands directory if needed and install only the skills from this repo. Any other skills or commands already in `~/.claude/commands/` are left untouched.

---

## Verify

After install, start a new Claude Code session and type `/`. You should see the new commands in the autocomplete list:

```
/bugfix-status
/milestone-new
/milestone-status
/session-start
/task-complete
```

Or run a quick smoke test from any project directory:

```bash
claude "List all available slash commands installed in ~/.claude/commands/ and describe what each one does in one sentence."
```

---

## Post-Install: Environment Setup

The skills work in both environments, but the setup experience is different.

### VS Code Extension

If you're using Claude Code as a VS Code extension (e.g., via Claude Code Team), there's nothing extra to configure. The extension handles rendering, multi-line input (`Shift+Enter`), and UI natively. Skills are available immediately after install. Just type `/` in the Claude Code panel.

### Terminal

The terminal requires a few one-time tweaks to match the VS Code experience. These are optional but recommended, especially the first two.

**1. Fix rendering.** Add this to `~/.zshrc` (or `~/.bashrc`), then `source ~/.zshrc`:

```bash
export CLAUDE_CODE_NO_FLICKER=1
```

This enables full-screen rendering, collapsible tool results, and mouse support. Much closer to how the VS Code extension looks.

**2. Fix line breaks.** By default, `Enter` submits immediately with no way to add a newline. The fix depends on your terminal:

- **iTerm2 / Ghostty / Kitty / WezTerm**: Run `/terminal-setup` once inside Claude Code. After that, `Shift+Enter` inserts a newline.
- **macOS Terminal.app**: `Shift+Enter` doesn't work in Terminal.app (it sends the same signal as `Enter`). Use `Option+Enter` instead:

<details>
<summary>Terminal.app: Option+Enter setup</summary>

1. Terminal.app → Settings → Profiles → Keyboard → check **"Use Option as Meta key"**
2. Create `~/.claude/keybindings.json`:

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

3. Restart Terminal.app (required for the Meta key change to take effect)
4. Open Claude Code and test `Option+Enter`. It should insert a newline

</details>

See **[Terminal Setup Guide](docs/terminal-setup.md)** for the full list: status line, font, keyboard shortcuts, notifications, and more.

---

## Update

When skills are updated in this repo, reinstall by running the same prompt from the `claude-docs/` directory:

```bash
claude "Copy each .md file from ./skills/ into ~/.claude/commands/, overwriting only the files that match. Do not delete or modify any other files already in ~/.claude/commands/. List what was updated."
```

---

## Uninstall

To remove all skills installed from this repo:

```bash
claude "Delete these files from ~/.claude/commands/ if they exist: session-start.md, milestone-status.md, milestone-new.md, task-complete.md, bugfix-status.md. Also delete ~/.claude/commands/internal/session-read.md and ~/.claude/commands/internal/CreateTemplates.md. Do not touch any other files. Confirm what was removed."
```

---

## Manual Install (fallback)

If you prefer not to use a Claude prompt, the shell script works too:

```bash
chmod +x install.sh
./install.sh
```

---

## Troubleshooting

**Commands don't appear after install**
Restart Claude Code. The commands directory is only loaded at session start.

**`~/.claude/commands/` wasn't created**
Run the install prompt again, or create it manually: `mkdir -p ~/.claude/commands`

**A skill isn't behaving as expected**
The skill files are plain markdown. Open `~/.claude/commands/skill-name.md` and read the instructions to see exactly what Claude is being asked to do. Edit directly or update the source in `claude-docs/skills/` and reinstall.
