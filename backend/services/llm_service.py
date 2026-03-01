import requests, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config

_CHAT_SYSTEM = """You are Arogya, an intelligent AI health companion. You are warm, empathetic, and speak simply.

Your job is to gather the user's symptoms through friendly conversation.

RULES:
1. Keep responses SHORT (2-3 sentences max). Be warm and simple.
2. Ask ONE clarifying question at a time.
3. After the user's SECOND reply OR if they say "that's all" / "give result" → output SYMPTOMS_READY immediately.
4. NEVER ask more than 2 follow-up questions total.
5. When ready, output this at the END of your message (after your text):
   SYMPTOMS_READY:{"symptoms": ["symptom_1", "symptom_2"]}
6. Only use these symptom names in the JSON:
   fever, headache, cough, fatigue, nausea, vomiting, diarrhoea, body_ache,
   chills, sore_throat, runny_nose, breathlessness, chest_pain, joint_pain,
   skin_rash, itching, jaundice, loss_of_appetite, weight_loss, sweating,
   dizziness, abdominal_pain, back_pain, muscle_pain, burning_urination,
   frequent_urination, high_fever, mild_fever, dry_cough, stiff_neck,
   sensitivity_to_light, red_eyes, swollen_lymph_nodes, night_sweats,
   hair_loss, constipation, bloating, indigestion, loss_of_taste, loss_of_smell
7. NEVER diagnose. You are Arogya, not an AI."""

_EXPLAINER_SYSTEM = """You are Arogya, a warm AI health companion.
Explain the predicted disease in exactly 2 sentences. Simple, caring language.
Do NOT list symptoms or medicines. End with: Please consult a real doctor for confirmation."""

_FALLBACKS = {
    "Measles": {
        "medicines":     ["Paracetamol (for fever)", "Vitamin A supplements", "Ibuprofen (for pain)", "Antibiotic eye drops (if eye infection)"],
        "diet":          ["Soft easily digestible foods", "Plenty of warm fluids and water", "Fresh fruit juices rich in Vitamin C", "Avoid spicy and oily foods"],
        "exercises":     ["Complete bed rest during fever", "Light stretching after recovery", "Short walks when feeling better", "Avoid strenuous activity for 2 weeks"],
        "home_remedies": ["Lukewarm sponge bath to reduce fever", "Neem leaves bath to soothe rash", "Honey and ginger tea for throat", "Keep room cool and well-ventilated"],
        "warning":       "Seek emergency care if breathing difficulty, confusion, or seizures occur."
    },
    "Typhoid": {
        "medicines":     ["Ciprofloxacin (antibiotic - doctor prescribed)", "Paracetamol for fever", "ORS for hydration", "Azithromycin (antibiotic)"],
        "diet":          ["Boiled rice, khichdi, idli", "Plenty of clean boiled water", "Coconut water for electrolytes", "Avoid raw vegetables and street food"],
        "exercises":     ["Complete bed rest", "Gentle walking after fever subsides", "Light yoga breathing exercises", "No vigorous exercise for 3-4 weeks"],
        "home_remedies": ["Apple cider vinegar compress for fever", "Cold compress on forehead", "Basil and ginger tea", "Garlic with honey twice daily"],
        "warning":       "Seek immediate care if fever crosses 104°F or stomach becomes very rigid."
    },
    "Common Cold": {
        "medicines":     ["Cetirizine (antihistamine)", "Paracetamol", "Nasal saline drops", "Vitamin C supplements"],
        "diet":          ["Hot soups and broths", "Ginger-turmeric milk", "Citrus fruits", "Avoid cold drinks and ice cream"],
        "exercises":     ["Rest for first 2 days", "Light walks in fresh air", "Breathing exercises", "Avoid gym until fully recovered"],
        "home_remedies": ["Steam inhalation with eucalyptus oil", "Honey-lemon-ginger tea", "Salt water gargle", "Turmeric milk at night"],
        "warning":       "See a doctor if fever persists beyond 5 days or breathing becomes difficult."
    },
    "Dengue": {
        "medicines":     ["Paracetamol only (NO aspirin/ibuprofen)", "ORS sachets", "Papaya leaf extract", "IV fluids if platelet low"],
        "diet":          ["Papaya leaf juice", "Pomegranate juice", "Coconut water", "Kiwi and citrus fruits"],
        "exercises":     ["Complete bed rest mandatory", "No exercise during fever", "Light walking after platelets normalise", "Rest for minimum 2 weeks"],
        "home_remedies": ["Papaya leaf juice 2x daily", "Neem leaf tea", "Giloy kadha", "Cool compresses on forehead"],
        "warning":       "Go to ER immediately if bleeding from nose/gums, severe abdominal pain, or black stools appear."
    },
}

