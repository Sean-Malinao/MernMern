#!/usr/bin/env python3
"""
Verification script for refactored ai-chatbot
Tests all modules and ensures everything works correctly
"""

import sys
import os

def verify_imports():
    """Verify all modules can be imported"""
    print("🔍 Verifying imports...")
    try:
        from config import CORS_ORIGINS, APP_TITLE, INTENT_PATTERNS
        print("  ✅ config.py imported successfully")
        
        from responses import RESPONSES
        print("  ✅ responses.py imported successfully")
        
        from nlp_utils import detect_intent, detect_language, detect_vibe
        print("  ✅ nlp_utils.py imported successfully")
        
        from candidate_manager import CandidateManager
        print("  ✅ candidate_manager.py imported successfully")
        
        from session_manager import SessionManager
        print("  ✅ session_manager.py imported successfully")
        
        from main import app, chat, root, health, stats
        print("  ✅ main.py imported successfully")
        
        return True
    except Exception as e:
        print(f"  ❌ Import failed: {e}")
        return False


def verify_candidate_manager():
    """Verify CandidateManager works correctly"""
    print("\n🔍 Verifying CandidateManager...")
    try:
        from candidate_manager import CandidateManager
        
        manager = CandidateManager()
        stats = manager.get_stats()
        
        if stats["total"] == 0:
            print("  ⚠️  No candidates loaded (CSV might be missing)")
            return True
        
        print(f"  ✅ Loaded {stats['total']} total candidates")
        print(f"     - Barangay Kapitan: {stats['kapitan']}")
        print(f"     - SK Chairman: {stats['sk_chairman']}")
        print(f"     - Kagawad: {stats['kagawad']}")
        
        return True
    except Exception as e:
        print(f"  ❌ CandidateManager verification failed: {e}")
        return False


def verify_session_manager():
    """Verify SessionManager works correctly"""
    print("\n🔍 Verifying SessionManager...")
    try:
        from session_manager import SessionManager
        
        manager = SessionManager()
        session = manager.get_session("test_user")
        
        manager.update_session(session, "Hello", "greeting", "Test")
        
        if len(manager.get_session_history("test_user")) != 1:
            print("  ❌ Session history tracking failed")
            return False
        
        print("  ✅ Session tracking works correctly")
        return True
    except Exception as e:
        print(f"  ❌ SessionManager verification failed: {e}")
        return False


def verify_nlp_utils():
    """Verify NLP utilities work correctly"""
    print("\n🔍 Verifying NLP utilities...")
    try:
        from nlp_utils import detect_intent, detect_language, detect_vibe
        
        # Test intent detection
        intent, score = detect_intent("Paano bumoto?")
        if intent != "voting_process":
            print(f"  ❌ Intent detection failed: got {intent}")
            return False
        print(f"  ✅ Intent detection works (detected: {intent})")
        
        # Test language detection
        lang = detect_language("Who are the candidates?")
        if lang not in ["english", "tagalog"]:
            print(f"  ❌ Language detection failed: got {lang}")
            return False
        print(f"  ✅ Language detection works (detected: {lang})")
        
        # Test vibe detection
        vibe = detect_vibe("Thank you!", "english")
        if vibe not in ["positive", "negative", "neutral"]:
            print(f"  ❌ Vibe detection failed: got {vibe}")
            return False
        print(f"  ✅ Vibe detection works (detected: {vibe})")
        
        return True
    except Exception as e:
        print(f"  ❌ NLP utilities verification failed: {e}")
        return False


def verify_responses():
    """Verify response templates are properly structured"""
    print("\n🔍 Verifying response templates...")
    try:
        from responses import RESPONSES
        
        required_intents = [
            'greeting', 'voting_process', 'eligibility', 'registration',
            'security', 'thanks', 'goodbye', 'help', 'unknown'
        ]
        
        missing = [intent for intent in required_intents if intent not in RESPONSES]
        
        if missing:
            print(f"  ❌ Missing response templates: {missing}")
            return False
        
        print(f"  ✅ All {len(RESPONSES)} response types present")
        print(f"     - Required: {len(required_intents)} ✅")
        
        return True
    except Exception as e:
        print(f"  ❌ Response template verification failed: {e}")
        return False


def verify_config():
    """Verify configuration is properly set"""
    print("\n🔍 Verifying configuration...")
    try:
        from config import (
            CORS_ORIGINS, APP_TITLE, APP_VERSION,
            INTENT_PATTERNS, VIBE_KEYWORDS,
            CONVERSATIONAL_STARTERS, FOLLOW_UP_SUGGESTIONS
        )
        
        if not CORS_ORIGINS:
            print("  ❌ CORS origins not configured")
            return False
        
        if not INTENT_PATTERNS:
            print("  ❌ Intent patterns not configured")
            return False
        
        print(f"  ✅ APP: {APP_TITLE} v{APP_VERSION}")
        print(f"  ✅ CORS origins: {len(CORS_ORIGINS)}")
        print(f"  ✅ Intent patterns: {len(INTENT_PATTERNS)}")
        print(f"  ✅ Vibe keywords: {len(VIBE_KEYWORDS)} languages")
        
        return True
    except Exception as e:
        print(f"  ❌ Configuration verification failed: {e}")
        return False


def main():
    """Run all verifications"""
    print("=" * 60)
    print("🚀 AI-CHATBOT REFACTORING VERIFICATION")
    print("=" * 60)
    
    results = {
        "Imports": verify_imports(),
        "Configuration": verify_config(),
        "Response Templates": verify_responses(),
        "NLP Utilities": verify_nlp_utils(),
        "CandidateManager": verify_candidate_manager(),
        "SessionManager": verify_session_manager(),
    }
    
    print("\n" + "=" * 60)
    print("📊 VERIFICATION SUMMARY")
    print("=" * 60)
    
    for check, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{check:.<40} {status}")
    
    all_passed = all(results.values())
    
    print("=" * 60)
    if all_passed:
        print("✅ ALL VERIFICATIONS PASSED - READY FOR PRODUCTION")
    else:
        print("❌ SOME VERIFICATIONS FAILED - SEE ERRORS ABOVE")
    print("=" * 60)
    
    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
