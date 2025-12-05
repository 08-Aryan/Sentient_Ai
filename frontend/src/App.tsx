import React, { useState, useMemo } from 'react';
import SummaryReport from './components/SummaryReport';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Header from './components/Layout/Header';
import ChatArea from './components/Chat/ChatArea';
import InputArea from './components/Chat/InputArea';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useChat } from './hooks/useChat';
import { useSession } from './hooks/useSession';
import { ConversationStats, SentimentLabel, ChartDataPoint } from './types';
import { calculateConversationStats } from './utils/analytics';

const SUGGESTIONS = [
  "This new update is fantastic!",
  "I am extremely frustrated.",
  "The documentation is okay.",
  "What can you do?"
];

const ChatApp: React.FC = () => {
  const { logout } = useAuth();
  const [showSummary, setShowSummary] = useState(false);
  const { remainingSessions, fetchLimit, saveSession } = useSession();

  const handleEndChat = () => {
    saveSession(currentStats);
    setShowSummary(true);
  };

  const { messages, botStatus, handleSendMessage, restartChat } = useChat(handleEndChat);

  // Memoize stats
  const currentStats: ConversationStats = useMemo(() =>
    calculateConversationStats(messages),
    [messages]);

  // Background gradient
  const ambientGlow = useMemo(() => {
    switch (currentStats.overallMoodLabel) {
      case SentimentLabel.POSITIVE: return 'from-blue-900/20 via-gray-950 to-gray-950';
      case SentimentLabel.NEGATIVE: return 'from-red-900/20 via-gray-950 to-gray-950';
      default: return 'from-sky-900/20 via-gray-950 to-gray-950';
    }
  }, [currentStats.overallMoodLabel]);

  const handleRestart = () => {
    restartChat();
    setShowSummary(false);
    fetchLimit();
  };

  const chartData: ChartDataPoint[] = messages
    .filter(m => m.role === 'user' && m.sentiment)
    .map((m, idx) => ({
      index: idx + 1,
      score: m.sentiment?.score || 0
    }));

  const isInputDisabled = botStatus !== 'idle' || (remainingSessions !== null && remainingSessions <= 0 && messages.length <= 1);
  const placeholder = remainingSessions !== null && remainingSessions <= 0 ? "Daily limit reached" : "Type your message...";

  return (
    <div className={`flex flex-col h-screen font-sans selection:bg-sky-500/30 transition-colors duration-1000 bg-gradient-to-b ${ambientGlow}`}>

      <Header
        remainingSessions={remainingSessions}
        currentStats={currentStats}
        onEndChat={handleEndChat}
        onLogout={logout}
        onShowSummary={() => setShowSummary(true)}
      />

      <ChatArea
        messages={messages}
        botStatus={botStatus}
        suggestions={SUGGESTIONS}
        onSuggestionClick={(text) => handleSendMessage(text, remainingSessions)}
      />

      <InputArea
        onSendMessage={(text) => handleSendMessage(text, remainingSessions)}
        disabled={isInputDisabled}
        placeholder={placeholder}
      />

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

const App: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return isRegistering ? (
      <Register onLoginClick={() => setIsRegistering(false)} />
    ) : (
      <Login onRegisterClick={() => setIsRegistering(true)} />
    );
  }

  return <ChatApp />;
};

const AppWithProvider: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithProvider;