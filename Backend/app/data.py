from typing import List, Dict, Optional
from datetime import datetime
from enum import Enum

# ===== ENUMS =====

class TaskStatus(str, Enum):
    PENDING = "Pending"           # Task created, not yet assigned
    ASSIGNED = "Assigned"         # Task assigned to employee(s)
    IN_PROGRESS = "In Progress"   # Employee started working
    COMPLETED = "Completed"       # Task completed


# ===== IN-MEMORY DATABASES =====

# Employee Database
employees_db: List[Dict] = [
    {
        "employeeId": "EMP001",
        "employeeName": "Arun Kumar",
        "date": "2026-01-14",
        "currentTaskDetails": "Develop REST APIs for PMS module",
        "noOfActiveProjects": 3
    },
    {
        "employeeId": "EMP002",
        "employeeName": "Priya Sharma",
        "date": "2026-01-14",
        "currentTaskDetails": "Design dashboard UI using React",
        "noOfActiveProjects": 2
    },
    {
        "employeeId": "EMP003",
        "employeeName": "Ravi Teja",
        "date": "2026-01-14",
        "currentTaskDetails": "Perform unit and integration testing",
        "noOfActiveProjects": 1
    },
    {
        "employeeId": "EMP004",
        "employeeName": "Sneha Iyer",
        "date": "2026-01-14",
        "currentTaskDetails": "Create database schema and relations",
        "noOfActiveProjects": 4
    },
    {
        "employeeId": "EMP005",
        "employeeName": "Vikram Singh",
        "date": "2026-01-14",
        "currentTaskDetails": "Optimize backend performance",
        "noOfActiveProjects": 2
    },
    {
        "employeeId": "EMP006",
        "employeeName": "Anjali Patel",
        "date": "2026-01-14",
        "currentTaskDetails": "Prepare project documentation",
        "noOfActiveProjects": 1
    },
    {
        "employeeId": "EMP007",
        "employeeName": "Rahul Mehta",
        "date": "2026-01-14",
        "currentTaskDetails": "Implement authentication and authorization",
        "noOfActiveProjects": 3
    },
    {
        "employeeId": "EMP008",
        "employeeName": "Kavya Nair",
        "date": "2026-01-14",
        "currentTaskDetails": "Design user experience flows",
        "noOfActiveProjects": 2
    },
    {
        "employeeId": "EMP009",
        "employeeName": "Suresh Reddy",
        "date": "2026-01-14",
        "currentTaskDetails": "Handle deployment and CI/CD pipeline",
        "noOfActiveProjects": 4
    },
    {
        "employeeId": "EMP010",
        "employeeName": "Neha Verma",
        "date": "2026-01-14",
        "currentTaskDetails": "Create automated test cases",
        "noOfActiveProjects": 2
    },
    {
        "employeeId": "EMP011",
        "employeeName": "Karthik Raj",
        "date": "2026-01-14",
        "currentTaskDetails": "Integrate frontend with backend APIs",
        "noOfActiveProjects": 3
    },
    {
        "employeeId": "EMP012",
        "employeeName": "Pooja Malhotra",
        "date": "2026-01-14",
        "currentTaskDetails": "Prepare performance reports",
        "noOfActiveProjects": 1
    },
    {
        "employeeId": "EMP013",
        "employeeName": "Amit Choudhary",
        "date": "2026-01-14",
        "currentTaskDetails": "Implement task management module",
        "noOfActiveProjects": 3
    },
    {
        "employeeId": "EMP014",
        "employeeName": "Divya Srinivasan",
        "date": "2026-01-14",
        "currentTaskDetails": "Design analytics dashboard",
        "noOfActiveProjects": 2
    },
    {
        "employeeId": "EMP015",
        "employeeName": "Manoj K",
        "date": "2026-01-14",
        "currentTaskDetails": "Review code and manage pull requests",
        "noOfActiveProjects": 5
    }
]

# Manager Database
managers_db: List[Dict] = [
    {
        "managerId": "MGR001",
        "managerName": "Rajesh Krishnan",
        "department": "Engineering"
    },
    {
        "managerId": "MGR002",
        "managerName": "Sunita Reddy",
        "department": "Product"
    }
]

# Task Queue (Tasks created by managers, pending assignment)
task_queue: List[Dict] = []
task_counter: int = 0

# Notifications Database
notifications_db: List[Dict] = []
notification_counter: int = 0


# ===== HELPER FUNCTIONS =====

def get_availability_status(active_projects: int) -> str:
    """Get availability status based on project count"""
    if active_projects == 0:
        return "Available"
    elif active_projects <= 2:
        return "Low Load"
    elif active_projects <= 4:
        return "Moderate Load"
    else:
        return "High Load"


# ===== EMPLOYEE FUNCTIONS =====

def get_all_employees() -> List[Dict]:
    """Get all employees"""
    return employees_db


def get_employee_by_id(employee_id: str) -> Optional[Dict]:
    """Get employee by ID"""
    for emp in employees_db:
        if emp["employeeId"] == employee_id:
            return emp
    return None


