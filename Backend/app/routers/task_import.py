from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import pandas as pd

from app.services.managers import get_manager_by_id
from app.services.employees import get_employee_by_id
from app.services.tasks import (
    create_task,
    assign_task_to_employees,
    get_manager_task_queue
)

task_import_router = APIRouter(
    prefix="/api/tasks/import",
    tags=["Task Import"]
)

# ======================================================
# PREVIEW IMPORT (NO WRITE, NO ASSIGN)
# ======================================================

@task_import_router.post(
    "/preview",
    summary="Parse Excel and preview tasks with employee mapping"
)
async def preview_task_import(file: UploadFile = File(...)):
    """
    Upload Excel → Parse → Return task + employee preview

    ✔ NO DB WRITE
    ✔ NO TASK CREATION
    ✔ NO ASSIGNMENT
    """

    # 1️⃣ Validate file type
    if not file.filename.endswith(".xlsx"):
        raise HTTPException(
            status_code=400,
            detail="Only .xlsx files are supported"
        )

    # 2️⃣ Read Excel
    try:
        df = pd.read_excel(file.file)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to read Excel file: {str(e)}"
        )

    # 3️⃣ Required columns
    required_columns = [
        "Employee_ID",
        "Employee_Name",
        "Role",
        "Project Name",
        "Task Assigned",
        "Task Description",
        "Task Completion Due Date"
    ]

    missing = [col for col in required_columns if col not in df.columns]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {missing}"
        )

    preview_tasks = []

    # 4️⃣ Build preview response
    for _, row in df.iterrows():
        deadline = None
        if not pd.isna(row["Task Completion Due Date"]):
            deadline = str(
                pd.to_datetime(row["Task Completion Due Date"]).date()
            )

        preview_tasks.append({
            "title": str(row["Task Assigned"]).strip(),
            "description": str(row["Task Description"]).strip(),
            "priority": "Medium",
            "deadline": deadline,
            "metadata": {
                "projectName": str(row["Project Name"]).strip()
            },
            "status": "Pending",
            "employee": {
                "employeeId": str(row["Employee_ID"]).strip(),
                "employeeName": str(row["Employee_Name"]).strip(),
                "role": str(row["Role"]).strip()
            }
        })

    return {
        "success": True,
        "count": len(preview_tasks),
        "tasks": preview_tasks
    }


# ======================================================
# CONFIRM IMPORT + AUTO ASSIGN
# ======================================================

class ConfirmImportRequest(BaseModel):
    managerId: str
    tasks: List[Dict]


@task_import_router.post(
    "/confirm",
    summary="Confirm import and auto-assign tasks"
)
async def confirm_task_import(payload: ConfirmImportRequest):
    """
    CONFIRM STEP

    ✔ Creates tasks
    ✔ Auto-assigns using employeeId
    ✔ Updates JSON storage
    ✔ Sends notifications
    ✔ Prevents duplicate imports
    ✔ Safe partial failure handling
    """

    manager = get_manager_by_id(payload.managerId)
    if not manager:
        raise HTTPException(
            status_code=404,
            detail="Manager not found"
        )

    existing_tasks = get_manager_task_queue(payload.managerId)

    created = 0
    assigned = 0
    failed = []
    created_tasks = []

    for task in payload.tasks:

        # 🛡 Defensive payload validation
        if "employee" not in task or "employeeId" not in task["employee"]:
            failed.append({
                "title": task.get("title", "UNKNOWN"),
                "reason": "Invalid task payload"
            })
            continue

        employee_id = task["employee"]["employeeId"]

        # 🛡 Validate employee exists
        employee = get_employee_by_id(employee_id)
        if not employee:
            failed.append({
                "title": task["title"],
                "employeeId": employee_id,
                "reason": "Employee not found"
            })
            continue

        # 🛡 Prevent duplicate task import
        is_duplicate = any(
            t["title"] == task["title"] and
            t.get("metadata", {}).get("projectName") ==
            task.get("metadata", {}).get("projectName")
            for t in existing_tasks
        )

        if is_duplicate:
            failed.append({
                "title": task["title"],
                "employeeId": employee_id,
                "reason": "Duplicate task already exists"
            })
            continue

        # 1️⃣ Create task
        new_task = create_task(
            manager_id=payload.managerId,
            title=task["title"],
            description=task["description"],
            priority=task.get("priority", "Medium"),
            deadline=task.get("deadline"),
            metadata=task.get("metadata", {})
        )

        if not new_task:
            failed.append({
                "title": task["title"],
                "reason": "Task creation failed"
            })
            continue

        created += 1
        created_tasks.append({
            "taskId": new_task["taskId"],
            "title": new_task["title"],
            "employeeId": employee_id
        })

        # 2️⃣ Auto assign
        assign_task_to_employees(
            task_id=new_task["taskId"],
            employee_ids=[employee_id],
            manager_id=payload.managerId
        )

        assigned += 1

    return {
        "success": True,
        "created": created,
        "assigned": assigned,
        "failed": failed,
        "createdTasks": created_tasks,
        "message": "Tasks imported and auto-assigned successfully"
    }
