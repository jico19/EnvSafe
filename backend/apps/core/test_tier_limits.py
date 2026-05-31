from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from django.test import TestCase
from .models import Organization, Project, ProjectMember

class TierLimitTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='owner', password='password')
        self.other_user = User.objects.create_user(username='other', password='password')
        self.client.force_authenticate(user=self.user)
        self.org = Organization.objects.create(name='Free Org', owner=self.user, tier='FREE')

    def test_free_tier_project_limit(self):
        # Create 2 projects (limit)
        Project.objects.create(name='P1', organization=self.org, environment='DEV')
        Project.objects.create(name='P2', organization=self.org, environment='DEV')
        
        # Try to create 3rd project
        url = '/projects/'
        data = {'name': 'P3', 'organization': self.org.id, 'environment': 'DEV'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Free tier limit reached', str(response.data))

    def test_free_tier_environment_limit(self):
        url = '/projects/'
        # Try to create STAGING project in FREE tier
        data = {'name': 'P1', 'organization': self.org.id, 'environment': 'STAGING'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Free tier only supports DEV', str(response.data))

    def test_free_tier_member_limit(self):
        project = Project.objects.create(name='P1', organization=self.org, environment='DEV')
        
        # Add 3 members (limit) - current code says >= 3
        # Wait, the code in viewsets.py:
        # if models.ProjectMember.objects.filter(project=project).count() >= 3:
        
        for i in range(3):
            u = User.objects.create_user(username=f'user{i}', password='password')
            ProjectMember.objects.create(project=project, user=u, role='VIEWER')
            
        # Try to add 4th member
        url = '/project-members/'
        u4 = User.objects.create_user(username='user4', password='password')
        data = {'username': 'user4', 'project': project.id, 'role': 'VIEWER'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Free tier limit reached', str(response.data))

    def test_premium_tier_limits(self):
        self.org.tier = 'PREMIUM'
        self.org.save()
        
        # Create 3 projects (exceeds FREE limit)
        for i in range(3):
            Project.objects.create(name=f'P{i}', organization=self.org, environment='DEV')
            
        # Create STAGING project
        url = '/projects/'
        data = {'name': 'P-STAGING', 'organization': self.org.id, 'environment': 'STAGING'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        project = Project.objects.get(name='P-STAGING')
        
        # Add 4 members
        for i in range(4):
            u = User.objects.create_user(username=f'p-user{i}', password='password')
            url = '/project-members/'
            data = {'username': u.username, 'project': project.id, 'role': 'VIEWER'}
            resp = self.client.post(url, data, format='json')
            self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
