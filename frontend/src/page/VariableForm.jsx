import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

const VariableForm = () => {
    const { id: projectId, varId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = Boolean(varId);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            key: '',
            value: '',
        }
    });

    const { data: variable } = useQuery({
        queryKey: ['variable', varId],
        queryFn: async () => {
            const response = await api.get(`/env-variable/${varId}/`);
            return response.data;
        },
        enabled: isEdit,
    });

    useEffect(() => {
        if (variable) {
            setValue('key', variable.key);
            setValue('value', variable.decrypted_value);
        }
    }, [variable, setValue]);

    const mutation = useMutation({
        mutationFn: async (data) => {
            const payload = {
                ...data,
                project: projectId,
            };
            if (isEdit) {
                return api.put(`/env-variable/${varId}/`, payload);
            } else {
                return api.post('/env-variable/', payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variables', projectId] });
            navigate(`/projects/${projectId}/variables`);
        },
        onError: (error) => {
            console.error('Operation failed:', error);
            alert('Failed to save variable.');
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <main className="max-w-2xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <button 
                        onClick={() => navigate(`/projects/${projectId}/variables`)}
                        className="text-sm text-zinc-500 hover:text-zinc-100 mb-4 flex items-center gap-2 transition-colors"
                    >
                        ← Back to Variables
                    </button>
                    <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">
                        {isEdit ? 'Edit Variable' : 'Create Variable'}
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        {isEdit ? 'Update your environment variable.' : 'Add a new environment variable to your project.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 border border-zinc-800 rounded-md p-8 shadow-sm">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="key" className="block text-sm font-medium text-zinc-300 mb-2">
                                Key
                            </label>
                            <input
                                id="key"
                                type="text"
                                {...register('key', { required: 'Key is required' })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                placeholder="DATABASE_URL"
                            />
                            {errors.key && (
                                <p className="mt-2 text-xs text-red-500">{errors.key.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="value" className="block text-sm font-medium text-zinc-300 mb-2">
                                Value
                            </label>
                            <textarea
                                id="value"
                                rows={4}
                                {...register('value', { required: 'Value is required' })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                placeholder="postgres://user:password@localhost:5432/db"
                            />
                            {errors.value && (
                                <p className="mt-2 text-xs text-red-500">{errors.value.message}</p>
                            )}
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/projects/${projectId}/variables`)}
                                className="px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white text-sm font-medium px-8 py-2.5 rounded-md transition-colors shadow-lg shadow-red-900/20"
                            >
                                {mutation.isPending ? 'Saving...' : isEdit ? 'Update Variable' : 'Create Variable'}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
    );
};

export default VariableForm;
