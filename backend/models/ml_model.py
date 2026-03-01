import os, sys, joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config

_model   = None
_encoder = None
_feature_columns = None


def _load():
    global _model, _encoder, _feature_columns
    if _model is None:
        _model           = joblib.load(config.MODEL_PATH)
        _encoder         = joblib.load(config.ENCODER_PATH)
        _feature_columns = joblib.load(config.FEATURES_PATH)

def predict(symptoms: list) -> dict:
    _load()

    # Build one-hot row
    row = {col: 0 for col in _feature_columns}
    matched = []
    for s in symptoms:
        key = s.strip().lower().replace(" ", "_")
        if key in row:
            row[key] = 1
            matched.append(key)

    df_input = pd.DataFrame([row], columns=_feature_columns)
    proba    = _model.predict_proba(df_input)[0]
    top3_idx = np.argsort(proba)[::-1][:3]

    top3 = [
        {"disease": _encoder.classes_[i], "confidence": round(float(proba[i]) * 100, 2)}
        for i in top3_idx
    ]

    return {
        "disease":          top3[0]["disease"],
        "confidence":       top3[0]["confidence"],
        "top3":             top3,
        "matched_symptoms": matched,
    }

def train() -> float:
    print("Loading datasets...")
    train_df = pd.read_csv(config.TRAINING_DATA)
    test_df  = pd.read_csv(config.TESTING_DATA)

    X_train = train_df.drop(columns=["prognosis"])
    y_train = train_df["prognosis"]
    X_test  = test_df.drop(columns=["prognosis"])
    y_test  = test_df["prognosis"]

    le = LabelEncoder()
    y_train_enc = le.fit_transform(y_train)
    y_test_enc  = le.transform(y_test)

    feature_columns = list(X_train.columns)
    print(f"Features: {len(feature_columns)} | Diseases: {len(le.classes_)}")

    model = XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        eval_metric="mlogloss",
        random_state=42,
        n_jobs=-1,
    )

    print("Training XGBoost...")
    model.fit(X_train, y_train_enc, eval_set=[(X_test, y_test_enc)], verbose=50)

    y_pred = model.predict(X_test)
    acc    = accuracy_score(y_test_enc, y_pred)
    print(f"\nTest Accuracy: {acc * 100:.2f}%")
    print(classification_report(y_test_enc, y_pred, target_names=le.classes_))

    os.makedirs(config.MODEL_DIR, exist_ok=True)
    joblib.dump(model,           config.MODEL_PATH)
    joblib.dump(le,              config.ENCODER_PATH)
    joblib.dump(feature_columns, config.FEATURES_PATH)
    print(f"Saved → {config.MODEL_DIR}")
    return acc


if __name__ == "__main__":
    train()
