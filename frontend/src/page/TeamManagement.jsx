import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Link } from 'react-router-dom';


const TeamManagement = () => {
    // Fetch all memberships across all projects in the organization
    const { data: memberships, isLoading } = useQuery({
        queryKey: ['org-team-memberships'],
        queryFn: async () => {
            const response = await api.get('/project-members/');
            return response.data;
        }
    });

    // Group memberships by user to show a unique list of people
    const users = memberships?.reduce((acc, current) => {
        const existingUser = acc.find(u => u.username === current.username);
        if (existingUser) {
            existingUser.projects.push({ name: current.project_name, role: current.role });
        } else {
            acc.push({
                id: current.user,
                username: current.username,
                projects: [{ name: current.project_name, role: current.role }]
            });
        }
        return acc;
    }, []) || [];

    return (
        <main className="max-w-6xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Team Management</h1>
                <p className="text-sm text-zinc-500 mt-1">Overview of all members across your organization's projects.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-widest font-bold">
                        <tr>
                            <th className="px-6 py-4">Member</th>
                            <th className="px-6 py-4">Active Projects</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {isLoading ? (
                            <tr><td colSpan="3" className="px-6 py-8 text-center text-zinc-600 animate-pulse">Loading team...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="3" className="px-6 py-12 text-center text-zinc-600">No members found besides yourself.</td></tr>
                        ) : users.map(member => (
                            <tr key={member.id} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-md bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                                            {member.username?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-200 font-medium">{member.username}</span>
                                            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">Verified Member</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {member.projects.map((p, idx) => (
                                            <span key={idx} className="bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded text-[10px] text-zinc-400">
                                                {p.name} <span className="text-zinc-600">({p.role})</span>
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
                                        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                        Active
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 p-6 bg-zinc-900/50 border border-zinc-800 border-dashed rounded-md text-center">
                <p className="text-sm text-zinc-500 mb-4">Need to add someone new?</p>
                <Link to="/projects" className="text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest">
                    Manage project memberships →
                </Link>
            </div>
        </main>
    );
};

export default TeamManagement;
