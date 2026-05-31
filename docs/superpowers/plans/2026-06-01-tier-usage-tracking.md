# Tier Usage Tracking & Plan Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a Backend Usage API and a Frontend Plan Page to show Free Tier users their current usage and remaining benefits.

**Architecture:** Centralize tier limits in the backend, expose them via a new `usage` endpoint on `OrganizationViewSet`, and display them in a new `Plan` page with bold counters.

**Tech Stack:** Django REST Framework, React 19, TanStack React Query.

---

### Task 1: Centralize Tier Configuration

**Files:**
- Modify: `backend/apps/core/models.py`
- Modify: `backend/apps/core/viewsets.py`

- [x] **Step 1: Move TierChoices if needed and define TIER_CONFIG**
Move logic into a central location in `viewsets.py` for now (or a new `constants.py` if preferred).

```python
# backend/apps/core/viewsets.py

TIER_CONFIG = {
    'FREE': {
        'max_projects': 2,
        'max_members_per_project': 3,
        'allowed_envs': ['DEV'],
        'rbac_masking': False
    },
    'PREMIUM': {
        'max_projects': 1000, # Practical infinity
        'max_members_per_project': 1000,
        'allowed_envs': ['DEV', 'STAGING', 'PRODUCTION'],
        'rbac_masking': True
    }
}
```

- [x] **Step 2: Refactor ProjectViewSets to use TIER_CONFIG**
Update `perform_create` and `perform_update`.

```python
# backend/apps/core/viewsets.py

    def perform_create(self, serializer):
        org = serializer.validated_data['organization']
        env = serializer.validated_data.get('environment')
        config = TIER_CONFIG.get(org.tier, TIER_CONFIG['FREE'])

        if models.Project.objects.filter(organization=org).count() >= config['max_projects']:
            raise serializers.ValidationError(f"{org.tier} tier limit reached: {config['max_projects']} projects max.")
        
        if env not in config['allowed_envs']:
            raise serializers.ValidationError(f"{org.tier} tier only supports {', '.join(config['allowed_envs'])}.")

        instance = serializer.save()
        # ... rest of method
```

- [x] **Step 3: Refactor ProjectMemberViewSets to use TIER_CONFIG**
Update `create` method.

```python
# backend/apps/core/viewsets.py (ProjectMemberViewSets)

            # Check tier limits
            config = TIER_CONFIG.get(project.organization.tier, TIER_CONFIG['FREE'])
            if models.ProjectMember.objects.filter(project=project).count() >= config['max_members_per_project']:
                return response.Response({"error": f"{project.organization.tier} tier limit reached: {config['max_members_per_project']} members max."}, status=status.HTTP_400_BAD_REQUEST)
```

- [x] **Step 4: Commit**
```bash
git add backend/apps/core/viewsets.py
git commit -m "refactor: centralize tier limits in TIER_CONFIG"
```

---

### Task 2: Implement Usage API Endpoint

**Files:**
- Modify: `backend/apps/core/viewsets.py`

- [x] **Step 1: Add `usage` action to `OrganizationViewSets`**

```python
# backend/apps/core/viewsets.py (OrganizationViewSets)

    @action(detail=True, methods=['get'])
    def usage(self, request, pk=None):
        org = self.get_object()
        config = TIER_CONFIG.get(org.tier, TIER_CONFIG['FREE'])
        
        project_count = models.Project.objects.filter(organization=org).count()
        # For simplicity, we'll show member usage across the organization or per project
        # Let's show the max members used in any one project vs the limit
        max_members_in_any_project = 0
        projects = models.Project.objects.filter(organization=org)
        for p in projects:
            m_count = models.ProjectMember.objects.filter(project=p).count()
            if m_count > max_members_in_any_project:
                max_members_in_any_project = m_count

        return response.Response({
            "tier": org.tier,
            "projects": {
                "used": project_count,
                "limit": config['max_projects'],
                "remaining": max(0, config['max_projects'] - project_count)
            },
            "members_per_project": {
                "used": max_members_in_any_project,
                "limit": config['max_members_per_project'],
                "remaining": max(0, config['max_members_per_project'] - max_members_in_any_project)
            },
            "environments": {
                "allowed": config['allowed_envs'],
                "restricted": [e[0] for e in models.Project.EnvChoices.choices if e[0] not in config['allowed_envs']]
            },
            "features": {
                "rbac_masking": config['rbac_masking'],
                "audit_logs": True
            }
        })
```

- [x] **Step 2: Verify with Manual Test (or curl)**
Run: `python manage.py runserver` (if possible) or just verify code syntax.

- [x] **Step 3: Commit**
```bash
git add backend/apps/core/viewsets.py
git commit -m "feat: add usage endpoint to OrganizationViewSet"
```

