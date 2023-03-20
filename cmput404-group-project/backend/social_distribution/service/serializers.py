from rest_framework import serializers
from django.contrib.auth.models import User

# import models
from .models import Post, Author, Followers, Following, FollowRequest, ImagePosts, Comment, Likes, Liked, Inbox

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
        fields = ('type', 'author', 'items')

class FollowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Following
        fields = ('type', 'author', 'items')

class FollowRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowRequest
        fields = ('type', 'summary', 'actor', 'object')

    def to_representation(self, instance):
        self.fields['actor'] = AuthorSerializer(read_only=True)
        self.fields['object'] = AuthorSerializer(read_only=True)
        return super().to_representation(instance)

class PostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ('id','type', 'title','source','origin','description','contentType','author','categories','count', 'content','comments','published','visibility','unlisted')

    def to_representation(self, instance):
        self.fields['author'] = AuthorSerializer(read_only=True)
        return super().to_representation(instance)

class ImagePostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagePosts
        fields = ('post', 'image') #add type?

class CommentsSerializer(serializers.ModelSerializer):
    author_id = serializers.CharField(
        required=True,
        write_only=True
        )

    class Meta:
        model = Comment
        # fields = "__all__"
        fields = ('id', 'type', 'author', 'author_id', 'comment', 'contentType', 'published', 'post')
    
    def to_representation(self, instance):
        self.fields['author'] = AuthorSerializer(read_only=True)
        # self.fields['post'] = PostSerializer(read_only=True)
        return super().to_representation(instance)

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

