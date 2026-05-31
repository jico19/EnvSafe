# Spec: Centralize Tier Configuration

## Problem
Tier limits (project counts, environment restrictions, member counts) are currently hardcoded within `ProjectViewSets` and `ProjectMemberViewSets`. This makes it difficult to maintain, update, or reuse these limits (e.g., for a usage/billing dashboard).

## Proposed Changes

### 1. New Constants Module
Create `backend/apps/core/constants.py` to hold all tier-related configurations and choices. This prevents circular imports between `models.py` and `viewsets.py`.

### 2. Move Choices
Move `TierChoices` and `EnvChoices` from `models.py` to `constants.py`.

### 3. Centralized Configuration
Define `TIER_CONFIG` in `constants.py`:
```python
TIER_CONFIG = {
    'FREE': {
        'max_projects': 2,
        'max_members_per_project': 3,
        'allowed_envs': ['DEV'],
        'rbac_masking': False
    },
    'PREMIUM': {
        'max_projects': 1000,
        'max_members_per_project': 1000,
        'allowed_envs': ['DEV', 'STAGING', 'PRODUCTION'],
        'rbac_masking': True
    }
}
```

### 4. Refactor Models
Update `backend/apps/core/models.py` to import `TierChoices` and `EnvChoices` from `constants.py`.

### 5. Refactor ViewSets
Update `backend/apps/core/viewsets.py`:
- Import `TIER_CONFIG`.
- Update `ProjectViewSets.perform_create` and `perform_update` to use `TIER_CONFIG`.
- Update `ProjectMemberViewSets.create` to use `TIER_CONFIG`.

## Testing Strategy
- Create `backend/apps/core/tests/test_tier_limits.py`.
- Test `FREE` tier project limit (2).
- Test `FREE` tier environment restriction (only `DEV`).
- Test `FREE` tier member limit (3 per project).
- Test `PREMIUM` tier allows more projects, all environments, and more members.
- Verify that exceeding `PREMIUM` limits (e.g., 1001 projects) also triggers validation errors (new behavior).
