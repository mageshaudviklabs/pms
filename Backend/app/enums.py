from enum import Enum

class TaskStatus(str, Enum):
    PENDING = "Pending"           # Task created, not yet assigned
    ASSIGNED = "Assigned"         # Task assigned to employee(s)
    IN_PROGRESS = "In Progress"   # Employee started working
    COMPLETED = "Completed"       # Task completed