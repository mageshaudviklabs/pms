from typing import Dict, List
import app.database as db

def add_task_to_employee_history(
    employee_id: str, task_id: int, task_title: str, 
    manager_id: str, manager_name: str, assigned_at: str, status: str = "Assigned"
) -> None:
    """Add a task assignment to employee's history"""
    if employee_id not in db.employee_task_history:
        db.employee_task_history[employee_id] = []
    
    history_entry = {
        "taskId": task_id,
        "taskTitle": task_title,
        "managerId": manager_id,
        "managerName": manager_name,
        "assignedAt": assigned_at,
        "status": status,
        "completedAt": None
    }
    
    db.employee_task_history[employee_id].append(history_entry)

def get_employee_task_history(employee_id: str) -> Dict:
    if employee_id not in db.employee_task_history:
        return {
            "employeeId": employee_id, "totalTasks": 0,
            "activeTasks": [], "completedTasks": [], "history": []
        }
    
    history = db.employee_task_history[employee_id]
    active = [h for h in history if h["status"] in ["Assigned", "In Progress"]]
    completed = [h for h in history if h["status"] == "Completed"]
    
    return {
        "employeeId": employee_id,
        "totalTasks": len(history),
        "activeTasks": active, "activeCount": len(active),
        "completedTasks": completed, "completedCount": len(completed),
        "fullHistory": sorted(history, key=lambda x: x["assignedAt"], reverse=True)
    }

def update_task_status_in_history(
    employee_id: str, task_id: int, new_status: str, completed_at: str = None
) -> bool:
    if employee_id not in db.employee_task_history:
        return False
    
    for entry in db.employee_task_history[employee_id]:
        if entry["taskId"] == task_id:
            entry["status"] = new_status
            if completed_at:
                entry["completedAt"] = completed_at
            return True
    return False