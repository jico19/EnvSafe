import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

const OrganizationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = Boolean(id);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
        }
    });

    const { data: organization } = useQuery({
        queryKey: ['organization', id],
        queryFn: async () => {
            const response = await api.get(`/organization/${id}/`);
            return response.data;
        },
        enabled: isEdit,
    });

    useEffect(() => {
        if (organization) {
            setValue('name', organization.name);
        }
    }, [organization, setValue]);

    const mutation = useMutation({
        mutationFn: async (data) => {
            if (isEdit) {
                return api.put(`/organization/${id}/`, data);
            } else {
                return api.post('/organization/', data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
            navigate('/organizations');
        },
        onError: (error) => {
            console.error('Operation failed:', error);
            alert('Failed to save organization. Make sure you don\'t already own an organization.');
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <main className="max-w-2xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <button 
                        onClick={() => navigate('/organizations')}
                        className="text-sm text-zinc-500 hover:text-zinc-100 mb-4 flex items-center gap-2 transition-colors"
                    >
                        ← Back to Organizations
                    </button>
                    <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">
                        {isEdit ? 'Edit Organization' : 'Create Organization'}
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        {isEdit ? 'Update your organization details.' : 'Set up a new organization to manage your projects.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 border border-zinc-800 rounded-md p-8 shadow-sm">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                                Organization Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register('name', { required: 'Name is required' })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                placeholder="Acme Corp"
                            />
                            {errors.name && (
                                <p className="mt-2 text-xs text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/organizations')}
                                className="px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white text-sm font-medium px-8 py-2.5 rounded-md transition-colors shadow-lg shadow-red-900/20"
                            >
                                {mutation.isPending ? 'Saving...' : isEdit ? 'Update Organization' : 'Create Organization'}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
    );
};

export default OrganizationForm;
