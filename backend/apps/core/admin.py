from django.contrib import admin
from . import models

admin.site.register(models.Organization)
admin.site.register(models.Project)
admin.site.register(models.EnvVariable)
admin.site.register(models.ProjectMember)
admin.site.register(models.AuditLog)
