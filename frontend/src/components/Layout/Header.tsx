import React from 'react';
import { Sparkles, Power, LogOut } from 'lucide-react';
import { ConversationStats, SentimentLabel } from '../../types';

interface HeaderProps {
    remainingSessions: number | null;
    currentStats: ConversationStats;
    onEndChat: () => void;
    onLogout: () => void;
    onShowSummary: () => void;
}

const Header: React.FC<HeaderProps> = ({ remainingSessions, currentStats, onEndChat, onLogout, onShowSummary }) => {
    return (
        <header className="flex-shrink-0 border-b border-gray-800/50 p-4 flex justify-between items-center backdrop-blur-md bg-black/50 sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-sky-600/20">
                    <Sparkles className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="font-bold text-lg tracking-tight text-white">Sentience<span className="text-blue-500">AI</span></h1>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500 font-medium">Context-Aware Engine</p>
                        {remainingSessions !== null && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${remainingSessions > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {remainingSessions} sessions left
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-gray-900/80 rounded-full border border-gray-800/50 backdrop-blur-sm shadow-sm">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Live Mood:</span>
                    <span className={`text-sm font-bold transition-colors duration-500 ${currentStats.overallMoodLabel === SentimentLabel.POSITIVE ? 'text-sky-400' :
                        currentStats.overallMoodLabel === SentimentLabel.NEGATIVE ? 'text-red-400' :
                            'text-gray-300'
                        }`}>
                        {currentStats.overallMoodLabel}
                    </span>
                </div>

                <button
                    onClick={onEndChat}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all text-sm font-medium"
                >
                    <Power size={16} />
                    <span className="hidden sm:inline">End Chat</span>
                </button>

                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
};

export default Header;
