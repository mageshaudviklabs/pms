from fastapi import FastAPI
from routers import tasks, employee, notifications
from fastapi.middleware.cors import CORSMiddleware
import data

# Create FastAPI application
app = FastAPI(
    title="PMS Demo API",
    description="Performance Management System - Task Assignment Demo",
    version="1.0.0",
    contact={
        "name": "PMS Development Team",
        "email": "support@pms-demo.com"
    },
    docs_url="/",
    redoc_url="/docs" 
)

# ===== CORS Middleware =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers (connect endpoints to app)
app.include_router(tasks.router)
app.include_router(employee.router)
app.include_router(notifications.router)

# Health check endpoint
@app.get("/api/health", tags=["System"])
async def health_check():
    """
    Health check endpoint to verify API is running.
    
    Returns system statistics and database counts.
    """
    return {
        "status": "healthy",
        "service": "PMS Task Assignment API",
        "version": "1.0.0",
        "stats": {
            "totalEmployees": len(data.employees_db),
            "totalManagers": len(data.managers_db),
            "totalTasks": len(data.task_queue),
            "pendingTasks": len([t for t in data.task_queue if t["status"] == "Pending"]),
            "assignedTasks": len([t for t in data.task_queue if t["status"] == "Assigned"]),
            "totalNotifications": len(data.notifications_db),
            "unreadNotifications": len([n for n in data.notifications_db if not n["isRead"]])
        }
    }

# ===== Run Instructions =====
if __name__ == "__main__":
    import uvicorn
    
    print("\n" + "="*50)
    print("Starting PMS API Server...")
    print("="*50)
    print("Swagger UI: http://127.0.0.1:8000/docs")
    print("Health Check: http://127.0.0.1:8000/health")
    print("="*50 + "\n")
    
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )