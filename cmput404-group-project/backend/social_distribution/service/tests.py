from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
import os
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
    def test_create_user(self):
        
        url = reverse('user-list')
        data = {
            "username": "test_user",
            "email": "test@test.ca",
            "password": "test123"
        }
        self.token = os.getenv("TEST_TOKEN")
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'test_user')
        self.assertEqual(Author.objects.count(), 1)
        self.assertEqual(Author.objects.get().displayName, 'test_user')

class PasswordTests(APITestCase):
    def setUp(self):
        url = reverse('user-list')
        data = {
            "username": "test_user",
            "email": "test@test.ca",
            "password": "test123"
        }
        self.token = os.getenv("TEST_TOKEN")
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        response = self.client.post(url, data, format='json')
        self.token = response.data.get("token")
        self.id = response.data.get("author").id

    def test_login(self):
        url = reverse('user-login')
        data = {
            "username": "test_user",
            "password": "test123"
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_change_pass(self):
        url = "/service/authors/" + str(self.id) + '/update_pass/'
        data = {
            "old_password": "test123",
            "new_password": "test321"
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        url = reverse('user-login')
        data = {
            "username": "test_user",
            "password": "test321"
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class AuthorTests(APITestCase):
    def setUp(self):
        url = reverse('user-list')
        data = {
            "username": "test_user",
            "email": "test@test.ca",
            "password": "test123"
        }
        self.token = os.getenv("TEST_TOKEN")
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        response = self.client.post(url, data, format='json')
        self.token = response.data.get("token")
        self.id = response.data.get("author").id

class FollowerTests(APITestCase):
    def setUp(self):
        url = reverse('user-list')
        data1 = {
            "username": "test_user",
            "email": "test@test.ca",
            "password": "test123"
        }
        data2 = {
            "username": "test_user2",
            "email": "test@test.ca",
            "password": "test123"
        }
        self.token = os.getenv("TEST_TOKEN")
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        response1 = self.client.post(url, data1, format='json')
        response2 = self.client.post(url, data2, format='json')
        self.token1 = response1.data.get("token")
        self.id1 = response1.data.get("author").id
        self.token2 = response2.data.get("token")
        self.id2 = response2.data.get("author").id
        self.followersid = 'http://127.0.0.1:8000/service/authors/' + str(self.id1) + '/followers/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        url = "/service/authors/" + str(self.id1) + '/follow-request/' + str(self.id2) + "/send/"
        self.response = self.client.get(url)
    
    def test_list_followers(self):
        url = "/service/authors/" + str(self.id1) + '/followers/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1}')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
    
    def test_list_follow_requests(self):
        url = "/service/authors/" + str(self.id1) + '/follow-request/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1}')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_get_follow_request(self):
        url = "/service/authors/" + str(self.id1) + '/follow-request/' + str(self.id2) + '/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1}')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.response.data)
    
    def test_accept_follow_request(self):
        url = "/service/authors/" + str(self.id1) + '/follow-request/' + str(self.id2) + "/accept/"
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token2}')
        response = self.client.get(url)
        followers = Followers.objects.get(id = self.followersid)
        follower = Author.objects.get(id = self.id2)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(follower in followers.items.all())

        url = "/service/authors/" + str(self.id1) + '/follow-request/' + str(self.id2) + '/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1}')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        