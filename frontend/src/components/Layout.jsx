import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

const Layout = ({ children }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const { data: organizations } = useQuery({
        queryKey: ['my-organizations'],
        queryFn: async () => {
            const response = await api.get('/organization/');
            return response.data;
        }
    });

    const myOrg = organizations?.[0];

    const upgradeMutation = useMutation({
        mutationFn: async () => {
            return api.post(`/organization/${myOrg.id}/toggle_tier/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-organizations'] });
        }
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
    };

    const getUserInitials = () => {
        if (!user || !user.username) return '??';
        return user.username.substring(0, 2).toUpperCase();
    };

    const NavLink = ({ to, label, icon }) => (
        <Link 
            to={to} 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all group ${
                isActive(to) 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
        >
            <span className="font-medium text-sm">{label}</span>
        </Link>
    );

    return (
        <div className="min-h-screen bg-zinc-950 bg-grid-zinc text-zinc-400 font-sans antialiased flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-900 flex flex-col fixed inset-y-0 left-0 bg-zinc-950/80 backdrop-blur-xl z-20">
                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 border-b border-zinc-900/50 mb-6">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <span className="text-red-500 font-mono font-bold text-xl tracking-tighter drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]">ENV</span>
                        <span className="text-zinc-100 font-mono font-bold text-xl tracking-tighter">SAFE</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1">
                    <NavLink to="/dashboard" label="Overview" />
                    <NavLink to="/organizations" label="Organizations" />
                    <NavLink to="/team" label="Team" />
                    <NavLink to="/projects" label="Projects" />
                    <NavLink to="/audit-logs" label="Audit Logs" />
                    <NavLink to="/plan" label="Plan" />
                </nav>

                {/* Bottom Section: Tier & User */}
                <div className="p-4 space-y-4">
                    {myOrg && (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">Operator_Tier</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${myOrg.tier === 'PREMIUM' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                                    {myOrg.tier}
                                </span>
                            </div>
                            <Link 
                                to="/plan"
                                className="w-full block text-center text-[10px] font-mono text-zinc-400 hover:text-red-500 font-bold uppercase transition-colors"
                            >
                                {myOrg.tier === 'FREE' ? '// UPGRADE_ACCESS' : '// MANAGE_PROTOCOL'}
                            </Link>
                        </div>
                    )}

                    <div className="pt-4 border-t border-zinc-900/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 text-[10px] font-mono uppercase font-bold">
                                {getUserInitials()}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-mono font-medium text-zinc-200 truncate max-w-[100px]">{user?.username}</span>
                                <button 
                                    onClick={handleLogout}
                                    className="text-[10px] font-mono text-zinc-600 hover:text-red-500 font-bold uppercase text-left transition-colors"
                                >
                                    Terminate_Session
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-64 min-h-screen relative">
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-transparent opacity-50 pointer-events-none h-64" />
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
