from rest_framework import permissions
from .models import ProjectMember, Organization, Project

class ProjectPermission(permissions.BasePermission):
    """
    Granular permission for Project and its related objects.
    - Owner: Full access
    - Admin: Add/edit/delete variables, manage members
    - Developer: Add/edit/delete variables
    - Viewer: See variable keys only
    """
    
    def has_permission(self, request, view):
        # Must be authenticated
        if not (request.user and request.user.is_authenticated):
            return False

        # For 'create' (POST to list), we must check the project ID in the request data
        if request.method == 'POST' and view.__class__.__name__ in ['EnvVariableViewSets', 'ProjectMemberViewSets']:
            project_id = request.data.get('project')
            if not project_id:
                return True # Let the serializer handle missing project ID
            
            try:
                project = Project.objects.get(id=project_id)
                # Check Organization owner
                if project.organization.owner == request.user:
                    return True
                # Check FREE tier bypass
                if project.organization.tier == TierChoices.FREE:
                    return True

                    return ProjectMember.objects.filter(project=project, user=request.user).exists()

                # Check Project roles
                membership = ProjectMember.objects.filter(project=project, user=request.user).first()
                if not membership:
                    return False
                
                role = membership.role
                if view.__class__.__name__ == 'EnvVariableViewSets':
                    return role in ['OWNER', 'ADMIN', 'DEVELOPER']
                
                if view.__class__.__name__ == 'ProjectMemberViewSets':
                    return role in ['OWNER', 'ADMIN']
                    
            except Project.DoesNotExist:
                return True # Let the serializer handle invalid project ID
        
        return True

    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Get the project from the object
        from .models import Project, EnvVariable, ProjectMember
        project = None
        if isinstance(obj, Project):
            project = obj
        elif isinstance(obj, EnvVariable):
            project = obj.project
        elif isinstance(obj, ProjectMember):
            project = obj.project
            
        if not project:
            return False

        # Check if user is Organization owner (Global Admin for that org)
        if project.organization.owner == user:
            return True

        # If Organization is FREE, bypass RBAC for all members
        if project.organization.tier == 'FREE':
            # Check project membership
            membership = ProjectMember.objects.filter(project=project, user=user).exists()
            return membership # Any member can do everything in Free tier

        # Get user's role in the project
        membership = ProjectMember.objects.filter(project=project, user=user).first()
        if not membership:
            return False
            
        role = membership.role

        # SAFE_METHODS (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True # All members can at least 'see' objects (keys)

        # Write operations (PUT, PATCH, DELETE)
        
        # OWNER can do anything
        if role == 'OWNER':
            return True
        
        # ADMIN can manage members and variables, but not delete the project itself
        if role == 'ADMIN':
            if isinstance(obj, Project) and request.method == 'DELETE':
                return False
            return True

        # DEVELOPER can manage variables, but not members or the project itself
        if role == 'DEVELOPER':
            if isinstance(obj, EnvVariable):
                return True
            return False

        # VIEWER is strictly read-only
        if role == 'VIEWER':
            return False

        return False
