# Contributing to claude-docs

Everything in this repo came from solving real problems in real projects. Contributions that follow the same spirit are welcome.

---

## Contributing

Useful contributions include:

- **New slash commands** — skills that solve a workflow problem you actually hit
- **Workflow improvements** — refinements to existing skills, templates, or the milestone system
- **Documentation** — fixes, clarifications, or new guides based on real usage
- **Bug reports** — a skill that misbehaves, a doc that's wrong, an install step that fails

---

## How to contribute

1. Fork the repo
2. Create a branch for your change
3. Open a pull request

For anything substantial (a new skill, a change to the milestone system, a restructure), open an issue first so we can talk about it before you build it. Small fixes can go straight to a PR.

---

## License and contributions

By submitting a contribution to this project, you agree that your contribution is licensed under the MIT License that covers this project, and that you have the right to grant that license. If your employer has rights to work you create, you are responsible for confirming you have permission to contribute.

---

## Style

Follow the conventions already in the repo rather than inventing new ones:

- **Skill files** are plain markdown: a one-paragraph description at the top, then numbered `## Step N:` sections separated by `---` rules. Look at `skills/session-start.md` for the pattern.
- **Command names** are kebab-case, verb-last where it reads naturally (`/session-start`, `/bug-add`, `/task-complete`). Helper docs that aren't user-facing commands go in `skills/internal/`.
- **New skills** need a row in the README command table and an entry in the [Skill Reference Manual](SkillReferenceManual.md).
- **Docs** live in `docs/`, use `---` section separators, and stay practical — explain what to do and why, skip the theory.

---

_When in doubt, match what's already here._
