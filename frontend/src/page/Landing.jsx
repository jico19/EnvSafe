import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-400 font-sans selection:bg-red-500/30 selection:text-red-200">
            {/* Nav */}
            <nav className="h-20 border-b border-zinc-900 flex items-center justify-between px-8 max-w-7xl mx-auto sticky top-0 bg-zinc-950/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-2">
                    <span className="text-red-500 font-mono font-bold text-2xl tracking-tighter">ENV</span>
                    <span className="text-zinc-100 font-mono font-bold text-2xl tracking-tighter">SAFE</span>
                </div>
                <div className="flex items-center gap-8">
                    <Link to="/docs" className="text-sm font-medium hover:text-zinc-100 transition-colors">Documentation</Link>
                    <Link to="/login" className="text-sm font-medium hover:text-zinc-100 transition-colors">Sign In</Link>
                    <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-red-900/20">
                        Get Started Free
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-24 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            Now with Production Grade Encryption
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold text-zinc-100 tracking-tighter leading-[1.1] mb-8">
                            Secure your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">environment</span> variables.
                        </h1>
                        <p className="text-xl text-zinc-500 leading-relaxed mb-10 max-w-xl">
                            The modern standard for secret management. Encrypt, version, and share your application secrets with granular role-based access.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link to="/register" className="bg-zinc-100 hover:bg-white text-zinc-950 font-bold px-8 py-4 rounded-full transition-all text-lg shadow-xl">
                                Start Building
                            </Link>
                            <Link to="/docs" className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold px-8 py-4 rounded-full transition-all text-lg">
                                View Docs
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Background Glows */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[100px]"></div>
            </header>

            {/* Feature Grid */}
            <section className="py-24 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-zinc-100">Symmetric Encryption</h3>
                            <p className="text-zinc-500 leading-relaxed">All values are encrypted using Fernet (AES-128) before they ever touch our database.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-zinc-100">Granular RBAC</h3>
                            <p className="text-zinc-500 leading-relaxed">Control exactly who can view, copy, or edit variables with specific project roles.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-zinc-100">Audit Trail</h3>
                            <p className="text-zinc-500 leading-relaxed">Never wonder who changed what. A complete history of every interaction is logged.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-24 bg-zinc-900/30">
                <div className="max-w-7xl mx-auto px-8 text-center mb-16">
                    <h2 className="text-4xl font-bold text-zinc-100 tracking-tight mb-4">Simple, transparent pricing.</h2>
                    <p className="text-zinc-500">Scale your secret management as your team grows.</p>
                </div>
                <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-10 text-left">
                        <h3 className="text-xl font-bold text-zinc-100 mb-2">Free</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-zinc-100">$0</span>
                            <span className="text-zinc-500 text-sm">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-sm text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                2 Projects
                            </li>
                            <li className="flex items-center gap-3 text-sm text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                3 Members per project
                            </li>
                            <li className="flex items-center gap-3 text-sm text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Dev environment only
                            </li>
                            <li className="flex items-center gap-3 text-sm text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                7 Days audit logs
                            </li>
                        </ul>
                        <Link to="/register" className="block w-full text-center py-3 rounded-xl border border-zinc-800 text-zinc-300 font-bold hover:bg-zinc-900 transition-all">
                            Get Started
                        </Link>
                    </div>

                    <div className="bg-zinc-950 border-2 border-red-500/50 rounded-3xl p-10 text-left relative overflow-hidden ring-4 ring-red-500/5">
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest rounded-bl-xl">Popular</div>
                        <h3 className="text-xl font-bold text-zinc-100 mb-2">Premium</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-zinc-100">$10</span>
                            <span className="text-zinc-500 text-sm">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-sm text-zinc-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Unlimited Projects
                            </li>
                            <li className="flex items-center gap-3 text-sm text-zinc-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Unlimited Members
                            </li>
                            <li className="flex items-center gap-3 text-sm text-zinc-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Staging & Production Envs
                            </li>
                            <li className="flex items-center gap-3 text-sm text-zinc-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                90 Days audit logs
                            </li>
                            <li className="flex items-center gap-3 text-sm text-zinc-100 font-bold underline decoration-red-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Granular RBAC Permissions
                            </li>
                        </ul>
                        <Link to="/register" className="block w-full text-center py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-900/40">
                            Upgrade Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-zinc-900 text-center">
                <p className="text-sm text-zinc-600">© 2026 EnvSafe Security Inc. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
