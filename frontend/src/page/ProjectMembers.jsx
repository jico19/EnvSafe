import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import DeleteModal from '../components/DeleteModal';
import { useAuth } from '../context/AuthContext';

const ProjectMembers = () => {
    const { id: projectId } = useParams();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [newMember, setNewMember] = useState({ username: '', role: 'VIEWER' });

    const { data: project } = useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const response = await api.get(`/projects/${projectId}/`);
            return response.data;
        }
    });

    const { data: members, isLoading } = useQuery({
        queryKey: ['project-members', projectId],
        queryFn: async () => {
            const response = await api.get(`/project-members/?project=${projectId}`);
            return response.data;
        }
    });

    const getMyRole = () => {
        if (!project) return 'VIEWER';
        if (project.organization_owner === user?.id) return 'OWNER';
        const membership = members?.find(m => m.user === user?.id);
        return membership?.role || 'VIEWER';
    };

    const canManage = () => {
        const role = getMyRole();
        return role === 'OWNER' || role === 'ADMIN';
    };

    const addMemberMutation = useMutation({
        mutationFn: async (data) => {
            return api.post('/project-members/', {
                project: projectId,
                username: data.username,
                role: data.role
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
            setNewMember({ username: '', role: 'VIEWER' });
        },
        onError: (error) => {
            alert(error.response?.data?.error || 'Failed to add member.');
        }
    });

    const updateRoleMutation = useMutation({
        mutationFn: async ({ memberId, role }) => {
            return api.patch(`/project-members/${memberId}/`, { role });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
        }
    });

    const deleteMemberMutation = useMutation({
        mutationFn: async (memberId) => {
            return api.delete(`/project-members/${memberId}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
        }
    });

    const handleAddMember = (e) => {
        e.preventDefault();
        addMemberMutation.mutate(newMember);
    };

    return (
        <main className="max-w-6xl mx-auto px-6 py-8">
            <div className="mb-8">
                <Link to="/projects" className="text-sm text-zinc-500 hover:text-zinc-100 mb-4 inline-flex items-center gap-2 transition-colors">
                    ← Back to Projects
                </Link>
                <div className="flex items-center justify-between mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
                            {project?.name || 'Loading...'} <span className="text-zinc-500 font-normal">Members</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-zinc-500">Manage project access.</p>
                            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 uppercase font-bold">Your Role: {getMyRole()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Member Form */}
                <div className="lg:col-span-1">
                    {canManage() ? (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-md p-6 sticky top-24">
                            <h3 className="text-zinc-100 font-medium mb-4 text-sm">Add New Member</h3>
                            <form onSubmit={handleAddMember} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1.5">Username</label>
                                    <input 
                                        type="text"
                                        value={newMember.username}
                                        onChange={(e) => setNewMember({ ...newMember, username: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-red-500 transition-colors"
                                        placeholder="johndoe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1.5">Role</label>
                                    <select 
                                        value={newMember.role}
                                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-red-500 transition-colors"
                                    >
                                        <option value="DEVELOPER">Developer</option>
                                        <option value="VIEWER">Viewer</option>
                                    </select>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={addMemberMutation.isPending}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded transition-colors shadow-lg shadow-red-900/20 disabled:opacity-50"
                                >
                                    {addMemberMutation.isPending ? 'Adding...' : 'Add to Project'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-zinc-900/30 border border-zinc-800 border-dashed rounded-md p-8 text-center">
                            <p className="text-xs text-zinc-600 uppercase font-bold tracking-widest">Management Locked</p>
                            <p className="text-[10px] text-zinc-700 mt-1">Only Owners and Admins can manage members.</p>
                        </div>
                    )}
                </div>

                {/* Member List */}
                <div className="lg:col-span-2">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-widest font-bold">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {isLoading ? (
                                    <tr><td colSpan="3" className="px-6 py-8 text-center text-zinc-600 animate-pulse">Loading members...</td></tr>
                                ) : members?.map(member => (
                                    <tr key={member.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                                    {member.username?.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-zinc-200 font-medium">{member.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {canManage() ? (
                                                <select 
                                                    value={member.role}
                                                    onChange={(e) => updateRoleMutation.mutate({ memberId: member.id, role: e.target.value })}
                                                    className="bg-transparent text-zinc-400 text-xs border-none focus:ring-0 cursor-pointer hover:text-zinc-100 transition-colors"
                                                >
                                                    <option value="DEVELOPER">Developer</option>
                                                    <option value="VIEWER">Viewer</option>
                                                </select>
                                            ) : (
                                                <span className="text-zinc-500 text-xs uppercase font-bold tracking-tighter">{member.role}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {canManage() && member.user !== user?.id ? (
                                                <button 
                                                    onClick={() => { setMemberToDelete(member); setIsDeleteModalOpen(true); }}
                                                    className="text-zinc-600 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-tighter"
                                                >
                                                    Remove
                                                </button>
                                            ) : (
                                                <span className="text-zinc-800 text-[10px] uppercase font-bold">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <DeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => deleteMemberMutation.mutate(memberToDelete.id)}
                itemName={`member ${memberToDelete?.username}`}
            />
        </main>
    );
};

export default ProjectMembers;
