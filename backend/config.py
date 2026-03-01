import os

BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR  = os.path.join(BASE_DIR, '..', 'datasets')

TRAINING_DATA   = os.path.join(DATASET_DIR, 'Training.csv')
TESTING_DATA    = os.path.join(DATASET_DIR, 'Testing.csv')
DATASET_CSV     = os.path.join(DATASET_DIR, 'dataset.csv')
DESCRIPTION_CSV = os.path.join(DATASET_DIR, 'symptom_Description.csv')
PRECAUTION_CSV  = os.path.join(DATASET_DIR, 'symptom_precaution.csv')
SEVERITY_CSV    = os.path.join(DATASET_DIR, 'Symptom_severity.csv')

MODEL_DIR     = os.path.join(BASE_DIR, 'models', 'saved')
MODEL_PATH    = os.path.join(MODEL_DIR, 'xgboost_model.pkl')
ENCODER_PATH  = os.path.join(MODEL_DIR, 'label_encoder.pkl')
FEATURES_PATH = os.path.join(MODEL_DIR, 'feature_columns.pkl')

OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL    = "llama3"

DEBUG = True
HOST  = "0.0.0.0"
PORT  = 5000

FEEDBACK_LOG_PATH  = os.path.join(MODEL_DIR, 'feedback_log.json')
RETRAIN_THRESHOLD  = 10
