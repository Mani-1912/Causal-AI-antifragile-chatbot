import pandas as pd, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config

_cache: dict = {}


def _load(path: str, key: str) -> pd.DataFrame:
    if key not in _cache:
        _cache[key] = pd.read_csv(path)
    return _cache[key]


def get_disease_descriptions() -> dict:
    df = _load(config.DESCRIPTION_CSV, 'desc')
    return dict(zip(df['Disease'], df['Description']))


def get_disease_precautions() -> dict:
    df = _load(config.PRECAUTION_CSV, 'prec')
    result = {}
    for _, row in df.iterrows():
        precs = [row.get(f'Precaution_{i}') for i in range(1, 5)]
        result[row['Disease']] = [p for p in precs if pd.notna(p)]
    return result


def get_symptom_severity() -> dict:
    df = _load(config.SEVERITY_CSV, 'sev')
    return dict(zip(df['Symptom'], df['weight']))


def get_disease_symptoms() -> dict:
    df = _load(config.DATASET_CSV, 'ds')
    result = {}
    for _, row in df.iterrows():
        result.setdefault(row['Disease'], []).append(row['Symptom'])
    return result


def get_all_symptoms() -> list:
    df = _load(config.TRAINING_DATA, 'train')
    return list(df.drop(columns=['prognosis']).columns)
