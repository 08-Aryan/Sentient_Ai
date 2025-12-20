import { SentimentLabel, SentimentResult } from "../types";
// import { analyzeLocalSentiment } from "../utils/sentimentLexicon";
import { selectTemplate, TemplateLibrary } from "../utils/chatUtils";
import { api } from "./api";

/**
 * SERVICE LAYER: The "Brain" of the application.
 * * This service handles the business logic between the UI and the local utilities.
 * It simulates an AI service delay to improve user experience.
 */

// --- 1. Sentiment Analysis Service ---

export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  try {
    const data = await api.predict(text);

    // Map backend response to SentimentResult
    // Backend returns: { sentiment: 'positive'|'negative'|'neutral', probability: 0.95 }
    // Frontend expects: { label: SentimentLabel, score: number }

    let label = SentimentLabel.NEUTRAL;
    if (data.sentiment === 'positive') label = SentimentLabel.POSITIVE;
    else if (data.sentiment === 'negative') label = SentimentLabel.NEGATIVE;

    let score = data.probability;
    if (label === SentimentLabel.NEGATIVE) score = -score;
    if (label === SentimentLabel.NEUTRAL) score = 0;

    return {
      label,
      score
    };

  } catch (error: any) {
    if (error.message === 'Daily limit reached') {
      throw error;
    }
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
  currentSentiment: SentimentResult,
  templates: TemplateLibrary | null
): Promise<string> => {

  // A. Use the provided sentiment
  // const currentSentiment = analyzeLocalSentiment(userText);

  // B. Determine the Overall Context Label
  // We match the threshold used in analytics.ts (0.05)
  let overallMoodLabel = SentimentLabel.NEUTRAL;
  if (overallMoodScore >= 0.05) overallMoodLabel = SentimentLabel.POSITIVE;
  else if (overallMoodScore <= -0.05) overallMoodLabel = SentimentLabel.NEGATIVE;

  // C. Generate Local Reply
  // We pass: Current Input + Current Sentiment + Overall History Mood + Templates
  const reply = selectTemplate(
    userText,
    currentSentiment.label,
    overallMoodLabel,
    templates
  );

  // Artificial Delay: Simulates typing/thinking time (800ms)
  await new Promise(resolve => setTimeout(resolve, 800));

  return reply;
};