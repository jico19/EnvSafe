# EnvSafe - Environment Variable Management System

## Project Overview
EnvSafe is a full-stack application designed to securely manage and store environment variables. It features encrypted storage, organization-level access control, and audit logging for security transparency.

### Architecture
- **Frontend**: React application built with Vite, using Axios for API calls and TanStack React Query for state management.
- **Backend**: Django REST Framework (DRF) project managing data persistence, encryption logic, and authentication.
- **Security**: 
  - JWT (JSON Web Token) for stateless authentication.
  - Symmetric encryption (Fernet) for environment variable values.
  - Audit logs to track views, additions, edits, and deletions.

## Technology Stack
- **Frontend**: React 19, Vite, Axios, TanStack React Query, React Hook Form.
- **Backend**: Django 6.0, Django REST Framework, SimpleJWT, Cryptography (Fernet).
- **Database**: SQLite (default configuration).

## Getting Started

### Backend Setup
1. Navigate to the `backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate # Unix/macOS
   ```
3. Install dependencies (Check `site-packages` for missing `requirements.txt`).
4. Set up environment variables in `.env`:
   - `ENCRYPTION_KEY`: A valid Fernet key.
   - `SECRET_KEY`: Django secret key.
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Development Conventions

### Backend
- **App Structure**: Core logic resides in `backend/apps/core`.
- **API Versioning**: Currently uses a flat structure via `apps.core.router`.
- **Encryption**: Always use `_encrypt_var` and `_decrypt_var` from `apps.core.utils.encryptor` when handling sensitive data.
- **Models**: Business entities include `Organization`, `Project`, `EnvVariable`, `ProjectMember`, and `AuditLog`.

### Frontend
- **Components**: Standard React functional components.
- **Data Fetching**: Use TanStack React Query hooks for fetching and mutations.
- **Styling**: Standard CSS (refer to `index.css`).

## Key Files
- `backend/apps/core/models.py`: Database schema definitions.
- `backend/apps/core/viewsets.py`: API logic and encryption integration.
- `backend/apps/core/utils/encryptor.py`: Symmetric encryption implementation.
- `frontend/src/App.jsx`: Main frontend application component.
- `frontend/package.json`: Frontend dependencies and scripts.
