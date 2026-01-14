from fastapi import APIRouter
import json, os

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TASK_PATH = os.path.join(BASE_DIR, "..", "utils", "tasks.json")


def load_tasks():
    with open(TASK_PATH, "r") as f:
        return json.load(f)


# GET all tasks
@router.get("/")
def get_all_tasks():
    return load_tasks()


# POST create new task
@router.post("/form")
def create_task(task: dict):
    tasks = load_tasks()
    tasks.append(task)

    with open(TASK_PATH, "w") as f:
        json.dump(tasks, f, indent=4)

    return {"message": "Task created", "task": task}
