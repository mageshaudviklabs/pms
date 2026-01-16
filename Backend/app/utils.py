def get_availability_status(active_projects: int) -> str:
    """Get availability status based on project count"""
    if active_projects == 0:
        return "Available"
    elif active_projects <= 2:
        return "Low Load"
    elif active_projects <= 4:
        return "Moderate Load"
    else:
        return "High Load"