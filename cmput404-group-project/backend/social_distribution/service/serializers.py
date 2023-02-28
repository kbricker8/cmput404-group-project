from rest_framework import serializers
from django.contrib.auth.models import User

# import models
from .models import Post
from .models import Author

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
    )
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

class ChangePasswordSerializer(serializers.Serializer):
    model = User
    old_password = serializers.CharField(required=True,)
    new_password = serializers.CharField(required=True,)


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['type', 'id', 'host', 'displayName', 'url', 'github', 'profileImage']

class PostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['type', 'id', 'title', 'description']

