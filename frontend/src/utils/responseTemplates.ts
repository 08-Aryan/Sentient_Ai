import { SentimentLabel } from "../types";

export type UserIntent = 'EXIT' | 'HELP' | 'GREETING' | 'APPRECIATION' | 'CHAT';

type ResponseCategory = Record<SentimentLabel, string[]>;

interface TemplateLibrary {
  [overallMood: string]: ResponseCategory;
}

const RESPONSES: TemplateLibrary = {
  // === CONTEXT: POSITIVE (The conversation is going well) ===
  [SentimentLabel.POSITIVE]: {
    [SentimentLabel.POSITIVE]: [
      "I'm delighted to hear that! It's great to see our solutions working out for you.",
      "That's excellent news. I'm glad I could help make your experience smoother.",
      "Fantastic! Is there anything else you'd like to explore while we're on a roll?",
      "I love that enthusiasm! It’s always a pleasure working through these things when they go right.",
      "Perfect. I'll mark that down as a success. What shall we tackle next?",
      "It's wonderful to see things moving in such a positive direction!",
      "Your success is my success. I'm thrilled we're making progress.",
      "That's the spirit! Let's keep this momentum going.",
      "I'm really enjoying our collaboration today.",
      "Music to my ears! What's the next challenge we can crush?"
    ],
    [SentimentLabel.NEGATIVE]: [
      "I'm sorry to see this sudden issue. We were making good progress—could you tell me more about what just happened?",
      "That is unexpected given how well things were going. Let's pause and figure out exactly where it went wrong.",
      "I appreciate your candor. Let's shift gears and address this bump in the road immediately.",
      "I apologize for the hiccup. I want to make sure we get back to that smooth experience from earlier.",
      "That's frustrating, especially since we were on the right track. Let me take a closer look at this.",
      "Oh, that's a sudden turn. I'm sorry to hear that.",
      "We were doing so well. Let's not let this setback stop us.",
      "That's disappointing, but I'm sure we can fix it.",
      "A bump in the road. Let's smooth it out together.",
      "I see. Let's pivot and address this new issue immediately."
    ],
    [SentimentLabel.NEUTRAL]: [
      "Understood. I'm ready for your next instruction.",
      "Got it. Feel free to provide more details whenever you're ready.",
      "I've noted that. How would you like to proceed from here?",
      "Clear. Standing by for more specifics if you have them.",
      "Alright, let's keep moving. What is the next item on your list?",
      "Understood. Moving on.",
      "Roger that. Standing by.",
      "I'm ready for the next step.",
      "Noted. Proceeding as requested.",
      "Clear. What's next?"
    ]
  },

  // === CONTEXT: NEGATIVE (The user is frustrated/angry) ===
  [SentimentLabel.NEGATIVE]: {
    [SentimentLabel.POSITIVE]: [
      "I'm glad we could resolve this specific part. I know the overall experience hasn't been perfect, but this is a step in the right direction.",
      "That's a relief. Thank you for your patience while we work through the rough patches.",
      "It's good to have a win here, even though I know I still have to earn back your full trust.",
      "I appreciate the positive feedback on this specific fix. I'm still committed to resolving the larger outstanding issues.",
      "Thank you. I'm glad we're finally seeing some progress.",
      "I'm glad we could find a bright spot in this.",
      "That's a step forward. Let's keep climbing.",
      "Good to hear. I hope this marks a turning point.",
      "I appreciate the positive update. Let's build on this.",
      "Thank you. I'm working hard to turn this around for you."
    ],
    [SentimentLabel.NEGATIVE]: [
      "I completely understand why this is frustrating. Let's focus entirely on fixing this specific error now.",
      "I hear your concern loud and clear. This falls short of the experience we want to provide.",
      "I am not going to offer excuses; I just want to fix this for you. Please tell me exactly what you see on your screen.",
      "It is perfectly reasonable to be upset about this. Let's break this problem down and solve it step-by-step.",
      "I apologize for the continued trouble. I am making this my top priority right now.",
      "I am truly sorry. I know this is testing your patience.",
      "I understand your frustration. I am doing my best to help.",
      "This is not the experience we want for you. I apologize.",
      "I hear you. Let's focus on the solution.",
      "I'm committed to fixing this, no matter how long it takes."
    ],
    [SentimentLabel.NEUTRAL]: [
      "I understand. I'll proceed carefully to ensure we don't run into further complications.",
      "Noted. I want to double-check that I'm understanding your requirements correctly to avoid more issues.",
      "Okay. I'll process that information. Please let me know if anything looks off.",
      "Understood. I appreciate you sticking with me through this.",
      "I have logged that input. Let's continue working towards a solution.",
      "I understand. I will proceed with caution.",
      "Noted. I will be careful.",
      "Okay. I am listening.",
      "Understood. Let's continue.",
      "I have logged that. Proceeding."
    ]
  },

  // === CONTEXT: NEUTRAL (Business as usual / Start of chat) ===
  [SentimentLabel.NEUTRAL]: {
    [SentimentLabel.POSITIVE]: [
      "That's great to hear! How else can I be of service?",
      "I'm glad I could provide the information you needed.",
      "Excellent. Is there anything else on your mind?",
      "Happy to help! What's next?",
      "That is good news. I'm here if you need anything else.",
      "That's good to hear!",
      "I'm happy to help.",
      "Great! What else?",
      "Glad I could be of assistance.",
      "Wonderful. How can I help further?"
    ],
    [SentimentLabel.NEGATIVE]: [
      "I'm sorry to hear you're facing trouble. Could you elaborate on the error?",
      "That sounds annoying. Let's see if we can troubleshoot this together.",
      "I apologize for the inconvenience. What seems to be the main symptom?",
      "That isn't ideal. Let me analyze the issue—can you provide more context?",
      "I understand that's a problem. Let me see what I can do to fix it.",
      "I'm sorry to hear that. Tell me more.",
      "That sounds troublesome. Let's look into it.",
      "I apologize. What went wrong?",
      "That's unfortunate. Let's debug this.",
      "I see. Let's try to fix it."
    ],
    [SentimentLabel.NEUTRAL]: [
      "I understand. What would you like to do next?",
      "Message received. I'm listening.",
      "Okay, I can help with that. Could you provide a bit more detail?",
      "Right. I'm ready when you are.",
      "Acknowledged. Please continue.",
      "Okay.",
      "Understood.",
      "I'm listening.",
      "Go on.",
      "Ready."
    ]
  }
};

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

const GENERIC_SHORT_INPUTS = [
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
 * Gets a response based on sentiment logic.
 * EXPORTED FUNCTION needed by geminiService.ts
 */
export const getLocalBotReply = (
  userText: string,
  userSentimentLabel: SentimentLabel,
  overallMoodLabel: SentimentLabel
): string => {
  const lowerText = userText.toLowerCase().trim();

  // 1. Fallback for Short Inputs (if not a command)
  if (lowerText.length > 0 && lowerText.length < 5 && userSentimentLabel === SentimentLabel.NEUTRAL) {
    return GENERIC_SHORT_INPUTS[Math.floor(Math.random() * GENERIC_SHORT_INPUTS.length)];
  }

  // 2. Context-Aware Template Selection
  const moodCategory = RESPONSES[overallMoodLabel] || RESPONSES[SentimentLabel.NEUTRAL];
  const sentimentResponses = moodCategory[userSentimentLabel] || moodCategory[SentimentLabel.NEUTRAL];

  return sentimentResponses[Math.floor(Math.random() * sentimentResponses.length)];
};