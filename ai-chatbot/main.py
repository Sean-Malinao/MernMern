# ai-chatbot/main.py
import csv
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Mayombo AI Assistant")

# Enable CORS for React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# === LOAD CANDIDATES FROM YOUR EXACT FILE ===
CANDIDATES = {"Barangay Kapitan": [], "SK Chairman": []}

# Load candidates from CSV file
csv_path = os.path.join(os.path.dirname(__file__), "candidates.csv")

try:
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Clean whitespace from keys and values
            clean_row = {k.strip(): v.strip() for k, v in row.items()}
            position = clean_row.get("Position", "")
            name = clean_row.get("Candidate Name", "")
            party = clean_row.get("Party", "")

            if position == "Barangay Kapitan" and name:
                CANDIDATES["Barangay Kapitan"].append({"name": name, "party": party})
            elif position == "SK Chairman" and name:
                CANDIDATES["SK Chairman"].append({"name": name, "party": party})
    
    print(f"✅ Loaded {len(CANDIDATES['Barangay Kapitan'])} Barangay Kapitan candidates")
    print(f"✅ Loaded {len(CANDIDATES['SK Chairman'])} SK Chairman candidates")

except Exception as e:
    print("❌ Error loading CSV:", e)
    CANDIDATES = {"Barangay Kapitan": [], "SK Chairman": []}

class ChatMessage(BaseModel):
    message: str

@app.post("/chat")
async def chat(msg: ChatMessage):
    user_msg = msg.message.lower().strip()
    clean_msg = " ".join(user_msg.split())

    # Greeting
    if any(w in clean_msg for w in ["hi", "hello", "hey"]):
        return {"reply": "Hello! I'm Mayombo's Election Assistant. Ask me about candidates or voting."}

    # Barangay Kapitan
    if ("barangay" in clean_msg and ("kapitan" in clean_msg or "captain" in clean_msg)) or \
       "barangay kapitan" in clean_msg:
        if CANDIDATES["Barangay Kapitan"]:
            names = [f"• {c['name']} ({c['party']})" for c in CANDIDATES["Barangay Kapitan"]]
            return {"reply": "Barangay Kapitan candidates:\n" + "\n".join(names)}
        else:
            return {"reply": "No Barangay Kapitan candidates found."}

    # SK Chairman
    if ("sk" in clean_msg and ("chairman" in clean_msg or "captain" in clean_msg)) or \
       "sk chairman" in clean_msg:
        if CANDIDATES["SK Chairman"]:
            names = [f"• {c['name']} ({c['party']})" for c in CANDIDATES["SK Chairman"]]
            return {"reply": "SK Chairman candidates:\n" + "\n".join(names)}
        else:
            return {"reply": "No SK Chairman candidates found."}

    # Voting process
    if any(word in clean_msg for word in ["how to vote", "voting steps", "cast vote"]):
        return {"reply": "1. Log in with Voter ID & DOB\n2. Verify identity\n3. Select candidates\n4. Confirm. Your vote is secured on blockchain."}

    # Eligibility
    if any(word in clean_msg for word in ["eligible", "can i vote", "requirements"]):
        return {"reply": "Eligible if:\n• 15+ → SK election\n• 18+ → Barangay election\n• Registered in Mayombo"}

    # Prediction
    if any(word in clean_msg for word in ["winning", "prediction", "who will win"]):
        return {"reply": "Current trends:\n• Barangay: Juan Dela Cruz\n• SK: Miguel Santos"}

    # Default
    return {"reply": "Try: 'barangay kapitan', 'sk chairman', or 'how to vote'"}