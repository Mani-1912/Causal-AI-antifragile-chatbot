import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.data_loader import get_symptom_severity, get_disease_symptoms


def analyze(symptoms: list, predicted_disease: str) -> dict:
    severity_map  = get_symptom_severity()
    disease_syms  = get_disease_symptoms().get(predicted_disease, [])
    known = {s.lower().replace(" ", "_") for s in disease_syms}

    analysis    = []
    total_score = 0

    for sym in symptoms:
        clean    = sym.strip().lower().replace(" ", "_")
        severity = severity_map.get(clean, 3)
        causal   = clean in known

        strength = (
            "High"   if causal and severity >= 5 else
            "Medium" if causal                   else
            "Low"
        )

        analysis.append({
            "symptom":          clean.replace("_", " ").title(),
            "severity":         severity,
            "causal_strength":  strength,
            "linked_to_disease": causal,
        })
        total_score += severity

    analysis.sort(key=lambda x: x["severity"], reverse=True)

    max_possible = len(symptoms) * 7
    risk_score   = round((total_score / max_possible) * 100, 1) if max_possible > 0 else 0

    risk_level = (
        "Critical" if risk_score >= 75 else
        "High"     if risk_score >= 50 else
        "Moderate" if risk_score >= 25 else
        "Low"
    )

    key_drivers = [a["symptom"] for a in analysis if a["causal_strength"] == "High"]
    if not key_drivers:
        key_drivers = [a["symptom"] for a in analysis[:2]]

    return {
        "causal_analysis":            analysis,
        "risk_score":                 risk_score,
        "risk_level":                 risk_level,
        "key_drivers":                key_drivers,
        "total_symptoms_analyzed":    len(symptoms),
        "symptoms_matching_disease":  sum(1 for a in analysis if a["linked_to_disease"]),
    }
