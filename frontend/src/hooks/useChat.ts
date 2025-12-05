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

    const handleSendMessage = useCallback(async (text: string, remainingSessions: number | null) => {
        if (!text.trim() || botStatus !== 'idle') return;

        if (remainingSessions !== null && remainingSessions <= 0 && messages.length <= 1) {
            alert("You have reached your daily limit of 10 sessions.");
            return;
        }

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
            const sentiment = await analyzeSentiment(text);

            setMessages(prev => prev.map(msg =>
                msg.id === tempId ? { ...msg, sentiment } : msg
            ));

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

        } catch (error: any) {
            console.error("Interaction failed", error);
            if (error.message === 'Daily limit reached') {
                alert("You have reached your daily limit of 10 sessions.");
            }
            setBotStatus('idle');
        } finally {
            setBotStatus('idle');
        }
    }, [botStatus, messages, onEndChat]);

    const restartChat = () => {
        setMessages([INITIAL_MESSAGE]);
    };

    return { messages, botStatus, handleSendMessage, restartChat };
};
