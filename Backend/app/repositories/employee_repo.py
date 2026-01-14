import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, "..", "utils", "employee.json")

def load_employees():
    with open(JSON_PATH, "r") as f:
        return json.load(f)
