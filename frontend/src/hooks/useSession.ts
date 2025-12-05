import { useState, useEffect, useCallback } from 'react';
import { ConversationStats } from '../types';
import { useAuth } from '../context/AuthContext';

export const useSession = () => {
    const { user } = useAuth();
    const [remainingSessions, setRemainingSessions] = useState<number | null>(null);

    const fetchLimit = useCallback(async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const res = await fetch(`${API_URL}/chat/check-limit`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setRemainingSessions(data.remaining);
            }
        } catch (error) {
            console.error("Failed to fetch limit", error);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchLimit();
        }
    }, [user, fetchLimit]);

    const saveSession = async (stats: ConversationStats, messages: any[]) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            await fetch(`${API_URL}/chat/end`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    totalMessages: stats.totalMessages,
                    averageScore: stats.averageScore,
                    overallMood: stats.overallMoodLabel,
                    trend: stats.trend,
                    messages: messages
                })
            });
            fetchLimit();
        } catch (error) {
            console.error("Failed to save session", error);
        }
    };

    return { remainingSessions, fetchLimit, saveSession };
};
