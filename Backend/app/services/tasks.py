from typing import List, Dict, Optional
from datetime import datetime

from app.enums import TaskStatus
from app.services.managers import get_manager_by_id
from app.services.employees import (
    get_employees_ranked,
    get_employee_by_id,
    update_employee_on_assignment
)
from app.services.notifications import create_notification
from app.services.history import add_task_to_employee_history

# ✅ JSON-based task storage (DB replacement)
from app.services.task_storage import (
    create_task as save_task,
    get_all_tasks,
    get_task_by_id as load_task_by_id,
    update_task
)


# =====================================================
# CREATE TASK
# =====================================================

def create_task(
    manager_id: str,
    title: str,
    description: str,
    priority: str = "Medium",
    deadline: str = None,
    metadata: Dict = None
) -> Optional[Dict]:

    manager = get_manager_by_id(manager_id)
    if not manager:
        return None

    task = {
        "title": title,
        "description": description,
        "priority": priority,
        "deadline": deadline,
        "metadata": metadata or {},
        "status": TaskStatus.PENDING.value,
        "managerId": manager_id,
        "managerName": manager["managerName"],
        "assignedEmployees": [],
        "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "assignedAt": None
    }

    return save_task(task)


# =====================================================
# GET TASK BY ID
# =====================================================

def get_task_by_id(task_id: int) -> Optional[Dict]:
    return load_task_by_id(task_id)


# =====================================================
# GET MANAGER TASK QUEUE
# =====================================================

def get_manager_task_queue(manager_id: str, status_filter: str = None) -> List[Dict]:
    tasks = [t for t in get_all_tasks() if t["managerId"] == manager_id]

    if status_filter:
        tasks = [t for t in tasks if t["status"] == status_filter]

    tasks.sort(key=lambda x: x["createdAt"], reverse=True)
    return tasks


# =====================================================
# TASK DETAILS + AVAILABLE EMPLOYEES
# =====================================================

def get_task_details_with_employees(task_id: int) -> Optional[Dict]:
    task = get_task_by_id(task_id)
    if not task:
        return None

    ranked_employees = get_employees_ranked()

    return {
        "task": task,
        "availableEmployees": ranked_employees,
        "totalEmployees": len(ranked_employees)
    }


# =====================================================
# ASSIGN TASK TO EMPLOYEES
# =====================================================

def assign_task_to_employees(
    task_id: int,
    employee_ids: List[str],
    manager_id: str
) -> Optional[Dict]:

    task = get_task_by_id(task_id)
    if not task:
        return None

    if task["managerId"] != manager_id:
        return None

    if task["status"] != TaskStatus.PENDING.value:
        return None

    manager = get_manager_by_id(manager_id)
    assigned_employees = []
    assigned_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for emp_id in employee_ids:
        employee = get_employee_by_id(emp_id)
        if not employee:
            continue

        # Update employee workload
        update_employee_on_assignment(emp_id, task["title"])

        # Notification
        create_notification(
            employee_id=emp_id,
            manager_id=manager_id,
            task_id=task_id,
            message=f"{manager['managerName']} selected you to do '{task['title']}' task."
        )

        # History
        add_task_to_employee_history(
            employee_id=emp_id,
            task_id=task_id,
            task_title=task["title"],
            manager_id=manager_id,
            manager_name=manager["managerName"],
            assigned_at=assigned_at,
            status=TaskStatus.ASSIGNED.value
        )

        assigned_employees.append({
            "employeeId": emp_id,
            "employeeName": employee["employeeName"]
        })

    task["status"] = TaskStatus.ASSIGNED.value
    task["assignedEmployees"] = assigned_employees
    task["assignedAt"] = assigned_at

    update_task(task)

    return {
        "task": task,
        "assignedTo": assigned_employees,
        "notificationsSent": len(assigned_employees)
    }
