from ..models import AuditLog

def log_audit(user, action, variable_key, project=None, organization=None):
    """
    Helper function to create an audit log entry.
    Supports auditing at Organization, Project, or Variable level.
    """
    try:
        AuditLog.objects.create(
            user=user,
            project=project,
            organization=organization,
            action=action,
            variable_key=variable_key
        )
    except Exception as e:
        # We don't want audit logging to break the main application flow,
        # but we should at least print the error in development.
        print(f"Audit Logging Failed: {str(e)}")
