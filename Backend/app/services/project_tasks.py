from typing import List, Dict
from app.services.task_storage import get_all_tasks


def get_tasks_by_project(project_name: str) -> List[Dict]:
    tasks = get_all_tasks()
    return [
        t for t in tasks
        if t.get("metadata", {}).get("projectName") == project_name
    ]


def get_projects_summary_for_manager(manager_id: str) -> List[Dict]:
    tasks = get_all_tasks()
    projects = {}

    for task in tasks:
        if task["managerId"] != manager_id:
            continue

        project = task.get("metadata", {}).get("projectName")
        if not project:
            continue

        projects.setdefault(project, {
            "projectName": project,
            "totalTasks": 0,
            "assignedTasks": 0
        })

        projects[project]["totalTasks"] += 1
        if task["status"] in ["Assigned", "In Progress"]:
            projects[project]["assignedTasks"] += 1

    return list(projects.values())


def get_employee_projects(employee_id: str) -> List[Dict]:
    tasks = get_all_tasks()
    projects = {}

    for task in tasks:
        for emp in task.get("assignedEmployees", []):
            if emp["employeeId"] == employee_id:
                project = task.get("metadata", {}).get("projectName")
                if not project:
                    continue

                projects.setdefault(project, {
                    "projectName": project,
                    "activeTasks": 0
                })

                if task["status"] in ["Assigned", "In Progress"]:
                    projects[project]["activeTasks"] += 1

    return list(projects.values())
