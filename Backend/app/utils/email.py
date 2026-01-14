from pydantic import BaseModel
from typing import Optional

class Employee(BaseModel):
    employeeId: str
    employeeName: str
    date: str
    currentTaskDetails: str
    noOfActiveProjects: int
