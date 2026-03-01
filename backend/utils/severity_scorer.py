import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.data_loader import get_symptom_severity


def score(symptoms: list) -> dict:
    severity_map = get_symptom_severity()
    breakdown    = []
    total        = 0

    for s in symptoms:
        clean    = s.strip().lower().replace(" ", "_")
        weight   = severity_map.get(clean, 3)
        total   += weight
        breakdown.append({"symptom": clean, "weight": weight,
                          "label": "High" if weight >= 6 else "Medium" if weight >= 4 else "Low"})

    max_possible = len(symptoms) * 7
    percentage   = round((total / max_possible) * 100, 1) if max_possible > 0 else 0

    return {
        "total_score":   total,
        "score_percent": percentage,
        "severity_label": "Critical" if percentage >= 75 else
                          "High"     if percentage >= 50 else
                          "Moderate" if percentage >= 25 else "Low",
        "breakdown":     sorted(breakdown, key=lambda x: x["weight"], reverse=True),
    }
