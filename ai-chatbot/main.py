"""Main FastAPI application for Mayombo AI Assistant"""

import random
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import CORS_ORIGINS, APP_TITLE, APP_VERSION
from responses import RESPONSES
from nlp_utils import (
    detect_intent, detect_vibe, detect_language,
    apply_vibe_to_response, clean_response,
    add_conversational_flair, apply_conversational_logic
)
from candidate_manager import CandidateManager
from session_manager import SessionManager


# Initialize FastAPI app
app = FastAPI(title=APP_TITLE)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],  # Add your frontend ports here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize managers
candidate_manager = CandidateManager()
session_manager = SessionManager()


# === REQUEST MODEL ===
class ChatMessage(BaseModel):
    message: str


# === HELPER FUNCTIONS ===
def get_user_identifier(request: Request) -> str:
    """Get user identifier from request"""
    return request.client.host


def generate_reply(intent: str, language: str) -> str:
    """Generate response based on intent and language"""
    if intent not in RESPONSES:
        intent = 'unknown'
    
    responses = RESPONSES[intent]
    
    # Filter responses by detected language
    if language == 'tagalog':
        filtered = [r for r in responses if any(
            word in r.lower() for word in 
            ['ang ', 'mga ', ' sa ', ' ng ', 'boto', 'kandidato', 'pagboto', 'botante']
        )]
    else:  # english
        filtered = [r for r in responses if not any(
            marker in r.lower() for marker in 
            [' ang ', ' mga ', ' sa ', ' ng ']
        )]
    
    # Use filtered responses if available, else fallback
    return random.choice(filtered) if filtered else random.choice(responses)


# === ROUTES ===
@app.post("/chat")
async def chat(msg: ChatMessage, request: Request):
    """Main chat endpoint"""
    user_msg = msg.message.strip()
    
    if not user_msg:
        return {"reply": "Walang mensahe. Ano ang gusto mong itanong? 😊"}
    
    # Get user identifier and session
    user_id = get_user_identifier(request)
    session = session_manager.get_session(user_id)
    
    # Detect intent, language, and vibe
    intent, confidence = detect_intent(user_msg)
    language = detect_language(user_msg)
    vibe = detect_vibe(user_msg, language)
    
    # Apply conversational context logic
    intent = apply_conversational_logic(user_msg, intent, language, session)
    
    # === HANDLE CANDIDATE QUERIES ===
    if intent == 'kapitan_candidates':
        reply = candidate_manager.format_candidates("Barangay Kapitan")
        reply = add_conversational_flair(reply, intent, language)
        reply = apply_vibe_to_response(reply, vibe, language)
        session_manager.update_session(session, user_msg, intent, "Barangay Kapitan", language)
        return {"reply": reply}
    
    elif intent == 'sk_candidates':
        reply = candidate_manager.format_candidates("SK Chairman")
        reply = add_conversational_flair(reply, intent, language)
        reply = apply_vibe_to_response(reply, vibe, language)
        session_manager.update_session(session, user_msg, intent, "SK Chairman", language)
        return {"reply": reply}
    
    elif intent == 'kagawad_candidates':
        reply = candidate_manager.format_candidates("Kagawad")
        reply = add_conversational_flair(reply, intent, language)
        reply = apply_vibe_to_response(reply, vibe, language)
        session_manager.update_session(session, user_msg, intent, "Kagawad", language)
        return {"reply": reply}
    
    elif intent == 'all_candidates':
        reply = "**Lahat ng Kandidato / All Candidates:**\n\n"
        for position in ["Barangay Kapitan", "SK Chairman", "Kagawad"]:
            reply += candidate_manager.format_candidates(position) + "\n\n"
        reply += "🗳️ Piliin nang mabuti! Choose wisely!"
        reply = add_conversational_flair(reply, intent, language)
        reply = apply_vibe_to_response(reply, vibe, language)
        session_manager.update_session(session, user_msg, intent, language=language)
        return {"reply": reply.strip()}
    
    # === CHECK FOR SPECIFIC CANDIDATE ===
    candidate_info = candidate_manager.get_candidate_info(user_msg)
    if candidate_info:
        reply = candidate_info
        reply = add_conversational_flair(reply, 'candidate_detail', language)
        reply = apply_vibe_to_response(reply, vibe, language)
        session_manager.update_session(session, user_msg, 'candidate_detail', language=language)
        return {"reply": reply}
    
    # === HANDLE GENERAL INTENTS ===
    reply = generate_reply(intent, language)
    reply = clean_response(intent, reply)
    reply = add_conversational_flair(reply, intent, language)
    reply = apply_vibe_to_response(reply, vibe, language)
    session_manager.update_session(session, user_msg, intent, language=language)
    
    return {"reply": reply}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Mayombo AI Assistant is running! / Gumagana ang Mayombo AI Assistant!",
        "status": "online",
        "version": APP_VERSION
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    stats = candidate_manager.get_stats()
    return {
        "status": "healthy",
        "candidates_loaded": stats["total"],
        "total_kapitan": stats["kapitan"],
        "total_sk": stats["sk_chairman"],
        "total_kagawad": stats["kagawad"],
        "language_support": ["English", "Tagalog"],
        "vibe_detection": "enabled",
        "conversational_ai": "enabled",
        "active_sessions": session_manager.get_active_sessions_count()
    }


@app.get("/stats")
async def stats():
    """Get chatbot statistics"""
    candidate_stats = candidate_manager.get_stats()
    return {
        "total_candidates": candidate_stats["total"],
        "positions": list(candidate_manager.candidates.keys()),
        "supported_languages": ["English", "Tagalog"],
        "vibe_aware": True,
        "context_aware": True,
        "active_sessions": session_manager.get_active_sessions_count()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
