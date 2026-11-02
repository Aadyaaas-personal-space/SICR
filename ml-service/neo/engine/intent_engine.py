
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline


class NEOIntentEngine:

    def __init__(self):

        self.training_data = {

            "GREETING": [
                "hello",
                "hi",
                "hey neo",
                "good morning",
                "good evening",
                "how are you",
                "hello there"
            ],

            "CAREER_DISCOVERY": [
                "which career is best for me",
                "suggest a career",
                "help me choose my career",
                "what should I become",
                "which profession should I choose",
                "recommend careers for me",
                "I am confused about my future"
            ],

            "INTEREST_ANALYSIS": [
                "I like computers",
                "I love mathematics",
                "I enjoy designing",
                "I like solving problems",
                "I am interested in technology",
                "what are my interests",
                "analyze my interests"
            ],

            "SKILL_GUIDANCE": [
                "what skills should I learn",
                "which skills are required",
                "help me improve my skills",
                "what should I study",
                "suggest technical skills",
                "how can I improve my abilities"
            ],

            "ROADMAP_GENERATION": [
                "create a learning roadmap",
                "make a study plan",
                "give me a career roadmap",
                "how do I achieve my goal",
                "create a plan for my future",
                "guide me step by step"
            ],

            "CAREER_COMPARISON": [
                "compare data science and web development",
                "which career is better",
                "difference between two careers",
                "compare software developer and data analyst",
                "which profession has better opportunities"
            ],

            "COURSE_RECOMMENDATION": [
                "suggest courses for me",
                "which course should I take",
                "recommend online courses",
                "where can I learn programming",
                "what should I learn next"
            ],

            "ACADEMIC_GUIDANCE": [
                "how can I improve my marks",
                "help me with my studies",
                "analyze my academic performance",
                "how should I prepare for exams",
                "I am weak in mathematics"
            ],

            "MOTIVATION": [
                "I feel demotivated",
                "I am not confident",
                "motivate me",
                "I am afraid of failure",
                "I cannot decide my future"
            ],

            "GENERAL_QUESTION": [
                "what is artificial intelligence",
                "explain machine learning",
                "what is programming",
                "tell me about technology",
                "explain computer science"
            ]
        }

        self.model = Pipeline([
            ("tfidf", TfidfVectorizer(
                lowercase=True,
                ngram_range=(1, 2),
                sublinear_tf=True
            )),
            ("classifier", LogisticRegression(
                max_iter=1000,
                class_weight="balanced"
            ))
        ])

        self.train()

    def train(self):

        sentences = []
        labels = []

        for intent, examples in self.training_data.items():

            for sentence in examples:
                sentences.append(sentence)
                labels.append(intent)

        self.model.fit(sentences, labels)

    def predict(self, message):

        if not isinstance(message, str) or not message.strip():
            return {
                "intent": "UNKNOWN",
                "confidence": 0.0
            }

        cleaned_message = re.sub(
            r"[^a-zA-Z0-9\s]",
            " ",
            message.lower()
        )

        cleaned_message = " ".join(cleaned_message.split())

        probabilities = self.model.predict_proba(
            [cleaned_message]
        )[0]

        best_index = probabilities.argmax()

        confidence = float(probabilities[best_index])

        intent = self.model.classes_[best_index]

        # Avoid pretending that an uncertain prediction is reliable.
        if confidence < 0.25:
            intent = "UNKNOWN"

        return {
            "intent": intent,
            "confidence": round(confidence, 4)
        }


# Create one reusable NEO intent engine.
neo_intent_engine = NEOIntentEngine()
