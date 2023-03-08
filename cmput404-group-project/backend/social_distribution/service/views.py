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

class UsersViewSet(viewsets.GenericViewSet):
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

        followers_id = 'http://127.0.0.1:8000/service/authors/' + str(author.id) + '/followers/'
        followers = Followers(id=followers_id, author = author)
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
    
    @action(detail=True, methods=['post'])
    def update_pass(self, request, *args, **kwargs):
        self.object = self.get_object()
        user = self.object.user
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong Password."]}, 
                                status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"status": "success",
                             "code": status.HTTP_200_OK,
                             "message": "Password updated successfully"})
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)
    
class FollowRequestViewSet(viewsets.GenericViewSet):
    queryset = FollowRequest.objects.all()
    serializer_class = FollowRequestSerializer

    def list(self, request, author_pk=None, *args, **kwargs):
        author = get_object_or_404(Author, id=author_pk)
        queryset = FollowRequest.objects.all().filter(object=author)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, author_pk=None, *args, **kwargs):
        object = get_object_or_404(Author, id=author_pk)
        actor = get_object_or_404(Author, id=pk)
        try: 
            instance = FollowRequest.objects.get(object=object, actor=actor)
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except:
            return Response({"detail": ["Request does not exist."]},
                            status=status.HTTP_404_NOT_FOUND)

    @action(detail=True)
    def send(self, request, pk=None, author_pk=None, *args, **kwargs):
        object = Author.objects.get(id=author_pk)
        actor = Author.objects.get(id=pk)
        summary = f"{actor.displayName} wants to follow {object.displayName}."
        if FollowRequest.objects.filter(actor=actor, object=object).count(): # request already exists
            return Response({"detail": ["Request already exists."]},
                            status=status.HTTP_400_BAD_REQUEST)
        follow_request = FollowRequest(summary=summary, actor=actor, object=object)
        follow_request.save()
        serializer = FollowRequestSerializer(instance=follow_request)
        return Response(serializer.data)
    
    @action(detail=True)
    def accept(self, request, pk=None, author_pk=None, *args, **kwargs):
        object = get_object_or_404(Author, id=author_pk)
        actor = get_object_or_404(Author, id=pk)
        if FollowRequest.objects.filter(actor=actor, object=object).count():
            instance = FollowRequest.objects.get(object=object, actor=actor)
            followers = Followers.objects.get(author=object)
            followers.items.add(actor)
            instance.delete()
            return Response({"detail": ["Follow request accepted."]},
                        status=status.HTTP_200_OK)

        return Response({"detail": ["Request does not exist."]},
                        status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True)
    def decline(self, request, pk=None, author_pk=None, *args, **kwargs):
        object = get_object_or_404(Author, id=author_pk)
        actor = get_object_or_404(Author, id=pk)
        if FollowRequest.objects.filter(actor=actor, object=object).count():
            instance = FollowRequest.objects.get(object=object, actor=actor)
            instance.delete()
            return Response({"detail": ["Follow request declined."]},
                        status=status.HTTP_200_OK)

        return Response({"detail": ["Request does not exist."]},
                        status=status.HTTP_404_NOT_FOUND)


class FollowersViewSet(viewsets.GenericViewSet):
    queryset = Followers.objects.all()
    serializer_class = FollowersSerializer

    def list(self, request, author_pk=None, *args, **kwargs):
        instance = Followers.objects.get(author__id=author_pk)
        serializer = FollowersSerializer(instance=instance)
        return Response(serializer.data)
    
    @action(detail=True)
    def unfollow(self, request, pk=None, author_pk=None, *args, **kwargs):
        author = get_object_or_404(Author, id=author_pk)
        follower = get_object_or_404(Author, id=pk)
        followers = Followers.objects.get(author=author)
        if followers.items.contains(follower):
            followers.items.remove(follower)
            return Response({"detail": ["Unfollowed successfully."]},
                            status=status.HTTP_200_OK)

        return Response({"detail": ["User is not in following list."]},
                        status=status.HTTP_400_BAD_REQUEST)


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