_DEFAULT_FALLBACK = {
    "medicines":     ["Paracetamol for fever/pain", "Consult a doctor for prescription medication", "ORS sachets for hydration", "Multivitamin supplements"],
    "diet":          ["Light easily digestible meals", "Plenty of water and fluids", "Fresh fruits and vegetables", "Avoid spicy, oily and processed foods"],
    "exercises":     ["Rest during acute illness", "Light walking when fever subsides", "Gentle stretching after recovery", "Gradual return to normal activity"],
    "home_remedies": ["Stay well hydrated", "Get adequate sleep (8+ hours)", "Warm ginger-honey tea", "Keep environment clean and ventilated"],
    "warning":       "Seek immediate medical attention if symptoms worsen or persist beyond 3 days."
}


def call_llm(history: list) -> dict:
    try:
        resp = requests.post(
            f"{config.OLLAMA_BASE_URL}/api/chat",
            json={
                "model":    config.OLLAMA_MODEL,
                "messages": [{"role": "system", "content": _CHAT_SYSTEM}] + history,
                "stream":   False,
                "options":  {"temperature": 0.7, "top_p": 0.9, "num_predict": 256},
            },
            timeout=60,
        )
        resp.raise_for_status()
        full = resp.json()["message"]["content"]

        if "SYMPTOMS_READY:" in full:
            parts   = full.split("SYMPTOMS_READY:")
            message = parts[0].strip()
            try:
                data = json.loads(parts[1].strip())
                syms = data.get("symptoms", [])
                return {"message": message, "symptoms_ready": len(syms) >= 2, "symptoms": syms}
            except Exception:
                return {"message": message, "symptoms_ready": False, "symptoms": []}

        return {"message": full.strip(), "symptoms_ready": False, "symptoms": []}

    except requests.exceptions.ConnectionError:
        return {
            "message": "I'm having trouble connecting to my brain right now 😅 Please make sure Ollama is running (`ollama serve`). Meanwhile, I'll do my best to help!",
            "symptoms_ready": False,
            "symptoms": [],
        }
    except Exception as e:
        return {
            "message": "Something went wrong. Please try again in a moment.",
            "symptoms_ready": False,
            "symptoms": [],
        }


def explain_result(disease: str, confidence: float, symptoms: list) -> str:
    try:
        user_msg = (
            f"Predicted: {disease} (confidence: {confidence:.1f}%). "
            f"Symptoms: {', '.join(symptoms)}. Explain in 2 warm simple sentences."
        )
        resp = requests.post(
            f"{config.OLLAMA_BASE_URL}/api/chat",
            json={
                "model":    config.OLLAMA_MODEL,
                "messages": [
                    {"role": "system", "content": _EXPLAINER_SYSTEM},
                    {"role": "user",   "content": user_msg},
                ],
                "stream":   False,
                "options":  {"temperature": 0.6, "num_predict": 128},
            },
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()["message"]["content"]
    except Exception:
        return (
            f"Based on your symptoms, the analysis suggests you may have **{disease}** "
            f"with a confidence of {confidence:.1f}%. "
            "Please consult a doctor for proper diagnosis and treatment."
        )


def generate_advice(disease: str, symptoms: list) -> dict:
    try:
        prompt = f"""Disease: {disease}
Symptoms: {', '.join(symptoms) if symptoms else 'general'}

Respond ONLY with this exact JSON (no markdown, no extra text):
{{
  "medicines":     ["item 1", "item 2", "item 3", "item 4"],
  "diet":          ["item 1", "item 2", "item 3", "item 4"],
  "exercises":     ["item 1", "item 2", "item 3"],
  "home_remedies": ["item 1", "item 2", "item 3", "item 4"],
  "warning":       "one sentence emergency warning"
}}"""

        resp = requests.post(
            f"{config.OLLAMA_BASE_URL}/api/chat",
            json={
                "model":    config.OLLAMA_MODEL,
                "messages": [
                    {"role": "system", "content": "You are a medical knowledge assistant. Respond with valid JSON only. No markdown."},
                    {"role": "user",   "content": prompt},
                ],
                "stream":   False,
                "options":  {"temperature": 0.3, "num_predict": 512},
            },
            timeout=45,
        )
        resp.raise_for_status()
        raw = resp.json()["message"]["content"].strip()
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw.strip())
        # Validate it has all keys with content
        if all(result.get(k) for k in ["medicines", "diet", "exercises", "home_remedies"]):
            return result
    except Exception:
        pass

    return _FALLBACKS.get(disease, _DEFAULT_FALLBACK)
