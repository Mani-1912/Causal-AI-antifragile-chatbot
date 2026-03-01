import uuid, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from services.llm_service import call_llm, explain_result, generate_advice
from models.ml_model      import predict
from models.causal_model  import analyze
from utils.data_loader    import get_disease_descriptions, get_disease_precautions
from utils.symptom_parser import extract_symptoms

_sessions: dict = {}

FORCE_PHRASES = {
    "that's all", "thats all", "no more", "no thats all", "just those",
    "that is all", "ok done", "i'm done", "im done", "give me result",
    "show result", "diagnose me", "what do i have", "just give",
    "please diagnose", "tell me what", "predict now", "run diagnosis",
}

def start_session() -> dict:
    session_id = str(uuid.uuid4())
    _sessions[session_id] = {
        "history":  [],
        "symptoms": [],
        "turns":    0,
    }
    greeting = (
        "Hello! I'm Arogya, your personal health companion 🌿\n\n"
        "Tell me how you're feeling today — describe your symptoms "
        "in your own words, and I'll do my best to help you."
    )
    return {"session_id": session_id, "message": greeting}


def handle_message(session_id: str, user_message: str) -> dict:
    if session_id not in _sessions:
        new = start_session()
        session_id = new["session_id"]

    sess = _sessions[session_id]
    sess["turns"] += 1
    sess["history"].append({"role": "user", "content": user_message})

    force = any(p in user_message.lower() for p in FORCE_PHRASES)

    new_symptoms = extract_symptoms(user_message)
    for s in new_symptoms:
        if s not in sess["symptoms"]:
            sess["symptoms"].append(s)

    llm_result = call_llm(sess["history"])
    ai_message = llm_result["message"]
    llm_ready  = llm_result["symptoms_ready"]
    llm_syms   = llm_result.get("symptoms", [])

    for s in llm_syms:
        if s not in sess["symptoms"]:
            sess["symptoms"].append(s)

    sess["history"].append({"role": "assistant", "content": ai_message})

    ready = (
        llm_ready or
        force or
        (sess["turns"] >= 3 and len(sess["symptoms"]) >= 2)
    )

    if ready and len(sess["symptoms"]) >= 2:
        return _build_result(session_id, ai_message)

    return {
        "session_id": session_id,
        "message":    ai_message,
        "state":      "CHATTING",
        "payload":    None,
    }


def _build_result(session_id: str, ai_message: str) -> dict:
    sess     = _sessions[session_id]
    symptoms = sess["symptoms"]

    ml      = predict(symptoms)
    disease = ml["disease"]

    causal      = analyze(symptoms, disease)
    explanation = explain_result(disease, ml["confidence"], symptoms)
    advice      = generate_advice(disease, symptoms)
    desc        = get_disease_descriptions().get(disease, "")
    precs       = get_disease_precautions().get(disease, [])

    payload = {
        "disease":          disease,
        "confidence":       ml["confidence"],
        "top3":             ml["top3"],
        "matched_symptoms": ml["matched_symptoms"],
        "explanation":      explanation,
        "description":      desc,
        "precautions":      precs,
        "medicines":        advice.get("medicines", []),
        "diet":             advice.get("diet", []),
        "exercises":        advice.get("exercises", []),
        "home_remedies":    advice.get("home_remedies", []),
        "warning":          advice.get("warning", ""),
        "causal":           causal,
    }

    return {
        "session_id": session_id,
        "message":    ai_message,
        "state":      "RESULT",
        "payload":    payload,
    }
