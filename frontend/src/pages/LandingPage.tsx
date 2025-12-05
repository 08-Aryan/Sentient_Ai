import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, BarChart2, Shield, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-sky-500/30">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <MessageSquare size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Sentient AI
                    </span>
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Log In
                    </Link>
                    <Link to="/register" className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                    Now with Real-time Sentiment Analysis
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
                    Chat with Context.<br />
                    Understand the Mood.
                </h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
                    Experience a chatbot that doesn't just read your messages—it understands the emotion behind them.
                    Powered by advanced sentiment analysis to deliver empathetic and context-aware responses.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-sky-600/20">
                        Get Started Free
                        <ArrowRight size={18} />
                    </Link>
                    <Link to="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white border border-gray-800 rounded-xl font-medium transition-all">
                        Live Demo
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
                    <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mb-4">
                            <MessageSquare className="text-sky-400" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Context Aware</h3>
                        <p className="text-gray-400">Maintains conversation history to provide relevant and coherent responses throughout your chat.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                            <BarChart2 className="text-purple-400" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Sentiment Tracking</h3>
                        <p className="text-gray-400">Visualizes the emotional tone of your conversation with real-time charts and analytics.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                            <Shield className="text-emerald-400" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                        <p className="text-gray-400">Your conversations are private. We use secure authentication and do not share your data.</p>
                    </div>
                </div>
            </main>

            <footer className="border-t border-gray-900 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Sentient AI. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
