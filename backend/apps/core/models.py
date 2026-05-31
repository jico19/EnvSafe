from django.db import models
from django.contrib.auth.models import User
from .constants import TierChoices, EnvChoices
    


class Organization(models.Model):
    
    TierChoices = TierChoices

    name = models.CharField(max_length=200)
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    tier = models.CharField(max_length=20, choices=TierChoices, default=TierChoices.FREE)

    def __str__(self):
        return f"{self.name} ({self.tier})"

class Project(models.Model):
    
    EnvChoices = EnvChoices
            
    name = models.CharField(max_length=200)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    environment = models.CharField(max_length=50, choices=EnvChoices)
    
    def __str__(self):
        return f"{self.name}"
    

class EnvVariable(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    key = models.CharField(max_length=255)
    value = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

class ProjectMember(models.Model):
    
    class RoleChoices(models.TextChoices):
        OWNER = "OWNER", "Owner"
        ADMIN = "ADMIN", "Admin"
        DEVELOPER = "DEVELOPER", "Developer"
        VIEWER = "VIEWER", "Viewer"
        
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=100, choices=RoleChoices)

class AuditLog(models.Model):
    
    class ActionChoices(models.TextChoices):
        VIEWED = "VIEWED", "Viewed"
        ADDED = "ADDED", "Added"
        EDITED = "EDITED", "Edited"
        DELETED = "DELETED", "Deleted"        

        
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100, choices=ActionChoices)
    variable_key = models.CharField(max_length=100)
    timestamp =  models.DateTimeField(auto_now_add=True)