import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config
from utils.helpers import load_json, save_json, now


def log_feedback(symptoms: list, predicted_disease: str,
                 correct: bool, actual_disease: str = None) -> dict:
    log = load_json(config.FEEDBACK_LOG_PATH, default=[])

    log.append({
        "timestamp":        now(),
        "symptoms":         symptoms,
        "predicted_disease": predicted_disease,
        "correct":          correct,
        "actual_disease":   actual_disease,
    })
    save_json(config.FEEDBACK_LOG_PATH, log)

    wrong_count   = sum(1 for e in log if not e["correct"])
    should_retrain = (
        wrong_count > 0 and
        wrong_count % config.RETRAIN_THRESHOLD == 0
    )

    if should_retrain:
        _trigger_retrain()

    return {
        "logged":            True,
        "total_feedback":    len(log),
        "wrong_predictions": wrong_count,
        "should_retrain":    should_retrain,
        "message": (
            "Thank you! Your feedback helps Arogya improve. 💚"
            if correct else
            "Thank you for the correction! Arogya learns from this."
        ),
    }


def get_stats() -> dict:
    log     = load_json(config.FEEDBACK_LOG_PATH, default=[])
    total   = len(log)
    correct = sum(1 for e in log if e["correct"])
    wrong   = total - correct
    acc     = round((correct / total) * 100, 1) if total > 0 else 0.0

    return {
        "total_feedback":       total,
        "correct_predictions":  correct,
        "wrong_predictions":    wrong,
        "real_world_accuracy":  acc,
        "next_retrain_in":      config.RETRAIN_THRESHOLD - (wrong % config.RETRAIN_THRESHOLD),
    }


def _trigger_retrain():
    try:
        from models.ml_model import train
        print("Antifragile retraining triggered...")
        acc = train()
        print(f"Retraining complete. New accuracy: {acc * 100:.2f}%")
    except Exception as e:
        print(f"Retraining failed: {e}")
