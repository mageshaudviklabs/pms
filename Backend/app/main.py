from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Routers
from app.routers.employee import router as employee_router
from app.routers.managers import router as managers_router
from app.routers.tasks import router as tasks_router
from app.routers.notifications import router as notifications_router
from app.routers.task_import import  task_import_router
from app.routers.employee_tasks import router as employee_tasks_router
from app.routers.projects import router as projects_router



# Database (single source of truth)
from app import database

# ======================================================
# Create FastAPI application
# ======================================================

app = FastAPI(
    title="PMS Demo API",
    description="Performance Management System - Task & Employee Management",
    version="1.0.0",
    contact={
        "name": "PMS Development Team",
        "email": "support@pms-demo.com"
    },
    docs_url="/",
    redoc_url="/docs"
)

# ======================================================
# CORS Middleware
# ======================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # OK for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# Register Routers
# ======================================================

app.include_router(employee_router)
app.include_router(managers_router)
app.include_router(tasks_router)
app.include_router(notifications_router)
app.include_router(task_import_router)
app.include_router(employee_tasks_router)
app.include_router(projects_router)



# ======================================================
# Health Check Endpoint
# ======================================================

@app.get("/api/health", tags=["System"])
async def health_check():
    """
    Health check endpoint to verify API is running.
    """
    return {
        "status": "healthy",
        "service": "PMS API",
        "version": "1.0.0",
        "stats": {
            "totalEmployees": len(database.employees_db),
            "totalManagers": len(database.managers_db),
            "totalTasks": len(database.task_queue),
            "pendingTasks": len(
                [t for t in database.task_queue if t["status"] == "Pending"]
            ),
            "assignedTasks": len(
                [t for t in database.task_queue if t["status"] == "Assigned"]
            ),
            "totalNotifications": len(database.notifications_db),
            "unreadNotifications": len(
                [n for n in database.notifications_db if not n["isRead"]]
            )
        }
    }

# ======================================================
# Run Server (Dev Only)
# ======================================================

if __name__ == "__main__":
    import uvicorn

    print("\n" + "=" * 50)
    print("Starting PMS API Server...")
    print("=" * 50)
    print("Swagger UI: http://127.0.0.1:8000/")
    print("Health Check: http://127.0.0.1:8000/api/health")
    print("=" * 50 + "\n")

    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
