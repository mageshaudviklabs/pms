from typing import List, Dict, Optional
import app.database as db

def get_manager_by_id(manager_id: str) -> Optional[Dict]:
    """Get manager by ID"""
    for mgr in db.managers_db:
        if mgr["managerId"] == manager_id:
            return mgr
    return None

def get_all_managers() -> List[Dict]:
    """Get all managers"""
    return db.managers_db