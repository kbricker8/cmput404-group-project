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
    email = serializers.EmailField(required=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ChangePasswordSerializer(serializers.Serializer):
    model = User
    old_password = serializers.CharField(required=True,)
    new_password = serializers.CharField(required=True,)

class LoginSerializer(serializers.Serializer):
    model = User
    username = serializers.CharField(
        write_only=False,
        required=True,
        )
    password = serializers.CharField(
        write_only=False,
        required=True,
    )

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['type', 'id', 'host', 'displayName', 'url', 'github', 'profileImage']

class PostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['type', 'id', 'title', 'description']

