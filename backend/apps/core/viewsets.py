from rest_framework import viewsets, response, status, serializers as drf_serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.utils import timezone
from datetime import timedelta
from . import serializers
from . import models
from .constants import TIER_CONFIG, TierChoices, EnvChoices
from .utils.encryptor import _encrypt_var
from .utils.audit_helper import log_audit
from .permission import ProjectPermission
from django.db.models import Q



class OrganizationViewSets(viewsets.ModelViewSet):
    queryset = models.Organization.objects.all()
    serializer_class = serializers.OrganizationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only show orgs you own
        return self.queryset.filter(owner=self.request.user)

    def create(self, request):
        try:
            data = request.data
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)  # added validation
            instance = serializer.save(owner=request.user)
            
            log_audit(request.user, 'ADDED', f"ORG: {instance.name}", organization=instance)
            
            return response.Response("Created!", status=status.HTTP_201_CREATED)
        except Exception as e:
            print(str(e))
            return response.Response("Error", status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        instance = serializer.save()
        log_audit(self.request.user, 'EDITED', f"ORG: {instance.name}", organization=instance)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        name = instance.name
        res = super().destroy(request, *args, **kwargs)
        log_audit(request.user, 'DELETED', f"ORG: {name}")
        return res

    @action(detail=True, methods=['post'])
    def toggle_tier(self, request, pk=None):
        """ Mock payment: toggle between FREE and PREMIUM """
        org = self.get_object()
        if org.tier == TierChoices.FREE:
            org.tier = TierChoices.PREMIUM
        else:
            org.tier = TierChoices.FREE
        org.save()
        return response.Response({"status": f"Upgraded to {org.tier}!"})

    @action(detail=True, methods=['get'])
    def usage(self, request, pk=None):
        org = self.get_object()
        config = TIER_CONFIG.get(org.tier, TIER_CONFIG['FREE'])
        
        project_count = models.Project.objects.filter(organization=org).count()
        
        # Max members in any one project
        max_members_in_any_project = 0
        projects = models.Project.objects.filter(organization=org)
        for p in projects:
            m_count = models.ProjectMember.objects.filter(project=p).count()
            if m_count > max_members_in_any_project:
                max_members_in_any_project = m_count

        return response.Response({
            "tier": org.tier,
            "projects": {
                "used": project_count,
                "limit": config['max_projects'],
                "remaining": max(0, config['max_projects'] - project_count)
            },
            "members_per_project": {
                "used": max_members_in_any_project,
                "limit": config['max_members_per_project'],
                "remaining": max(0, config['max_members_per_project'] - max_members_in_any_project)
            },
            "environments": {
                "allowed": config['allowed_envs'],
                "restricted": [e[0] for e in EnvChoices.choices if e[0] not in config['allowed_envs']]
            },
            "features": {
                "rbac_masking": config['rbac_masking'],
                "audit_logs": True
            }
        })

class ProjectViewSets(viewsets.ModelViewSet):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectSerializer
    permission_classes = [IsAuthenticated, ProjectPermission]

    def get_queryset(self):
        user = self.request.user
        # Organization owners see all projects in their org
        # Members see only projects they are assigned to
        return models.Project.objects.filter(
            Q(organization__owner=user) | 
            Q(projectmember__user=user)
        ).distinct()

    def perform_create(self, serializer):
        org = serializer.validated_data['organization']
        env = serializer.validated_data.get('environment')
        config = TIER_CONFIG.get(org.tier, TIER_CONFIG['FREE'])

        # Limit enforcement
        if models.Project.objects.filter(organization=org).count() >= config['max_projects']:
            raise drf_serializers.ValidationError(f"Free tier limit reached: {config['max_projects']} projects max. Please upgrade to Premium.")
        
        if env not in config['allowed_envs']:
            raise drf_serializers.ValidationError(f"Free tier only supports {', '.join(config['allowed_envs'])} environment. Please upgrade to Premium.")

        instance = serializer.save()
        log_audit(self.request.user, 'ADDED', f"PROJECT: {instance.name}", project=instance, organization=instance.organization)

    def perform_update(self, serializer):
        org = serializer.validated_data.get('organization', serializer.instance.organization)
        env = serializer.validated_data.get('environment')
        config = TIER_CONFIG.get(org.tier, TIER_CONFIG['FREE'])

        if env and env not in config['allowed_envs']:
            raise drf_serializers.ValidationError(f"Free tier only supports {', '.join(config['allowed_envs'])} environment. Please upgrade to Premium.")

        instance = serializer.save()
        log_audit(self.request.user, 'EDITED', f"PROJECT: {instance.name}", project=instance, organization=instance.organization)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        name = instance.name
        org = instance.organization
        res = super().destroy(request, *args, **kwargs)
        log_audit(request.user, 'DELETED', f"PROJECT: {name}", organization=org)
        return res

class EnvVariableViewSets(viewsets.ModelViewSet):
    queryset = models.EnvVariable.objects.all()
    serializer_class = serializers.EnvVariableSerializer
    permission_classes = [IsAuthenticated, ProjectPermission]
    
    
    def list(self, request):
        
        qs = self.get_queryset()
        
        project_id = request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_id=project_id)

        serializer = self.get_serializer(qs, many=True)
        
        
        return response.Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        """ this where to create the envs """
        data = request.data
        
        encrypted_var = _encrypt_var(data.get('value'))
        
        project = models.Project.objects.get(id=data.get('project'))
        variable = models.EnvVariable.objects.create(
            key=data.get('key'),
            value=encrypted_var,
            project=project,
            created_by=request.user
        )
        
        log_audit(request.user, 'ADDED', variable.key, project=project, organization=project.organization)
        
        return response.Response("Created!", status=status.HTTP_201_CREATED)

    def perform_update(self, serializer):
        if 'value' in self.request.data:
            encrypted_value = _encrypt_var(self.request.data['value'])
            instance = serializer.save(value=encrypted_value)
        else:
            instance = serializer.save()
        
        log_audit(self.request.user, 'EDITED', instance.key, project=instance.project, organization=instance.project.organization)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        project = instance.project
        key = instance.key
        
        res = super().destroy(request, *args, **kwargs)
        
        log_audit(request.user, 'DELETED', key, project=project, organization=project.organization)
        
        return res

