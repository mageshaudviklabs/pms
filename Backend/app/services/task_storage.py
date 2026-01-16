import json
from pathlib import Path
from typing import Dict, List, Optional

TASK_FILE = Path("app/storage/tasks.json")


# ==============================
# INTERNAL HELPERS
# ==============================

def _load_data() -> Dict:
    """
    Load task storage from JSON.
    If file does not exist, initialize structure.
    """
    if not TASK_FILE.exists():
        return {
            "lastTaskId": 0,
            "tasks": []
        }

    with open(TASK_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_data(data: Dict):
    """
    Persist task storage to JSON.
    """
    TASK_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(TASK_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


# ==============================
# PUBLIC STORAGE API
# ==============================

def get_all_tasks() -> List[Dict]:
    data = _load_data()
    return data["tasks"]


def get_task_by_id(task_id: int) -> Optional[Dict]:
    data = _load_data()
    for task in data["tasks"]:
        if task["taskId"] == task_id:
            return task
    return None


def get_next_task_id() -> int:
    """
    Atomically increments and returns next task ID.
    """
    data = _load_data()
    data["lastTaskId"] += 1
    _save_data(data)
    return data["lastTaskId"]


def create_task(task: Dict) -> Dict:
    """
    Persist a new task.
    Task ID is assigned here (single source of truth).
    """
    data = _load_data()

    task["taskId"] = get_next_task_id()
    data = _load_data()  # reload after increment

    data["tasks"].append(task)
    _save_data(data)

    return task


def update_task(updated_task: Dict) -> Dict:
    """
    Update existing task.
    """
    data = _load_data()

    for idx, task in enumerate(data["tasks"]):
        if task["taskId"] == updated_task["taskId"]:
            data["tasks"][idx] = updated_task
            _save_data(data)
            return updated_task

    raise ValueError(f"Task with ID {updated_task['taskId']} not found")
