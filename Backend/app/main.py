from fastapi import FastAPI
from routers.employees import router as employee_router
from routers.tasks import router as task_router

app = FastAPI(
    title="PMS Backend",
    description="Project Management System API"
)

@app.get("/")
def root():
    return {"message": "Manager Dashboard"}

app.include_router(employee_router)
app.include_router(task_router)
