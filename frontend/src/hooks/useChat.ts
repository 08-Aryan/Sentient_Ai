import { useState, useCallback, useEffect, useRef } from 'react';
import { Message, ConversationStats } from '../types';
import { analyzeSentiment, generateBotReply } from '../services/services';
import { api } from '../services/api';
import { calculateConversationStats } from '../utils/analytics';
// import { detectIntent, CAPABILITY_RESPONSE, GENERIC_FAREWELLS } from '../utils/responseTemplates'; -- REMOVED
import { detectIntent, CAPABILITY_RESPONSE, GENERIC_FAREWELLS, TemplateLibrary } from '../utils/chatUtils';

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
    const [limits, setLimits] = useState<{ daily_sessions: number, session_messages: number } | null>(null);
    const [templates, setTemplates] = useState<TemplateLibrary | null>(null);

    // Fetch config and templates on mount
    useEffect(() => {
        const fetchConfigAndTemplates = async () => {
            try {
                const config = await api.getConfig();
                setLimits(config.limits);

                const tmpls = await api.getTemplates();
                setTemplates(tmpls);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            }
        };
        fetchConfigAndTemplates();
    }, []);

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
            let currentSessionId = sessionId;

            // Start session if not exists
            if (!currentSessionId) {
                try {
                    const startData = await api.startChat();
                    currentSessionId = startData.session_id;
                    setSessionId(currentSessionId);
                } catch (err: any) {
                    console.error("Session start error:", err);
                    setBotStatus('idle');
                    if (err.message === 'Authentication required') {
                        alert("Please log in to start a chat.");
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
            // We use 'currentSessionId!' because we returned if it failed above
            await api.sendMessage(currentSessionId!, 'user', text, sentiment);

            const updatedMessagesForStats = [...messages, { ...userMsg, sentiment }];
            const newStats = calculateConversationStats(updatedMessagesForStats);

            setBotStatus('typing');

            // --- BOT REPLY GENERATION ---
            // Construct history for the AI service if needed (Gemini style)
            const geminiHistory = updatedMessagesForStats.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const botReplyText = await generateBotReply(
                text,
                geminiHistory,
                newStats.averageScore,
                sentiment,
                templates
            );

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                text: botReplyText,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, botMsg]);

            // Save Bot Message
            await api.sendMessage(currentSessionId!, 'bot', botReplyText);

        } catch (error: any) {
            console.error("Interaction failed", error);
            // Rollback optimistic update
            setMessages(prev => prev.filter(msg => msg.id !== tempId));

            if (error.message === 'Daily limit reached') {
                const limit = limits?.daily_sessions || 20; // Fallback only if fetch failed
                alert(`You have reached your daily limit of ${limit} sessions.`);
            } else if (error.message === 'Session message limit reached') {
                const limit = limits?.session_messages || 250;
                alert(`You have reached the message limit of ${limit} for this session.`);
            } else {
                alert("Failed to send message. Please try again.");
            }
            setBotStatus('idle');
        } finally {
            setBotStatus('idle');
        }
    }, [botStatus, messages, onEndChat, sessionId, limits]);

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
