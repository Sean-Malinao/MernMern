"""Core NLP and processing utilities"""

import re
import random
from typing import Tuple, Optional
from config import INTENT_PATTERNS, VIBE_KEYWORDS, CONVERSATIONAL_STARTERS, FOLLOW_UP_SUGGESTIONS


def detect_intent(message: str) -> Tuple[str, float]:
    """Detect user intent using pattern matching"""
    message = message.lower().strip()
    
    best_intent = 'unknown'
    best_score = 0.0
    
    for pattern, intent, base_score in INTENT_PATTERNS:
        if re.search(pattern, message, re.IGNORECASE):
            if base_score > best_score:
                best_score = base_score
                best_intent = intent
    
    return best_intent, best_score


def detect_vibe(message: str, language: str) -> str:
    """Lightweight vibe detection using keywords"""
    msg_lower = message.lower()
    lang_kw = VIBE_KEYWORDS.get(language, VIBE_KEYWORDS["english"])
    
    for kw in lang_kw["negative"]:
        if kw in msg_lower:
            return "negative"
    
    for kw in lang_kw["positive"]:
        if kw in msg_lower:
            return "positive"
    
    return "neutral"


def detect_language(message: str) -> str:
    """Improved language detection (English vs Tagalog vs Taglish - mixed language)"""
    msg_lower = message.lower().strip()
    
    # Strong English indicators (prioritize these)
    english_indicators = ['thank', 'thanks', 'you ', 'your ', 'how to', 'can i', 'what is', 'where ', 'when ', 'who ', 'vote', 'candidates', 'eligible', 'register']
    english_score = sum(1 for word in english_indicators if word in msg_lower)
    
    # Strong Tagalog indicators
    tagalog_indicators = ['ang ', 'ng ', 'sa ', 'mga ', 'ko ', 'mo ', 'ano ', 'sino ', 'paano ', 'salamat', 'boto', 'kandidato', 'bumoto', 'pagboto']
    tagalog_score = sum(1 for word in tagalog_indicators if word in msg_lower)
    
    # Taglish indicators (mixed English-Tagalog patterns) - CRITICAL for better detection
    taglish_patterns = ['paano mag', 'paano bumoto', 'ano ang kailangan', 'pwede ko', 'pwede ba', 'mag vote', 'mag-vote', 'how bumoto', 'eligible ba', 'ano eligibility']
    taglish_score = sum(1 for pattern in taglish_patterns if pattern in msg_lower)
    
    # Decision logic: Taglish gets priority for proper response
    if taglish_score > 0:
        return 'tagalog'  # Treat Taglish as Tagalog for better responses
    elif english_score > tagalog_score:
        return 'english'
    elif tagalog_score > 0:
        return 'tagalog'
    else:
        return 'english'


def apply_vibe_to_response(reply: str, vibe: str, language: str) -> str:
    """Add vibe-appropriate touches WITHOUT changing factual content"""
    if vibe == "positive":
        closings = {
            "english": "\n\n✨ Happy to help! Your vote matters! 🗳️",
            "tagalog": "\n\n✨ Masaya kaming makatulong! Mahalaga ang boto mo! 🗳️"
        }
        return reply + closings.get(language, closings["english"])
    
    elif vibe == "negative":
        empathy = {
            "english": "😔 We understand this can be frustrating. ",
            "tagalog": "😔 Naiintindihan namin na nakakainis minsan. "
        }
        help_offer = {
            "english": "\n\n📞 Need help? Type 'help' for assistance!",
            "tagalog": "\n\n📞 Kailangan ng tulong? I-type ang 'help'!"
        }
        return empathy.get(language, empathy["english"]) + reply + help_offer.get(language, help_offer["english"])
    
    return reply


def clean_response(intent: str, text: str) -> str:
    """Remove headers that repeat the user's question"""
    INTENT_HEADERS = {
        "voting_process": ["paano bumoto", "how to vote", "voting process", "hakbang sa pagboto"],
        "eligibility": ["kinakailangan para bumoto", "voter eligibility"],
        "registration": ["paano magparehistro", "how to register"]
    }

    if intent in INTENT_HEADERS:
        for header in INTENT_HEADERS[intent]:
            text = re.sub(rf"\*\*.*{header}.*?\*\*\s*", "", text, flags=re.IGNORECASE)
            text = re.sub(rf".*{header}.*:\s*", "", text, flags=re.IGNORECASE)

    return text.strip()


def add_conversational_flair(reply: str, intent: str, language: str) -> str:
    """Add natural conversation flow (simulates ML personality)"""
    # Add starter phrase for non-greeting intents
    if intent not in ['greeting', 'thanks', 'goodbye', 'unknown']:
        starter = random.choice(CONVERSATIONAL_STARTERS.get(language, CONVERSATIONAL_STARTERS["english"]))
        reply = starter + reply
    
    # Add follow-up suggestion for key intents
    if intent in FOLLOW_UP_SUGGESTIONS:
        suggestion = FOLLOW_UP_SUGGESTIONS[intent].get(language, FOLLOW_UP_SUGGESTIONS[intent]["english"])
        reply += suggestion
    
    # Special handling for greetings
    elif intent == 'greeting':
        closing = random.choice([
            "\n\nWhat would you like to know about the election?",
            "\n\nHow can I help you today?",
            "\n\nAsk me anything about the Mayombo election!",
            "\n\nReady to make your voice heard? 💬",
            "\n\nI'm here to help with anything election-related!"
        ])
        reply += closing
    
    return reply


def apply_conversational_logic(user_msg: str, intent: str, lang: str, session: dict) -> str:
    """Handle conversational follow-ups and context"""
    if intent == 'unknown':
        last_intent = session.get("last_intent")
        
        # Handle "and for SK?" type follow-ups
        if last_intent in ['kapitan_candidates', 'kagawad_candidates'] and re.search(r'\b(sk|sangguniang kabataan)\b', user_msg, re.IGNORECASE):
            return 'sk_candidates'
        elif last_intent == 'sk_candidates' and re.search(r'\b(kapitan|barangay captain)\b', user_msg, re.IGNORECASE):
            return 'kapitan_candidates'
        elif last_intent in ['kapitan_candidates', 'sk_candidates'] and re.search(r'\b(kagawad|councilor)\b', user_msg, re.IGNORECASE):
            return 'kagawad_candidates'
    
    return intent
