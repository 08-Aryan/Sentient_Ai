import { SentimentLabel, SentimentResult } from "../types";
// import { analyzeLocalSentiment } from "../utils/sentimentLexicon";
import { getLocalBotReply } from "../utils/responseTemplates";

/**
 * SERVICE LAYER: The "Brain" of the application.
 * * This service handles the business logic between the UI and the local utilities.
 * It simulates an AI service delay to improve user experience.
 */

// --- 1. Sentiment Analysis Service ---

export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Map backend response to SentimentResult
    // Backend returns: { sentiment: 'positive'|'negative'|'neutral', probability: 0.95 }
    // Frontend expects: { label: SentimentLabel, score: number }

    let label = SentimentLabel.NEUTRAL;
    if (data.sentiment === 'positive') label = SentimentLabel.POSITIVE;
    else if (data.sentiment === 'negative') label = SentimentLabel.NEGATIVE;

    // Normalize score to -1 to 1 range for compatibility with existing logic if needed,
    // or just use the probability as is if the app handles 0-1.
    // Looking at existing code, it seems to use a score.
    // Let's assume the probability is confidence.
    // We might need to map it to a signed score for the "overall mood" calculation.
    // If positive, score is prob. If negative, score is -prob.

    let score = data.probability;
    if (label === SentimentLabel.NEGATIVE) score = -score;
    if (label === SentimentLabel.NEUTRAL) score = 0;

    return {
      label,
      score
    };

  } catch (error) {
    console.error("Sentiment analysis failed:", error);
    // Fallback to neutral if API fails
    return { label: SentimentLabel.NEUTRAL, score: 0 };
  }
};

// --- 2. Chatbot Response Service ---

export const generateBotReply = async (
  userText: string,
  // We keep the 'history' param to match the signature App.tsx expects, 
  // even though the local logic calculates context via 'overallMoodScore'.
  chatHistory: any[],
  overallMoodScore: number,
  currentSentiment: SentimentResult
): Promise<string> => {

  // A. Use the provided sentiment
  // const currentSentiment = analyzeLocalSentiment(userText);

  // B. Determine the Overall Context Label
  // We match the threshold used in analytics.ts (0.05)
  let overallMoodLabel = SentimentLabel.NEUTRAL;
  if (overallMoodScore >= 0.05) overallMoodLabel = SentimentLabel.POSITIVE;
  else if (overallMoodScore <= -0.05) overallMoodLabel = SentimentLabel.NEGATIVE;

  // C. Generate Local Reply
  // We pass: Current Input + Current Sentiment + Overall History Mood
  const reply = getLocalBotReply(
    userText,
    currentSentiment.label,
    overallMoodLabel
  );

  // Artificial Delay: Simulates typing/thinking time (800ms)
  await new Promise(resolve => setTimeout(resolve, 800));

  return reply;
};