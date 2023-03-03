from rest_framework import serializers
from django.contrib.auth.models import User

# import models
from .models import Post, Author, Followers, FollowRequest, ImagePosts, Comment, Likes, Liked, Inbox

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
        fields = ['type', 'id', 'url', 'host', 'displayName', 'github', 'profileImage']

class FollowersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Followers
        fields = ('type, items')

class FollowerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowRequest
        fields = ('type', 'summary', 'actor', 'object')

class PostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = "__all__"

class ImagePostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagePosts
        fields = ('post', 'image') #add type?

class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('type', 'author', 'comment', 'contentType', 'published', 'id')

class LikesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = ('context', 'summary', 'type', 'author', 'object')

class LikedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Liked
        fields = ('type', 'items', 'author')

class Inbox(serializers.ModelSerializer):
    class Meta:
        model = Inbox
        fields = ('type', 'author', 'items')

