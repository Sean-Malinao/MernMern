"""Response templates for the chatbot"""

RESPONSES = {
    'greeting': [
        "✨ Hello there! I'm Mayombo's AI Election Assistant. I'm here to help with anything related to the upcoming barangay election.\n\nWhat would you like to know? You can ask about:\n• Candidate information\n• Voting process\n• Eligibility requirements\n• Election security\n\nJust type 'help' for a full list of what I can do! 😊",
        "🌟 Hi! I'm your friendly neighborhood election assistant. Ready to help you navigate the Mayombo barangay election.\n\nHow can I assist you today? You can:\n• Check candidate lists\n• Learn how to vote\n• Verify eligibility\n• Understand security features\n\nAsk away! I'm here to help. 🗳️",
        "👋 Hey! Mayombo Election Assistant here. I'm all set to help you with the barangay election.\n\nWhether you need candidate info, voting steps, or eligibility details—I've got you covered!\n\nWhat would you like to know? Just ask! 💬",
        "😊 Hello! I'm your go-to for all things Mayombo election. Need help with candidates, voting process, or anything else?\n\nI'm here to make your election experience smooth and stress-free. What would you like to know? 🗳️",
        "👋 Hi there! Ready to dive into the Mayombo barangay election? I'm here to help with:\n• Candidate information\n• Voting procedures\n• Eligibility requirements\n• Security features\n\nJust ask me anything—I'm all ears! 💬"
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
    
    'results_info': [
        "🗳️ **Tungkol sa Resulta ng Halalan:**\n\nAng opisyal na resulta ay ipapahayad pagkatapos ng voting period ayon sa schedule ng COMELEC.\n\n🔍 Ang sistema ay transparent at verifiable - maaari mong i-verify ang proseso ng pagbilang.\n\n💡 Para sa opisyal na resulta, mangyaring maghintay ng announcement mula sa inyong Barangay Captain at COMELEC.",
        "🗳️ **About Election Results:**\n\nOfficial results will be announced after the voting period closes, following COMELEC schedule.\n\n🔍 The system is transparent and verifiable - you can verify the counting process.\n\n💡 For official results, please wait for announcements from your Barangay Captain and COMELEC.",
    ],
    
    'importance': [
        "**Bakit Mahalaga ang Pagboto:**\n\n🗳️ **Karapatan mo ito** - Ito ay constitutional right ng bawat mamamayan\n\n🏘️ **Makakaapekto sa barangay** - Ang mga napipili mo ay maglilingkod sa inyong komunidad\n\n💪 **Iyong tinig** - Ang boto mo ay ang paraan para marinig ka\n\n👥 **Accountability** - Pipiliin mo ang mga responsableng lider\n\n🌟 **Pagbabago** - Nagsisimula sa local governance ang tunay na pagbabago\n\nAng iyong boto ay may kapangyarihan!",
    ],
    
    'technical_issue': [
        "**May Problema sa Sistema?**\n\n🔧 Subukan ang mga sumusunod:\n\n1️⃣ I-refresh ang page (F5)\n2️⃣ I-clear ang browser cache\n3️⃣ Gumamit ng updated browser\n4️⃣ I-check ang internet connection\n\n📞 **Kung patuloy ang problema:**\nMakipag-ugnayan sa technical support:\n• Email: support@mayombo-voting.ph\n• Hotline: (Available during election period)\n\n💡 Mag-screenshot ng error para mas mabilis masolusyunan!",
    ],
    
    'platform_info': [
        "**Tungkol sa Mayombo Voting Platform:**\n\n🌐 Ito ay secure, blockchain-based voting system\n\n✨ **Features:**\n• End-to-end encryption\n• Real-time vote counting\n• Tamper-proof records\n• Anonymous voting\n• Accessible kahit saan\n\n🔒 Gumagamit ng latest technology para sa:\n• Security\n• Transparency\n• Convenience\n• Accuracy\n\nModernong paraan ng pagboto para sa Mayombo!",
    ],
    
    'positions_info': [
        "**Mga Posisyon sa Barangay Election:**\n\n👔 **Barangay Kapitan**\n• Pinuno ng barangay\n• Namamahala sa day-to-day operations\n• Nag-implement ng programs at policies\n\n👥 **Barangay Kagawad** (Councilors)\n• Miyembro ng Sangguniang Barangay\n• Tumutulong sa pagpapasa ng ordinansa\n• May specific committees\n\n🎓 **SK Chairman**\n• Pinuno ng Sangguniang Kabataan\n• Nag-represent sa kabataan (15-30 years old)\n• Nag-organize ng youth programs\n\nLahat ay may mahalagang papel sa barangay!",
    ],
    
    'thanks': [
        "Walang anuman! 😊\n\nMay iba ka pang tanong? Nandito lang ako para tumulong!\n\n🗳️ Huwag kalimutang bumoto!",
        "You're welcome! 😊\n\nDo you have any other questions? I'm here to help!\n\n🗳️ Don't forget to vote!",
        "Salamat sa pagtanong! May matutulungan pa ba ako?",
    ],
    
    'thanks': [
        "Salamat sa iyo din! [smile]\n\nMasaya kaming tumulong sa iyo. Kung mayroon pang katanungan tungkol sa halalan, huwag mag-atubiling magtanong!\n\n[ballot] Ang iyong boto ay mahalaga!",
        "Thank you too! [smile]\n\nI'm happy I could help. If you have any more questions about the election, feel free to ask!\n\n[ballot] Your vote matters!",
        "Maraming salamat! [pray]\n\nSiguro kaming nakatulong ka namin. Balik ka lang anumang oras kung may ibang tanong!\n\n[ballot] Magboto para sa Mayombo!",
        "You're welcome! Thanks for using our election assistant. Good luck with your vote! [ballot][smile]",
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
