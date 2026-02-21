"""Configuration and constants for the chatbot"""

CORS_ORIGINS = [
    "http://localhost:5174",
    "http://127.0.0.1:5174"
]

APP_TITLE = "Mayombo AI Assistant"
APP_VERSION = "4.0 - Conversational Edition"

VIBE_KEYWORDS = {
    "english": {
        "positive": ["thank", "awesome", "nice", "cool", "love", "helpful", "smooth", "perfect", "great", "amazing", "thanks", "salamat"],
        "negative": ["don't get", "hard", "error", "why", "damn", "annoying", "broken", "frustrating", "help me", "can't find", "stupid", "worst", "nakakainis", "hirap", "galit"]
    },
    "tagalog": {
        "positive": ["salamat", "ganda", "galing", "aliw", "smooth", "perpekto", "magaling", "sarap", "saya", "thank you", "thanks"],
        "negative": ["hindi ko", "hirap", "error", "bakit", "puta", "bwiset", "sira", "nakakainis", "tulong", "di ko", "galit", "stress", "annoying", "frustrating"]
    }
}

CONVERSATIONAL_STARTERS = {
    "english": [
        "Great question! ",
        "Ah, I see what you're asking. ",
        "Happy to help with that! ",
        "Let me explain clearly: ",
        "Good news: ",
        "Here's what you need to know: "
    ],
    "tagalog": [
        "Magandang tanong! ",
        "Naiintindihan ko ang itinatanong mo. ",
        "Masaya kong tutulungan ka! ",
        "Ipapaliwanag ko nang malinaw: ",
        "Magandang balita: ",
        "Eto ang kailangan mong malaman: "
    ]
}

FOLLOW_UP_SUGGESTIONS = {
    "kapitan_candidates": {
        "english": "\n\n💡 Want to know about SK Chairman candidates next?",
        "tagalog": "\n\n💡 Gusto mo bang malaman ang mga kandidato para sa SK Chairman susunod?"
    },
    "sk_candidates": {
        "english": "\n\n💡 Ready to learn the voting process?",
        "tagalog": "\n\n💡 Handa ka na bang matutunan ang proseso ng pagboto?"
    },
    "kagawad_candidates": {
        "english": "\n\n💡 Need help understanding how to vote for multiple Kagawads?",
        "tagalog": "\n\n💡 Kailangan mo ng tulong para maunawaan kung paano bumoto para sa maraming Kagawad?"
    },
    "eligibility": {
        "english": "\n\n💡 Would you like to know how to register next?",
        "tagalog": "\n\n💡 Gusto mo bang malaman kung paano magparehistro susunod?"
    },
    "voting_process": {
        "english": "\n\n💡 Want to see candidate lists before election day?",
        "tagalog": "\n\n💡 Gusto mo bang makita ang listahan ng mga kandidato bago ang araw ng halalan?"
    }
}

INTENT_PATTERNS = [
    (r'\b(hi|hello|hey|good (morning|afternoon|evening|day)|greetings|g\'day|yo|sup|what\'s up|wassup|hey there|hi there|howdy|how are you|kamusta|kumusta|magandang (umaga|tanghali|hapon|gabi)|kamusta ka|kumusta ka|musta|hellooo|heyy|hey!|hi!|hello!|goodday|gday|greetings!|greetings,|hey there!|hi there!|howdy!|h3ll0|h3llo|h3l0|h3ll0|h3ll0|h3ll0|h3ll0|h3ll0|hiya|hey-hey|yo!|sup!|wassup!|what\'s up!|hola|bonjour|namaste|helloo|heyo|heyy|hey there|hi there|g\'day!|good day!|how are you?|kamusta ka?|kumusta ka?|musta?|h3ll0!|h3llo!|h3l0!|h3ll0!|h3ll0!|hiya!|hey-hey!|yo!|sup!|wassup!|what\'s up!|hola!|bonjour!|namaste!)\b', 'greeting', 1.0),
    (r'\b(barangay kapitan|captain|barangay captain|kapitan)\b', 'kapitan_candidates', 0.9),
    (r'\b(sino ang (mga )?kandidato|sino (mga )?tumatakbo|listahan ng kandidato)\b', 'all_candidates', 0.9),
    (r'\b(sk chairman|sk captain|sangguniang kabataan|sk chairperson)\b', 'sk_candidates', 0.9),
    (r'\b(kagawad|councilor|konsehal)\b', 'kagawad_candidates', 0.9),
    (r'\b(all candidates|show all|list all|lahat ng kandidato)\b', 'all_candidates', 0.8),
    (r'\b(sino|sinong|who are|who is)\b.*\b(kandidato|candidates|tumatakbo|running)\b', 'all_candidates', 0.8),
    (r'\b(how to vote|voting process|how do i vote|how can i vote|paano (ako )?bumoto|paano ang pagboto|proseso ng pagboto|voting steps|steps to vote|hakbang sa pagboto|cast vote|submit vote|iboto|magboto|kumpletuhin ang boto|confirm vote|paano mag vote|paano mag-vote|mag vote|mag-voting|bumoto|mag.*vote|voting rules|voting guidelines)\b', 'voting_process', 1.0),
    (r'\b(eligible|can i vote|am i qualified|requirements|pwede ba ako bumoto|edad|age requirement|voter age|ilang taon|kwalipikado|qualified|karapat-dapat|kinakailangan|ano ang kailangan|pwede ko|pwede ba|eligible ba|ano eligibility|requirements para|requirements ko|kailangan ko|may requirement|kwalipikasyon)\b', 'eligibility', 1.0),
    (r'\b(register|registration|sign up|magparehistro|pagrehistro|paano (mag)?register|how to register|saan magparehistro|voter id|id ng botante|voter\'s id)\b', 'registration', 0.9),
    (r'\b(blockchain|secure|security|safe|ligtas|tamper|fraud|cheat|daya|pandaraya|protektado|protected|encrypted|secure ba|privacy|private|pribado|lihim)\b', 'security', 0.9),
    (r'\b(when|date|schedule|election day|kailan|kailan ang halalan|petsa ng halalan|schedule ng eleksyon|where to vote|voting location|precinct|saan boboto|lugar ng pagboto|online|internet|sa bahay)\b.*\b(vote|boto)\b', 'election_date', 0.8),
    (r'\b(results|tally|count|resulta|bilang|sino ang nanalo|who won|nag-lead|nangunguna|winning|prediction|who will win|forecast|manalo|real-time|live|realtime)\b', 'results_info', 0.9),
    (r'\b(why vote|bakit bumoto|importance|kahalagahan|karapatan|rights|right to vote)\b', 'importance', 1.0),
    (r'\b(problema|problem|issue|error|hindi gumagana|not working|nakalimutan|forgot|password|voter id|nawala|lost|wala na)\b', 'technical_issue', 0.9),
    (r'\b(ano ang|what is|how does|paano gumagana)\b.*\b(system|platform|blockchain|features|functionality|gamit|magagawa)\b', 'platform_info', 0.9),
    (r'\b(ano ang|what is|tungkol sa)\b.*\b(kapitan|kagawad|sk chairman|role|tungkulin|responsibilidad|responsibility)\b', 'positions_info', 0.9),
    (r'\b(thank you|thanks|salamat|maraming salamat|thank u|ty|maraming salamat po|salamat po|salamat na|dahil|appreciated)\b', 'thanks', 1.0),
    (r'\b(bye|goodbye|exit|quit|paalam|sige na)\b', 'goodbye', 1.0),
    (r'\b(help|what can you do|commands|tulong|ano kaya mong gawin)\b', 'help', 1.0),
]
