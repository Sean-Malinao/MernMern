# ai-chatbot/main.py
import csv
import os
import re
import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Tuple

app = FastAPI(title="Mayombo AI Assistant")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# === KNOWLEDGE BASE ===
CANDIDATES = {"Barangay Kapitan": [], "SK Chairman": [], "Kagawad": []}

# Load candidates from CSV
csv_path = os.path.join(os.path.dirname(__file__), "candidates.csv")

try:
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            clean_row = {k.strip(): v.strip() for k, v in row.items()}
            position = clean_row.get("Position", "")
            name = clean_row.get("Candidate Name", "")
            party = clean_row.get("Party", "")

            if position == "Barangay Kapitan" and name:
                CANDIDATES["Barangay Kapitan"].append({"name": name, "party": party})
            elif position == "SK Chairman" and name:
                CANDIDATES["SK Chairman"].append({"name": name, "party": party})
            elif position == "Kagawad" and name:
                CANDIDATES["Kagawad"].append({"name": name, "party": party})
    
    print(f"✅ Loaded {len(CANDIDATES['Barangay Kapitan'])} Barangay Kapitan candidates")
    print(f"✅ Loaded {len(CANDIDATES['SK Chairman'])} SK Chairman candidates")
    print(f"✅ Loaded {len(CANDIDATES['Kagawad'])} Kagawad candidates")

except Exception as e:
    print("❌ Error loading CSV:", e)

# === INTENT PATTERNS (English & Tagalog) ===
INTENT_PATTERNS = [
    # Greetings (English & Tagalog)
    (r'\b(hi|hello|hey|good morning|good afternoon|good evening)\b', 'greeting', 1.0),
    (r'\b(kumusta|magandang (umaga|tanghali|hapon|gabi)|kamusta|musta)\b', 'greeting', 1.0),
    (r'\b(yo|sup|what\'s up)\b', 'greeting', 0.9),
    
    # Candidates queries (English & Tagalog)
    (r'\b(barangay kapitan|captain|barangay captain|kapitan)\b', 'kapitan_candidates', 0.9),
    (r'\b(sino ang (mga )?kandidato|sino (mga )?tumatakbo|listahan ng kandidato)\b', 'all_candidates', 0.9),
    (r'\b(sk chairman|sk captain|sangguniang kabataan|sk chairperson)\b', 'sk_candidates', 0.9),
    (r'\b(kagawad|councilor|konsehal)\b', 'kagawad_candidates', 0.9),
    (r'\b(all candidates|show all|list all|lahat ng kandidato)\b', 'all_candidates', 0.8),
    (r'\b(sino|sinong|who are|who is)\b.*\b(kandidato|candidates|tumatakbo|running)\b', 'all_candidates', 0.8),
    
    # Voting process (English & Tagalog)
    (r'\b(how to vote|voting process|how do i vote|how can i vote)\b', 'voting_process', 1.0),
    (r'\b(paano (ako )?bumoto|paano ang pagboto|proseso ng pagboto)\b', 'voting_process', 1.0),
    (r'\b(voting steps|steps to vote|hakbang sa pagboto)\b', 'voting_process', 0.9),
    (r'\b(cast vote|submit vote|iboto|magboto)\b', 'voting_process', 0.8),
    (r'\b(kumpletuhin ang boto|confirm vote)\b', 'voting_process', 0.8),
    
    # Eligibility (English & Tagalog)
    (r'\b(eligible|can i vote|am i qualified|requirements|pwede ba ako bumoto)\b', 'eligibility', 1.0),
    (r'\b(edad|age requirement|voter age|ilang taon)\b', 'eligibility', 0.9),
    (r'\b(kwalipikado|qualified|karapat-dapat)\b', 'eligibility', 0.9),
    (r'\b(requirements|kinakailangan|ano ang kailangan)\b', 'eligibility', 0.8),
    
    # Registration (English & Tagalog)
    (r'\b(register|registration|sign up|magparehistro|pagrehistro)\b', 'registration', 0.9),
    (r'\b(paano (mag)?register|how to register|saan magparehistro)\b', 'registration', 1.0),
    (r'\b(voter id|id ng botante|voter\'s id)\b', 'registration', 0.8),
    
    # Blockchain/Security (English & Tagalog)
    (r'\b(blockchain|secure|security|safe|ligtas)\b', 'security', 0.9),
    (r'\b(tamper|fraud|cheat|daya|pandaraya)\b', 'security', 0.8),
    (r'\b(protektado|protected|encrypted|secure ba)\b', 'security', 0.9),
    (r'\b(privacy|private|pribado|lihim)\b', 'privacy', 0.9),
    
    # Election info (English & Tagalog)
    (r'\b(when|date|schedule|election day|kailan)\b', 'election_date', 0.8),
    (r'\b(kailan ang halalan|petsa ng halalan|schedule ng eleksyon)\b', 'election_date', 1.0),
    (r'\b(where to vote|voting location|precinct|saan boboto|lugar ng pagboto)\b', 'voting_location', 0.9),
    (r'\b(online|internet|sa bahay)\b.*\b(vote|boto)\b', 'online_voting', 0.9),
    
    # Results/Counting (English & Tagalog)
    (r'\b(results|tally|count|resulta|bilang)\b', 'results', 0.9),
    (r'\b(sino ang nanalo|who won|nag-lead|nangunguna)\b', 'results', 0.9),
    (r'\b(winning|prediction|who will win|forecast|manalo)\b', 'prediction', 0.9),
    (r'\b(real-time|live|realtime)\b', 'realtime_count', 0.9),
    
    # Voting rights & importance (English & Tagalog)
    (r'\b(why vote|bakit bumoto|importance|kahalagahan)\b', 'importance', 1.0),
    (r'\b(karapatan|rights|right to vote)\b', 'voting_rights', 0.9),
    
    # Problems/Issues (English & Tagalog)
    (r'\b(problema|problem|issue|error|hindi gumagana|not working)\b', 'technical_issue', 0.9),
    (r'\b(nakalimutan|forgot|password|voter id)\b', 'forgot_credentials', 0.9),
    (r'\b(nawala|lost|wala na)\b.*\b(id|voter)\b', 'forgot_credentials', 0.9),
    
    # Platform info (English & Tagalog)
    (r'\b(ano ang|what is|how does|paano gumagana)\b.*\b(system|platform|blockchain)\b', 'platform_info', 0.9),
    (r'\b(features|functionality|gamit|magagawa)\b', 'features', 0.9),
    
    # Positions explanation (English & Tagalog)
    (r'\b(ano ang|what is|tungkol sa)\b.*\b(kapitan|kagawad|sk chairman)\b', 'positions_info', 0.9),
    (r'\b(role|tungkulin|responsibilidad|responsibility)\b', 'positions_info', 0.8),
    
    # Thank you (English & Tagalog)
    (r'\b(thank you|thanks|salamat|maraming salamat|thank u|ty)\b', 'thanks', 1.0),
    
    # Goodbye (English & Tagalog)
    (r'\b(bye|goodbye|exit|quit|paalam|sige na)\b', 'goodbye', 1.0),
    
    # Help (English & Tagalog)
    (r'\b(help|what can you do|commands|tulong|ano kaya mong gawin)\b', 'help', 1.0),
]

