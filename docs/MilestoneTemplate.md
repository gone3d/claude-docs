# Milestone X.X - [Milestone Title]

**Milestone Version:** [Starting version from Task 0, e.g., 0.8.6.0]
**Date Created:** YYYY-MM-DD
**Date Started:** YYYY-MM-DD (when Task 0 begins)
**Date Completed:** YYYY-MM-DD (when all tasks complete)
**Status:** Planning | In Progress | Complete
**Based on:** [Reference document/issue/request]

[Brief 1-2 sentence description of what this milestone accomplishes]

---

## Version Information

**Versioning Strategy:**

- **v0.8.x** - Development phase (pre-MVP, can go to v0.8.100+ if needed)
- **v0.9.x** - Beta/MVP release (first public release)
- **v1.0.x** - Production release (first stable release)

**Task-Level Versioning:**
Each task completion increments the BUILD number (4th digit) by 1:

- Task 0 complete → 0.8.6.0
- Task 1 complete → 0.8.6.1
- Task 2 complete → 0.8.6.2
- Task 3 complete → 0.8.6.3
- etc.
- Final Task and Milestone Completion adds 0.0.0.1 to last task on completion. There might need to be additional bumps based on errors or testing.

This allows immediate deployment for browser testing after each task.

**Current Versions (at milestone start):**

- **[ui-repo]:** `[Check package.json in Task 0]`
- **[api-repo]:** `[Check package.json in Task 0]`

**Target Versions (after milestone completion):**

- **[ui-repo]:** `[Starting version + 0.0.0.N]` (where N = number of tasks)
- **[api-repo]:** `[Starting version + 0.0.0.N]` (where N = number of tasks, if API changes)

**Note:** Stay in v0.8.x until MVP release. It's fine to have v0.8.50.0 or even v0.8.100.0!

**Git Branches:**

- **[ui-repo]:** `{developer}-MMDDYY-milestone-X-ui` (created in Task 0.3)
- **[api-repo]:** `{developer}-MMDDYY-milestone-X-api` (created in Task 0.4)

---

## Progress Summary

**Completion:** X of Y tasks complete (Z%)

| Task                             | Priority | Status     | Version     | Deployed |
| -------------------------------- | -------- | ---------- | ----------- | -------- |
| Task 0: Milestone Initialization | SETUP    | ⏳ Pending | -           | -        |
| Task 1: [Task Name]              | HIGH     | ⏳ Pending | [Current+1] | -        |
| Task 2: [Task Name]              | MEDIUM   | ⏳ Pending | [Current+2] | -        |
| Task 3: [Task Name]              | LOW      | ⏳ Pending | [Current+3] | -        |

**Status Legend:**

- ⏳ Pending - Not started
- 🚧 In Progress - Currently being worked on
- ✅ Complete - Implementation finished
- 🚀 Deployed - Live in production

---

## Overview

**Objective:** [What this milestone aims to achieve]

**Scope:**

- [Key deliverable 1]
- [Key deliverable 2]
- [Key deliverable 3]

**Priority Breakdown:**

- High: X tasks
- Medium: Y tasks
- Low: Z tasks
- Informational: N tasks

**Estimated Effort:** X hours / Y days / Z weeks
**Actual Progress:** [Track actual time spent]

**Dependencies:**

- Milestone X.X (status: ✅ Complete | 🚧 In Progress | ⏳ Pending)
- [External dependency name] (status)

**Blocks:**

