from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from django.test import TestCase
from .models import Organization, Project, ProjectMember

class UsageApiTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='owner', password='password')
        self.client.force_authenticate(user=self.user)
        self.org = Organization.objects.create(name='Free Org', owner=self.user, tier='FREE')

    def test_usage_endpoint_exists(self):
        url = f'/organization/{self.org.id}/usage/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_usage_endpoint_data(self):
        # Create some data
        p1 = Project.objects.create(name='P1', organization=self.org, environment='DEV')
        ProjectMember.objects.create(project=p1, user=self.user, role='ADMIN')
        
        url = f'/organization/{self.org.id}/usage/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        
        self.assertEqual(data['tier'], 'FREE')
        self.assertEqual(data['projects']['used'], 1)
        self.assertEqual(data['projects']['limit'], 2)
        self.assertEqual(data['members_per_project']['used'], 1)
        self.assertEqual(data['members_per_project']['limit'], 3)
        self.assertIn('DEV', data['environments']['allowed'])
        self.assertIn('STAGING', data['environments']['restricted'])
