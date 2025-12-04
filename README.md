# Context-Aware Sentiment Chatbot

A production-grade, context-aware chatbot that performs real-time sentiment analysis and adapts its responses based on the conversation's emotional trajectory.

## 🛠️ Installation & Setup requirements

### **NLTK VADER Logic (Zero-Dependency)**
This application utilizes the **NLTK (Natural Language Toolkit) VADER** sentiment analysis algorithm.

*   **No Python Installation Required:** The VADER lexicon and scoring logic have been ported to TypeScript (`utils/sentimentLexicon.ts`).
*   **No `pip install nltk` Required:** Unlike standard Python implementations, this web application runs entirely in the browser.
*   **No API Key Required:** The default mode uses the local "Local Intelligence" engine.


# 1. Install
npm install

# 2. Run
npm run dev

---

## 🧠 Core Logic & Architecture

### **The Context Matrix**
The bot does not simply respond to your last message. It maintains a **Conversation State** to ensure emotional consistency.

| Current Input | Overall Mood (History) | Bot Persona | Example Response |
| :--- | :--- | :--- | :--- |
| **Positive** | **Positive** | Enthusiastic | "That's fantastic! Let's keep this momentum going!" |
| **Positive** | **Negative** | Cautious | "I'm glad that helped, but I haven't forgotten our earlier issues." |
| **Negative** | **Positive** | Surprised/Helpful | "Oh no, we were doing so well. Let me fix this immediately." |
| **Negative** | **Negative** | Apologetic | "I understand your frustration is growing. I am committed to fixing this." |

### **Tier Features**

**Tier 1: Persistence & Summary**
*   Full conversation history is tracked.
*   On exit, a **Summary Report** is generated displaying the overall sentiment score, total message count, and a visual chart of the sentiment trajectory.

**Tier 2: Real-Time Analysis & Trends**
*   **Instant Feedback:** Every user message is analyzed immediately for sentiment (Positive/Neutral/Negative) and displayed in the UI.
*   **Mood Trend:** The app calculates whether the conversation is **Improving**, **Declining**, or **Stable** by comparing the first half of the conversation to the second half.

---

## 🚀 Usage

1.  **Chat:** Type messages naturally. The bot will analyze your sentiment in real-time.
2.  **Visual Indicators:** Watch the "Live Mood" badge in the header update as the conversation context shifts.
3.  **Summary:** Click **End Chat** (or type "exit") to view the comprehensive analytical report.