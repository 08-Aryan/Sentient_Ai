import React, { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import ChatMessage from '../ChatMessage';
import { Message } from '../../types';

interface ChatAreaProps {
    messages: Message[];
    botStatus: 'idle' | 'analyzing' | 'typing';
    suggestions: string[];
    onSuggestionClick: (text: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, botStatus, suggestions, onSuggestionClick }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, botStatus]);

    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide relative bg-black/20">
            <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-end">
                <div className="pb-4">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}

                    {botStatus !== 'idle' && (
                        <div className="flex w-full mb-6 justify-start animate-message-in">
                            <div className="flex items-center gap-3 bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                                <Bot size={18} className="text-sky-500 animate-pulse" />
                                {botStatus === 'analyzing' ? (
                                    <span className="text-sm text-gray-400 font-medium">Analyzing sentiment layers...</span>
                                ) : (
                                    <div className="flex gap-1.5 px-1">
                                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {messages.length === 1 && botStatus === 'idle' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 animate-message-in">
                        {suggestions.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSuggestionClick(suggestion)}
                                className="text-left p-4 bg-gray-900/40 hover:bg-gray-900 border border-gray-800/50 hover:border-sky-500/30 rounded-xl transition-all group"
                            >
                                <span className="text-sm text-gray-400 group-hover:text-sky-400 transition-colors">"{suggestion}"</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ChatArea;
