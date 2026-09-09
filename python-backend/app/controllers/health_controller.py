# FILE: app/controllers/health_controller.py
# JOB: Return the health report.

from app.services import health_service


# The simple check.
def health():
    return health_service.get_health_status()


# The deep check.
def health_deep():
    try:
        return health_service.check_all()
    except Exception as error:
        return {
            "status": "down",
            "error": "The health check itself failed: " + str(error),
        }
