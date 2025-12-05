import { useState, useCallback } from 'react';
import { Message, ConversationStats } from '../types';
import { analyzeSentiment, generateBotReply } from '../services/services';
import { calculateConversationStats } from '../utils/analytics';
import { detectIntent, CAPABILITY_RESPONSE, GENERIC_FAREWELLS } from '../utils/responseTemplates';

const INITIAL_MESSAGE: Message = {
    id: 'init',
    role: 'bot',
    text: "Hello! I am ready to chat. I analyze your sentiment in real-time to adjust my responses.",
    timestamp: Date.now()
};

export const useChat = (onEndChat: () => void) => {
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [botStatus, setBotStatus] = useState<'idle' | 'analyzing' | 'typing'>('idle');
    const [sessionId, setSessionId] = useState<string | null>(null);

    const handleSendMessage = useCallback(async (text: string, remainingSessions: number | null) => {
        if (!text.trim() || botStatus !== 'idle') return;

        // 1. Optimistic UI Update
        const tempId = Date.now().toString();
        const userMsg: Message = {
            id: tempId,
            role: 'user',
            text: text,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, userMsg]);

        const intent = detectIntent(text);

        // --- Intent: EXIT ---
        if (intent === 'EXIT') {
            setBotStatus('typing');
            setTimeout(() => {
                const farewellMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'bot',
                    text: GENERIC_FAREWELLS[Math.floor(Math.random() * GENERIC_FAREWELLS.length)],
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, farewellMsg]);
                setBotStatus('idle');
                setTimeout(onEndChat, 1500);
            }, 800);
            return;
        }

        // --- Intent: HELP ---
        if (intent === 'HELP') {
            setBotStatus('typing');
            setTimeout(() => {
                const helpMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'bot',
                    text: CAPABILITY_RESPONSE,
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, helpMsg]);
                setBotStatus('idle');
            }, 800);
            return;
        }

        // --- Intent: CHAT ---
        setBotStatus('analyzing');
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            let currentSessionId = sessionId;

            // Start session if not exists
            if (!currentSessionId) {
                try {
                    const startRes = await fetch(`${API_URL}/chat/start`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include'
                    });

                    if (!startRes.ok) {
                        if (startRes.status === 403) throw new Error('Daily limit reached');
                        if (startRes.status === 401) throw new Error('Authentication required');
                        throw new Error(`Failed to start session: ${startRes.status}`);
                    }
                    const startData = await startRes.json();
                    currentSessionId = startData.session_id;
                    setSessionId(currentSessionId);
                } catch (err: any) {
                    console.error("Session start error:", err);
                    setBotStatus('idle');
                    if (err.message === 'Authentication required') {
                        alert("Please log in to start a chat.");
                        // Optional: Redirect to login or show login modal
                    } else {
                        alert(err.message || "Failed to start a new chat session. Please try again.");
                    }
                    return; // Stop execution if session start fails
                }
            }

            const sentiment = await analyzeSentiment(text);

            setMessages(prev => prev.map(msg =>
                msg.id === tempId ? { ...msg, sentiment } : msg
            ));

            // Save User Message
            await fetch(`${API_URL}/chat/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    session_id: currentSessionId,
                    role: 'user',
                    content: text,
                    sentiment: sentiment
                })
            });

            const updatedMessagesForStats = [...messages, { ...userMsg, sentiment }];
            const newStats = calculateConversationStats(updatedMessagesForStats);

            setBotStatus('typing');

            const geminiHistory = updatedMessagesForStats.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const botReplyText = await generateBotReply(
                text,
                geminiHistory,
                newStats.averageScore,
                sentiment
            );

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                text: botReplyText,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, botMsg]);

            // Save Bot Message
            await fetch(`${API_URL}/chat/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    session_id: currentSessionId,
                    role: 'bot',
                    content: botReplyText
                })
            });

        } catch (error: any) {
            console.error("Interaction failed", error);
            if (error.message === 'Daily limit reached') {
                alert("You have reached your daily limit of 20 sessions.");
            } else if (error.message === 'Session message limit reached') { // Backend might return this
                alert("You have reached the message limit for this session.");
            }
            setBotStatus('idle');
        } finally {
            setBotStatus('idle');
        }
    }, [botStatus, messages, onEndChat, sessionId]);

    const restartChat = () => {
        setMessages([INITIAL_MESSAGE]);
        setSessionId(null);
    };

    const loadMessages = (msgs: Message[], sessId: string) => {
        setMessages(msgs);
        setSessionId(sessId);
    };

    return { messages, botStatus, handleSendMessage, restartChat, loadMessages, sessionId };
};
