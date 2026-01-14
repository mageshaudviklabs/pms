from fastapi import APIRouter
from repositories.employee_repo import load_employees

router = APIRouter(prefix="/api/tasks", tags=["Employees"])


@router.get("/employees")
def get_all_employees():
    return load_employees()


# 👉 This is the endpoint you need
@router.get("/employees/sorted")
def get_sorted_employees():
    employees = load_employees()
    employees_sorted = sorted(employees, key=lambda x: x["noOfActiveProjects"])
    return employees_sorted
