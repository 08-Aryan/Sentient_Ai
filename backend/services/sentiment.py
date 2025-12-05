import joblib
import re
import numpy as np
import os
from config import Config

class SentimentService:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.labels = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}
        self.load_model()

    def load_model(self):
        if not os.path.exists(Config.ARTIFACT_PATH):
            print(f"ERROR: Artifact file '{Config.ARTIFACT_PATH}' not found.")
            return

        print("Loading model artifacts...")
        try:
            artifacts = joblib.load(Config.ARTIFACT_PATH)
            self.model = artifacts['model']
            self.vectorizer = artifacts['vectorizer']
            print("Model and Vectorizer loaded successfully.")
        except Exception as e:
            print(f"ERROR: Failed to load artifacts: {e}")

    def clean_text(self, text):
        if not isinstance(text, str):
            return ""
        text = re.sub(r'<.*?>', '', text)
        text = re.sub(r'http\S+|https\S+|www\S+', '', text)
        text = re.sub(r'@\w+', '', text)
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        text = text.lower()
        return text

    def predict(self, text):
        if not self.model or not self.vectorizer:
            raise Exception("Model not loaded")

        cleaned_text = self.clean_text(text)
        vectorized_text = self.vectorizer.transform([cleaned_text])
        
        prediction_idx = self.model.predict(vectorized_text)[0]
        prediction_label = self.labels[prediction_idx]
        
        probs = self.model.predict_proba(vectorized_text)[0]
        confidence_score = float(np.max(probs))
        
        prob_breakdown = {self.labels[i]: float(probs[i]) for i in range(3)}

        return {
            'sentiment': prediction_label.lower(),
            'probability': round(confidence_score, 2),
            'breakdown': prob_breakdown
        }

sentiment_service = SentimentService()
