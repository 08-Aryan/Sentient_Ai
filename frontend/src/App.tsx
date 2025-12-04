import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Send, Power, Sparkles, Bot } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import SummaryReport from './components/SummaryReport';
import { Message, ConversationStats, SentimentLabel, ChartDataPoint } from '../types';
import { analyzeSentiment, generateBotReply } from '../services/geminiService';
import { calculateConversationStats } from '../utils/analytics';
import { detectIntent, CAPABILITY_RESPONSE, GENERIC_FAREWELLS } from '../utils/responseTemplates';

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'bot',
  text: "Hello! I am ready to chat. I analyze your sentiment in real-time to adjust my responses.",
  timestamp: Date.now()
};

const SUGGESTIONS = [
  "This new update is fantastic!",
  "I am extremely frustrated.",
  "The documentation is okay.",
  "What can you do?"
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [botStatus, setBotStatus] = useState<'idle' | 'analyzing' | 'typing'>('idle');
  const [showSummary, setShowSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, botStatus]);

  // Memoize stats to avoid recalculating on every render
  const currentStats: ConversationStats = useMemo(() =>
    calculateConversationStats(messages),
    [messages]);

  // Background gradient based on mood
  const ambientGlow = useMemo(() => {
    switch (currentStats.overallMoodLabel) {
      case SentimentLabel.POSITIVE: return 'from-blue-900/20 via-gray-950 to-gray-950';
      case SentimentLabel.NEGATIVE: return 'from-red-900/20 via-gray-950 to-gray-950';
      default: return 'from-sky-900/20 via-gray-950 to-gray-950';
    }
  }, [currentStats.overallMoodLabel]);

  // Main Message Handler
  const handleSendMessage = useCallback(async (textOverride?: string) => {
    const text = textOverride || inputText;
    if (!text.trim() || botStatus !== 'idle') return;

    setInputText('');

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
        setTimeout(() => setShowSummary(true), 1500);
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
      // Step 1: Analyze Sentiment
      const sentiment = await analyzeSentiment(text);

      setMessages(prev => prev.map(msg =>
        msg.id === tempId ? { ...msg, sentiment } : msg
      ));

      // Calculate new context with this latest message included
      const updatedMessagesForStats = [...messages, { ...userMsg, sentiment }];
      const newStats = calculateConversationStats(updatedMessagesForStats);

      setBotStatus('typing');

      // Step 2: Generate Context-Aware Reply
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

    } catch (error) {
      console.error("Interaction failed", error);
      setBotStatus('idle');
    } finally {
      setBotStatus('idle');
    }
  }, [inputText, botStatus, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleRestart = () => {
    setMessages([INITIAL_MESSAGE]);
    setShowSummary(false);
  };

  // Prepare Chart Data
  const chartData: ChartDataPoint[] = messages
    .filter(m => m.role === 'user' && m.sentiment)
    .map((m, idx) => ({
      index: idx + 1,
      score: m.sentiment?.score || 0
    }));

  return (
    <div className={`flex flex-col h-screen font-sans selection:bg-sky-500/30 transition-colors duration-1000 bg-gradient-to-b ${ambientGlow}`}>

      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-800/50 p-4 flex justify-between items-center backdrop-blur-md bg-black/50 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-sky-600/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white">Sentience<span className="text-blue-500">AI</span></h1>
            <p className="text-xs text-gray-500 font-medium">Context-Aware Engine</p>
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
            onClick={() => setShowSummary(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all text-sm font-medium"
          >
            <Power size={16} />
            <span className="hidden sm:inline">End Chat</span>
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide relative bg-black/20">
        <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-end">

          <div className="pb-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing Indicator */}
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

          {/* Empty State / Suggestions */}
          {messages.length === 1 && botStatus === 'idle' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 animate-message-in">
              {SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(suggestion)}
                  className="text-left p-4 bg-gray-900/40 hover:bg-gray-900 border border-gray-800/50 hover:border-sky-500/30 rounded-xl transition-all group"
                >
                  <span className="text-sm text-gray-400 group-hover:text-sky-400 transition-colors">"{suggestion}"</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-shrink-0 p-4 md:p-6 backdrop-blur-md bg-black/80 border-t border-gray-800/50 z-20">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center group">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              disabled={botStatus !== 'idle'}
              className="w-full bg-gray-900/50 text-white placeholder-gray-600 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-sky-600/50 focus:bg-gray-900 border border-gray-800/50 transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || botStatus !== 'idle'}
              className="absolute right-2 p-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-500 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-600/20"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="flex justify-center gap-6 mt-3 opacity-60">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
              <span className="text-[10px] text-gray-500">Positive Context</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
              <span className="text-[10px] text-gray-500">Negative Context</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {showSummary && (
        <SummaryReport
          stats={currentStats}
          history={chartData}
          onClose={() => setShowSummary(false)}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default App;