from django.contrib.auth.models import User

class ProjectMemberViewSets(viewsets.ModelViewSet):
    queryset = models.ProjectMember.objects.all()
    serializer_class = serializers.ProjectMemberSerializer
    permission_classes = [IsAuthenticated, ProjectPermission]

    def get_queryset(self):
        qs = super().get_queryset()
        project_id = self.request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs

    def create(self, request):
        data = request.data
        username = data.get('username')
        project_id = data.get('project')
        role = data.get('role', 'VIEWER')

        try:
            user = User.objects.get(username=username)
            project = models.Project.objects.get(id=project_id)
            
            # Check if membership already exists
            if models.ProjectMember.objects.filter(project=project, user=user).exists():
                return response.Response({"error": "User is already a member of this project."}, status=status.HTTP_400_BAD_REQUEST)

            # Check tier limits
            config = TIER_CONFIG.get(project.organization.tier, TIER_CONFIG['FREE'])
            if models.ProjectMember.objects.filter(project=project).count() >= config['max_members_per_project']:
                return response.Response({"error": f"Free tier limit reached: {config['max_members_per_project']} members max."}, status=status.HTTP_400_BAD_REQUEST)

            member = models.ProjectMember.objects.create(
                project=project,
                user=user,
                role=role
            )
            
            log_audit(request.user, 'ADDED', f"MEMBER: {username}", project=project, organization=project.organization)
            
            return response.Response(serializers.ProjectMemberSerializer(member).data, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return response.Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AuditLogViewSets(viewsets.ModelViewSet):
    queryset = models.AuditLog.objects.all().order_by('-timestamp')
    serializer_class = serializers.AuditLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        
        project_id = self.request.query_params.get('project')
        org_id = self.request.query_params.get('organization')

        # Filter by Project if provided
        if project_id:
            return qs.filter(project_id=project_id)
        
        # Filter by Organization if provided
        if org_id:
            return qs.filter(organization_id=org_id)

        # Default: Global view (scoped to user's access)
        # Show logs for orgs owned OR projects joined
        return qs.filter(
            Q(organization__owner=user) | 
            Q(project__projectmember__user=user)
        ).distinct()
