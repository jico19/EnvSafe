import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import DeleteModal from '../components/DeleteModal';
import { useAuth } from '../context/AuthContext';

const ProjectVariables = () => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showValues, setShowValues] = useState({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [variableToDelete, setVariableToDelete] = useState(null);
    const { user } = useAuth();

    const { data: project } = useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const response = await api.get(`/projects/${projectId}/`);
            return response.data;
        }
    });

    const { data: projectMemberships } = useQuery({
        queryKey: ['project-memberships'],
        queryFn: async () => {
            const response = await api.get('/project-members/');
            return response.data;
        }
    });

    const getRole = () => {
        if (!project) return 'VIEWER';
        if (project.organization_owner === user?.id) return 'OWNER';
        const membership = projectMemberships?.find(m => m.project === parseInt(projectId) && m.user === user?.id);
        return membership?.role || 'VIEWER';
    };

    const canManage = () => {
        const role = getRole();
        return role === 'OWNER' || role === 'ADMIN' || role === 'DEVELOPER';
    };

    const { data: variables, isLoading, error } = useQuery({
        queryKey: ['variables', projectId],
        queryFn: async () => {
            const response = await api.get(`/env-variable/?project=${projectId}`);
            return response.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (varId) => {
            return api.delete(`/env-variable/${varId}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variables', projectId] });
            setIsDeleteModalOpen(false);
            setVariableToDelete(null);
        }
    });

    const toggleValue = (id) => {
        setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDeleteClick = (variable) => {
        setVariableToDelete(variable);
        setIsDeleteModalOpen(true);
    };

    const { data: projectLogs } = useQuery({
        queryKey: ['project-logs', projectId],
        queryFn: async () => {
            const response = await api.get(`/audit-log/?project=${projectId}`);
            return response.data.slice(0, 10);
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
        <main className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <div className="mb-6">
                        <Link 
                            to="/projects"
                            className="text-sm text-zinc-500 hover:text-zinc-100 mb-4 inline-flex items-center gap-2 transition-colors"
                        >
                            ← Back to Projects
                        </Link>
                        <div className="flex items-center justify-between mt-2">
                            <div>
                                <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
                                    {project?.name || 'Loading...'} <span className="text-zinc-500 font-normal">Variables</span>
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-sm text-zinc-500">Manage environment variables.</p>
                                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 uppercase font-bold">Role: {getRole()}</span>
                                </div>
                            </div>
                            {canManage() && (
                                <Link 
                                    to={`/projects/${projectId}/variables/new`}
                                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                                >
                                    New Variable
                                </Link>
                            )}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-zinc-600 font-mono text-sm animate-pulse">loading variables...</div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-950/20 border border-red-900 rounded-md p-4 flex items-center gap-3 text-red-400 text-sm">
                            <span className="font-bold">Error:</span> Failed to load variables.
                        </div>
                    ) : variables?.length === 0 ? (
                        <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-md">
                            <p className="text-zinc-600 text-sm font-mono">no variables found.</p>
                            <p className="text-zinc-700 text-xs mt-1">add your first environment variable to this project.</p>
                        </div>
                    ) : (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-widest font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Key</th>
                                        <th className="px-6 py-4">Value</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {variables.map(v => (
                                        <tr key={v.id} className="hover:bg-zinc-800/50 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-zinc-200">{v.key}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <code className="bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-xs text-zinc-400 min-w-[120px]">
                                                        {showValues[v.id] ? v.decrypted_value : '••••••••••••••••'}
                                                    </code>
                                                    <button 
                                                        onClick={() => toggleValue(v.id)}
                                                        className="text-[10px] text-zinc-500 hover:text-red-500 uppercase font-bold tracking-tighter transition-colors"
                                                    >
                                                        {showValues[v.id] ? 'Hide' : 'Show'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-4">
                                                    {canManage() ? (
                                                        <>
                                                            <Link 
                                                                to={`/projects/${projectId}/variables/edit/${v.id}`}
                                                                className="text-zinc-500 hover:text-zinc-100 transition-colors"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDeleteClick(v)}
                                                                className="text-zinc-500 hover:text-red-500 transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-zinc-700 text-[10px] uppercase font-bold tracking-widest">Locked</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Project Activity Feed */}
                <div className="lg:col-span-1">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-md p-6 h-fit">
                        <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-widest mb-6">Project Activity</h3>
                        <div className="space-y-6">
                            {projectLogs && projectLogs.length > 0 ? projectLogs.map(log => (
                                <div key={log.id} className="relative pl-4 border-l border-zinc-800">
                                    <span className={`absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full ${getActionColor(log.action)}`}></span>
                                    <p className="text-[11px] text-zinc-300 font-mono leading-none mb-1">{log.variable_key}</p>
                                    <p className="text-[10px] text-zinc-500 leading-tight">
                                        {log.action.toLowerCase()} by {log.username}
                                    </p>
                                    <p className="text-[9px] text-zinc-600 mt-1 uppercase font-bold tracking-tighter">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            )) : (
                                <p className="text-[10px] text-zinc-600 font-mono">No recent activity.</p>
                            )}
                        </div>
                        {projectLogs && projectLogs.length >= 10 && (
                            <Link to="/audit-logs" className="block mt-8 text-center text-[10px] text-zinc-500 hover:text-red-500 uppercase font-bold tracking-widest transition-colors">
                                View full history →
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <DeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => deleteMutation.mutate(variableToDelete.id)}
                itemName={variableToDelete?.key}
            />
        </main>
    );
};

export default ProjectVariables;
