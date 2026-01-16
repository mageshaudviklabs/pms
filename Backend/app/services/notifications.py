from typing import List, Dict
from datetime import datetime
import app.database as db
from app.services.employees import get_employee_by_id
from app.services.managers import get_manager_by_id

def create_notification(employee_id: str, manager_id: str, task_id: int, message: str) -> Dict:
    """Create a notification for an employee"""
    # Accessing the module directly to update the global counter
    db.notification_counter += 1
    
    employee = get_employee_by_id(employee_id)
    manager = get_manager_by_id(manager_id)
    
    notification = {
        "notificationId": db.notification_counter,
        "employeeId": employee_id,
        "employeeName": employee["employeeName"] if employee else "Unknown",
        "managerId": manager_id,
        "managerName": manager["managerName"] if manager else "Unknown",
        "taskId": task_id,
        "message": message,
        "isRead": False,
        "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    db.notifications_db.append(notification)
    return notification

def get_employee_notifications(employee_id: str, unread_only: bool = False) -> List[Dict]:
    """Get notifications for an employee"""
    notifications = [n for n in db.notifications_db if n["employeeId"] == employee_id]
    
    if unread_only:
        notifications = [n for n in notifications if not n["isRead"]]
    
    notifications.sort(key=lambda x: x["createdAt"], reverse=True)
    return notifications

def mark_notification_read(notification_id: int) -> bool:
    for notification in db.notifications_db:
        if notification["notificationId"] == notification_id:
            notification["isRead"] = True
            return True
    return False

def get_all_notifications() -> List[Dict]:
    return list(reversed(db.notifications_db))

def delete_notification(notification_id: int) -> bool:
    for i, notification in enumerate(db.notifications_db):
        if notification["notificationId"] == notification_id:
            db.notifications_db.pop(i)
            return True
    return False