---

### Task 3: Create Plan Page Component

**Files:**
- Create: `frontend/src/page/Plan.jsx`

- [x] **Step 1: Implement Plan Page UI**

```jsx
// frontend/src/page/Plan.jsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

const Plan = () => {
    const queryClient = useQueryClient();

    const { data: orgs } = useQuery({
        queryKey: ['my-organizations'],
        queryFn: async () => (await api.get('/organization/')).data
    });

    const myOrg = orgs?.[0];

    const { data: usage, isLoading } = useQuery({
        queryKey: ['org-usage', myOrg?.id],
        queryFn: async () => (await api.get(`/organization/${myOrg.id}/usage/`)).data,
        enabled: !!myOrg
    });

    const upgradeMutation = useMutation({
        mutationFn: async () => api.post(`/organization/${myOrg.id}/toggle_tier/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-organizations'] });
            queryClient.invalidateQueries({ queryKey: ['org-usage'] });
        }
    });

    if (isLoading || !usage) return <div className="p-8 text-zinc-500 font-mono text-xs">loading usage data...</div>;

    const UsageCard = ({ title, used, limit, label }) => (
        <div className="bg-zinc-900 border border-zinc-800 rounded-md p-6">
            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold font-mono ${used >= limit ? 'text-red-500' : 'text-zinc-100'}`}>{used}</span>
                <span className="text-zinc-600 text-lg font-mono">/ {limit === 1000 ? '∞' : limit}</span>
            </div>
            <p className="text-zinc-500 text-sm mt-2">{label}</p>
        </div>
    );

    return (
        <main className="max-w-4xl mx-auto px-6 py-12">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-zinc-100 mb-2">Subscription & Usage</h1>
                <p className="text-zinc-400">Manage your plan and track your organization's limits.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <UsageCard 
                    title="Projects" 
                    used={usage.projects.used} 
                    limit={usage.projects.limit} 
                    label="Active projects in your organization."
                />
                <UsageCard 
                    title="Members" 
                    used={usage.members_per_project.used} 
                    limit={usage.members_per_project.limit} 
                    label="Maximum members in any single project."
                />
            </div>

            <section className="bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden mb-12">
                <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
                    <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Environment Access</h2>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['DEV', 'STAGING', 'PRODUCTION'].map(env => {
                        const isAllowed = usage.environments.allowed.includes(env);
                        return (
                            <div key={env} className={`flex items-center justify-between p-3 rounded border ${isAllowed ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' : 'border-zinc-800 bg-zinc-950 text-zinc-600'}`}>
                                <span className="font-mono font-bold text-sm">{env}</span>
                                {isAllowed ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <div className="flex items-center justify-between p-8 bg-red-600/10 border border-red-500/20 rounded-md">
                <div>
                    <h3 className="text-zinc-100 font-bold mb-1">
                        {usage.tier === 'FREE' ? 'Upgrade to Premium' : 'Manage Subscription'}
                    </h3>
                    <p className="text-zinc-400 text-sm">
                        {usage.tier === 'FREE' ? 'Get unlimited projects, members, and all environments.' : 'You are currently on the Premium plan.'}
                    </p>
                </div>
                <button 
                    onClick={() => upgradeMutation.mutate()}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors"
                >
                    {usage.tier === 'FREE' ? 'Upgrade' : 'Switch to Free'}
                </button>
            </div>
        </main>
    );
};

export default Plan;
```

- [x] **Step 2: Commit**
```bash
git add frontend/src/page/Plan.jsx
git commit -m "feat: create Plan page component with usage counters"
```

---

### Task 4: Integration & Routing

**Files:**
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/components/Layout.jsx`

- [x] **Step 1: Add Route in App.jsx**

```jsx
// frontend/src/App.jsx
import Plan from './page/Plan'; // import

// ... in routes
<Route path="/plan" element={<Layout><Plan /></Layout>} />
```

- [x] **Step 2: Update Sidebar in Layout.jsx**

```jsx
// frontend/src/components/Layout.jsx

// In NavLinks section
<NavLink to="/plan" label="Plan" />

// In Bottom Section (TierIndicator) - change the button to a Link
<Link 
    to="/plan"
    className="w-full block text-center text-[11px] text-zinc-100 hover:text-red-500 font-bold uppercase transition-colors"
>
    {myOrg.tier === 'FREE' ? 'Upgrade to Premium' : 'Manage Plan'}
</Link>
```

- [x] **Step 3: Commit**
```bash
git add frontend/src/App.jsx frontend/src/components/Layout.jsx
git commit -m "feat: add Plan route and update sidebar navigation"
```
