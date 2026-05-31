import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import DeleteModal from '../components/DeleteModal';

const Organizations = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [organizationToDelete, setOrganizationToDelete] = useState(null);

    const { data: organizations, isLoading, error } = useQuery({
        queryKey: ['organizations'],
        queryFn: async () => {
            const response = await api.get('/organization/');
            return response.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/organization/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
            setIsDeleteModalOpen(false);
            setOrganizationToDelete(null);
        },
        onError: (error) => {
            console.error('Delete failed:', error);
            alert('Failed to delete organization.');
        }
    });

    const handleDeleteClick = (org) => {
        setOrganizationToDelete(org);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (organizationToDelete) {
            deleteMutation.mutate(organizationToDelete.id);
        }
    };

    return (
        <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Organizations</h1>
                        <p className="text-sm text-zinc-500 mt-1">Manage organization settings and member access.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/organizations/new')}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                    >
                        Create Organization
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-zinc-600 font-mono text-sm animate-pulse">loading organizations...</div>
                    </div>
                ) : error ? (
                    <div className="bg-red-950/20 border border-red-900 rounded-md p-4 flex items-center gap-3 text-red-400 text-sm">
                        <span className="font-bold">Error:</span> Failed to load organizations. Please try again later.
                    </div>
                ) : organizations?.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-md">
                        <p className="text-zinc-600 text-sm font-mono">no organizations found.</p>
                        <p className="text-zinc-700 text-xs mt-1">create your first organization to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {organizations?.map(org => (
                            <div key={org.id} className="bg-zinc-900 border border-zinc-800 rounded-md p-6 flex items-center justify-between hover:border-zinc-700 transition-colors">
                                <div>
                                    <h3 className="text-lg font-medium text-zinc-100 mb-1">{org.name}</h3>
                                    <p className="text-sm text-zinc-400 max-w-xl">{org.description || 'No description provided.'}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => navigate(`/organizations/edit/${org.id}`)}
                                        className="bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 text-sm font-medium px-3 py-1.5 rounded-md border border-zinc-700 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClick(org)}
                                        className="bg-transparent hover:bg-red-900/20 text-red-500/70 hover:text-red-500 text-sm font-medium px-3 py-1.5 rounded-md border border-zinc-700 hover:border-red-900/50 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            <DeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={organizationToDelete?.name}
            />
        </main>
    );
};

export default Organizations;
