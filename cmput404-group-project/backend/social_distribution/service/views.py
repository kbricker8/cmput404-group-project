from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, status, generics, mixins
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login

# import serializers
from .serializers import PostSerializer
from .serializers import UserSerializer
from .serializers import ChangePasswordSerializer
from .serializers import AuthorSerializer
from .serializers import LoginSerializer
from .serializers import CommentsSerializer
from .serializers import FollowRequestSerializer
from .serializers import FollowersSerializer

# import models
from django.contrib.auth.models import User
from .models import Post, Author, Comment, FollowRequest, Followers

class UsersViewSet(mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def create(self, request, *args, **kwargs):
        # create corresponding author
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        user = User.objects.get(username=serializer.data.get("username"))

        author = Author(host="http://127.0.0.1:8000/", displayName=serializer.data.get("username"), user=user)
        author.save()
        author.url = "http://127.0.0.1:8000/service/authors/" + str(author.id)
        author.save()

        followers = Followers(user = author)
        followers.save()

        author_serializer = AuthorSerializer(instance=author)

        return Response(author_serializer.data, status=status.HTTP_201_CREATED)
    
    def list(self, request):
        recent_users = User.objects.all().order_by('-last_login')
        page = self.paginate_queryset(recent_users)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(recent_users, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_pass(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong Password."]}, 
                                status=status.HTTP_400_BAD_REQUEST)
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"status": "success",
                             "code": status.HTTP_200_OK,
                             "message": "Password updated successfully"})
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get("username")
            password = serializer.data.get("password")
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                author = Author.get_author_from_user(user=user)
                author_serializer = AuthorSerializer(instance=author)
                return Response(author_serializer.data,
                        status=status.HTTP_200_OK)
            return Response({"detail": ["Wrong username or password."]}, 
                            status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)


class AuthorsViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    def list(self, request, *args, **kwargs): # overrides the default list method
        authors = Author.objects.all()
        serializer = self.get_serializer(authors, many=True)
        return Response({"type": "authors",
                         "items": serializer.data})
    
class FollowRequestViewSet(viewsets.ModelViewSet):
    queryset = FollowRequest.objects.all()
    serializer_class = FollowRequestSerializer


class FollowersViewSet(viewsets.ModelViewSet):
    queryset = Followers.objects.all()
    serializer_class = FollowersSerializer

    def update(self, request, pk=None, author_pk=None, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


class PostsViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def list(self, request, author_pk=None, *args, **kwargs): # overrides the default list method
        posts = Post.objects.all()
        serializer = self.get_serializer(posts, many=True)
        return Response({"type": "posts",
                         "items": serializer.data})
    
    def create(self, request, author_pk=None, *args, **kwargs):
        
        author = Author.objects.get(id=author_pk)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # self.perform_create(serializer)
        serializer.save(author=author)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CommentsViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentsSerializer

    def list(self, request, author_pk=None, post_pk=None, *args, **kwargs): # overrides the default list method
        comments = Comment.objects.filter(post=post_pk).all()
        serializer = self.get_serializer(comments, many=True)
        return Response({"type": "comments",
                         "items": serializer.data})

    def create(self, request, author_pk=None, post_pk=None, *args, **kwargs):
        
        post = Post.objects.get(id=post_pk)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # self.perform_create(serializer)
        serializer.save(post=post)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
