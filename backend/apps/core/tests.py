from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Project, Organization, EnvVariable
from .utils.encryptor import _encrypt_var, _decrypt_var

class EncryptionUpdateTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.organization = Organization.objects.create(name='Test Org', owner=self.user)
        self.project = Project.objects.create(
            name='Test Project', 
            organization=self.organization, 
            environment=Project.EnvChoices.DEV
        )
        self.client.force_authenticate(user=self.user)
        
        # Initial create
        self.env_var = EnvVariable.objects.create(
            project=self.project,
            key='DATABASE_URL',
            value=_encrypt_var('postgres://localhost'),
            created_by=self.user
        )

    def test_update_encryption(self):
        url = f'/env-variable/{self.env_var.id}/'
        new_value = 'postgres://production'
        data = {
            'value': new_value,
            'key': 'DATABASE_URL',
            'project': self.project.id,
            'created_by': self.user.id
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh from DB
        self.env_var.refresh_from_db()
        
        # Verify it's encrypted in DB (not equal to plain text)
        self.assertNotEqual(self.env_var.value, new_value)
        
        # Verify it can be decrypted back to the new value
        try:
            decrypted = _decrypt_var(self.env_var.value)
            self.assertEqual(decrypted, new_value)
        except Exception as e:
            self.fail(f"Value was not encrypted properly and failed to decrypt: {e}")
