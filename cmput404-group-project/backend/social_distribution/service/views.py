from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, action
from rest_framework.response import Response

# import serializers
from .serializers import PostsSerializer
from .serializers import UserSerializer
from .serializers import ChangePasswordSerializer
from .serializers import AuthorSerializer

# import models
from django.contrib.auth.models import User
from .models import Post, Author

class UsersViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # @action(detail=True, methods=['post'])
    # def create(self, request, *args, **kwargs):
    #     pk = self.kwargs.get('pk')
    #     # save_allowance = get_object(User.objects.all(), pk=pk)
    #     user = self.get_object()
    #     serializer = self.get_serializer(data=request.data)
    #     if serializer.is_valid():
    #         user.set_password(serializer.validated_data['password'])
    #         # user.save()
    #         return Response({"status": "success",
    #                          "code": status.HTTP_200_OK,
    #                          "message": "Account created successfully"})
    #     else:
    #         return Response(serializer.errors,
    #                         status=status.HTTP_400_BAD_REQUEST)
    
    def create(self, request, *args, **kwargs):
        # create corresponding author
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        author = Author(host="http://127.0.0.1:8000/", displayName=serializer.data.get("username"))
        author.save()
        author.url = "http://127.0.0.1:8000/service/authors/" + str(author.id)
        author.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def list(self, request):
        recent_users = User.objects.all().order_by('-last_login')
        page = self.paginate_queryset(recent_users)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(recent_users, many=True)
        return Response(serializer.data)

    
# From tutorial
# https://studygyaan.com/django/django-rest-framework-tutorial-change-password-and-reset-password
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User

    @action(detail=False)
    def get_object(self, queryset=None):
        queryset = self.request.user.all()
        return Response(self.request.user)
    
    @action(detail=True, methods=['post'])
    def update_pass(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

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

class PostsViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostsSerializer

    def list(self, request, *args, **kwargs): # overrides the default list method
        posts = Post.objects.all()
        serializer = self.get_serializer(posts, many=True)
        return Response({"type": "posts",
                         "items": serializer.data})


class AuthorsViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    def list(self, request, *args, **kwargs): # overrides the default list method
        authors = Author.objects.all()
        serializer = self.get_serializer(authors, many=True)
        return Response({"type": "authors",
                         "items": serializer.data})