- Milestone Y.Y - [Brief description of what's blocked]

---

## Git Workflow Policy

**CRITICAL: Claude Code must NOT commit or push code to GitHub.**

**Claude Code Responsibilities:**

- ✅ Write and modify code files
- ✅ Run TypeScript compilation to verify changes
- ✅ Run tests if requested
- ✅ Prepare code for review
- ✅ Create feature branches ONLY (git checkout -b, git push -u origin)
- ❌ **DO NOT** run `git add` or `git commit`
- ❌ **DO NOT** run `git push` (except initial branch creation)
- ❌ **DO NOT** create pull requests
- ❌ **DO NOT** run deployment commands

**User Responsibilities:**

- Review code changes in GitHub Desktop
- Create commits with appropriate messages
- Push commits to feature branch
- Create pull requests
- Manage branches and merges
- Deploy to production

**The ONLY Git Exception:**
Branch creation for milestones is allowed:

- `git checkout -b milestone-X.X-[ui|api]` - Create feature branch
- `git push -u origin milestone-X.X-[ui|api]` - Push branch to remote

**All other git operations are handled by the user via GitHub Desktop.**

See CLAUDE.md for complete git workflow documentation.

---

## Background (OPTIONAL)

**Note:** This section is optional but recommended for complex milestones. Use it to provide context on the problem being solved and the chosen solution approach.

### The Problem

[Describe the problem or issue this milestone addresses]

**Example:**

- User-reported bug: [Description]
- Technical debt: [Description]
- Feature gap: [Description]

### The Solution

[Describe the approach/solution this milestone implements]

**Key Features:**

- ✅ Feature 1
- ✅ Feature 2
- ✅ Feature 3

**Code Examples (if applicable):**

```typescript
// Example of solution approach
// BEFORE
const oldApproach = () => {
  /* old code */
};

// AFTER
const newApproach = () => {
  /* new code */
};
```

---

## Task 0: Milestone Initialization (SETUP PRIORITY)

**Purpose:** Initialize milestone by determining current version and creating feature branches
**Estimated Time:** 5-10 minutes
**Status:** ⏳ Pending
**Dependencies:** None

### Description

Every milestone must start with Task 0 to establish the baseline version numbers. This ensures version tracking is accurate regardless of when the milestone was created vs when it starts.

**Why This Matters:**

- Milestones may be planned weeks before execution
- Other milestones may deploy between planning and execution
- Version numbers change frequently
- We need accurate baseline for +0.0.1.0 increments per task

### Step 0.1: Determine Current UI Version

```bash
cd [github-root]/[ui-repo]
git checkout main
git pull origin main
cat package.json | grep '"version"'
```

**Action:** Record current version from package.json

**Example Output:**

```
"version": "0.8.5.10"
```

**Update Milestone Document:**

- Current UI Version: `0.8.5.10`
- Starting Milestone Version: `0.8.6.0` (current + 0.0.1.0 for new milestone)
- Task versioning: Each task adds +0.0.0.1 (0.8.6.0 → 0.8.6.1 → 0.8.6.2, etc.)

### Step 0.2: Determine Current API Version

```bash
cd [github-root]/[api-repo]
git checkout main
git pull origin main
cat package.json | grep '"version"'
```

**Action:** Record current version from package.json

**Example Output:**

```
"version": "0.8.5.8"
```

**Update Milestone Document:**

- Current API Version: `0.8.5.8`
- Starting Milestone Version: `0.8.5.9` (if API changes needed) OR `0.8.5.8` (if no API changes)
- Task versioning: Each API task adds +0.0.0.1 (e.g., 0.8.5.9 → 0.8.5.10 → 0.8.5.11)

### Step 0.3: Create UI Branch

**Branch Naming Format:** `{developer}-MMDDYY-milestone-X-ui`

**Examples:**

- `don-033026-milestone-17-ui` (Milestone 17 started March 30, 2026)
- `don-033026-milestone-18.1-ui` (Milestone 18.1 - already broken into submilestones)

**Note:** For large milestones requiring multiple task branches, use: `{developer}-MMDDYY-milestone-X.T#-ui`

- Example: `don-033026-milestone-17.T3-ui` (Milestone 17, Task 3 branch)

```bash
cd [github-root]/[ui-repo]
git checkout main
git pull origin main
git checkout -b {developer}-MMDDYY-milestone-X-ui
git push -u origin {developer}-MMDDYY-milestone-X-ui
```

**Success Criteria:**

- ✅ Branch `{developer}-MMDDYY-milestone-X-ui` created from latest main
- ✅ Branch pushed to remote
- ✅ Branch name follows format: {developer}-MMDDYY-milestone-#-ui

### Step 0.4: Create API Branch (if needed)

**Note:** Only create if milestone includes API changes

**Branch Naming Format:** `{developer}-MMDDYY-milestone-X-api` (matches UI branch pattern)

```bash
cd [github-root]/[api-repo]
git checkout main
git pull origin main
git checkout -b {developer}-MMDDYY-milestone-X-api
git push -u origin {developer}-MMDDYY-milestone-X-api
```

**Success Criteria:**

- ✅ Branch `{developer}-MMDDYY-milestone-X-api` created from latest main
- ✅ Branch pushed to remote
- ✅ Branch name matches UI branch pattern (milestone-X-api)

### Step 0.5: Update Milestone Header

Update the milestone document with discovered versions:

```markdown
**Milestone Version:** 0.8.6.0 (starting version)
**Date Started:** 2026-03-28

## Version Information

**Current Versions (before milestone):**

- **[ui-repo]:** `0.8.5.10`
- **[api-repo]:** `0.8.5.8`

**Starting Versions (milestone begins):**

- **[ui-repo]:** `0.8.6.0` (current + 0.0.1.0 for new milestone)
- **[api-repo]:** `0.8.5.8` (no changes this milestone)

**Task-Level Versioning:**
Each task increments BUILD number (+0.0.0.1):

- Task 0 complete → 0.8.6.0
- Task 1 complete → 0.8.6.1
- Task 2 complete → 0.8.6.2
- Task N complete → 0.8.6.N
```

### Success Criteria

- ✅ Current UI version recorded from package.json
- ✅ Current API version recorded from package.json
- ✅ Target versions calculated (current + 0.0.1.0)
- ✅ Milestone version determined
- ✅ UI branch created and pushed
- ✅ API branch created and pushed (if needed)
- ✅ Milestone document header updated
- ✅ Date Started recorded
- ✅ Ready to proceed with Task 1

---

## Task 1: [Task Name] (PRIORITY LEVEL)

**Severity:** HIGH | MEDIUM | LOW | INFO
**Risk:** [Brief description of risk if not completed]
**Estimated Time:** X hours
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending | 🚧 In Progress | ✅ Complete | 🚀 Deployed
**Version:** 0.8.5.10 (version when this task will be deployed)
**Dependencies:**

- Task 0.1, 0.2 (branch setup)
- Task X (if dependent on another task in this milestone)
- Milestone Y.Y - Task Z (if dependent on task in another milestone)

### Description

[Detailed description of what needs to be done and why]

### Affected Files

**[ui-repo]:**

- `/src/path/to/file1.tsx`
- `/src/path/to/file2.tsx`

**[api-repo]:**

- `/functions/path/to/endpoint.ts`
- `/lib/path/to/utility.ts`

### Implementation Steps

1. **Step 1 - [Brief description]**:

   ```typescript
   // Code example or command
   ```

2. **Step 2 - [Brief description]**:

   ```typescript
   // Code example or command
   ```

3. **Step 3 - [Brief description]**:
   - Sub-step details
   - More details

### Testing Checklist

**Unit Tests:**

- [ ] Test case 1
- [ ] Test case 2

**Integration Tests:**

- [ ] Integration scenario 1
- [ ] Integration scenario 2

**Manual Testing:**

- [ ] Manual test 1
- [ ] Manual test 2

**Production Verification (after deployment):**

- [ ] Production check 1
- [ ] Production check 2

### Success Criteria

- ✅ Criterion 1
- ✅ Criterion 2
- ✅ Criterion 3

### Rollback Plan

If this task causes issues:

```bash
# Rollback to previous commit on milestone branch
cd [github-root]/[ui-repo|api-repo]
git checkout milestone-X.X-[ui|api]
git revert [commit-hash]
git push origin milestone-X.X-[ui|api]
```

---

## Task 2: [Another Task Name] (PRIORITY LEVEL)

[Follow same structure as Task 1]

---

## Testing Strategy

### Test Environments

**Development:**

- Local development servers
- Branch: `milestone-X.X-ui`, `milestone-X.X-api`

**Staging (if applicable):**

- URL: [staging URL]
- Branch: `milestone-X.X-ui`, `milestone-X.X-api`

**Production:**

- URL: [production-ui-url]
- API: [production-api-url]

### Testing Phases

**Phase 1: Unit Testing**

- Run automated tests: `npm test`
- Coverage threshold: X%
- All tests must pass before moving to integration

**Phase 2: Integration Testing**

- Test interactions between components
- Verify API contract compliance
- Cross-browser testing (Chrome, Firefox, Safari)

**Phase 3: Manual Testing**

- Complete testing checklist for each task
- User acceptance testing (UAT)
- Edge case testing

**Phase 4: Production Verification**

- Smoke tests after deployment
- Monitor error logs for 24 hours
- Performance benchmarking

### Test Data

**Test Accounts:**

- Admin: `[admin-username]` / `[admin-password]`
- User: `[test-username]` / `[test-password]`

**Test Scenarios:**

- [Key scenario 1]
- [Key scenario 2]

---

## Deployment Plan

### Version Progression

This milestone includes X version bumps:

**Version 0.8.5.9 → 0.8.5.10** (Tasks 1-2)

- Task 1: [Task name]
- Task 2: [Task name]
- **Deployment Date:** YYYY-MM-DD
- **Branch:** `milestone-X.X-ui`, `milestone-X.X-api`
- **Deployment Notes:** [Any special considerations]

**Version 0.8.5.10 → 0.8.5.11** (Task 3)

- Task 3: [Task name]
- **Deployment Date:** YYYY-MM-DD
- **Branch:** `milestone-X.X-ui`, `milestone-X.X-api`
- **Deployment Notes:** [Any special considerations]

### Pre-Deployment Checklist

**Code Quality:**

- [ ] All tests passing
- [ ] TypeScript compilation successful (no errors)
- [ ] Linting passes with no errors
- [ ] No console.log statements in production code
- [ ] Code review completed

**Version Management:**

- [ ] package.json version updated in both repos
- [ ] Version numbers match deployment plan
- [ ] CHANGELOG.md updated (if exists)

**Database Changes (if applicable):**

- [ ] Migration scripts tested locally
- [ ] Migration scripts tested on staging
- [ ] Rollback migrations prepared
- [ ] Data backup completed

**Documentation:**

- [ ] README.md updated (if needed)
- [ ] API documentation updated (if needed)
- [ ] CLAUDE.md updated with session notes
- [ ] Milestone tasks marked as complete

**Security:**

- [ ] No secrets in code
- [ ] Environment variables configured
- [ ] Security headers verified
- [ ] CSRF tokens functional (if applicable)

### Deployment Steps

**Step 1: Merge to Main**

```bash
# UI Repository
cd [github-root]/[ui-repo]
git checkout main
git pull origin main
git merge milestone-X.X-ui
git push origin main

# API Repository
cd [github-root]/[api-repo]
git checkout main
git pull origin main
git merge milestone-X.X-api
git push origin main
```

**Step 2: Tag Release**

```bash
# UI Repository
cd [github-root]/[ui-repo]
git tag -a v0.8.5.10 -m "Milestone X.X: [Brief description]"
git push origin v0.8.5.10

# API Repository
cd [github-root]/[api-repo]
git tag -a v0.8.5.9 -m "Milestone X.X: [Brief description]"
git push origin v0.8.5.9
```

**Step 3: Deploy**

```bash
# Verify deployments
curl [production-api-url]/health
# Open [production-ui-url] in browser
```

**Step 4: Post-Deployment Verification**

- [ ] API health check passes
- [ ] UI loads without errors
- [ ] Key features functional
- [ ] Monitor error logs for 1 hour
- [ ] No critical errors in production

### Post-Deployment

**Monitoring (first 24 hours):**

- Check error logs every 2 hours
- Monitor API response times
- Watch for user-reported issues

**Cleanup:**

- [ ] Archive milestone branches (optional - keep for reference)
- [ ] Update project board/tracking system
- [ ] Notify team of successful deployment

---

## Success Metrics

### Quantitative Metrics

- **Code Quality:**
  - Test coverage: X% → Y%
  - Build time: X seconds → Y seconds
  - Bundle size: X MB → Y MB

- **Performance:**
  - Page load time: X ms → Y ms
  - API response time: X ms → Y ms
  - Lighthouse score: X → Y

- **Security (if applicable):**
  - Vulnerabilities: X → 0
  - Security headers score: X% → Y%

### Qualitative Metrics

- ✅ User feedback: [Expected outcome]
- ✅ Developer experience: [Expected outcome]
- ✅ System stability: [Expected outcome]

### Acceptance Criteria

- ✅ All tasks completed and deployed
- ✅ All tests passing
- ✅ No critical bugs in production
- ✅ Documentation updated
- ✅ Team sign-off received

---

## Rollback Plan

### When to Rollback

Rollback if:

- Critical bug discovered in production
- Security vulnerability introduced
- Data loss or corruption occurs
- System becomes unstable
- Major feature broken

### Rollback Procedure

**Step 1: Stop Current Deployment**

```bash
# If deployment in progress, cancel it
# Check GitHub Actions / Cloudflare Pages dashboard
```

**Step 2: Revert to Previous Release**

**Option A: Revert via Git** (preferred for clean rollback)

```bash
# UI Repository
cd [github-root]/[ui-repo]
git checkout main
git revert [merge-commit-hash] --mainline 1
git push origin main

# API Repository
cd [github-root]/[api-repo]
git checkout main
git revert [merge-commit-hash] --mainline 1
git push origin main
```

**Option B: Reset to Previous Tag** (if revert fails)

```bash
# UI Repository
cd [github-root]/[ui-repo]
git checkout main
git reset --hard v0.8.5.9  # Previous version
git push origin main --force

# API Repository
cd [github-root]/[api-repo]
git checkout main
git reset --hard v0.8.5.8  # Previous version
git push origin main --force
```

**Step 3: Database Rollback (if applicable)**

```bash
# Run rollback migrations if database changes were made
cd [github-root]/[api-repo]
# [your database rollback command here]
```

**Step 4: Verify Rollback**

- [ ] Check API health endpoint
- [ ] Verify UI loads correctly
- [ ] Test critical user flows
- [ ] Confirm previous version deployed

**Step 5: Post-Rollback Actions**

1. Notify team of rollback
2. Document issue that caused rollback
3. Create hotfix plan
4. Schedule fix and redeployment

### Rollback Testing

**Test rollback procedure in staging:**

- [ ] Practice revert process
- [ ] Verify database rollback works
- [ ] Confirm deployment pipeline reverts correctly

---

## Dependencies

### External Dependencies

**Required Before Starting:**

- ✅ Milestone X.X completed
- ⏳ Third-party service integration
- ⏳ Design assets finalized

**Required During Development:**

- Access to production environment
- Database migration permissions
- API keys for testing

### Internal Dependencies

**Blocks:**

- Milestone Y.Y cannot start until Task X complete
- Feature Z requires Task Y to be deployed

**Blocked By:**

- Waiting on design team for mockups (Task 1)
- Waiting on API schema changes (Task 3)

---

## Risk Assessment

### High Risk Changes

**[Change Name]:**

- **Risk:** [Description of risk]
- **Impact:** [What breaks if this fails]
- **Mitigation:** [How we reduce risk]
- **Contingency:** [What we do if it fails]

### Medium Risk Changes

**[Change Name]:**

- **Risk:** [Description]
- **Mitigation:** [How to reduce risk]

### Low Risk Changes

**[Change Name]:**

- **Risk:** [Minimal impact]
- **Mitigation:** [Standard testing]

### Risk Mitigation Strategies

1. **Comprehensive Testing:** All changes tested in dev/staging before production
2. **Gradual Rollout:** Deploy to staging first, monitor, then production
3. **Feature Flags:** Critical features behind flags for quick disable
4. **Monitoring:** Enhanced logging during deployment window
5. **Rollback Ready:** Tested rollback procedure available

---

## Appendix A: Tools & Resources

### Development Tools

- **IDE:** VSCode / Cursor
- **API Testing:** Postman / curl
- **Database:** [database platform]

### Testing Tools

- **Unit Tests:** Vitest
- **E2E Tests:** Playwright (if applicable)
- **Performance:** Lighthouse

### Deployment Tools

- **UI:** [deployment platform] (auto-deploy from main branch)
- **API:** [deployment platform] (auto-deploy from main branch)
- **Database:** [database CLI tool]

### Documentation

- **Project Docs:** `/README.md`, `/ARCHITECTURE.md`, `/CLAUDE.md`
- **API Docs:** [Link to API documentation]
- **Design Docs:** [Link to Figma/design files]

### Monitoring & Debugging

- **Logs:** Cloudflare dashboard
- **Error Tracking:** Browser console / server logs
- **Performance:** Lighthouse / Chrome DevTools

---

## Appendix B: Checklist for New Milestones

When creating a new milestone using this template:

**Setup:**

- [ ] Copy MilestoneTemplate.md to MilestoneX.X.md
- [ ] Update milestone number and title
- [ ] Fill in current version numbers from package.json
- [ ] Calculate target version numbers
- [ ] Set branch names (milestone-X.X-ui, milestone-X.X-api)

**Planning:**

- [ ] Define objective and scope
- [ ] List all tasks with priorities
- [ ] Estimate effort for each task
- [ ] Identify dependencies
- [ ] Assess risks
- [ ] Plan version bumps (which tasks → which version)

**Execution:**

- [ ] Create Task 0.1, 0.2 (branch setup) - complete first
- [ ] Complete tasks in order
- [ ] Update progress summary as tasks complete
- [ ] Mark testing checkboxes as tests pass
- [ ] Document actual time spent

**Completion:**

- [ ] All tasks complete and tested
- [ ] All version bumps completed
- [ ] Deployment successful
- [ ] Post-deployment verification passed
- [ ] CLAUDE.md updated with summary
- [ ] Milestone marked as Complete

---

## Appendix C: Version Numbering

**Semantic Versioning:** `MAJOR.MINOR.PATCH.BUILD`

- **MAJOR (0):** Breaking changes, major releases
- **MINOR (8):** New features, backward compatible
- **PATCH (5):** Bug fixes, backward compatible
- **BUILD (9+):** Small changes, hotfixes, incremental updates

**Version Bump Guidelines:**

- **BUILD increment (+0.0.0.1):** Each task completion (allows immediate Cloudflare deployment for testing)
- **PATCH increment (+0.0.1.0):** New milestone starts (resets BUILD to 0)
- **MINOR increment (+0.1.0.0):** Major feature or significant enhancement (rare in v0.8.x)
- **MAJOR increment (+1.0.0.0):** Breaking changes or major release (v0.9.x = MVP, v1.0.x = production)

**Example Progression Within a Milestone:**

- 0.8.6.0 → 0.8.6.1 (Task 1 complete, deployed for testing)
- 0.8.6.1 → 0.8.6.2 (Task 2 complete, deployed for testing)
- 0.8.6.2 → 0.8.6.3 (Task 3 complete, deployed for testing)

**Example Progression Between Milestones:**

- 0.8.6.N (Milestone 20 final) → 0.8.7.0 (Milestone 21 starts)
- 0.8.7.N (Milestone 21 final) → 0.8.8.0 (Milestone 22 starts)

---

## Appendix D: Implementation Patterns (OPTIONAL)

**Note:** This section is optional and project-specific. Use it to document common patterns, migration guides, or code examples relevant to this milestone.

### Pattern Example Template

**Pattern Name:**

```typescript
// BEFORE
const oldPattern = () => {
  // Old implementation
};

// AFTER
const newPattern = () => {
  // New implementation
};
```

**Key Changes:**

1. Change 1 description
2. Change 2 description
3. Change 3 description

**Usage Notes:**

- When to use this pattern
- Edge cases to consider
- Related patterns or alternatives

---

**End of Milestone X.X Specification**
