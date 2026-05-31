from rest_framework import routers
from . import viewsets


router = routers.DefaultRouter()

urlpatterns = []

router.register(r'organization', viewsets.OrganizationViewSets)
router.register(r'projects', viewsets.ProjectViewSets)
router.register(r'env-variable', viewsets.EnvVariableViewSets)
router.register(r'project-members', viewsets.ProjectMemberViewSets)
router.register(r'audit-log', viewsets.AuditLogViewSets)

urlpatterns += router.urls