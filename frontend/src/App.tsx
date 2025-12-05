import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SummaryReport from './components/SummaryReport';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import ChatArea from './components/Chat/ChatArea';
import InputArea from './components/Chat/InputArea';
import LandingPage from './pages/LandingPage';
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

const ChatLayout: React.FC = () => {
  const { logout } = useAuth();
  const [showSummary, setShowSummary] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null); // For viewing history
  const { remainingSessions, fetchLimit, saveSession } = useSession();

  const endChatRef = React.useRef<() => void>(() => { });

  const { messages, botStatus, handleSendMessage, restartChat, loadMessages, sessionId } = useChat(() => endChatRef.current());

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

  const handleEndChat = () => {
    saveSession(currentStats, messages);
    setShowSummary(true);
  };

  React.useEffect(() => {
    endChatRef.current = handleEndChat;
  }, [currentStats, messages]); // Update ref when dependencies of handleEndChat change

  // ... (memoization code) ...

  const handleRestart = () => {
    // Real-time saving handles persistence now.
    // We just reset the UI.
    restartChat();
    setShowSummary(false);
    setSelectedSession(null);
    fetchLimit();
  };

  const handleSelectSession = async (session: any) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const res = await fetch(`${API_URL}/chat/session/${session.id}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        // Map backend messages to frontend Message type
        const loadedMessages = data.messages.map((msg: any) => ({
          id: msg.id.toString(),
          role: msg.role,
          text: msg.content,
          timestamp: new Date(msg.timestamp).getTime(),
          sentiment: msg.sentiment
        }));
        loadMessages(loadedMessages, session.id.toString());
        setShowSummary(false);
        setIsSidebarOpen(false); // Close sidebar on mobile
      }
    } catch (error) {
      console.error("Failed to load session", error);
    }
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
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar
        onNewChat={handleRestart}
        onSelectSession={handleSelectSession}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        currentSessionId={sessionId}
      />

      <div className={`flex-1 flex flex-col h-full font-sans selection:bg-sky-500/30 transition-colors duration-1000 bg-gradient-to-b ${ambientGlow} relative`}>
        {/* Mobile Sidebar Toggle - Integrated into Header or separate? Header has it? No. */}
        {/* Let's add a toggle button if sidebar is closed on mobile. Actually Sidebar handles its own visibility via props. */}
        {/* We need a button to OPEN sidebar on mobile. Header usually has it. */}

        <Header
          remainingSessions={remainingSessions}
          currentStats={currentStats}
          onEndChat={handleEndChat}
          onLogout={logout}
          onShowSummary={() => setShowSummary(true)}
        />
        {/* Mobile Menu Button Overlay - Simplified for now, assume Header or Sidebar handles it. 
            Actually Header needs a 'Menu' button. Let's add it to Header later if needed. 
            For now, Sidebar is always visible on desktop, hidden on mobile. 
            We need a way to open it on mobile. 
            Let's add a floating button or modify Header. 
            For this iteration, let's assume desktop first or add a simple button.
        */}
        <button
          className="md:hidden absolute top-4 left-4 z-30 p-2 bg-gray-800 rounded-lg text-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          Menu
        </button>

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
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginWrapper />} />
      <Route path="/register" element={<RegisterWrapper />} />
      <Route path="/chat" element={
        <ProtectedRoute>
          <ChatLayout />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Wrappers to handle navigation after auth
const LoginWrapper = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/chat" replace />;
  return <Login onRegisterClick={() => { }} />; // Navigation handled by Link in Login component now? No, Login component uses props.
  // We need to update Login/Register to use Links or useNavigate instead of props.
  // For now, let's wrap them to adapt.
  // Actually, let's update Login/Register to use react-router-dom Links.
};

const RegisterWrapper = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/chat" replace />;
  return <Register onLoginClick={() => { }} />;
};

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;