# PRD.md: Tutorial UI Product Requirements

> What we're building, why, and for whom. Updated only when product direction changes.
> Implementation specifics belong in ARCHITECTURE.md and milestone files.

---

## Vision

A clean, functional task management application that serves as a practical walkthrough for the claude-docs skill system.

## Problem Statement

Developers learning the claude-docs skill system need a real, non-trivial project to practice with. A task management app provides enough complexity (CRUD, filtering, sorting, relationships between entities) to exercise the full milestone workflow without being overwhelming.

---

## Target Users

| User Type | Description | Primary Needs |
|---|---|---|
| Developer (learner) | Developer following the claude-docs tutorial | A working example project to practice the skill system with |
| End user (hypothetical) | Someone managing personal or work tasks | Create, organize, filter, and track tasks with categories and priorities |

---

## MVP Definition

The smallest version of this product that delivers real value.

**In scope for MVP:**
- [ ] Task CRUD (create, read, update, delete)
- [ ] Category CRUD with color coding
- [ ] Task filtering by status, priority, and category
- [ ] Task sorting by date, priority, and title
- [ ] Status workflow (todo -> in_progress -> done)
- [ ] Priority levels with visual indicators
- [ ] Responsive layout

**Out of scope for MVP (future):**
- User authentication
- Multi-user support
- Due date reminders/notifications
- Drag-and-drop reordering
- Search (full-text)
- Dark mode

---

## Core Features

### Task Management
Create, view, edit, and delete tasks. Each task has a title, optional description, status, priority, optional due date, and optional category. Tasks are displayed in a filterable, sortable list.

### Category Organization
Group tasks by category. Categories have names and colors for visual distinction. Deleting a category sets its tasks' category to null rather than deleting them.

### Filtering and Sorting
Filter tasks by status (tab bar), priority (dropdown), and category (dropdown). Sort by date created, due date, priority, or title in ascending or descending order.

---

## Success Criteria

How we know the MVP is working:

- [ ] All four pages render and function correctly
- [ ] Tasks can be created, viewed, edited, and deleted
- [ ] Categories can be managed and assigned to tasks
- [ ] Filtering and sorting work as specified
- [ ] UI communicates clearly with the API (loading states, error handling)

---

## Constraints & Requirements

**Technical constraints:**
- Must consume the tutorial-api REST endpoints (no direct database access)
- Must run locally alongside the API for development

**Non-functional requirements:**
- Performance: page loads under 2s on localhost
- Accessibility: semantic HTML, keyboard navigation for forms
- Responsive: usable on desktop and tablet widths

---

**Last updated**: 2026-04-10
**Status**: Draft
