"""Test Taglish detection and responses - Direct test"""

from nlp_utils import detect_intent, detect_language, detect_vibe
from responses import RESPONSES
import random

# Test cases
test_queries = [
    ("paano mag vote", "voting_process"),
    ("pwede ko ba mag vote", "voting_process"),
    ("eligible ba ako", "eligibility"),
    ("ano ang requirements para bumoto", "voting_process"),
    ("paano mag-vote please", "voting_process"),
]

print("=" * 70)
print("TAGLISH DETECTION & NLP TEST")
print("=" * 70)

for query, expected_intent in test_queries:
    print(f"\nQuery: '{query}'")
    print("-" * 70)
    
    intent, conf = detect_intent(query)
    language = detect_language(query)
    vibe = detect_vibe(query, language)
    
    print(f"Detected Intent: {intent} (confidence: {conf:.2%})")
    print(f"Expected Intent: {expected_intent}")
    print(f"Match: {'PASS' if intent == expected_intent else 'FAIL'}")
    print(f"Language: {language.upper()}")
    print(f"Vibe: {vibe}")
    
    # Show sample response
    if intent in RESPONSES:
        sample_response = random.choice(RESPONSES[intent])
        print(f"Sample Response: {sample_response[:100]}..." if len(sample_response) > 100 else f"Sample Response: {sample_response}")

print("\n" + "=" * 70)
print("TEST SUMMARY")
print("=" * 70)
passed = sum(1 for q, exp in test_queries if detect_intent(q)[0] == exp)
print(f"Tests Passed: {passed}/{len(test_queries)}")
print("Status: ALL TESTS PASSED" if passed == len(test_queries) else "Status: SOME TESTS FAILED")
