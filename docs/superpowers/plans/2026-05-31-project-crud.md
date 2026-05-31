# Project CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full CRUD functionality for Projects, including a multi-field form and deletion confirmation.

**Architecture:** Use `react-hook-form` for form management, React Query for data fetching/mutations, and standard React routing for navigation.

**Tech Stack:** React 19, TanStack React Query, Axios, React Hook Form, React Router.

---

### Task 1: Create ProjectForm Component

**Files:**
- Create: `frontend/src/page/ProjectForm.jsx`

- [ ] **Step 1: Implement the ProjectForm component**
  - Include imports (React, useForm, useNavigate, useParams, useQuery, useMutation, api).
  - Fetch organizations for the dropdown.
  - Handle edit mode by fetching project details if `id` exists.
  - Implement form with Name, Organization, and Environment fields.
  - Set up mutation for create/update.

### Task 2: Register Routes in App.jsx

**Files:**
- Modify: `frontend/src/App.jsx`

- [ ] **Step 1: Add ProjectForm routes**
  - Import `ProjectForm`.
  - Add routes for `/projects/new` and `/projects/edit/:id`.

### Task 3: Update Projects List with CRUD actions

**Files:**
- Modify: `frontend/src/page/projects.jsx`

- [ ] **Step 1: Add Navigation to ProjectForm**
  - Update "New Project" button to navigate to `/projects/new`.
- [ ] **Step 2: Add Edit and Delete buttons**
  - Add buttons to each project card.
  - Edit button navigates to `/projects/edit/:id`.
- [ ] **Step 3: Integrate DeleteModal**
  - Import `DeleteModal`.
  - Add state for modal (isOpen, selectedProjectId).
  - Implement `deleteMutation`.
  - Handle modal confirm to trigger deletion.
