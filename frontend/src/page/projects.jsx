import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import DeleteModal from '../components/DeleteModal';
import { useAuth } from '../context/AuthContext';


const Projects = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [deleteId, setDeleteId] = useState(null);
    const { user } = useAuth();

    const { data: projects, isLoading, error } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const response = await api.get('/projects/');
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

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/projects/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setDeleteId(null);
        }
    });

    const getRole = (project) => {
        if (project.organization_owner === user?.id) return 'OWNER';
        const membership = projectMemberships?.find(m => m.project === project.id && m.user === user?.id);
        return membership?.role || 'VIEWER';
    };

    const canManage = (project) => {
        const role = getRole(project);
        return role === 'OWNER' || role === 'ADMIN';
    };

    const canEditVariables = (project) => {
        const role = getRole(project);
        return role === 'OWNER' || role === 'ADMIN' || role === 'DEVELOPER';
    };

    return (
        <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Projects</h1>
                        <p className="text-sm text-zinc-500 mt-1">Access and manage project environment variables.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/projects/new')}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                    >
                        New Project
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-zinc-600 font-mono text-sm animate-pulse">loading projects...</div>
                    </div>
                ) : error ? (
                    <div className="bg-red-950/20 border border-red-900 rounded-md p-4 flex items-center gap-3 text-red-400 text-sm">
                        <span className="font-bold">Error:</span> Failed to load projects.
                    </div>
                ) : projects?.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-md">
                        <p className="text-zinc-600 text-sm font-mono">no projects found.</p>
                        <p className="text-zinc-700 text-xs mt-1">create your first project to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects?.map(project => (
                            <div key={project.id} className="group bg-zinc-900 border border-zinc-800 rounded-md p-6 hover:border-zinc-700 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-zinc-100 group-hover:text-red-500 transition-colors">{project.name}</h3>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter font-bold">Role: {getRole(project)}</span>
                                    </div>
                                    <span className="text-[10px] font-mono bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-900 uppercase">
                                        {project.environment}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-zinc-500 uppercase tracking-widest">Organization</span>
                                        <span className="text-zinc-300 font-mono">ID: {project.organization}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 pt-2">
                                        {canManage(project) ? (
                                            <>
                                                <button 
                                                    onClick={() => navigate(`/projects/edit/${project.id}`)}
                                                    className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs py-1.5 rounded transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => setDeleteId(project.id)}
                                                    className="flex-1 text-center bg-zinc-800 hover:bg-red-900/30 text-white hover:text-red-400 text-xs py-1.5 rounded transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex-1 text-center text-zinc-600 text-[10px] uppercase py-1.5 border border-dashed border-zinc-800 rounded">
                                                Read Only Access
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-4">
                                        <Link 
                                            to={`/projects/${project.id}/members`}
                                            className="text-zinc-500 hover:text-zinc-100 text-xs font-medium transition-colors"
                                        >
                                            Members
                                        </Link>
                                        <Link 
                                            to={`/projects/${project.id}/variables`}
                                            className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
                                        >
                                            Variables →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <DeleteModal 
                    isOpen={!!deleteId}
                    onClose={() => setDeleteId(null)}
                    onConfirm={() => deleteMutation.mutate(deleteId)}
                    itemName="Project"
                />
            </main>
    );
};

export default Projects;

