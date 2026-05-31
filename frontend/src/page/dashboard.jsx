import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

const Dashboard = () => {
    const { data: logs } = useQuery({
        queryKey: ['audit-logs-summary'],
        queryFn: async () => {
            const response = await api.get('/audit-log/');
            // Return only top 5 recent logs
            return response.data.slice(0, 5);
        }
    });

    const getActionColor = (action) => {
        switch (action) {
            case 'ADDED': return 'bg-emerald-500';
            case 'EDITED': return 'bg-amber-500';
            case 'DELETED': return 'bg-red-500';
            case 'VIEWED': return 'bg-blue-500';
            default: return 'bg-zinc-500';
        }
    };

    return (
        <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Overview</h1>
                    <Link to="/organizations/new" className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
                        New Organization
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/organizations" className="group block bg-zinc-900 border border-zinc-800 rounded-md p-6 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-zinc-100 group-hover:text-red-500 transition-colors">Organizations</h2>
                            <span className="text-xs font-mono bg-zinc-800 text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded">
                                manage
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm mb-4">Manage your organizations, teams, and member permissions.</p>
                        <div className="flex items-center text-red-500 text-sm font-medium">
                            Explore organizations →
                        </div>
                    </Link>

                    <Link to="/projects" className="group block bg-zinc-900 border border-zinc-800 rounded-md p-6 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-zinc-100 group-hover:text-red-500 transition-colors">Projects</h2>
                            <span className="text-xs font-mono bg-zinc-800 text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded">
                                secure
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm mb-4">Access and configure environment variables for all your projects.</p>
                        <div className="flex items-center text-red-500 text-sm font-medium">
                            View all projects →
                        </div>
                    </Link>
                </div>

                {/* Recent Activity Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-medium text-zinc-300 uppercase tracking-widest">Recent Activity</h2>
                        <Link to="/audit-logs" className="text-xs text-red-500 hover:text-red-400 font-medium">View all</Link>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-md divide-y divide-zinc-800">
                        {logs && logs.length > 0 ? logs.map(log => (
                            <div key={log.id} className="p-4 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${getActionColor(log.action)}`}></span>
                                    <span className="text-zinc-100 font-mono">{log.variable_key}</span>
                                    <span className="text-zinc-500">{log.action.toLowerCase()} by {log.username || 'system'}</span>
                                </div>
                                <span className="text-zinc-600 font-mono text-xs">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-zinc-600 font-mono text-xs">
                                no recent activity.
                            </div>
                        )}
                    </div>
                </div>
            </main>
    );
};

export default Dashboard;
