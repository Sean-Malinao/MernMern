"""Session management for conversational memory"""

from typing import Dict


class SessionManager:
    """Manages user sessions and conversation history with ML-like learning"""
    
    def __init__(self):
        self.sessions: Dict = {}
        self.learning_patterns: Dict = {}  # Track patterns for ML behavior
    
    def get_session(self, user_identifier: str) -> Dict:
        """Get or create session for user with learning context"""
        if user_identifier not in self.sessions:
            self.sessions[user_identifier] = {
                "history": [],
                "last_intent": None,
                "last_position": None,
                "topics_mentioned": [],  # ML: track topics for context
                "languages_used": [],    # ML: track language preferences
                "conversation_depth": 0  # ML: track engagement level
            }
        return self.sessions[user_identifier]
    
    def update_session(self, session: Dict, message: str, intent: str, position: str = None, language: str = "english"):
        """Update session with new message and context (with ML learning)"""
        session["history"].append(message.lower())
        
        # Keep last 5 messages for better context (increased from 3)
        if len(session["history"]) > 5:
            session["history"].pop(0)
        
        session["last_intent"] = intent
        
        # ML Learning: Track topics for contextual follow-ups
        if intent not in session["topics_mentioned"]:
            session["topics_mentioned"].append(intent)
        
        # ML Learning: Track language preferences
        if language not in session["languages_used"]:
            session["languages_used"].append(language)
        
        # ML Learning: Increase conversation depth
        session["conversation_depth"] += 1
        
        if position:
            session["last_position"] = position
    
    def get_session_history(self, user_identifier: str) -> list:
        """Get conversation history for user"""
        session = self.get_session(user_identifier)
        return session.get("history", [])
    
    def get_last_intent(self, user_identifier: str) -> str:
        """Get the last detected intent for user"""
        session = self.get_session(user_identifier)
        return session.get("last_intent")
    
    def clear_session(self, user_identifier: str):
        """Clear session data for user"""
        if user_identifier in self.sessions:
            del self.sessions[user_identifier]
    
    def get_active_sessions_count(self) -> int:
        """Get count of active sessions"""
        return len(self.sessions)
    
    def get_session_learning_data(self, user_identifier: str) -> dict:
        """Get ML learning data about user for smarter responses"""
        session = self.get_session(user_identifier)
        return {
            "topics_discussed": session.get("topics_mentioned", []),
            "languages_preferred": session.get("languages_used", []),
            "conversation_depth": session.get("conversation_depth", 0)
        }
