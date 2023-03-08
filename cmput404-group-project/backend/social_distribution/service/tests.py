from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status

from django.contrib.auth.models import User
from .models import Post, Author, Followers, FollowRequest, ImagePosts, Comment, Likes, Liked, Inbox

from .serializers import PostSerializer
from .serializers import UserSerializer
from .serializers import ChangePasswordSerializer
from .serializers import AuthorSerializer
from .serializers import LoginSerializer
from .serializers import CommentsSerializer
from .serializers import FollowRequestSerializer
from .serializers import FollowersSerializer


# Create your tests here.
class CreateUserTest(APITestCase):
    def test_list_users(self):
        url = reverse('users-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
        self.assertEqual(response.data, [])

    def test_create_user(self):
        url = reverse('users-list')
        data = {
            "username": "test_user",
            "email": "test@test.ca",
            "password": "test123"
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'test_user')
        self.assertEqual(Author.objects.count(), 1)
        self.assertEqual(Author.objects.get().displayName, 'test_user')

class PasswordTests(APITestCase):
    def setUp(self):
        url = reverse('users-list')
        data = {
            "username": "test_user",
            "email": "test@test.ca",
            "password": "test123"
        }
        response = self.client.post(url, data, format='json')
        self.id = response.data.get("id")

    def test_login(self):
        url = reverse('users-login')
        data = {
            "username": "test_user",
            "password": "test123"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_change_pass(self):
        url = "/service/authors/" + str(self.id) + '/update_pass/'
        data = {
            "old_password": "test123",
            "new_password": "test321"
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        url = reverse('users-login')
        data = {
            "username": "test_user",
            "password": "test321"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class AuthorTests(APITestCase):
    def setUp(self):
        url = reverse('users-list')
        data = {
            "username": "test_user",
            "email": "test@test.ca",
            "password": "test123"
        }
        response = self.client.post(url, data, format='json')
        self.id = response.data.get("id")

class FollowerTests(APITestCase):
    def setUp(self):
        url = reverse('users-list')
        data = {
            "username": "test_user",
            "email": "test@test.ca",
            "password": "test123"
        }
        response = self.client.post(url, data, format='json')
        self.id = response.data.get("id")
        # self.followersid = 'http://127.0.0.1:8000/service/authors/' + str(self.id) + '/followers/'
    
    def test_list_followers(self):
        url = "/service/authors/" + str(self.id) + '/followers/'