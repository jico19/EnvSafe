# Frontend CRUD & Security Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete CRUD operations for Organizations, Projects, and EnvVariables, and fix backend update encryption.

**Architecture:** Use shared form components for Create/Edit modes, React Query for mutations, and a custom deletion modal.

**Tech Stack:** React, Tailwind CSS (Zinc theme), TanStack React Query, Django REST Framework.

---

### Task 1: Backend Security Fix (Update Encryption)

**Files:**
- Modify: `backend/apps/core/viewsets.py`

- [ ] **Step 1: Implement `perform_update` in `EnvVariableViewSets`**

```python
    def perform_update(self, serializer):
        if 'value' in self.request.data:
            encrypted_value = _encrypt_var(self.request.data['value'])
            serializer.save(value=encrypted_value)
        else:
            serializer.save()
```

- [ ] **Step 2: Verify with manual DB check or temporary print**
- [ ] **Step 3: Commit**

```bash
git add backend/apps/core/viewsets.py
git commit -m "fix(backend): encrypt variable value on update"
```

### Task 2: Custom Delete Confirmation Modal

**Files:**
- Create: `frontend/src/components/DeleteModal.jsx`

- [ ] **Step 1: Create `DeleteModal` component**

```jsx
import React from 'react';

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-md max-w-sm w-full shadow-xl">
                <h2 className="text-zinc-100 text-lg font-semibold mb-2">Delete {itemName}?</h2>
                <p className="text-zinc-400 text-sm mb-6">This action cannot be undone. All associated data will be lost.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-md">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/DeleteModal.jsx
git commit -m "feat(ui): add DeleteModal component"
```

### Task 3: Organization CRUD (Create/Edit/Delete)

**Files:**
- Create: `frontend/src/page/OrganizationForm.jsx`
- Modify: `frontend/src/page/organizations.jsx`
- Modify: `frontend/src/App.jsx`

- [ ] **Step 1: Create `OrganizationForm.jsx`**
- [ ] **Step 2: Add routes to `App.jsx`**
- [ ] **Step 3: Update `organizations.jsx` list with Edit/Delete buttons and `DeleteModal`**
- [ ] **Step 4: Commit**

```bash
git add frontend/src/App.jsx frontend/src/page/OrganizationForm.jsx frontend/src/page/organizations.jsx
git commit -m "feat(org): implement organization CRUD"
```

### Task 4: Project CRUD (Create/Edit/Delete)

**Files:**
- Create: `frontend/src/page/ProjectForm.jsx`
- Modify: `frontend/src/page/projects.jsx`
- Modify: `frontend/src/App.jsx`

- [ ] **Step 1: Create `ProjectForm.jsx`**
- [ ] **Step 2: Add routes to `App.jsx`**
- [ ] **Step 3: Update `projects.jsx` list with Edit/Delete buttons and `DeleteModal`**
- [ ] **Step 4: Commit**

```bash
git add frontend/src/App.jsx frontend/src/page/ProjectForm.jsx frontend/src/page/projects.jsx
git commit -m "feat(project): implement project CRUD"
```

### Task 5: Project Variables View & CRUD

**Files:**
- Create: `frontend/src/page/ProjectVariables.jsx`
- Create: `frontend/src/page/VariableForm.jsx`
- Modify: `frontend/src/App.jsx`

- [ ] **Step 1: Create `ProjectVariables.jsx` (List variables for a specific project)**
- [ ] **Step 2: Create `VariableForm.jsx` (Create/Edit variables)**
- [ ] **Step 3: Add routes to `App.jsx`**
- [ ] **Step 4: Commit**

```bash
git add frontend/src/App.jsx frontend/src/page/ProjectVariables.jsx frontend/src/page/VariableForm.jsx
git commit -m "feat(vars): implement environment variable CRUD"
```
