# Milestone [VERSION] - [Milestone Title]

**Version:** [VERSION] (starting version, from package.json PATCH +1, BUILD reset to 0)
**Date Created:** YYYY-MM-DD
**Date Started:** YYYY-MM-DD (when Task 0 begins)
**Date Completed:** YYYY-MM-DD (when all tasks complete)
**Status:** Planning | In Progress | Complete
**Based on:** [Reference document/issue/request]

[Brief 1-2 sentence description of what this milestone accomplishes]

---

## Version Information

**Current Version (at milestone start):**

- **tutorial-api:** `[Check package.json in Task 0]`

**Target Version (after milestone completion):**

- **tutorial-api:** `[VERSION].N` (where N = number of tasks)

**Task-Level Versioning:**
Each task completion increments the BUILD number (4th digit) by 1:

- Task 0 complete: [VERSION]
- Task 1 complete: [VERSION but BUILD +1]
- Task 2 complete: [VERSION but BUILD +2]
- etc.

This allows deployment and testing after each task.

**Git Branch:**

- **tutorial-api:** `{developer}-MMDDYY-[VERSION]-api`

---

## Progress Summary

**Completion:** X of Y tasks complete (Z%)

| Task | Priority | Status | Version | Deployed |
|---|---|---|---|---|
| Task 0: Milestone Initialization | SETUP | Pending | - | - |
| Task 1: [Task Name] | HIGH | Pending | [VERSION].1 | - |
| Task 2: [Task Name] | MEDIUM | Pending | [VERSION].2 | - |
| Task 3: [Task Name] | LOW | Pending | [VERSION].3 | - |

**Status Legend:**

- Pending: not started
- In Progress: currently being worked on
- Complete: implementation finished
- Deployed: live in production

---

## Overview

**Objective:** [What this milestone aims to achieve]

**Scope:**

- [Key deliverable 1]
- [Key deliverable 2]
- [Key deliverable 3]

**Estimated Effort:** X hours / Y days
**Actual Effort:** [Track actual time spent]

**Dependencies:**

- [Milestone or feature this depends on] (status)

---

## Git Workflow Policy

**CRITICAL: Claude Code must NOT commit or push code to GitHub.**

**Claude Code Responsibilities:**

- Write and modify code files
- Run TypeScript compilation to verify changes
- Run tests if requested
- Prepare code for review
- Create feature branches ONLY (git checkout -b, git push -u origin)

**User Responsibilities:**

- Review code changes in GitHub Desktop (or preferred git tool)
- Create commits with appropriate messages
- Push commits to feature branch
- Create pull requests
- Manage branches and merges
- Deploy to production

**The ONLY Git Exception:**
Branch creation for milestones:

- `git checkout -b {developer}-MMDDYY-[VERSION]-api`
- `git push -u origin {developer}-MMDDYY-[VERSION]-api`

All other git operations are handled by the developer.

---

## Task 0: Milestone Initialization (SETUP)

**Purpose:** Initialize milestone by determining current version and creating the feature branch
**Estimated Time:** 5-10 minutes
**Status:** Pending

### Step 0.1: Determine Current Version

```bash
cd "tutorials/new-project/tutorial-api"
git checkout main
git pull origin main
cat package.json | grep '"version"'
```

**Action:** Record current version from package.json.

**Update Milestone Document:**

- Current version: `[from package.json]`
- Starting milestone version: `[current PATCH +1, BUILD reset to 0]`
- Task versioning: each task adds +0.0.0.1

### Step 0.2: Create Feature Branch

**Branch Naming Format:** `{developer}-MMDDYY-[VERSION]-api`

```bash
cd "tutorials/new-project/tutorial-api"
git checkout main
git pull origin main
git checkout -b {developer}-MMDDYY-[VERSION]-api
git push -u origin {developer}-MMDDYY-[VERSION]-api
```

### Step 0.3: Update Milestone Header

Update this document with confirmed version and Date Started.

### Success Criteria

- Current version recorded from package.json
- Feature branch created and pushed
- Milestone header updated with confirmed version
- Date Started recorded
- Ready to proceed with Task 1

---

## Task 1: [Task Name] (PRIORITY)

**Estimated Time:** X hours
**Actual Time:** [Fill in when complete]
**Status:** Pending
**Version:** [VERSION].1
**Dependencies:** Task 0

### Description

[Detailed description of what needs to be done and why]

### Affected Files

- `path/to/file1`
- `path/to/file2`

### Implementation Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Testing

- [ ] TypeScript compilation passes
- [ ] [Test case 1]
- [ ] [Test case 2]

### Success Criteria

- [Criterion 1]
- [Criterion 2]

---

## Task 2: [Task Name] (PRIORITY)

[Follow same structure as Task 1]

---

**End of Milestone [VERSION] Specification**
