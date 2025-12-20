import { SentimentLabel } from "../types";

export type UserIntent = 'EXIT' | 'HELP' | 'GREETING' | 'APPRECIATION' | 'CHAT';

export interface TemplateLibrary {
    [overallMood: string]: {
        [userSentiment: string]: string[];
    };
}

export const GENERIC_FAREWELLS = [
    "Goodbye! I'm compiling your session summary now...",
    "Take care. I hope I was able to help today.",
    "Closing the session. Have a productive day!",
    "Farewell! Your sentiment report is ready for review.",
    "See you next time. Stay positive!",
    "Signing off. Don't hesitate to return if you need more help.",
    "Bye for now!",
    "Have a great day ahead!",
    "Catch you later!"
];

export const GENERIC_SHORT_INPUTS = [
    "Could you provide a little more detail?",
    "I'm listening—please go on.",
    "I want to make sure I understand; could you elaborate?",
    "Could you expand on that slightly?",
    "I'm here. Please tell me more."
];

export const CAPABILITY_RESPONSE =
    "I am a Context-Aware Sentiment Chatbot designed to understand not just *what* you say, but *how* you say it.\n\n" +
    "• **Real-Time Analysis:** I detect emotions in every message to guide my responses.\n" +
    "• **Context Memory:** I remember if our conversation has been generally happy or frustrated, and I adapt my tone (e.g., I won't be annoyingly cheerful if you're angry).\n" +
    "• **Trend Tracking:** I monitor if our interaction is getting better or worse over time.\n" +
    "• **Analytics:** Type 'exit' to see a visual graph of our emotional trajectory.";

/**
 * Classifies the user's input into an Intent.
 */
export const detectIntent = (text: string): UserIntent => {
    const lowerText = text.toLowerCase().trim();
    const cleanText = lowerText.replace(/[^\w\s]/g, '');

    const CAPABILITY_QUERIES = [
        "what can you do", "help", "capabilities", "features", "how do you work", "who are you",
        "what are you", "assist", "support", "guide", "manual", "instructions", "what is this",
        "tell me about yourself", "functionality", "commands", "options", "menu"
    ];
    const FAREWELL_QUERIES = [
        "bye", "exit", "quit", "goodbye", "end", "stop", "terminate", "close",
        "later", "cya", "see ya", "peace", "leave", "done", "finish", "halt", "abort",
        "sign off", "logout", "log out"
    ];
    const GREETING_QUERIES = [
        "hi", "hello", "hey", "greetings", "good morning", "yo", "sup", "what's up",
        "howdy", "hola", "bonjour", "good afternoon", "good evening", "hiya", "welcome",
        "hey there", "hi there"
    ];
    const APPRECIATION_QUERIES = [
        "thanks", "thank you", "thx", "appreciate it", "cheers", "cool", "awesome",
        "great", "good job", "nice", "ty", "tysm", "grateful", "amazing", "wonderful",
        "perfect", "excellent"
    ];

    if (CAPABILITY_QUERIES.some(q => lowerText.includes(q))) return 'HELP';
    if (FAREWELL_QUERIES.some(f => cleanText === f)) return 'EXIT';
    if (GREETING_QUERIES.some(g => cleanText === g || cleanText.startsWith(g + ' '))) return 'GREETING';
    if (APPRECIATION_QUERIES.some(a => lowerText.includes(a))) return 'APPRECIATION';

    return 'CHAT';
};

/**
 * Selects a response from the provided template library.
 */
export const selectTemplate = (
    userText: string,
    userSentimentLabel: SentimentLabel,
    overallMoodLabel: SentimentLabel,
    templates: TemplateLibrary | null
): string => {
    const lowerText = userText.toLowerCase().trim();

    // 1. Fallback for Short Inputs (if not a command)
    if (lowerText.length > 0 && lowerText.length < 5 && userSentimentLabel === SentimentLabel.NEUTRAL) {
        return GENERIC_SHORT_INPUTS[Math.floor(Math.random() * GENERIC_SHORT_INPUTS.length)];
    }

    if (!templates) {
        return "I am connecting to the database...";
    }

    // 2. Context-Aware Template Selection
    // Ensure keys match the backend format (Title Case vs Upper Case?)
    // Backend returns Title Case keys ('Positive', 'Negative', 'Neutral') based on my seed script.
    // SentimentLabel enum might be uppercase or lowercase.

    // Map SentimentLabel (likely 'positive', 'negative', 'neutral') to Title Case
    const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const moodKey = toTitleCase(overallMoodLabel);
    const sentimentKey = toTitleCase(userSentimentLabel);

    const moodCategory = templates[moodKey] || templates['Neutral'];
    if (!moodCategory) return "I'm listening.";

    const sentimentResponses = moodCategory[sentimentKey] || moodCategory['Neutral'];

    if (!sentimentResponses || sentimentResponses.length === 0) {
        return "I see. Please go on.";
    }

    return sentimentResponses[Math.floor(Math.random() * sentimentResponses.length)];
};
