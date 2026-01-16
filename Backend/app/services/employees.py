from typing import List, Dict, Optional
from datetime import datetime
import app.database as db
from app.utils import get_availability_status

# ===== CORE FUNCTIONS =====

def get_all_employees() -> List[Dict]:
    """Get all employees with full details"""
    return db.employees_db

def get_employee_by_id(employee_id: str) -> Optional[Dict]:
    """Get employee by ID"""
    for emp in db.employees_db:
        if emp["employeeId"] == employee_id:
            return emp
    return None

def get_employees_ranked() -> List[Dict]:
    """Get employees ranked by availability"""
    sorted_employees = sorted(db.employees_db, key=lambda x: x["noOfActiveProjects"])
    
    ranked_list = []
    for rank, emp in enumerate(sorted_employees, 1):
        ranked_list.append({
            "rank": rank,
            "employeeId": emp["employeeId"],
            "employeeName": emp["employeeName"],
            "designation": emp.get("designation", "Employee"),
            "currentTaskDetails": emp["currentTaskDetails"],
            "noOfActiveProjects": emp["noOfActiveProjects"],
            "availabilityStatus": get_availability_status(emp["noOfActiveProjects"])
        })
    return ranked_list

def update_employee_on_assignment(employee_id: str, task_title: str) -> bool:
    """Update employee when task is assigned"""
    employee = get_employee_by_id(employee_id)
    if employee:
        employee["noOfActiveProjects"] += 1
        employee["currentTaskDetails"] = task_title
        employee["date"] = datetime.now().strftime("%Y-%m-%d")
        return True
    return False

# ===== PROFILE MAPPING FUNCTIONS =====

def map_employee_to_profile(emp: Dict) -> Dict:
    return {
        "id": emp["employeeId"],
        "name": emp["employeeName"],
        "email": emp.get("email", ""),
        "department": emp.get("department", "General"),
        "designation": emp.get("designation", "Staff")
    }

def get_all_employee_profiles() -> List[Dict]:
    return [map_employee_to_profile(emp) for emp in db.employees_db]

def get_employee_profile_by_id(employee_id: str) -> Optional[Dict]:
    emp = get_employee_by_id(employee_id)
    return map_employee_to_profile(emp) if emp else None