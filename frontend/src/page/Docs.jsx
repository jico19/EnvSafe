import React from 'react';
import { Link } from 'react-router-dom';

const Docs = () => {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-400 font-sans selection:bg-red-500/30 selection:text-red-200">
            {/* Header */}
            <header className="h-16 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-red-500 font-mono font-bold text-lg tracking-tighter">ENV</span>
                        <span className="text-zinc-100 font-mono font-bold text-lg tracking-tighter">SAFE</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-sm font-medium hover:text-zinc-100 transition-colors">Sign In</Link>
                        <Link to="/register" className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors">Register</Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-8 py-16 flex gap-16">
                {/* Sidebar Nav */}
                <aside className="w-64 hidden lg:block sticky top-32 h-fit space-y-8">
                    <div>
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Introduction</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#getting-started" className="hover:text-zinc-100 transition-colors">Getting Started</a></li>
                            <li><a href="#architecture" className="hover:text-zinc-100 transition-colors">Architecture</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Features</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#encryption" className="hover:text-zinc-100 transition-colors">Encryption</a></li>
                            <li><a href="#rbac" className="hover:text-zinc-100 transition-colors">RBAC Roles</a></li>
                            <li><a href="#audit" className="hover:text-zinc-100 transition-colors">Audit Logging</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Billing</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#tiers" className="hover:text-zinc-100 transition-colors">Subscription Tiers</a></li>
                        </ul>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 max-w-3xl">
                    <section id="getting-started" className="mb-20">
                        <h1 className="text-4xl font-bold text-zinc-100 mb-6 tracking-tight">Getting Started</h1>
                        <p className="text-lg leading-relaxed mb-6">
                            EnvSafe is a secure environment variable management system designed for teams who prioritize security and compliance. Our platform ensures that your application secrets are encrypted at rest and only accessible to authorized personnel.
                        </p>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 font-mono text-sm text-zinc-300">
                            <span className="text-zinc-500"># Start by creating an organization</span><br/>
                            1. Navigate to Organizations<br/>
                            2. Create your first Org<br/>
                            3. Add a Project (DEV/STAGING/PROD)<br/>
                            4. Start adding secrets
                        </div>
                    </section>

                    <section id="encryption" className="mb-20 pt-10 border-t border-zinc-900">
                        <h2 className="text-3xl font-bold text-zinc-100 mb-6 tracking-tight">Encryption</h2>
                        <p className="leading-relaxed mb-6">
                            We use <span className="text-zinc-100 font-medium">Fernet symmetric encryption</span>. Fernet guarantees that a message encrypted using it cannot be manipulated or read without the key. It uses 128-bit AES in CBC mode and PKCS7 padding.
                        </p>
                        <ul className="list-disc list-inside space-y-4 text-zinc-400">
                            <li>Values are encrypted in the backend <span className="italic">before</span> storage.</li>
                            <li>Decryption only happens during authorized API requests.</li>
                            <li>Access is gated by JWT tokens and role-based permissions.</li>
                        </ul>
                    </section>

                    <section id="rbac" className="mb-20 pt-10 border-t border-zinc-900">
                        <h2 className="text-3xl font-bold text-zinc-100 mb-6 tracking-tight">RBAC Roles</h2>
                        <p className="mb-8 leading-relaxed">EnvSafe Premium allows you to assign specific roles to team members at the project level.</p>
                        
                        <div className="space-y-6">
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                                <h4 className="text-zinc-100 font-bold mb-1">Owner</h4>
                                <p className="text-sm">Full administrative access. Can delete projects and manage organization billing.</p>
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                                <h4 className="text-zinc-100 font-bold mb-1">Admin</h4>
                                <p className="text-sm">Can create, edit, and delete variables. Can invite or remove team members.</p>
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                                <h4 className="text-zinc-100 font-bold mb-1">Developer</h4>
                                <p className="text-sm">Can view and copy decrypted variable values. Cannot create or delete variables.</p>
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                                <h4 className="text-zinc-100 font-bold mb-1">Viewer</h4>
                                <p className="text-sm italic">Premium Only.</p>
                                <p className="text-sm">Can see variable keys to verify configuration, but <span className="text-red-400">values are masked</span>.</p>
                            </div>
                        </div>
                    </section>

                    <section id="tiers" className="mb-20 pt-10 border-t border-zinc-900">
                        <h2 className="text-3xl font-bold text-zinc-100 mb-6 tracking-tight">Subscription Tiers</h2>
                        <div className="overflow-hidden border border-zinc-800 rounded-xl">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-zinc-900 text-zinc-100 font-bold border-b border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-4">Feature</th>
                                        <th className="px-6 py-4">Free</th>
                                        <th className="px-6 py-4">Premium</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    <tr>
                                        <td className="px-6 py-4 font-medium">Projects</td>
                                        <td className="px-6 py-4 text-zinc-500">2</td>
                                        <td className="px-6 py-4 text-zinc-100">Unlimited</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium">Environments</td>
                                        <td className="px-6 py-4 text-zinc-500">Dev Only</td>
                                        <td className="px-6 py-4 text-zinc-100">All</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium">Logs Retention</td>
                                        <td className="px-6 py-4 text-zinc-500">7 Days</td>
                                        <td className="px-6 py-4 text-zinc-100">90 Days</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium">RBAC</td>
                                        <td className="px-6 py-4 text-zinc-500">No</td>
                                        <td className="px-6 py-4 text-zinc-100">Yes</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>

            <footer className="py-12 border-t border-zinc-900 text-center">
                <p className="text-sm text-zinc-600">© 2026 EnvSafe Security Inc.</p>
            </footer>
        </div>
    );
};

export default Docs;
