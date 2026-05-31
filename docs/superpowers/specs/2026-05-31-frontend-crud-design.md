# Design Spec: Frontend CRUD Operations & Security Fix

## Overview
Complete the full CRUD (Create, Read, Update, Delete) lifecycle for Organizations, Projects, and Environment Variables in the EnvSafe frontend. Address a security vulnerability in the backend where variable updates skip encryption.

## Goals
- Functional Create/Update/Delete for all major entities.
- Shared form components for consistent UI and DRY code.
- Dedicated page for project-specific environment variables.
- Custom confirmation modal for deletions.
- Ensure all variable updates are encrypted.

## Proposed Changes

### 1. Routing (frontend/src/App.jsx)
New routes to support dedicated pages:
- `/organizations/new` & `/organizations/edit/:id`
- `/projects/new` & `/projects/edit/:id`
- `/projects/:id/variables` (List view)
- `/projects/:id/variables/new` & `/projects/:id/variables/edit/:varId`

### 2. Frontend Components
- **`DeleteModal`**: Custom UI component for deletion confirmation.
- **Shared Forms**: 
  - `OrganizationForm.jsx`: Handles create/edit for Organizations.
  - `ProjectForm.jsx`: Handles create/edit for Projects.
  - `VariableForm.jsx`: Handles create/edit for EnvVariables.

### 3. State Management
- Use `useMutation` from TanStack React Query for all POST/PUT/DELETE operations.
- Invalidate relevant query keys (e.g., `['organizations']`, `['projects']`, `['variables', projectId]`) on success.

### 4. Backend Fix (backend/apps/core/viewsets.py)
- Modify `EnvVariableViewSets.perform_update` (or override `update`) to ensure `_encrypt_var` is called on the `value` field if it's provided in the update request.

## User Experience
- **Navigation**: "New" buttons on list pages redirect to form pages. "Edit" buttons on list items redirect to edit pages.
- **Feedback**: Loading states during submission, success/error toast notifications.
- **Safety**: Custom modal prevents accidental deletions.

## Verification Plan
- **Manual Testing**: Create, edit, and delete one of each entity. Verify variable value is encrypted in DB and decrypted in UI.
- **Automated Testing**: Add basic React Testing Library checks for form submission if time permits.
