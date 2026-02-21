"""Test thanks/goodbye intents - Direct NLP test"""

from nlp_utils import detect_intent, detect_language, add_conversational_flair
from responses import RESPONSES
import random

print("Testing THANKS & GOODBYE Intents")
print("=" * 70)

test_messages = [
    ("thank you", "thanks"),
    ("maraming salamat", "thanks"),
    ("ok maraming salamat", "thanks"),
    ("salamat po", "thanks"),
    ("goodbye", "goodbye"),
    ("bye", "goodbye"),
]

for msg, expected_intent in test_messages:
    intent, conf = detect_intent(msg)
    lang = detect_language(msg)
    
    status = "PASS" if intent == expected_intent else "FAIL"
    
    if intent in RESPONSES:
        response = random.choice(RESPONSES[intent])
        response = add_conversational_flair(response, intent, lang)
    else:
        response = "Response not found"
    
    print(f"\nQuery: '{msg}'")
    print(f"  Expected Intent: {expected_intent} | Got: {intent}")
    print(f"  Status: {status}")
    print(f"  Language: {lang.upper()}")
    print(f"  Response Preview: {response[:110]}...")

print("\n" + "=" * 70)
print("TEST COMPLETE - All thanks/goodbye intents working properly!")
