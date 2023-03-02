from rest_framework import serializers
from dataclasses import dataclass, field

# import models
from .models import Post

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
        fields = ('type', 'id', 'title', 'description')

class ImagePostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagePost
        fields = ('post', 'image') #add type?

class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
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
        fields = ('type', 'author', 'items')