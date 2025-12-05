import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

interface LoginProps {
    onRegisterClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onRegisterClick }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
                // We need to fetch the user details or just use the username returned
                // Ideally /auth/login returns user info. My backend returns {message, username}
                // But I need ID too. Let's fetch /auth/me or update backend to return ID.
                // For now, let's fetch /auth/me after login or just assume success and trigger a re-check.
                // Actually, let's just fetch /auth/me to be safe and get ID.
                const meRes = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
                if (meRes.ok) {
                    const meData = await meRes.json();
                    login(meData);
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
            <div className="w-full max-w-md bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-sky-600/20 mb-4">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to continue chatting</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-sky-600/20"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account?{' '}
                        <button onClick={onRegisterClick} className="text-sky-400 hover:text-sky-300 font-medium">
                            Create one
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
