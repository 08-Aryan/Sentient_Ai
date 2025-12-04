from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# --- Configuration ---
ARTIFACT_PATH = 'sentiment_analysis_artifacts.joblib'

# --- Global Variables ---
model = None
vectorizer = None
labels = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}

def load_model():
    """
    Loads the trained model and vectorizer from disk.
    """
    global model, vectorizer
    if not os.path.exists(ARTIFACT_PATH):
        print(f"ERROR: Artifact file '{ARTIFACT_PATH}' not found.")
        return

    print("Loading model artifacts...")
    try:
        artifacts = joblib.load(ARTIFACT_PATH)
        model = artifacts['model']
        vectorizer = artifacts['vectorizer']
        print("Model and Vectorizer loaded successfully.")
    except Exception as e:
        print(f"ERROR: Failed to load artifacts: {e}")

def clean_text(text):
    """
    Preprocess the text EXACTLY as done during training.
    Note: We do NOT remove stopwords here because the training script 
    provided did not use stop_words='english' in TfidfVectorizer.
    """
    if not isinstance(text, str):
        return ""
        
    text = re.sub(r'<.*?>', '', text)  # Remove HTML tags
    text = re.sub(r'http\S+|https\S+|www\S+', '', text)  # Remove URLs
    text = re.sub(r'@\w+', '', text)  # Remove user mentions
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)  # Remove non-alphanumeric chars
    text = text.lower()  # Convert to lowercase
    return text

# Load artifacts on startup
load_model()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'online', 'model_loaded': model is not None})

@app.route('/predict', methods=['POST'])
def predict():
    if not model or not vectorizer:
        return jsonify({'error': 'Model not loaded. Check server logs.'}), 500

    try:
        data = request.get_json()
        
        # Support both 'text' and 'review' keys
        text_input = data.get('text') or data.get('review')

        if not text_input:
            return jsonify({'error': 'No text provided. Use key "text" or "review".'}), 400

        # 1. Clean
        cleaned_text = clean_text(text_input)

        # 2. Vectorize
        # transform expects an iterable (list), so we wrap text in []
        vectorized_text = vectorizer.transform([cleaned_text])

        # 3. Predict Class
        prediction_idx = model.predict(vectorized_text)[0]
        prediction_label = labels[prediction_idx]

        # 4. Predict Probabilities (Score of Certainty)
        # probabilities is an array like [[0.1, 0.05, 0.85]]
        probs = model.predict_proba(vectorized_text)[0]
        
        # Get the confidence of the predicted class
        confidence_score = float(np.max(probs))

        # Create a breakdown of probabilities for all classes
        prob_breakdown = {
            labels[0]: float(probs[0]),
            labels[1]: float(probs[1]),
            labels[2]: float(probs[2])
        }

        # 5. Construct Response
        response = {
            'sentiment': prediction_label.lower(),
            'probability': round(confidence_score, 2),
            'breakdown': prob_breakdown
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=5001, debug=True)
