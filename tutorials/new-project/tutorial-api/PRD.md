# PRD.md: Tutorial API Product Requirements

> What we're building, why, and for whom. Updated only when product direction changes.
> Implementation specifics belong in ARCHITECTURE.md and milestone files.

---

## Vision

A reliable REST API backend that powers the Tutorial task management app and serves as a practical walkthrough for the claude-docs skill system.

## Problem Statement

The Tutorial UI needs a backend that handles data persistence, validation, and business logic. The API provides CRUD operations for tasks and categories with filtering and sorting, keeping the frontend free from direct database access.

---

## Target Users

| User Type | Description | Primary Needs |
|---|---|---|
| Tutorial UI (frontend) | React SPA consuming the REST API | Reliable, well-structured JSON endpoints with consistent error handling |
| Developer (learner) | Developer following the claude-docs tutorial | A working backend example to practice the skill system with |

---

## MVP Definition

The smallest version of this product that delivers real value.

**In scope for MVP:**
- [ ] Task CRUD endpoints (create, read, update, delete)
- [ ] Category CRUD endpoints
- [ ] Task filtering by status, priority, and category
- [ ] Task sorting by date, priority, and title
- [ ] Pagination support
- [ ] Input validation
- [ ] Consistent JSON response format
- [ ] Health check endpoint
- [ ] Database schema with migrations and seed data

**Out of scope for MVP (future):**
- Authentication / authorization
- Rate limiting
- Full-text search
- WebSocket real-time updates
- File uploads

---

## Core Features

### Task Management API
CRUD endpoints for tasks with validation. Tasks have title, description, status, priority, due date, and category. Supports filtering by status/priority/category and sorting by multiple fields.

### Category Management API
CRUD endpoints for categories. Categories have name, color, and sort order. Deleting a category nullifies the category_id on associated tasks rather than cascading deletes.

### Data Validation
All input is validated server-side. Required fields enforced, enum values checked (status, priority), UUIDs validated for relationships.

---

## Success Criteria

How we know the MVP is working:

- [ ] All 11 endpoints respond correctly with valid input
- [ ] Invalid input returns appropriate error responses
- [ ] Filtering and sorting work as specified
- [ ] Database persists data across server restarts
- [ ] Tutorial UI can perform all operations through the API

---

## Constraints & Requirements

**Technical constraints:**
- Must run on localhost:3001 for development
- Must use PostgreSQL for persistence
- Must return consistent JSON response format (`{ success, data/error }`)

**Non-functional requirements:**
- Performance: API responses under 200ms for typical queries
- Reliability: Graceful error handling, no unhandled promise rejections
- CORS: Configured to allow Tutorial UI origin

---

**Last updated**: 2026-04-10
**Status**: Draft
