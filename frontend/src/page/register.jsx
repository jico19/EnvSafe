import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerUser } = useAuth();

    const onSubmit = async (data) => {
        try {
            await registerUser(data);
            alert('Registration successful. You can now login.');
        } catch (error) {
            console.error(error);
            alert('Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 bg-grid-zinc flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mb-8 relative z-10">
                <div className="flex items-center gap-2">
                    <span className="text-red-500 font-mono font-bold text-xl tracking-tighter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">ENV</span>
                    <span className="text-zinc-100 font-mono font-bold text-xl tracking-tighter">SAFE</span>
                    <span className="text-zinc-700 font-mono text-xs ml-2 border border-zinc-800 px-1.5 py-0.5 rounded">v1.0</span>
                </div>
            </div>

            <div className="w-full max-w-md glass-card rounded-lg p-8 relative z-10 overflow-hidden">
                {/* Accent line at top */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
                
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight font-mono uppercase">Request Access</h1>
                    <p className="text-zinc-500 text-xs font-mono mt-1">INITIALIZE OPERATOR PROTOCOL // REGISTER_NEW</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em]">New_Identity</label>
                        <input 
                            id="username"
                            className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 text-sm font-mono px-4 py-3 rounded-md placeholder:text-zinc-700 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                            placeholder="OPERATOR_NAME"
                            {...register('username', { required: 'Identity required' })} 
                        />
                        {errors.username && <span className="text-red-500 text-[10px] font-mono leading-none block">{errors.username.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em]">Comm_Link</label>
                        <input 
                            id="email"
                            type="email"
                            className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 text-sm font-mono px-4 py-3 rounded-md placeholder:text-zinc-700 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                            placeholder="OPERATOR@ENVSAFE.DEV"
                            {...register('email', { required: 'Comm link required' })} 
                        />
                        {errors.email && <span className="text-red-500 text-[10px] font-mono leading-none block">{errors.email.message}</span>}
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em]">New_Access_Key</label>
                        <input 
                            id="password"
                            type="password" 
                            className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 text-sm font-mono px-4 py-3 rounded-md placeholder:text-zinc-700 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                            placeholder="••••••••"
                            {...register('password', { required: 'Key required' })} 
                        />
                        {errors.password && <span className="text-red-500 text-[10px] font-mono leading-none block">{errors.password.message}</span>}
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold tracking-widest px-4 py-4 rounded-md transition-all mt-4 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-[0.98] uppercase"
                    >
                        Initialize_Access
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                        Existing Operator? <Link to="/login" className="text-red-500 hover:text-red-400 transition-colors">Authenticate_Link</Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 flex gap-4 text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                <span>Status: Ready</span>
                <span>System: Awaiting_Data</span>
            </div>
        </div>
    );
};

export default Register;
