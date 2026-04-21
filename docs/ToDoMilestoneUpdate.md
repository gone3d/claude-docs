# ToDo: /milestone-update Skill

**Status:** Planned
**Priority:** Medium
**Created:** 2026-04-14
**Context:** Requested during Hourlings Milestone 21.7b when tasks needed restructuring mid-milestone

## Problem

Mid-milestone task restructuring happens frequently: tasks merge, split, reorder, or scope changes based on what's discovered during implementation. Currently this requires manually editing the milestone markdown file, which is error-prone (version numbers, completion percentages, task numbering all need to stay in sync).

## Proposed Skill

```
/milestone-update <instructions>
```

### Examples

```
/milestone-update merge tasks 4 and 6 into task 4, renumber remaining tasks
/milestone-update add task between 3 and 4: "Disable popup, wire edit through footer" priority HIGH
/milestone-update remove task 5, renumber remaining
/milestone-update reorder: move task 6 before task 4
/milestone-update update task 4 description: "Now includes cleanup of old rendering code"
```

### What It Should Do

1. Read the current milestone file (auto-detected from session or specified)
2. Parse the progress table and task sections
3. Apply the requested changes:
   - **Add task**: Insert new task at specified position, shift numbering
   - **Remove task**: Delete task section, shift numbering
   - **Merge tasks**: Combine descriptions/checklists, remove the merged task, shift numbering
   - **Reorder tasks**: Move task sections, renumber
   - **Update description**: Modify task title or description text
   - **Split task**: Create two tasks from one, shift numbering
4. Recalculate:
   - Completion count and percentage
   - Version assignments (maintain sequence from last completed task)
   - Task dependencies (update references to renumbered tasks)
5. Update the progress table to match the task sections
6. Report what changed

### What It Should NOT Do

- Change task statuses (use /task-complete for that)
- Create new milestones (use /milestone-new)
- Modify completed tasks without explicit confirmation

### Implementation Notes

- The progress table and task body sections must stay in sync
- Version assignments: completed tasks keep their versions, pending tasks get reassigned sequentially
- Tasks 2 & 3 sharing a version (as happened in 21.7b) is valid when tasks are completed together
- Should warn if restructuring would affect completed task references

### Skill File Location

```
skills/milestone-update.md
```

### Dependencies

- Needs to understand the milestone file format (MilestoneTemplate.md)
- Uses session context to find the active milestone (same as /milestone-status)
