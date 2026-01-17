# Facade file: Re-exports from modular files to maintain backward compatibility

from app.enums import TaskStatus
from app.utils import get_availability_status
from app.services.task_storage import get_all_tasks

# Re-export Database items (careful with mutable counters)
from app.database import (
    employees_db, managers_db, task_queue, notifications_db, 
    employee_task_history, task_counter, notification_counter
)

# Re-export Services
from app.services.employees import (
    get_all_employees, get_employee_by_id, get_employees_ranked, 
    update_employee_on_assignment, get_all_employee_profiles, 
    get_employee_profile_by_id, map_employee_to_profile
)

from app.services.managers import (
    get_manager_by_id, get_all_managers
)

from app.services.tasks import (
    create_task, get_task_by_id, get_manager_task_queue, 
    get_task_details_with_employees, assign_task_to_employees
)

from app.services.notifications import (
    create_notification, get_employee_notifications, 
    mark_notification_read, get_all_notifications, delete_notification
)

from app.services.history import (
    add_task_to_employee_history, get_employee_task_history, 
    update_task_status_in_history
)