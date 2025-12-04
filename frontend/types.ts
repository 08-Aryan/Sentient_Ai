export enum SentimentLabel {
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative',
  NEUTRAL = 'Neutral',
}

export interface SentimentResult {
  score: number; // Range: -1.0 to 1.0
  label: SentimentLabel;
}

export interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: number;
  sentiment?: SentimentResult; // Only user messages have sentiment
}

export enum TrendDirection {
  IMPROVING = 'Improving',
  DECLINING = 'Declining',
  STABLE = 'Stable',
  VOLATILE = 'Volatile',
  INSUFFICIENT_DATA = 'Insufficient Data',
}

export interface ConversationStats {
  totalMessages: number;
  averageScore: number;
  overallMoodLabel: SentimentLabel;
  trend: TrendDirection;
}

// Data structure for Recharts
export interface ChartDataPoint {
  index: number;
  score: number;
}