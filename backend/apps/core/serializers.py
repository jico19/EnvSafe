from rest_framework import serializers
from . import models
from .constants import TierChoices, EnvChoices
from .utils.encryptor import _decrypt_var
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Organization
        fields = ['id', 'name', 'owner', 'tier']
        read_only_fields = ['owner']

class ProjectSerializer(serializers.ModelSerializer):
    organization_owner = serializers.IntegerField(source='organization.owner.id', read_only=True)
    class Meta:
        model = models.Project
        fields = "__all__"
        
class EnvVariableSerializer(serializers.ModelSerializer):
    decrypted_value = serializers.SerializerMethodField()
    # project_name =  serializers.SerializerMethodField()
    
    
    class Meta:
        model = models.EnvVariable
        fields = ['id','project','key', 'value', 'decrypted_value', 'created_by']
        read_only_fields = ['created_by']
        extra_kwargs = {
            'value': {'write_only': True}
        }
    
    def get_decrypted_value(self, obj):
        request = self.context.get('request')
        if not request or not request.user:
            return None

        # If Organization is FREE, bypass RBAC masking
        if obj.project.organization.tier == models.Organization.TierChoices.FREE:
            return _decrypt_var(obj.value)

        # PREMIUM Logic: Check if user is Organization owner
        if obj.project.organization.owner == request.user:
            return _decrypt_var(obj.value)

        # PREMIUM Logic: Check project membership role
        membership = models.ProjectMember.objects.filter(project=obj.project, user=request.user).first()
        if membership and membership.role != 'VIEWER':
            return _decrypt_var(obj.value)
            
        return "******** (RESTRICTED)"
    
    def get_project_name(self, obj):
        return obj.project.name

class ProjectMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    class Meta:
        model = models.ProjectMember
        fields = ['id', 'project', 'project_name', 'user', 'username', 'role']
        
class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = models.AuditLog
        fields = ['id', 'project', 'project_name', 'user', 'username', 'action', 'variable_key', 'timestamp']