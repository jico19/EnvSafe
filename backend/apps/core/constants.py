from django.db import models

class TierChoices(models.TextChoices):
    FREE = "FREE", "Free"
    PREMIUM = "PREMIUM", "Premium"

class EnvChoices(models.TextChoices):
    DEV = "DEV", "Dev"
    STAGING = "STAGING", "Staging"
    PRODUCTION = "PRODUCTION", "Production"

TIER_CONFIG = {
    'FREE': {
        'max_projects': 2,
        'max_members_per_project': 3,
        'allowed_envs': [EnvChoices.DEV],
        'rbac_masking': False
    },
    'PREMIUM': {
        'max_projects': 1000,
        'max_members_per_project': 1000,
        'allowed_envs': [EnvChoices.DEV, EnvChoices.STAGING, EnvChoices.PRODUCTION],
        'rbac_masking': True
    }
}
