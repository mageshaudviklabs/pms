from fastapi import APIRouter, HTTPException
import data

router = APIRouter(prefix="/api/employees", tags=["Employees"])


@router.get("/", summary="Get all employees")
async def get_all_employees():
    """Returns all employees with their current data"""
    employees = data.get_all_employees()
    return {
        "success": True,
        "count": len(employees),
        "data": employees
    }


@router.get("/ranking", summary="Get employees ranked by availability")
async def get_employee_ranking():
    """
    Returns employees ranked by number of active projects.
    
    **Ranking Logic:**
    - Rank 1 = Fewest active projects (best candidate)
    - Higher rank = More projects (busier)
    
    **Availability Status:**
    - `Available`: 0 projects
    - `Low Load`: 1-2 projects
    - `Moderate Load`: 3-4 projects
    - `High Load`: 5+ projects
    """
    ranking = data.get_employees_ranked()
    return {
        "success": True,
        "description": "Employees ranked by availability (fewer projects = higher rank)",
        "count": len(ranking),
        "data": ranking
    }


@router.get("/{employee_id}", summary="Get employee by ID")
async def get_employee(employee_id: str):
    """Get a specific employee by their ID"""
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
            "availabilityStatus": data.get_availability_status(employee["noOfActiveProjects"])
        }
    }


@router.get("/{employee_id}/notifications", summary="Get employee notifications")
async def get_employee_notifications(employee_id: str, unread_only: bool = False):
    """
    Get all notifications for an employee.
    
    These are messages sent when a manager assigns a task to them.
    
    Query params:
    - `unread_only`: If true, only returns unread notifications
    """
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