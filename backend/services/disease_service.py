import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.data_loader    import get_disease_descriptions, get_disease_precautions
from services.llm_service import generate_advice


def get_disease_info(disease: str) -> dict:
    descriptions = get_disease_descriptions()
    precautions  = get_disease_precautions()
    advice       = generate_advice(disease, [])

    return {
        "disease":      disease,
        "description":  descriptions.get(disease, "No description available."),
        "precautions":  precautions.get(disease, []),
        "medicines":    advice.get("medicines", []),
        "diet":         advice.get("diet", []),
        "exercises":    advice.get("exercises", []),
        "home_remedies": advice.get("home_remedies", []),
        "warning":      advice.get("warning", ""),
    }


def list_all_diseases() -> list:
    return sorted(get_disease_descriptions().keys())
