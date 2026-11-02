
from neo.engine.intent_engine import neo_intent_engine

questions = [
    "Hello NEO",
    "Which career is best for me?",
    "I love computers and coding",
    "What skills should I learn?",
    "Create a learning roadmap",
    "Compare data science and web development"
]

for question in questions:

    result = neo_intent_engine.predict(question)

    print("\nStudent:", question)
    print("NEO Intent:", result["intent"])
    print("Confidence:", result["confidence"])
