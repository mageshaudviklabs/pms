from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.services.projects import (
    get_projects_for_manager,
    create_manager_project
)
from app.services.project_tasks import (
    get_tasks_by_project,
    get_projects_summary_for_manager,
    get_employee_projects
)

router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"]
)


class CreateProjectRequest(BaseModel):
    managerId: str
    projectName: str
    description: Optional[str] = ""


@router.post("/create", summary="Create a new project")
def create_project(request: CreateProjectRequest):
    try:
        project = create_manager_project(
            manager_id=request.managerId,
            project_name=request.projectName,
            description=request.description
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not project:
        raise HTTPException(status_code=404, detail="Manager not found")

    return {
        "success": True,
        "project": project
    }


@router.get(
    "/manager/{manager_id}",
    summary="Get projects created by manager"
)
def get_manager_projects(manager_id: str):
    projects = get_projects_for_manager(manager_id)

    return {
        "success": True,
        "count": len(projects),
        "projects": projects
    }


@router.get(
    "/manager/{manager_id}/summary",
    summary="Get project summary for manager"
)
def manager_project_summary(manager_id: str):
    return {
        "success": True,
        "projects": get_projects_summary_for_manager(manager_id)
    }

@router.get(
    "/{project_name}/tasks",
    summary="Get all tasks under a project"
)
def get_project_tasks(project_name: str):
    tasks = get_tasks_by_project(project_name)

    return {
        "success": True,
        "count": len(tasks),
        "tasks": tasks
    }


@router.get(
    "/employee/{employee_id}",
    summary="Get projects employee is working on"
)
def get_employee_project_list(employee_id: str):
    return {
        "success": True,
        "projects": get_employee_projects(employee_id)
    }


@router.get(
    "/employee/{employee_id}/{project_name}",
    summary="Get employee tasks inside a project"
)
def get_employee_project_tasks(employee_id: str, project_name: str):
    tasks = get_tasks_by_project(project_name)

    employee_tasks = []
    for task in tasks:
        for emp in task.get("assignedEmployees", []):
            if emp["employeeId"] == employee_id:
                employee_tasks.append(task)

    return {
        "success": True,
        "count": len(employee_tasks),
        "tasks": employee_tasks
    }
