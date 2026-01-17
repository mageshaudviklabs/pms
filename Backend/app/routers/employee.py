from fastapi import APIRouter, HTTPException
from app import data

router = APIRouter(prefix="/api/employees", tags=["Employees"])

# =========================================================
# EMPLOYEE PROFILE ROUTES (PROFILE ONLY)
# =========================================================

@router.get("/profile", summary="Get all employee profiles")
async def get_employee_profiles():
    """
    Returns employee profile data only.
    No tasks, no workload, no history.
    """
    profiles = data.get_all_employee_profiles()
    return {
        "success": True,
        "count": len(profiles),
        "data": profiles
    }


@router.get("/profile/{employee_id}", summary="Get employee profile by ID")
async def get_employee_profile(employee_id: str):
    """
    Returns a single employee profile by ID.
    """
    profile = data.get_employee_profile_by_id(employee_id)

    if not profile:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"Employee profile '{employee_id}' not found"
            }
        )

    return {
        "success": True,
        "data": profile
    }


# =========================================================
# TASK-AWARE EMPLOYEE ROUTES (EXISTING LOGIC)
# =========================================================

@router.get("/", summary="Get all employees")
async def get_all_employees():
    """Returns all employees with their current data"""
    employees = data.get_all_employees()

    employees_with_history = []
    for emp in employees:
        history = data.get_employee_task_history(emp["employeeId"])
        employees_with_history.append({
            **emp,
            "taskHistorySummary": {
                "totalTasks": history["totalTasks"],
                "activeTasks": history["activeCount"],
                "completedTasks": history["completedCount"]
            }
        })

    return {
        "success": True,
        "count": len(employees_with_history),
        "data": employees_with_history
    }


@router.get("/ranking", summary="Get employees ranked by availability")
async def get_employee_ranking():
    ranking = data.get_employees_ranked()
    return {
        "success": True,
        "description": "Employees ranked by availability (fewer projects = higher rank)",
        "count": len(ranking),
        "data": ranking
    }


@router.get("/{employee_id}", summary="Get employee by ID")
async def get_employee(employee_id: str):
    employee = data.get_employee_by_id(employee_id)

    if not employee:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"Employee '{employee_id}' not found"
            }
        )

    return {
        "success": True,
        "data": {
            **employee,
            "availabilityStatus": data.get_availability_status(
                employee["noOfActiveProjects"]
            )
        }
    }


@router.get("/{employee_id}/notifications", summary="Get employee notifications")
async def get_employee_notifications(employee_id: str, unread_only: bool = False):
    employee = data.get_employee_by_id(employee_id)

    if not employee:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"Employee '{employee_id}' not found"
            }
        )

    notifications = data.get_employee_notifications(employee_id, unread_only)

    return {
        "success": True,
        "employee": {
            "employeeId": employee_id,
            "employeeName": employee["employeeName"]
        },
        "unreadOnly": unread_only,
        "count": len(notifications),
        "notifications": notifications
    }


@router.get("/{employee_id}/task-history", summary="Get employee task history/logs")
async def get_employee_task_history(employee_id: str):
    employee = data.get_employee_by_id(employee_id)

    if not employee:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"Employee '{employee_id}' not found"
            }
        )

    history = data.get_employee_task_history(employee_id)

    return {
        "success": True,
        "employee": {
            "employeeId": employee_id,
            "employeeName": employee["employeeName"],
            "currentTaskDetails": employee["currentTaskDetails"],
            "noOfActiveProjects": employee["noOfActiveProjects"]
        },
        "taskHistory": history,
        "summary": {
            "totalTasksAssigned": history["totalTasks"],
            "currentlyActive": history["activeCount"],
            "completed": history["completedCount"]
        }
    }
