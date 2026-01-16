from fastapi import APIRouter
from app.services.task_storage import get_all_tasks

router = APIRouter(
    prefix="/api/tasks",
    tags=["Tasks"]
)

@router.get(
    "/employee/{employee_id}",
    summary="Get tasks assigned to an employee"
)
def get_tasks_for_employee(employee_id: str):
    """
    Returns active tasks assigned to a specific employee.
    """

    tasks = get_all_tasks()  # returns LIST

    employee_tasks = []

    for task in tasks:
        if task.get("status") not in ["Assigned", "In Progress"]:
            continue

        for emp in task.get("assignedEmployees", []):
            if emp.get("employeeId") == employee_id:
                employee_tasks.append({
                    "taskId": task["taskId"],
                    "title": task["title"],
                    "description": task["description"],
                    "projectName": task.get("metadata", {}).get("projectName"),
                    "priority": task["priority"],
                    "deadline": task["deadline"],
                    "status": task["status"],
                    "managerName": task["managerName"],
                    "assignedAt": task["assignedAt"]
                })

    return {
        "success": True,
        "count": len(employee_tasks),
        "tasks": employee_tasks
    }
