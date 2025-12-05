import { SentimentResult, SentimentLabel } from "../types";

// Ensure your Flask API is running on this port
const API_URL = "http://localhost:5001/predict";

export const analyzeRemoteSentiment = async (text: string): Promise<SentimentResult> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // The Python API expects a JSON object with a "text" or "review" key
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    // The API returns: { "sentiment": "positive", "probability": 0.97 }
    const data = await response.json();

    // --- Map Python Response to Frontend Types ---
    
    // Convert string "positive"/"negative"/"neutral" to your Enum
    let label = SentimentLabel.NEUTRAL;
    if (data.sentiment === "positive") {
      label = SentimentLabel.POSITIVE;
    } else if (data.sentiment === "negative") {
      label = SentimentLabel.NEGATIVE;
    }

    return {
      label: label,
      score: data.probability, // Map 'probability' directly to 'score'
    };

  } catch (error) {
    console.error("Failed to fetch sentiment:", error);
    // Optional: Fallback to local analysis if API fails
    // return analyzeLocalSentiment(text); 
    throw error;
  }
};