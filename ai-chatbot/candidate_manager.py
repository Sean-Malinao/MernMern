"""Candidate management and knowledge base"""

import csv
import os
from typing import Dict, List


class CandidateManager:
    """Manages candidate data loading and retrieval"""
    
    def __init__(self):
        self.candidates = {"Barangay Kapitan": [], "SK Chairman": [], "Kagawad": []}
        self.load_candidates()
    
    def load_candidates(self):
        """Load candidates from CSV file"""
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
                        self.candidates["Barangay Kapitan"].append({"name": name, "party": party})
                    elif position == "SK Chairman" and name:
                        self.candidates["SK Chairman"].append({"name": name, "party": party})
                    elif "kagawad" in position.lower() and name:
                        self.candidates["Kagawad"].append({"name": name, "party": party})
            
            self._log_loaded_candidates()
        
        except Exception as e:
            print(f"[ERROR] Error loading CSV: {e}")
            import traceback
            traceback.print_exc()
    
    def _log_loaded_candidates(self):
        """Log loaded candidate counts"""
        print(f"[OK] Loaded {len(self.candidates['Barangay Kapitan'])} Barangay Kapitan candidates")
        print(f"[OK] Loaded {len(self.candidates['SK Chairman'])} SK Chairman candidates")
        print(f"[OK] Loaded {len(self.candidates['Kagawad'])} Kagawad candidates")
    
    def get_candidates_by_position(self, position: str) -> List[Dict]:
        """Get candidates for a specific position"""
        return self.candidates.get(position, [])
    
    def format_candidates(self, position: str) -> str:
        """Format candidate list for display"""
        candidates_list = self.get_candidates_by_position(position)
        
        if not candidates_list:
            return f"Walang nahanap na kandidato para sa {position} sa database."
        
        tagalog_positions = {
            "Barangay Kapitan": "Barangay Kapitan",
            "SK Chairman": "SK Chairman",
            "Kagawad": "Kagawad"
        }
        
        formatted = [f"• {c['name']} ({c['party']})" for c in candidates_list]
        
        header = f"**Mga Kandidato para sa {tagalog_positions.get(position, position)}:**\n\n"
        candidates_text = "\n".join(formatted)
        footer = f"\n\n📊 Kabuuang kandidato: {len(candidates_list)}"
        
        return header + candidates_text + footer
    
    def get_candidate_info(self, message: str) -> str:
        """Extract specific candidate information from message"""
        message_lower = message.lower()
        
        for position, candidates in self.candidates.items():
            for candidate in candidates:
                if candidate['name'].lower() in message_lower:
                    return f"**{candidate['name']}**\n\nPosisyon: {position}\nPartido: {candidate['party']}\n\n🎯 Good luck sa lahat ng mga kandidato!\n\nMay iba ka pang gustong malaman tungkol sa kandidatong ito?"
        
        return None
    
    def get_total_candidates(self) -> int:
        """Get total count of all candidates"""
        return sum(len(v) for v in self.candidates.values())
    
    def get_stats(self) -> Dict:
        """Get statistics about candidates"""
        return {
            "total": self.get_total_candidates(),
            "kapitan": len(self.candidates["Barangay Kapitan"]),
            "sk_chairman": len(self.candidates["SK Chairman"]),
            "kagawad": len(self.candidates["Kagawad"])
        }
