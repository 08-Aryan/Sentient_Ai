import React, { useEffect, useState } from 'react';
import { MessageSquare, Plus, LogOut, ChevronLeft, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Session {
    id: number;
    created_at: string;
    updated_at: string;
    title: string | null;
    overall_mood: string;
    total_messages: number;
    summary_data: string;
}

interface SidebarProps {
    onNewChat: () => void;
    onSelectSession: (session: any) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    currentSessionId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, onSelectSession, isOpen, setIsOpen, currentSessionId }) => {
    const { logout } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                const res = await fetch(`${API_URL}/chat/history`, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setSessions(data);
                }
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        };
        if (isOpen || currentSessionId) {
            fetchHistory();
        }
    }, [isOpen, currentSessionId]);

    // Group sessions by date
    const groupedSessions = sessions.reduce((acc, session) => {
        const date = new Date(session.created_at).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(session);
        return acc;
    }, {} as Record<string, Session[]>);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-950 border-r border-gray-800 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                        <button
                            onClick={onNewChat}
                            className="flex-1 flex items-center gap-2 px-4 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-colors shadow-lg shadow-sky-600/20"
                        >
                            <Plus size={18} />
                            <span className="font-medium">New Chat</span>
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="md:hidden p-2 text-gray-400 hover:text-white"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>

                    {/* History List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {Object.entries(groupedSessions).map(([date, dateSessions]: [string, Session[]]) => (
                            <div key={date}>
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Calendar size={12} />
                                    {date}
                                </h3>
                                <div className="space-y-2">
                                    {dateSessions.map((session) => (
                                        <button
                                            key={session.id}
                                            onClick={() => onSelectSession(session)}
                                            className="w-full text-left p-3 rounded-lg hover:bg-gray-900 transition-colors group"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-300 group-hover:text-white truncate">
                                                    {session.title || `Session #${session.id}`}
                                                </span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${session.overall_mood === 'Positive' ? 'bg-sky-500/10 text-sky-400' :
                                                    session.overall_mood === 'Negative' ? 'bg-red-500/10 text-red-400' :
                                                        'bg-gray-500/10 text-gray-400'
                                                    }`}>
                                                    {session.overall_mood}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">
                                                {session.total_messages} messages
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {sessions.length === 0 && (
                            <div className="text-center text-gray-500 text-sm py-8">
                                No history yet
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-800">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="font-medium">Log Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
