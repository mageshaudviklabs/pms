from typing import List, Dict, Optional
from datetime import datetime

from app.services.project_storage import get_all_projects, create_project
from app.services.managers import get_manager_by_id


def get_projects_for_manager(manager_id: str) -> List[Dict]:
    return [
        p for p in get_all_projects()
        if p["managerId"] == manager_id
    ]


def create_manager_project(
    manager_id: str,
    project_name: str,
    description: str = ""
) -> Optional[Dict]:

    manager = get_manager_by_id(manager_id)
    if not manager:
        return None

    # 🔒 Unique project name per manager
    existing = [
        p for p in get_all_projects()
        if p["managerId"] == manager_id
        and p["projectName"].lower() == project_name.lower()
    ]
    if existing:
        raise ValueError("Project with same name already exists")

    project = {
        "projectName": project_name,
        "description": description,
        "managerId": manager_id,
        "managerName": manager["managerName"],
        "status": "Active",
        "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    return create_project(project)
