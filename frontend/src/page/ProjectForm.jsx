import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

const ProjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        organization: '',
        environment: 'DEV'
    });

    const [errorMsg, setErrorMsg] = useState('');

    const { data: organizations } = useQuery({
        queryKey: ['organizations'],
        queryFn: async () => {
            const response = await api.get('/organization/');
            return response.data;
        }
    });

    const selectedOrgId = formData.organization;
    const selectedOrg = organizations?.find(o => o.id === parseInt(selectedOrgId));
    const isFreeTier = selectedOrg?.tier === 'FREE';

    const { data: usage } = useQuery({
        queryKey: ['usage', selectedOrgId],
        queryFn: async () => {
            const response = await api.get(`/organization/${selectedOrgId}/usage/`);
            return response.data;
        },
        enabled: !!selectedOrgId && !isEdit
    });

    const isAtLimit = usage?.projects?.remaining === 0;

    const { data: project, isLoading: isLoadingProject } = useQuery({
        queryKey: ['project', id],
        queryFn: async () => {
            const response = await api.get(`/projects/${id}/`);
            return response.data;
        },
        enabled: isEdit
    });

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name,
                organization: project.organization,
                environment: project.environment
            });
        }
    }, [project]);

    const mutation = useMutation({
        mutationFn: async (data) => {
            setErrorMsg('');
            if (isEdit) {
                return await api.put(`/projects/${id}/`, data);
            }
            return await api.post('/projects/', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            navigate('/projects');
        },
        onError: (err) => {
            const data = err.response?.data;
            if (typeof data === 'string') {
                setErrorMsg(data);
            } else if (data?.detail) {
                setErrorMsg(data.detail);
            } else if (Array.isArray(data)) {
                setErrorMsg(data[0]);
            } else if (data && typeof data === 'object') {
                // Handle field errors or non_field_errors
                const firstError = Object.values(data)[0];
                setErrorMsg(Array.isArray(firstError) ? firstError[0] : JSON.stringify(data));
            } else {
                setErrorMsg('An error occurred while saving the project.');
            }
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isAtLimit && !isEdit) {
            setErrorMsg(`You have reached the project limit for ${selectedOrg.name}.`);
            return;
        }
        mutation.mutate(formData);
    };

    if (isEdit && isLoadingProject) return <div className="text-zinc-500 p-8">Loading...</div>;

    return (
        <main className="max-w-2xl mx-auto px-6 py-12">
                <h1 className="text-2xl font-semibold text-zinc-100 mb-8">
                    {isEdit ? 'Edit Project' : 'New Project'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-8 rounded-md border border-zinc-800">
                    {errorMsg && (
                        <div className="bg-red-950/30 border border-red-900/50 rounded-md p-4 text-red-400 text-sm mb-6">
                            <span className="font-bold">Error:</span> {errorMsg}
                        </div>
                    )}

                    {isAtLimit && !isEdit && (
                        <div className="bg-amber-950/20 border border-amber-900/50 rounded-md p-4 text-amber-500 text-sm mb-6 flex flex-col gap-2">
                            <p><span className="font-bold uppercase tracking-tighter mr-2">Limit Warning:</span> This organization has reached its project limit ({usage.projects.limit}).</p>
                            <p className="text-xs opacity-80">Delete an existing project or upgrade to Premium to create more.</p>
                            <button 
                                type="button"
                                onClick={() => navigate('/plan')}
                                className="mt-2 text-zinc-100 bg-amber-900/40 hover:bg-amber-800/60 px-3 py-1.5 rounded text-xs font-medium w-fit transition-colors"
                            >
                                View Plan & Upgrade
                            </button>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Project Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2 text-zinc-100 focus:outline-none focus:border-red-500 transition-colors"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Organization</label>
                        <select
                            required
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2 text-zinc-100 focus:outline-none focus:border-red-500 transition-colors"
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        >
                            <option value="">Select Organization</option>
                            {organizations?.map(org => (
                                <option key={org.id} value={org.id}>{org.name} ({org.tier})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Environment</label>
                        <select
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2 text-zinc-100 focus:outline-none focus:border-red-500 transition-colors"
                            value={formData.environment}
                            onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                        >
                            <option value="DEV">Development (Free)</option>
                            <option value="STAGING" disabled={isFreeTier}>Staging {isFreeTier ? '— Premium Only' : ''}</option>
                            <option value="PRODUCTION" disabled={isFreeTier}>Production {isFreeTier ? '— Premium Only' : ''}</option>
                        </select>
                        {isFreeTier && (
                            <p className="mt-2 text-xs text-zinc-500">
                                <span className="text-amber-500 font-bold">Premium:</span> Upgrade to unlock Staging and Production environments.
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/projects')}
                            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending || (isAtLimit && !isEdit)}
                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2 rounded-md transition-colors"
                        >
                            {mutation.isPending ? 'Saving...' : 'Save Project'}
                        </button>
                    </div>
                </form>
            </main>
    );
};

export default ProjectForm;
