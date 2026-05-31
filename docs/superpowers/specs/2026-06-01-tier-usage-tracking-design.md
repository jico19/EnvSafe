# Spec: Subscription Tier & Usage Tracking

## Overview
Implement a centralized system to track and display organization-level usage limits and benefits, specifically focusing on helping Free Tier users understand their current consumption and what is available in the Premium Tier.

## Goals
- Provide a clear "Usage" API endpoint on the backend.
- Create a dedicated "Plan" page on the frontend with bold usage counters.
- Centralize limit definitions to ensure consistency between enforcement and reporting.

## Architecture

### 1. Backend: Usage API
The `OrganizationViewSet` will be extended with a `@action(detail=True, methods=['get'])` called `usage`.

#### Limit Configuration
Centralize limits in `backend/apps/core/viewsets.py` (or a separate constants file):
```python
TIER_CONFIG = {
    'FREE': {
        'max_projects': 2,
        'max_members_per_project': 3,
        'allowed_envs': ['DEV'],
        'rbac_masking': False
    },
    'PREMIUM': {
        'max_projects': float('inf'),
        'max_members_per_project': float('inf'),
        'allowed_envs': ['DEV', 'STAGING', 'PRODUCTION'],
        'rbac_masking': True
    }
}
```

#### Response Structure
```json
{
  "tier": "FREE",
  "projects": {
    "used": 1,
    "limit": 2,
    "remaining": 1
  },
  "members_limit": 3,
  "environments": {
    "allowed": ["DEV"],
    "restricted": ["STAGING", "PRODUCTION"]
  },
  "features": {
    "rbac_masking": false,
    "audit_logs": true
  }
}
```

### 2. Frontend: Plan Page
A new page `frontend/src/page/Plan.jsx` will be created.

#### UI Components
- **Current Plan Header**: Displays "Free Tier" or "Premium Tier".
- **Usage Counters**: 
    - Large, bold text (e.g., **1 / 2** Projects).
    - Color-coded (Red when at limit, Zinc when below).
- **Environment Matrix**: Shows which environments are accessible.
- **Feature Comparison**: A table or list comparing Free vs. Premium.
- **Action Button**: "Upgrade to Premium" (or "Switch to Free" for testing).

### 3. Navigation & Layout
- **Sidebar**: Add a "Plan" navigation link.
- **Sidebar Widget**: Keep the small plan indicator but make it link to the new Plan page.

## Testing Strategy

### Backend
- Unit test for the `usage` endpoint ensuring correct counts for an org with 0, 1, and 2 projects.
- Verify the endpoint returns correct limits based on the organization's tier.

### Frontend
- Verify the Plan page correctly displays data from the usage API.
- Verify that the "Upgrade" button triggers the `toggle_tier` action and refreshes the usage data.
