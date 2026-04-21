# claude-docs

> Claude Code skills, workflow documentation, and reference guides. Built from real project experience.

Claude Code slash commands, workflow patterns, and configuration guides developed while building production applications in the terminal and VS Code. Everything here came from solving real problems: session management across terminals, milestone tracking, multi-repo coordination, and is designed to be installed, adapted, and improved.

It also serves as the reference material for the **VoodooCode** guide series.

---

## What's Here

```
claude-docs/
├── skills/                      # Source files for ~/.claude/commands/ slash commands
│   ├── session-start.md         # /session-start: initialize session with project context
│   ├── session-save.md          # /session-save: save session state for later
│   ├── session-resume.md        # /session-resume: restore a saved session
│   ├── session-help.md          # /session-help: context-aware command guide
│   ├── project-new.md           # /project-new: scaffold a complete project doc set
│   ├── milestone-status.md      # /milestone-status: active milestone progress
│   ├── milestone-start.md       # /milestone-start: begin/resume milestone work
│   ├── milestone-new.md         # /milestone-new: scaffold a new milestone
│   ├── task-complete.md         # /task-complete: mark a task done, update tracker
│   ├── milestone-complete.md    # /milestone-complete: close out a finished milestone
│   ├── bug-status.md            # /bug-status: open bug summary
│   ├── bug-add.md               # /bug-add: create a new bug from template
│   ├── bug-fixed.md             # /bug-fixed: mark a bug as resolved
│   └── internal/                # Helper docs, not user-facing commands
│       ├── session-read.md      # /internal:session-read: session context resolution
│       └── CreateTemplates.md   # /internal:CreateTemplates: template generation reference
├── docs/                        # Guides and reference
│   ├── terminal-setup.md        # Getting Claude Code terminal to feel like VS Code
│   ├── workflow-guide.md        # Multi-repo workflow patterns
│   ├── milestone-system.md      # The milestone/task management system
│   ├── MilestoneTemplate.md     # Template for new milestone files
│   └── BugFixTemplate.md        # Template for bug fix tracking files
├── install.sh                   # Copies skills to ~/.claude/commands/
└── README.md                    # This file
```

---

## Skills (Slash Commands)

Skills are markdown files that become `/slash-commands` inside Claude Code. They live at `~/.claude/commands/` on your machine and are available in every project.

| Command             | Description                                                                          |
| ------------------- | ------------------------------------------------------------------------------------ |
| `/session-start`    | Reads project docs and gives you a current-state briefing                            |
| `/session-save`     | Saves current session state for later restoration                                    |
| `/session-resume`   | Restores a previously saved session with full briefing                               |
| `/session-help`     | Context-aware command guide with suggested next steps                                |
| `/project-new`      | Scaffolds a complete project doc set (CLAUDE.md, ARCHITECTURE.md, PRD.md, templates) |
| `/milestone-status` | Shows active milestone progress: tasks done, what's next                             |
| `/milestone-start`  | Begins or resumes a milestone, executing tasks in sequence                           |
| `/task-complete`    | Marks a task complete and updates the progress table                                 |
| `/milestone-complete` | Closes out a finished milestone, updates TASKS.md and CLAUDE.md                    |
| `/milestone-new`    | Scaffolds a new milestone file from template with correct versions                   |
| `/bug-status`       | Shows open bugs: count, priority, and next to work on                                |
| `/bug-add`          | Creates a new bug file from template with auto-numbered ID                           |
| `/bug-fixed`        | Marks a bug as resolved and shows session help                                       |

See the **[Skill Reference Manual](SkillReferenceManual.md)** for full API-style documentation on each command: syntax, parameters, argument patterns, and examples.

See **[INSTALL.md](INSTALL.md)** for full installation instructions.

### Skill Organization

User-facing skills live directly in `skills/` and install to `~/.claude/commands/`. Helper and internal reference docs live in `skills/internal/` and install to `~/.claude/commands/internal/`, making them accessible as namespaced commands (`/internal:session-read`) without cluttering the main command list. This is a convention established here, not a formal Claude Code standard, but subdirectory namespacing is a supported feature.

### Installing Skills

```bash
# Clone this repo and run the install script
git clone https://github.com/gone3d/claude-docs.git
cd claude-docs
./install.sh
```

### Updating Skills

Edit the source in `skills/` then re-run `./install.sh` (or copy again). The commands directory is on your local machine. Changes take effect immediately in the next Claude Code session.

---

## Docs

### [Terminal Setup](docs/terminal-setup.md)

Getting Claude Code terminal to feel closer to the VS Code extension: no-flicker mode, status line, font, keybindings, mouse support. Start here if you're coming from the VS Code extension.

### [Workflow Guide](docs/workflow-guide.md)

Working across multiple repos simultaneously (UI + API pattern), starting sessions from a GitHub root directory, the session context system, terminal organization.

### [Milestone System](docs/milestone-system.md)

The milestone-based task management system: file structure, version numbering (MAJOR.MINOR.PATCH.BUILD), branch naming, git workflow, and how the skills fit in.

### [Tutorial: New Project](docs/Tutorial.md)

Step-by-step walkthrough of the full workflow. Scaffolds two repos (UI + API), creates milestones, completes tasks, and tracks bugs. Start here if you want to see everything in action.

### [Tutorial: Existing App](docs/TutorialExistingApp.md)

How to bootstrap the milestone system onto a project that already has code and history. Covers version format migration, template customization, and common scenarios (monorepos, 3-digit semver, team workflows).

---

## The Milestone System

The skills in this repo are built around a structured milestone workflow:

- **Milestone files** live in `./tasks/MilestoneX.X.md`
- **Template** at `./tasks/MilestoneTemplate.md`
- **Version format**: `MAJOR.MINOR.PATCH.BUILD`, each task completion bumps BUILD
- **Git workflow**: Claude creates branches, developer handles all commits/PRs via GitHub Desktop

This pattern works well for solo developers and small teams building on Cloudflare (Pages + Workers + D1), but the skills are generic enough to adapt to any project structure.

---

## Configuration

The skills expect this project structure (adjust for your stack):

```
your-project/
├── CLAUDE.md              # Session guide: current status, workflow rules
├── ARCHITECTURE.md        # Technical architecture, patterns, ADR log
├── PRD.md                 # Product requirements: vision, goals, MVP
├── TASKS.md               # Milestone dashboard: status table, backlog links
├── tasks/
│   ├── MilestoneTemplate.md
│   ├── MilestoneX.X.md   # Individual milestone files
│   ├── backlog/           # Future feature files (FF_*.md)
│   └── reference/         # Archived/completed milestones
├── bugs/
│   └── BugFixTemplate.md # Bug fix tracking files
└── package.json           # Version source of truth
```

---

_Built with Claude Code. Documented so you don't have to figure it out from scratch._
