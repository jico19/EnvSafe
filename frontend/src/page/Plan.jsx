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
