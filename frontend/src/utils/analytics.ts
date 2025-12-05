import { Message, TrendDirection, SentimentLabel, ConversationStats } from "../types";

export const calculateConversationStats = (history: Message[]): ConversationStats => {
  const userMessages = history.filter(m => m.role === 'user' && m.sentiment);
  
  if (userMessages.length === 0) {
    return {
      totalMessages: 0,
      averageScore: 0,
      overallMoodLabel: SentimentLabel.NEUTRAL,
      trend: TrendDirection.INSUFFICIENT_DATA
    };
  }

  // 1. Calculate Average
  const scores = userMessages.map(m => m.sentiment?.score || 0);
  const totalScore = scores.reduce((sum, s) => sum + s, 0);
  const averageScore = totalScore / scores.length;

  // 2. Determine Overall Mood Label
  let overallMoodLabel = SentimentLabel.NEUTRAL;
  if (averageScore >= 0.05) overallMoodLabel = SentimentLabel.POSITIVE;
  else if (averageScore <= -0.05) overallMoodLabel = SentimentLabel.NEGATIVE;

  // 3. Calculate Trend & Volatility
  let trend = TrendDirection.STABLE;
  
  if (scores.length >= 3) {
    // A. Check Volatility (Standard Deviation)
    // If user swings wildly (e.g., +0.8 then -0.8), average is 0 but mood is unstable.
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev > 0.5) {
        trend = TrendDirection.VOLATILE;
    } else {
        // B. Check Linear Trend (First 3 vs Last 3, or Halves)
        const splitSize = Math.max(1, Math.floor(scores.length * 0.3)); // compare first/last 30%
        
        const firstChunk = scores.slice(0, splitSize);
        const lastChunk = scores.slice(-splitSize);

        const firstAvg = firstChunk.reduce((a, b) => a + b, 0) / firstChunk.length;
        const lastAvg = lastChunk.reduce((a, b) => a + b, 0) / lastChunk.length;

        const diff = lastAvg - firstAvg;

        if (diff > 0.25) trend = TrendDirection.IMPROVING;
        else if (diff < -0.25) trend = TrendDirection.DECLINING;
        else trend = TrendDirection.STABLE;
    }
  } else if (scores.length === 2) {
      // Simple diff for very short convos
      const diff = scores[1] - scores[0];
      if (diff > 0.3) trend = TrendDirection.IMPROVING;
      else if (diff < -0.3) trend = TrendDirection.DECLINING;
  } else {
    trend = TrendDirection.INSUFFICIENT_DATA;
  }

  return {
    totalMessages: userMessages.length,
    averageScore: Number(averageScore.toFixed(4)),
    overallMoodLabel,
    trend
  };
};

export const getSentimentColor = (score: number) => {
  if (score >= 0.05) return 'text-green-400';
  if (score <= -0.05) return 'text-red-400';
  return 'text-gray-400';
};

export const getSentimentBadgeColor = (label: SentimentLabel) => {
  switch (label) {
    case SentimentLabel.POSITIVE: return 'bg-green-500/10 text-green-400 border-green-500/30';
    case SentimentLabel.NEGATIVE: return 'bg-red-500/10 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  }
};