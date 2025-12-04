import React, { memo } from 'react';
import { Message, SentimentLabel } from '../../types';
import { Bot, User, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const getSentimentIcon = (label?: SentimentLabel) => {
  switch (label) {
    case SentimentLabel.POSITIVE: return <TrendingUp size={14} />;
    case SentimentLabel.NEGATIVE: return <TrendingDown size={14} />;
    default: return <Minus size={14} />;
  }
};

const getSentimentStyles = (label?: SentimentLabel) => {
  switch (label) {
    case SentimentLabel.POSITIVE:
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case SentimentLabel.NEGATIVE:
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

const ChatMessage: React.FC<ChatMessageProps> = memo(({ message }) => {
  const isBot = message.role === 'bot';

  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'} animate-message-in group`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] flex-col ${isBot ? 'items-start' : 'items-end'}`}>

        {/* Avatar & Content Wrapper */}
        <div className={`flex gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>

          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg
            ${isBot ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gray-700'}`}>
            {isBot ? <Bot size={18} className="text-white" /> : <User size={18} className="text-gray-300" />}
          </div>

          {/* Bubble */}
          <div className={`relative p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed backdrop-blur-sm
            ${isBot
              ? 'bg-gray-800/90 border border-gray-700/50 text-gray-100 rounded-tl-none'
              : 'bg-blue-600 text-white rounded-tr-none shadow-blue-500/10'
            }`}>
            {message.text}
          </div>
        </div>

        {/* Tier 2: Real-time Sentiment Indicator (Only for User) */}
        {!isBot && message.sentiment && (
          <div className={`mt-2 mr-11 flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${getSentimentStyles(message.sentiment.label)} animate-message-in`}>
            {getSentimentIcon(message.sentiment.label)}
            <span>{message.sentiment.label}</span>
            <span className="opacity-50 text-[10px] font-mono">
              ({message.sentiment.score > 0 ? '+' : ''}{message.sentiment.score.toFixed(2)})
            </span>
          </div>
        )}

        {/* Timestamp - visible on hover */}
        <span className={`text-[10px] text-gray-500 mt-1 ${isBot ? 'ml-11' : 'mr-11'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

      </div>
    </div>
  );
});

export default ChatMessage;