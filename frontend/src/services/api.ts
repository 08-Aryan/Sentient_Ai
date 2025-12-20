import { SentimentResult } from "../types";

const API_URL = import.meta.env.VITE_API_URL || ''; // Relative path for proxy

const getHeaders = () => ({
    'Content-Type': 'application/json',
});

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        if (response.status === 403) throw new Error('Daily limit reached');
        if (response.status === 401) throw new Error('Authentication required');
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Request failed: ${response.status}`);
    }
    return response.json();
};

export const api = {
    checkLimit: async () => {
        const res = await fetch(`${API_URL}/chat/check-limit`, { credentials: 'include' });
        return handleResponse(res);
    },

    getConfig: async () => {
        const res = await fetch(`${API_URL}/config`, { credentials: 'include' });
        return handleResponse(res);
    },

    startChat: async () => {
        const res = await fetch(`${API_URL}/chat/start`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include'
        });
        return handleResponse(res);
    },

    sendMessage: async (sessionId: string, role: string, content: string, sentiment?: SentimentResult) => {
        const res = await fetch(`${API_URL}/chat/message`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify({
                session_id: sessionId,
                role,
                content,
                sentiment
            })
        });
        return handleResponse(res);
    },

    endChat: async (sessionId: string, stats: any) => {
        const res = await fetch(`${API_URL}/chat/end`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify({
                session_id: sessionId,
                ...stats
            })
        });
        return handleResponse(res);
    },

    getHistory: async () => {
        const res = await fetch(`${API_URL}/chat/history`, { credentials: 'include' });
        return handleResponse(res);
    },

    getSessionMessages: async (sessionId: string) => {
        const res = await fetch(`${API_URL}/chat/session/${sessionId}`, { credentials: 'include' });
        return handleResponse(res);
    },

    getTemplates: async () => {
        const res = await fetch(`${API_URL}/chat/templates`, { credentials: 'include' });
        return handleResponse(res);
    },

    predict: async (text: string) => {
        const res = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ text })
        });
        return handleResponse(res);
    }
};
