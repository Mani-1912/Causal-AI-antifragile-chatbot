import json, os
from datetime import datetime

def ok(data, message: str = "Success") -> dict:
    return {"status": "success", "message": message, "data": data}

def err(message: str = "An error occurred") -> dict:
    return {"status": "error", "message": message, "data": None}

def success_response(data, message="Success"): return ok(data, message)
def error_response(message="An error occurred"): return err(message)

def load_json(path: str, default=None):
    if default is None:
        default = []
    if not os.path.exists(path):
        return default
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except Exception:
        return default

def save_json(path: str, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

def load_json_file(path, default=None): return load_json(path, default)
def save_json_file(path, data): return save_json(path, data)

def now() -> str:
    return datetime.utcnow().isoformat()

def timestamp(): return now()