def get_employees_ranked() -> List[Dict]:
    """Get employees ranked by availability (fewer projects = higher rank)"""
    sorted_employees = sorted(employees_db, key=lambda x: x["noOfActiveProjects"])
    
    ranked_list = []
    for rank, emp in enumerate(sorted_employees, 1):
        ranked_list.append({
            "rank": rank,
            "employeeId": emp["employeeId"],
            "employeeName": emp["employeeName"],
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


# ===== MANAGER FUNCTIONS =====

def get_manager_by_id(manager_id: str) -> Optional[Dict]:
    """Get manager by ID"""
    for mgr in managers_db:
        if mgr["managerId"] == manager_id:
            return mgr
    return None


def get_all_managers() -> List[Dict]:
    """Get all managers"""
    return managers_db


# ===== TASK FUNCTIONS =====

def create_task(
    manager_id: str,
    title: str,
    description: str,
    priority: str = "Medium",
    deadline: str = None,
    metadata: Dict = None
) -> Optional[Dict]:
    """
    Create a new task and add to manager's queue
    Status: Pending (not yet assigned)
    """
    global task_counter
    
    manager = get_manager_by_id(manager_id)
    if not manager:
        return None
    
    task_counter += 1
    
    task = {
        "taskId": task_counter,
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
    
    task_queue.append(task)
    return task


def get_task_by_id(task_id: int) -> Optional[Dict]:
    """Get task by ID"""
    for task in task_queue:
        if task["taskId"] == task_id:
            return task
    return None


def get_manager_task_queue(manager_id: str, status_filter: str = None) -> List[Dict]:
    """Get all tasks for a specific manager, optionally filtered by status"""
    tasks = [t for t in task_queue if t["managerId"] == manager_id]
    
    if status_filter:
        tasks = [t for t in tasks if t["status"] == status_filter]
    
    # Sort by created date (newest first)
    tasks.sort(key=lambda x: x["createdAt"], reverse=True)
    return tasks


def get_task_details_with_employees(task_id: int) -> Optional[Dict]:
    """
    Get task details along with ranked available employees
    This is what manager sees when they click on a task
    """
    task = get_task_by_id(task_id)
    if not task:
        return None
    
    # Get ranked employees
    ranked_employees = get_employees_ranked()
    
    return {
        "task": task,
        "availableEmployees": ranked_employees,
        "totalEmployees": len(ranked_employees)
    }


def assign_task_to_employees(
    task_id: int,
    employee_ids: List[str],
    manager_id: str
) -> Optional[Dict]:
    """
    Assign a task to one or more employees
    - Updates task status to "Assigned"
    - Updates employee data
    - Creates notifications for employees
    """
    task = get_task_by_id(task_id)
    if not task:
        return None
    
    # Verify manager owns this task
    if task["managerId"] != manager_id:
        return None
    
    # Verify task is pending
    if task["status"] != TaskStatus.PENDING.value:
        return None
    
    manager = get_manager_by_id(manager_id)
    assigned_employees = []
    
    for emp_id in employee_ids:
        employee = get_employee_by_id(emp_id)
        if employee:
            # Update employee
            update_employee_on_assignment(emp_id, task["title"])
            
            # Create notification
            create_notification(
                employee_id=emp_id,
                manager_id=manager_id,
                task_id=task_id,
                message=f"{manager['managerName']} selected you to do '{task['title']}' task."
            )
            
            assigned_employees.append({
                "employeeId": emp_id,
                "employeeName": employee["employeeName"]
            })
    
    # Update task
    task["status"] = TaskStatus.ASSIGNED.value
    task["assignedEmployees"] = assigned_employees
    task["assignedAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    return {
        "task": task,
        "assignedTo": assigned_employees,
        "notificationsSent": len(assigned_employees)
    }


# ===== NOTIFICATION FUNCTIONS =====

def create_notification(
    employee_id: str,
    manager_id: str,
    task_id: int,
    message: str
) -> Dict:
    """Create a notification for an employee"""
    global notification_counter
    
    notification_counter += 1
    
    employee = get_employee_by_id(employee_id)
    manager = get_manager_by_id(manager_id)
    
    notification = {
        "notificationId": notification_counter,
        "employeeId": employee_id,
        "employeeName": employee["employeeName"] if employee else "Unknown",
        "managerId": manager_id,
        "managerName": manager["managerName"] if manager else "Unknown",
        "taskId": task_id,
        "message": message,
        "isRead": False,
        "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    notifications_db.append(notification)
    return notification


def get_employee_notifications(employee_id: str, unread_only: bool = False) -> List[Dict]:
    """Get notifications for an employee"""
    notifications = [n for n in notifications_db if n["employeeId"] == employee_id]
    
    if unread_only:
        notifications = [n for n in notifications if not n["isRead"]]
    
    # Sort by date (newest first)
    notifications.sort(key=lambda x: x["createdAt"], reverse=True)
    return notifications


def mark_notification_read(notification_id: int) -> bool:
    """Mark a notification as read"""
    for notification in notifications_db:
        if notification["notificationId"] == notification_id:
            notification["isRead"] = True
            return True
    return False


def get_all_notifications() -> List[Dict]:
    """Get all notifications (for testing)"""
    return list(reversed(notifications_db))


def delete_notification(notification_id: int) -> bool:
    """Delete a notification by ID"""
    global notifications_db
    
    for i, notification in enumerate(notifications_db):
        if notification["notificationId"] == notification_id:
            notifications_db.pop(i)
            return True
    
    return False
		