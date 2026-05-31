# Project CRUD Design

## Architecture
Implementing Create, Read, Update, and Delete for Projects in the EnvSafe frontend.

## Components
### ProjectForm
- Path: `frontend/src/page/ProjectForm.jsx`
- Responsibilities:
  - Handle project creation and editing.
  - Form fields: Name (text), Organization (select), Environment (select: DEV, STAGING, PRODUCTION).
  - Fetch organization list for selection.
  - Submit data to `/projects/` (POST) or `/projects/:id/` (PUT).

### Projects List Enhancement
- Path: `frontend/src/page/projects.jsx`
- Enhancements:
  - Navigation to `ProjectForm`.
  - Edit button per project card.
  - Delete button per project card with confirmation modal.
  - Integration of `DeleteModal`.

## Data Flow
1. User interacts with UI in `projects.jsx`.
2. Navigation to `ProjectForm` with or without `id`.
3. `ProjectForm` fetches necessary data (organizations, project details if editing).
4. On submit, `useMutation` sends request to backend.
5. On success, cache is invalidated and user is redirected.
6. For deletion, `DeleteModal` confirms action before triggering `DELETE` request.

## Testing Strategy
- Manual verification of form validation.
- Verification of API payloads for create/update/delete.
- Confirmation of state updates (React Query cache invalidation).
