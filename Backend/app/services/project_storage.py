import json
from pathlib import Path
from typing import Dict, List, Optional

PROJECT_FILE = Path("app/storage/projects.json")


def _load_data() -> Dict:
    if not PROJECT_FILE.exists():
        return {"lastProjectId": 0, "projects": []}
    with open(PROJECT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_data(data: Dict):
    PROJECT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(PROJECT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def get_all_projects() -> List[Dict]:
    return _load_data()["projects"]


def create_project(project: Dict) -> Dict:
    data = _load_data()
    data["lastProjectId"] += 1
    project["projectId"] = data["lastProjectId"]
    data["projects"].append(project)
    _save_data(data)
    return project
