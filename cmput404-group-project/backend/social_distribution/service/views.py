from django.shortcuts import render
from rest_framework import viewsets

# import serializers
from .serializers import PostSerializer

# import models
from .models import Post


class PostView(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
