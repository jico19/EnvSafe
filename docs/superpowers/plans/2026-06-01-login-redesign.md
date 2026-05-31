# Login Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the login page to a "Security Console" aesthetic with grid backgrounds, glass effects, and red accents.

**Architecture:** Update global CSS for reusable utility patterns and refactor the `Login.jsx` page component to apply these styles while preserving existing form logic.

**Tech Stack:** React 19, Tailwind CSS v4, Geist Mono font.

---

### Task 1: Update Global CSS with Security Utilities

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Add grid pattern and glassmorphism utilities**

```css
@layer utilities {
  .bg-grid-zinc {
    background-image: radial-gradient(circle, var(--color-zinc-800) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  
  .glass-card {
    @apply bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)];
  }
}
```

- [ ] **Step 2: Verify CSS builds without errors**

Run: `npm run build` (in frontend dir)
Expected: Success

- [ ] **Step 3: Commit**

```bash
git add frontend/src/index.css
git commit -m "style: add security console utility classes"
```

---

### Task 2: Refactor Login Page Component

**Files:**
- Modify: `frontend/src/page/login.jsx`

- [ ] **Step 1: Apply new layout and component styles**

```javascript
// ... existing imports

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();

    const onSubmit = async (data) => {
        try {
            await login(data);
        } catch (error) {
            console.error(error);
            alert('Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 bg-grid-zinc flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mb-8 relative z-10">
                <div className="flex items-center gap-2">
                    <span className="text-red-500 font-mono font-bold text-xl tracking-tighter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">ENV</span>
                    <span className="text-zinc-100 font-mono font-bold text-xl tracking-tighter">SAFE</span>
                    <span className="text-zinc-700 font-mono text-xs ml-2 border border-zinc-800 px-1.5 py-0.5 rounded">v1.0</span>
                </div>
            </div>

            <div className="w-full max-w-md glass-card rounded-lg p-8 relative z-10 overflow-hidden">
                {/* Accent line at top */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
                
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight font-mono">AUTHENTICATE</h1>
                    <p className="text-zinc-500 text-xs font-mono mt-1">SECURE ACCESS GATEWAY // LOGIN_REQUIRED</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em]">User_Identity</label>
                        <input 
                            className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 text-sm font-mono px-4 py-3 rounded-md placeholder:text-zinc-700 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                            placeholder="OPERATOR_ID"
                            {...register('username', { required: 'Identity required' })} 
                        />
                        {errors.username && <span className="text-red-500 text-[10px] font-mono leading-none block">{errors.username.message}</span>}
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em]">Access_Key</label>
                        <input 
                            type="password" 
                            className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 text-sm font-mono px-4 py-3 rounded-md placeholder:text-zinc-700 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                            placeholder="••••••••"
                            {...register('password', { required: 'Key required' })} 
                        />
                        {errors.password && <span className="text-red-500 text-[10px] font-mono leading-none block">{errors.password.message}</span>}
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold tracking-widest px-4 py-4 rounded-md transition-all mt-4 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-[0.98] uppercase"
                    >
                        Execute_Login
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                        No Credentials? <Link to="/register" className="text-red-500 hover:text-red-400 transition-colors">Request_Access</Link>
                    </p>
                </div>
            </div>
            
            <div className="mt-8 flex gap-4 text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                <span>Status: Optimal</span>
                <span>System: Encrypted</span>
            </div>
        </div>
    );
};

// ... export
```

- [ ] **Step 2: Commit changes**

```bash
git add frontend/src/page/login.jsx
git commit -m "feat(ui): redesign login page with security console aesthetic"
```
