from app import create_app
from extensions import db
from models import ResponseTemplate

app = create_app()

TEMPLATE_DATA = {
  # === CONTEXT: POSITIVE ===
  'Positive': {
    'Positive': [
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
    'Negative': [
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
    'Neutral': [
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

  # === CONTEXT: NEGATIVE ===
  'Negative': {
    'Positive': [
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
    'Negative': [
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
    'Neutral': [
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

  # === CONTEXT: NEUTRAL ===
  'Neutral': {
    'Positive': [
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
    'Negative': [
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
    'Neutral': [
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
}

def seed_db():
    with app.app_context():
        # Create tables (if ResponseTemplate table is new)
        db.create_all()
        
        # Check if already seeded to avoid duplicates
        if ResponseTemplate.query.first():
            print("Database already contains templates. Skipping seed.")
            return

        print("Seeding response templates...")
        count = 0
        for overall_mood, sentiments in TEMPLATE_DATA.items():
            for user_sentiment, messages in sentiments.items():
                for msg in messages:
                    t = ResponseTemplate(
                        overall_mood=overall_mood,
                        user_sentiment=user_sentiment,
                        content=msg
                    )
                    db.session.add(t)
                    count += 1
        
        try:
            db.session.commit()
            print(f"Successfully added {count} templates.")
        except Exception as e:
            db.session.rollback()
            print(f"Error seeding DB: {e}")

if __name__ == "__main__":
    seed_db()
