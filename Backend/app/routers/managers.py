from fastapi import APIRouter, HTTPException
from app import database

router = APIRouter(
    prefix="/api/managers",
    tags=["Managers"]
)

@router.get("/", summary="Get all managers")
async def get_all_managers():
    return {
        "success": True,
        "count": len(database.managers_db),
        "data": database.managers_db
    }


@router.get("/{manager_id}", summary="Get manager by ID")
async def get_manager_by_id(manager_id: str):
    for mgr in database.managers_db:
        if mgr["managerId"] == manager_id:
            return {
                "success": True,
                "data": mgr
            }

    raise HTTPException(
        status_code=404,
        detail={
            "success": False,
            "message": f"Manager '{manager_id}' not found"
        }
    )