# === RESPONSE TEMPLATES (Bilingual) ===
RESPONSES = {
    'greeting': [
        "Kumusta! Ako ang Mayombo Election Assistant. 👋\n\nMatutulong ako sa iyo sa:\n• Impormasyon tungkol sa mga kandidato\n• Proseso ng pagboto\n• Kinakailangan para bumoto\n• Seguridad ng eleksyon\n\nAno ang gusto mong malaman?",
        "Hello! I'm the Mayombo Election Assistant. 👋\n\nI can help you with:\n• Candidate information\n• Voting procedures\n• Eligibility requirements\n• Election security\n\nWhat would you like to know?",
        "Magandang araw! Maligayang pagdating sa Mayombo voting assistant. Paano kita matutulungan ngayon?",
    ],
    
    'voting_process': [
        "**Paano Bumoto sa Mayombo:**\n\n1️⃣ Mag-log in gamit ang iyong Voter ID at Petsa ng Kapanganakan\n2️⃣ I-verify ang iyong pagkakakilanlan\n3️⃣ Piliin ang iyong mga kandidato\n4️⃣ I-review ang iyong mga pinili\n5️⃣ I-confirm at i-submit ang boto\n\n💡 Tandaan: Isang beses lang ang pagboto at hindi na mababago pagkatapos i-submit!",
        "**How to Vote in Mayombo:**\n\n1️⃣ Log in with your Voter ID and Date of Birth\n2️⃣ Verify your identity\n3️⃣ Select your preferred candidates\n4️⃣ Review your choices\n5️⃣ Confirm and submit your vote\n\n💡 Remember: You can only vote once and cannot change after submission!",
    ],
    
    'eligibility': [
        "**Kinakailangan para Bumoto:**\n\n✅ **Para sa SK Election:**\n• Edad: 15-30 taong gulang\n• Nakarehisto bilang SK voter sa Mayombo\n\n✅ **Para sa Barangay Election:**\n• Edad: 18 taong gulang pataas\n• Nakarehisto bilang botante sa Mayombo\n• Pilipinong mamamayan\n\nSiguraduhing nakarehisto ka na bago ang araw ng halalan!",
        "**Voter Eligibility Requirements:**\n\n✅ **For SK Election:**\n• Age: 15-30 years old\n• Registered as SK voter in Mayombo\n\n✅ **For Barangay Election:**\n• Age: 18 years old and above\n• Registered voter in Mayombo\n• Filipino citizen\n\nMake sure you're registered before election day!",
    ],
    
    'registration': [
        "**Paano Magparehistro bilang Botante:**\n\n📝 **Mga Kakailanganin:**\n• Valid ID (School ID, Birth Certificate, etc.)\n• Proof of residency sa Mayombo\n• Application form\n\n📍 **Saan magparehistro:**\nPunta sa Office of the Barangay sa Mayombo\n\n⏰ **Kailan:**\nTingnan ang opisyal na schedule ng COMELEC\n\n💡 **Para sa online registration**, maghintay ng announcement mula sa barangay!",
        "**How to Register as a Voter:**\n\n📝 **Requirements:**\n• Valid ID (School ID, Birth Certificate, etc.)\n• Proof of residency in Mayombo\n• Application form\n\n📍 **Where to register:**\nVisit the Barangay Office in Mayombo\n\n⏰ **When:**\nCheck the official COMELEC schedule\n\n💡 **For online registration**, wait for official announcement from the barangay!",
    ],
    
    'security': [
        "**Seguridad ng Eleksyon:**\n\n🔒 **Blockchain Technology**: Bawat boto ay naka-record sa blockchain ledger na hindi mababago\n\n🔐 **Encryption**: Ang iyong boto ay naka-encrypt end-to-end\n\n✅ **Verification**: Mave-verify ang bawat boto nang hindi nalalaman kung sino bumoto\n\n🚫 **Tamper-Proof**: Kapag nai-record na, hindi na mababago o matatanggal ang boto\n\n🛡️ **Transparent**: Makikita ang bilang ng mga boto pero hindi ang identity ng bumoto\n\nLigtas at secure ang iyong boto!",
        "**Election Security Features:**\n\n🔒 **Blockchain Technology**: Every vote is recorded on an immutable blockchain ledger\n\n🔐 **Encryption**: Your vote is encrypted end-to-end\n\n✅ **Verification**: Each vote can be verified without revealing voter identity\n\n🚫 **Tamper-Proof**: Once recorded, votes cannot be altered or deleted\n\n🛡️ **Transparent**: Vote counts are visible but voter identity remains private\n\nYour vote is safe and secure!",
    ],
    
    'privacy': [
        "**Privacy at Confidentiality:**\n\n🔒 Ang iyong boto ay **100% lihim**\n\n✅ Walang makakakita kung sino ang binoto mo\n\n🛡️ Ang sistema ay hindi nag-store ng koneksyon sa pagitan ng voter at kandidato\n\n📊 Makikita lang ang kabuuang bilang ng boto, hindi individual votes\n\nAng iyong privacy ay protektado!",
    ],
    
    'election_date': [
        "**Petsa ng Halalan:**\n\n📅 Ang Mayombo Barangay Election ay susundin ang schedule ng COMELEC.\n\n🕒 Para sa eksaktong petsa at oras, mangyaring magtanong sa inyong local election office.\n\n📢 Abangan ang opisyal na pag-announce!\n\n💡 **Tip**: I-save ang petsa sa iyong calendar para hindi makalimutan!",
        "**Election Schedule:**\n\n📅 The Mayombo Barangay Election follows the COMELEC schedule.\n\n🕒 For the exact date and time, please check with your local election office.\n\n📢 Stay tuned for official announcements!\n\n💡 **Tip**: Save the date on your calendar so you won't forget!",
    ],
    
    'voting_location': [
        "**Saan Boboto:**\n\n💻 **Online Voting**: Pwede kang bumoto online through this secure platform kahit saan ka naroroon basta may internet!\n\n🏢 **In-Person** (kung available): Tingnan ang iyong voter registration para sa assigned precinct mo sa Barangay Mayombo.\n\n📱 Mas convenient ang online voting - boto ka kahit nasa bahay!",
        "**Where to Vote:**\n\n💻 **Online Voting**: You can vote online through this secure platform from anywhere with internet access!\n\n🏢 **In-Person** (if available): Check your voter registration for your assigned precinct in Barangay Mayombo.\n\n📱 Online voting is more convenient - vote from the comfort of your home!",
    ],
    
    'online_voting': [
        "**Online Voting:**\n\n✅ **Pwede ka bumoto online!**\n\n📱 Mga device na pwede gamitin:\n• Computer/Laptop\n• Tablet\n• Smartphone\n\n🌐 Kailangan lang ng stable internet connection\n\n🔒 Ligtas at secure ang online voting dahil sa blockchain technology\n\n💡 Vote kahit saan ka - sa bahay, opisina, o kahit nasaan!",
    ],
    
    'results': [
        "**Resulta ng Halalan:**\n\n📊 Available agad ang results pagkatapos ng voting period!\n\n⚡ Real-time ang vote counting dahil sa blockchain system\n\n🔍 Transparent at verifiable lahat ng boto\n\n📅 Bumalik dito pagkatapos ng eleksyon para makita ang opisyal na resulta!\n\n💡 Walang overnight counting - instant results!",
        "**Election Results:**\n\n📊 Results will be available immediately after the voting period closes!\n\n⚡ Real-time vote counting thanks to blockchain system\n\n🔍 All votes are transparent and verifiable\n\n📅 Check back here after the election to view official results!\n\n💡 No overnight counting - instant results!",
    ],
    
    'realtime_count': [
        "**Real-time Vote Counting:**\n\n⚡ Oo! Real-time ang bilang ng boto sa blockchain system\n\n📊 Makikita mo agad ang:\n• Bilang ng mga bumoto\n• Current tally (habang nagpapatuloy ang voting)\n• Final results (pagkatapos ng election)\n\n🔍 Transparent at accurate ang lahat!\n\nIto ang advantage ng blockchain technology!",
    ],
    
    'prediction': [
        "Hindi ako pwedeng gumawa ng prediction tungkol sa election results. 🤐\n\nBawat boto ay mahalaga! Ikaw ang magpapasya kung sino ang dapat manalo.\n\n🗳️ Hikayatin ang mga kapwa mamamayan na lumahok sa demokratikong prosesong ito.\n\n💪 Ang iyong boto ay ang iyong tinig!",
        "I cannot make official predictions about election outcomes. 🤐\n\nEvery vote counts! You decide who should win.\n\n🗳️ Encourage your fellow citizens to participate in this democratic process.\n\n💪 Your vote is your voice!",
    ],
    
    'importance': [
        "**Bakit Mahalaga ang Pagboto:**\n\n🗳️ **Karapatan mo ito** - Ito ay constitutional right ng bawat mamamayan\n\n🏘️ **Makakaapekto sa barangay** - Ang mga napipili mo ay maglilingkod sa inyong komunidad\n\n💪 **Iyong tinig** - Ang boto mo ay ang paraan para marinig ka\n\n👥 **Accountability** - Pipiliin mo ang mga responsableng lider\n\n🌟 **Pagbabago** - Nagsisimula sa local governance ang tunay na pagbabago\n\nAng iyong boto ay may kapangyarihan!",
    ],
    
    'voting_rights': [
        "**Karapatan sa Pagboto:**\n\n✅ Bawat qualified citizen ay may karapatang bumoto\n✅ Walang pwedeng pumigil sa iyo na bumoto\n✅ Ang iyong boto ay lihim at protektado\n✅ Hindi ka pwedeng pilitin kung sino iboboto\n✅ Pantay-pantay ang lahat ng boto\n\n🛡️ Ang mga karapatan mo ay protektado ng Konstitusyon at batas!",
    ],
    
    'technical_issue': [
        "**May Problema sa Sistema?**\n\n🔧 Subukan ang mga sumusunod:\n\n1️⃣ I-refresh ang page (F5)\n2️⃣ I-clear ang browser cache\n3️⃣ Gumamit ng updated browser\n4️⃣ I-check ang internet connection\n\n📞 **Kung patuloy ang problema:**\nMakipag-ugnayan sa technical support:\n• Email: support@mayombo-voting.ph\n• Hotline: (Available during election period)\n\n💡 Mag-screenshot ng error para mas mabilis masolusyunan!",
    ],
    
    'forgot_credentials': [
        "**Nakalimutan ang Voter ID o Password?**\n\n🔑 **Para sa Voter ID:**\n• Tingnan ang iyong voter registration certificate\n• Contact ang Barangay Office\n• Dalhin ang valid ID para ma-verify\n\n🔐 **Para sa Password:**\n• I-click ang 'Forgot Password' sa login page\n• Susundin ang instructions na ipapadala sa registered email/phone\n\n📞 **Kailangan ng tulong:**\nPumunta sa Barangay Office na may dalang valid ID\n\n💡 I-save ang credentials mo sa safe place!",
    ],
    
    'platform_info': [
        "**Tungkol sa Mayombo Voting Platform:**\n\n🌐 Ito ay secure, blockchain-based voting system\n\n✨ **Features:**\n• End-to-end encryption\n• Real-time vote counting\n• Tamper-proof records\n• Anonymous voting\n• Accessible kahit saan\n\n🔒 Gumagamit ng latest technology para sa:\n• Security\n• Transparency\n• Convenience\n• Accuracy\n\nModernong paraan ng pagboto para sa Mayombo!",
    ],
    
    'features': [
        "**Ano ang Magagawa ng Platform:**\n\n✅ Tingnan ang mga kandidato\n✅ Bumoto ng secure at private\n✅ I-verify ang iyong boto\n✅ Makita ang real-time results\n✅ View election statistics\n✅ Makatanggap ng notifications\n✅ Access voter education materials\n\n📱 User-friendly interface\n🔒 Maximum security\n⚡ Fast at efficient\n\nLahat ng kailangan mo para sa democratic participation!",
    ],
    
    'positions_info': [
        "**Mga Posisyon sa Barangay Election:**\n\n👔 **Barangay Kapitan**\n• Pinuno ng barangay\n• Namamahala sa day-to-day operations\n• Nag-implement ng programs at policies\n\n👥 **Barangay Kagawad** (Councilors)\n• Miyembro ng Sangguniang Barangay\n• Tumutulong sa pagpapasa ng ordinansa\n• May specific committees\n\n🎓 **SK Chairman**\n• Pinuno ng Sangguniang Kabataan\n• Nag-represent sa kabataan (15-30 years old)\n• Nag-organize ng youth programs\n\nLahat ay may mahalagang papel sa barangay!",
    ],
    
    'thanks': [
        "Walang anuman! 😊\n\nMay iba ka pang tanong? Nandito lang ako para tumulong!\n\n🗳️ Huwag kalimutang bumoto!",
        "You're welcome! 😊\n\nDo you have any other questions? I'm here to help!\n\n🗳️ Don't forget to vote!",
        "Salamat sa pagtanong! May matutulungan pa ba ako?",
    ],
    
    'goodbye': [
        "Paalam! Salamat sa pagbisita. 👋\n\n🗳️ Tandaan: Ang iyong boto ay mahalaga!\n\nHanggang sa muli!",
        "Goodbye! Thanks for visiting. 👋\n\n🗳️ Remember: Your vote matters!\n\nSee you again!",
        "Sige, ingat! Bumoto ka ha! 🗳️😊",
    ],
    
    'help': [
        "**Matutulungan kita sa mga sumusunod:**\n\n📋 **Kandidato**\n• Sino ang tumatakbo?\n• Partido ng kandidato\n• Lahat ng kandidato\n\n🗳️ **Pagboto**\n• Paano bumoto?\n• Saan boboto?\n• Kailan ang halalan?\n\n✅ **Eligibility**\n• Pwede ba ako bumoto?\n• Ano ang requirements?\n\n🔒 **Seguridad**\n• Gaano ka-secure?\n• Ano ang blockchain?\n\n💡 **Subukan:**\n• \"Sino ang kandidato para sa kapitan?\"\n• \"Paano ako boboto?\"\n• \"Pwede ba akong bumoto?\"\n• \"Gaano kasecure ang election?\"\n• \"Kailan ang halalan?\"\n\nType 'help' anytime kung kailangan mo ng tulong!",
        "**I can help you with:**\n\n📋 **Candidates**\n• Who are running?\n• Candidate's party\n• All candidates\n\n🗳️ **Voting**\n• How to vote?\n• Where to vote?\n• When is the election?\n\n✅ **Eligibility**\n• Can I vote?\n• What are the requirements?\n\n🔒 **Security**\n• How secure is it?\n• What is blockchain?\n\n💡 **Try asking:**\n• \"Who are the barangay kapitan candidates?\"\n• \"How do I vote?\"\n• \"Am I eligible to vote?\"\n• \"How secure is this election?\"\n• \"When is the election?\"\n\nType 'help' anytime you need assistance!",
    ],
    
    'unknown': [
        "Hindi ko masyadong naintindihan ang iyong tanong. 🤔\n\nPwede mo bang ulitin o gawing mas malinaw?\n\n💡 **Pwede mong itanong ang tungkol sa:**\n• Kandidato\n• Proseso ng pagboto\n• Kinakailangan para bumoto\n• Seguridad ng eleksyon\n\nI-type ang 'help' para makita ang buong listahan!",
        "I'm not sure I understood that. 🤔\n\nCould you rephrase your question?\n\n💡 **You can ask me about:**\n• Candidates\n• Voting process\n• Eligibility\n• Election security\n\nType 'help' to see what I can do!",
        "Pasensya na, hindi ko naintindihan. Pwede bang mas specific? Type 'help' para sa mga sample questions! 😊",
    ]
}

class ChatMessage(BaseModel):
    message: str

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

def format_candidates(position: str) -> str:
    """Format candidate list for display"""
    if not CANDIDATES.get(position):
        return f"Walang nahanap na kandidato para sa {position} sa database."
    
    # Bilingual header
    tagalog_positions = {
        "Barangay Kapitan": "Barangay Kapitan",
        "SK Chairman": "SK Chairman",
        "Kagawad": "Kagawad"
    }
    
    candidates_list = [f"• {c['name']} ({c['party']})" for c in CANDIDATES[position]]
    
    header = f"**Mga Kandidato para sa {tagalog_positions.get(position, position)}:**\n\n"
    candidates_text = "\n".join(candidates_list)
    footer = f"\n\n📊 Kabuuang kandidato: {len(CANDIDATES[position])}"
    
    return header + candidates_text + footer

def get_candidate_info(message: str) -> str:
    """Extract specific candidate name from message"""
    message_lower = message.lower()
    
    # Search through all candidates
    for position, candidates in CANDIDATES.items():
        for candidate in candidates:
            if candidate['name'].lower() in message_lower:
                return f"**{candidate['name']}**\n\nPosisyon: {position}\nPartido: {candidate['party']}\n\n🎯 Good luck sa lahat ng mga kandidato!\n\nMay iba ka pang gustong malaman tungkol sa kandidatong ito?"
    
    return None

