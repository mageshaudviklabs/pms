from fastapi import APIRouter, HTTPException
from typing import Optional
from app import data

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


@router.get("/", summary="Get all notifications")
async def get_all_notifications():
    """
    Get all notifications in the system.
    
    Useful for testing and admin purposes.
    Returns notifications sorted by date (newest first).
    """
    notifications = data.get_all_notifications()
    
    # Count stats
    total = len(notifications)
    unread = len([n for n in notifications if not n["isRead"]])
    read = total - unread
    
    return {
        "success": True,
        "stats": {
            "total": total,
            "unread": unread,
            "read": read
        },
        "notifications": notifications
    }


@router.get("/employee/{employee_id}", summary="Get notifications for employee")
async def get_notifications_for_employee(
    employee_id: str, 
    unread_only: bool = False
):
    """
    Get all notifications for a specific employee.
    
    This is the endpoint employees use to check their notifications/messages.
    
    **Query Parameters:**
    - `unread_only`: If true, only returns unread notifications
    
    **Example:**
    - GET /api/notifications/employee/EMP003
    - GET /api/notifications/employee/EMP003?unread_only=true
    """
    # Validate employee exists
    employee = data.get_employee_by_id(employee_id)
    
    if not employee:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"Employee '{employee_id}' not found"
            }
        )
    
    # Get notifications
    notifications = data.get_employee_notifications(employee_id, unread_only)
    
    # Get counts
    all_notifications = data.get_employee_notifications(employee_id, unread_only=False)
    unread_count = len([n for n in all_notifications if not n["isRead"]])
    read_count = len(all_notifications) - unread_count
    
    return {
        "success": True,
        "employee": {
            "employeeId": employee_id,
            "employeeName": employee["employeeName"]
        },
        "filter": "unread" if unread_only else "all",
        "stats": {
            "total": len(all_notifications),
            "unread": unread_count,
            "read": read_count
        },
        "count": len(notifications),
        "notifications": notifications
    }


@router.patch("/{notification_id}/read", summary="Mark notification as read")
async def mark_as_read(notification_id: int):
    """
    Mark a specific notification as read.
    
    Called when employee views/acknowledges the notification.
    
    **Example:**
    - PATCH /api/notifications/1/read
    """
    success = data.mark_notification_read(notification_id)
    
    if not success:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"Notification with ID {notification_id} not found"
            }
        )
    
    return {
        "success": True,
        "message": f"Notification {notification_id} marked as read",
        "notificationId": notification_id
    }


@router.patch("/employee/{employee_id}/read-all", summary="Mark all notifications as read")
async def mark_all_as_read(employee_id: str):
    """
    Mark all notifications for an employee as read.
    
    Useful for "Mark all as read" functionality.
    
    **Example:**
    - PATCH /api/notifications/employee/EMP003/read-all
    """
    # Validate employee exists
    employee = data.get_employee_by_id(employee_id)
    
    if not employee:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"Employee '{employee_id}' not found"
            }
        )
    
    # Get all unread notifications for this employee
    notifications = data.get_employee_notifications(employee_id, unread_only=True)
    
    # Mark each as read
    marked_count = 0
    for notification in notifications:
        if data.mark_notification_read(notification["notificationId"]):
            marked_count += 1
    
    return {
        "success": True,
        "message": f"Marked {marked_count} notification(s) as read",
        "employeeId": employee_id,
        "markedCount": marked_count
    }


@router.get("/{notification_id}", summary="Get single notification")
async def get_notification(notification_id: int):
    """
    Get a specific notification by ID.
    
    **Example:**
    - GET /api/notifications/1
    """
    # Find notification
    all_notifications = data.get_all_notifications()
    
    for notification in all_notifications:
        if notification["notificationId"] == notification_id:
            return {
                "success": True,
                "notification": notification
            }
    
    raise HTTPException(
        status_code=404,
        detail={
            "success": False,
            "message": f"Notification with ID {notification_id} not found"
        }
    )


@router.delete("/{notification_id}", summary="Delete notification")
async def delete_notification(notification_id: int):
    """
    Delete a specific notification.
    
    **Example:**
    - DELETE /api/notifications/1
    """
    success = data.delete_notification(notification_id)
    
    if not success:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"Notification with ID {notification_id} not found"
            }
        )
    
    return {
        "success": True,
        "message": f"Notification {notification_id} deleted",
        "notificationId": notification_id
    }