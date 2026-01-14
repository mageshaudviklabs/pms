from pydantic import BaseModel

class Employee(BaseModel):
    employeeId: str
    employeeName: str
    date: str
    currentTaskDetails: str
    noOfActiveProjects: int
