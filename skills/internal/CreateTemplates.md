Internal reference for project templates. Used by `/project-new` and `/bug-fix` when scaffolding files into a new or existing project.

This is not a user-facing command. It defines the canonical templates that skills copy into project directories.

---

## Template Inventory

| Template | Installed to | Used by |
|---|---|---|
| MilestoneTemplate.md | `[project]/tasks/MilestoneTemplate.md` | `/milestone-new`, `/project-new` |
| BugFixTemplate.md | `[project]/bugs/BugFixTemplate.md` | `/bug-fix`, `/project-new` |

---

## MilestoneTemplate.md

The full milestone template is maintained at `claude-docs/docs/MilestoneTemplate.md`. When generating a milestone template for a new project:

1. Read `claude-docs/docs/MilestoneTemplate.md` as the source
2. Replace `[ui-repo]`, `[api-repo]`, `[github-root]`, and other bracketed placeholders with project-specific values gathered during `/project-new`
3. Replace `[production-ui-url]`, `[production-api-url]` with actual deployment URLs
4. Replace `[admin-username]`, `[test-username]` with project test credentials
5. Replace `[deployment platform]`, `[database platform]`, `[database CLI tool]` with actual tech stack
6. Write the result to `[project]/tasks/MilestoneTemplate.md`

If `claude-docs/docs/MilestoneTemplate.md` is not accessible (e.g. the user hasn't cloned claude-docs), generate a minimal template following the same structure: header with version/status/dates, progress summary table, Task 0 initialization steps, and a repeatable task section.

---

## BugFixTemplate.md

The full bug fix template is maintained at `claude-docs/docs/BugFixTemplate.md`. When generating a bug fix template for a new project:

1. Read `claude-docs/docs/BugFixTemplate.md` as the source
2. No placeholder replacements needed. The template is already generic.
3. Write the result to `[project]/bugs/BugFixTemplate.md`
4. Create the `[project]/bugs/` directory if it doesn't exist
5. Create the `[project]/screenshots/` directory if it doesn't exist

---

## Folder Structure After Scaffolding

When `/project-new` runs, the resulting project should include:

```
[project]/
├── CLAUDE.md
├── ARCHITECTURE.md
├── PRD.md
├── TASKS.md
├── tasks/
│   ├── MilestoneTemplate.md
│   └── Milestone0.md
├── bugs/
│   └── BugFixTemplate.md
└── screenshots/
```

The `bugs/` folder starts with only the template. Individual bug fix files are created by the `/bug-fix` skill as needed.

The `screenshots/` folder starts empty. Bug fix files reference screenshots here using the naming convention `bugfix-NNN-description.png`.
