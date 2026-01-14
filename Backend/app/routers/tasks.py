from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import data

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


# ===== Pydantic Models =====

class CreateTaskRequest(BaseModel):
    managerId: str
    title: str
    description: str
    priority: str = "Medium"  # Low, Medium, High, Critical
    deadline: Optional[str] = None
    metadata: Optional[dict] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "managerId": "MGR001",
                "title": "Implement User Authentication",
                "description": "Add JWT-based authentication to the API endpoints",
                "priority": "High",
                "deadline": "2026-02-01",
                "metadata": {
                    "module": "Security",
                    "estimatedHours": 40
                }
            }
        }


class AssignTaskRequest(BaseModel):
    managerId: str
    employeeIds: List[str]
    
    class Config:
        json_schema_extra = {
            "example": {
                "managerId": "MGR001",
                "employeeIds": ["EMP003", "EMP006"]
            }
        }


# ===== ENDPOINTS =====

@router.post("/create", summary="Create a new task")
async def create_task(request: CreateTaskRequest):
    """
    **Step 1 of Workflow**: Manager creates a new task
    
    - Task is added to the manager's task queue
    - Status is set to "Pending"
    - Task is NOT yet assigned to any employee
    
    The manager will later click on this task to assign employees.
    """
    task = data.create_task(
        manager_id=request.managerId,
        title=request.title,
        description=request.description,
        priority=request.priority,
        deadline=request.deadline,
        metadata=request.metadata
    )
    
    if not task:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"Manager '{request.managerId}' not found"
            }
        )
    
    return {
        "success": True,
        "message": "Task created and added to queue",
        "task": task
    }


@router.get("/queue/{manager_id}", summary="Get manager's task queue")
async def get_task_queue(manager_id: str, status: Optional[str] = None):
    """
    **Step 2 of Workflow**: Manager views their task queue
    
    Returns all tasks created by the manager.
    
    Optional filter by status:
    - `Pending` - Tasks not yet assigned
    - `Assigned` - Tasks already assigned to employees
    - `In Progress` - Tasks being worked on
    - `Completed` - Finished tasks
    """
    manager = data.get_manager_by_id(manager_id)
    if not manager:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"Manager '{manager_id}' not found"
            }
        )
    
    tasks = data.get_manager_task_queue(manager_id, status)
    
    # Count by status
    all_tasks = data.get_manager_task_queue(manager_id)
    status_counts = {
        "Pending": len([t for t in all_tasks if t["status"] == "Pending"]),
        "Assigned": len([t for t in all_tasks if t["status"] == "Assigned"]),
        "In Progress": len([t for t in all_tasks if t["status"] == "In Progress"]),
        "Completed": len([t for t in all_tasks if t["status"] == "Completed"])
    }
    
    return {
        "success": True,
        "manager": manager,
        "filter": status or "All",
        "statusCounts": status_counts,
        "count": len(tasks),
        "tasks": tasks
    }


@router.get("/{task_id}", summary="Get task details with available employees")
async def get_task_details(task_id: int):
    """
    **Step 3 of Workflow**: Manager clicks on a task
    
    Returns:
    - Complete task details (title, description, metadata, etc.)
    - List of available employees **ranked by availability**
    - Employees with fewer active projects appear first
    
    This is the interface where manager selects employees to assign.
    """
    result = data.get_task_details_with_employees(task_id)
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"Task with ID {task_id} not found"
            }
        )
    
    return {
        "success": True,
        "data": result
    }


@router.post("/{task_id}/assign", summary="Assign task to employees")
async def assign_task(task_id: int, request: AssignTaskRequest):
    """
    **Step 4 & 5 of Workflow**: Manager assigns task to employee(s)
    
    This will:
    1. Assign the task to selected employee(s)
    2. Update task status from "Pending" → "Assigned"
    3. Increment each employee's `noOfActiveProjects`
    4. **Send notification** to each employee:
       *"{Manager Name} selected you to do '{Task Title}' task."*
    5. Return updated ranking
    
    **Note**: Multiple employees can be assigned to a single task.
    """
    task = data.get_task_by_id(task_id)
    
    if not task:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"Task with ID {task_id} not found"
            }
        )
    
    if task["status"] != "Pending":
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "message": f"Task is already '{task['status']}'. Only 'Pending' tasks can be assigned."
            }
        )
    
    if task["managerId"] != request.managerId:
        raise HTTPException(
            status_code=403,
            detail={
                "success": False,
                "message": "You can only assign tasks that you created"
            }
        )
    
    # Validate employees exist
    invalid_employees = []
    for emp_id in request.employeeIds:
        if not data.get_employee_by_id(emp_id):
            invalid_employees.append(emp_id)
    
    if invalid_employees:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "message": f"Invalid employee IDs: {invalid_employees}"
            }
        )
    
    # Perform assignment
    result = data.assign_task_to_employees(
        task_id=task_id,
        employee_ids=request.employeeIds,
        manager_id=request.managerId
    )
    
    return {
        "success": True,
        "message": f"Task assigned to {len(result['assignedTo'])} employee(s). Notifications sent.",
        "data": result,
        "updatedEmployeeRanking": data.get_employees_ranked()
    }


@router.get("/", summary="Get all tasks")
async def get_all_tasks():
    """Get all tasks in the system (for testing/admin)"""
    return {
        "success": True,
        "count": len(data.task_queue),
        "tasks": list(reversed(data.task_queue))
    }