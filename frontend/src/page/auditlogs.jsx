import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

const AuditLogs = () => {
    const { data: logs, isLoading, error } = useQuery({
        queryKey: ['audit-logs'],
        queryFn: async () => {
            const response = await api.get('/audit-log/');
            return response.data;
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

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <main className="max-w-6xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Audit Logs</h1>
                <p className="text-sm text-zinc-500 mt-1">Track all interactions with your environment variables.</p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-zinc-600 font-mono text-sm animate-pulse">loading logs...</div>
                </div>
            ) : error ? (
                <div className="bg-red-950/20 border border-red-900 rounded-md p-4 text-red-400 text-sm">
                    Error: Failed to load audit logs.
                </div>
            ) : logs?.length === 0 ? (
                <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-md">
                    <p className="text-zinc-600 text-sm font-mono">no activity found.</p>
                </div>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-widest font-bold">
                            <tr>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Project</th>
                                <th className="px-6 py-4">Variable</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${getActionColor(log.action)}`}></span>
                                            <span className="font-mono text-xs">{log.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300 font-medium">{log.project_name || 'N/A'}</td>
                                    <td className="px-6 py-4 font-mono text-zinc-200">{log.variable_key}</td>
                                    <td className="px-6 py-4 text-zinc-400">{log.username || 'System'}</td>
                                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{formatTime(log.timestamp)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
};

export default AuditLogs;