def detect_language(message: str) -> str:
    """Simple language detection (Tagalog vs English)"""
    tagalog_words = ['ano', 'sino', 'paano', 'saan', 'kailan', 'kumusta', 'salamat', 
                     'mga', 'ang', 'ng', 'sa', 'ko', 'mo', 'ka', 'ako', 'ikaw']
    
    message_lower = message.lower()
    tagalog_count = sum(1 for word in tagalog_words if word in message_lower.split())
    
    return 'tagalog' if tagalog_count >= 2 else 'english'

@app.post("/chat")
async def chat(msg: ChatMessage):
    user_msg = msg.message.strip()
    
    if not user_msg:
        return {"reply": "Walang mensahe. Ano ang gusto mong itanong? 😊"}
    
    # Detect intent
    intent, confidence = detect_intent(user_msg)
    
    # Detect language preference
    lang = detect_language(user_msg)
    
    # Handle candidate-specific queries
    if intent == 'kapitan_candidates':
        return {"reply": format_candidates("Barangay Kapitan")}
    
    elif intent == 'sk_candidates':
        return {"reply": format_candidates("SK Chairman")}
    
    elif intent == 'kagawad_candidates':
        return {"reply": format_candidates("Kagawad")}
    
    elif intent == 'all_candidates':
        reply = "**Lahat ng Kandidato / All Candidates:**\n\n"
        for position in ["Barangay Kapitan", "SK Chairman", "Kagawad"]:
            reply += format_candidates(position) + "\n\n"
        reply += "🗳️ Piliin nang mabuti! Choose wisely!"
        return {"reply": reply.strip()}
    
    # Check if asking about specific candidate
    candidate_info = get_candidate_info(user_msg)
    if candidate_info:
        return {"reply": candidate_info}
    
    # Return response for detected intent
    if intent in RESPONSES:
        responses = RESPONSES[intent]
        
        # Try to select response based on detected language
        if lang == 'tagalog':
            # Prefer Tagalog responses (usually first in list)
            tagalog_responses = [r for r in responses if any(word in r.lower() for word in ['ang', 'mga', 'sa', 'para', 'ng'])]
            if tagalog_responses:
                return {"reply": random.choice(tagalog_responses)}
        
        return {"reply": random.choice(responses)}
    
    # Default unknown response
    unknown_responses = RESPONSES['unknown']
    # Prefer Tagalog for unknown if user used Tagalog
    if lang == 'tagalog':
        return {"reply": unknown_responses[0]}
    return {"reply": random.choice(unknown_responses)}

@app.get("/")
async def root():
    return {
        "message": "Mayombo AI Assistant is running! / Gumagana ang Mayombo AI Assistant!",
        "status": "online",
        "version": "2.0 - Bilingual Edition"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "candidates_loaded": sum(len(v) for v in CANDIDATES.values()),
        "total_kapitan": len(CANDIDATES["Barangay Kapitan"]),
        "total_sk": len(CANDIDATES["SK Chairman"]),
        "total_kagawad": len(CANDIDATES["Kagawad"]),
        "language_support": ["English", "Tagalog"]
    }

@app.get("/stats")
async def stats():
    """Get chatbot statistics"""
    return {
        "total_intents": len(set(intent for _, intent, _ in INTENT_PATTERNS)),
        "total_patterns": len(INTENT_PATTERNS),
        "supported_languages": ["English", "Tagalog"],
        "total_candidates": sum(len(v) for v in CANDIDATES.values()),
        "positions": list(CANDIDATES.keys())
    }