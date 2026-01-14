from fastapi import FastAPI
from routers import tasks, employee, notifications

# Create FastAPI application
app = FastAPI(
    title="PMS Demo API",
    description="Performance Management System - Task Assignment Demo",
    version="1.0.0"
)

# Register routers (connect endpoints to app)
app.include_router(tasks.router)        # /api/tasks/...
app.include_router(employee.router)    # /api/employees/...
app.include_router(notifications.router) # /api/notifications/...

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "PMS Demo API"
    }