from django.utils import timezone
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
    url = serializers.URLField(read_only=True)
    host = serializers.URLField(read_only=True)
    class Meta:
        model = Author
        fields = ['type', 'id', 'url', 'host', 'displayName', 'github', 'profileImage']

class AuthorIdSerializer(serializers.ModelSerializer):
    model = Author
    id = serializers.UUIDField(required=True,)
    class Meta:
        model = Author
        fields = ['id']

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
        fields = ('type', 'id','summary', 'actor', 'object')

    def to_representation(self, instance):
        self.fields['actor'] = AuthorSerializer(read_only=True)
        self.fields['object'] = AuthorSerializer(read_only=True)
        return super().to_representation(instance)

class PostSerializer(serializers.ModelSerializer):
    id = serializers.CharField(required=False)
    comments = serializers.CharField(required=False)
    published = serializers.DateTimeField(required=False)
    count = serializers.IntegerField(required=False)

    class Meta:
        model = Post
        fields = ('id', 'url','type', 'title','source','origin','description','contentType','author','categories','count', 'numLikes','content','comments','published','visibility','unlisted')

    def to_representation(self, instance):
        self.fields['author'] = AuthorSerializer(read_only=True)
        return super().to_representation(instance)

class PostIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id']

    # def to_representation(self, instance):
    #     return instance.id

class ImagePostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagePosts
        fields = ('id', 'type', 'post', 'image')

class CommentsSerializer(serializers.ModelSerializer):
    # author_id = serializers.CharField(
    #     required=True,
    #     write_only=True
    #     )
    id = serializers.CharField(required=False)
    published = serializers.DateTimeField(required=False, read_only=True)

    class Meta:
        model = Comment
        # fields = "__all__"
        fields = ('id', 'type', 'author', 'comment', 'contentType', 'published', 'numLikes', 'post')
    
    def to_representation(self, instance):
        # self.fields['author'] = AuthorSerializer(read_only=True)
        # self.fields['post'] = PostSerializer(read_only=True)
        return super().to_representation(instance)

class LikesSerializer(serializers.ModelSerializer):
    context = serializers.CharField(required=False)
    class Meta:
        model = Likes
        fields = ('context', 'summary', 'type', 'author', 'object')

    def to_representation(self, instance):
        self.fields['author'] = AuthorSerializer(read_only=True)
        # self.fields['object'] = PostIdSerializer(read_only=True)
        return super().to_representation(instance)
    
class LikeSerializer(serializers.ModelSerializer):
    model = Likes
    author = serializers.UUIDField(required=True,)
    class Meta:
        model = Likes
        fields = ['author']


class LikedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Liked
        fields = ('type', 'author', 'items')

    def to_representation(self, instance):
        self.fields['items'] = LikesSerializer(read_only=True, many=True)
        return super().to_representation(instance)

#create a serializer for inbox
class InboxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbox
        fields = ('type', 'author', 'items')

    # def to_representation(self, instance):
    #     self.fields['items'] = FollowRequestSerializer(read_only=True, many=True)
    #     return super().to_representation(instance)

class PostItemSerializer(serializers.Serializer):
    id = serializers.CharField()
    type = serializers.CharField()
    title = serializers.CharField(required=True)
    source = serializers.CharField(required=False)
    origin = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    contentType = serializers.CharField(required=False)
    content = serializers.CharField(required=False)
    author = serializers.CharField(required=False)
    categories = serializers.JSONField(required=False)
    count = serializers.IntegerField(required=False)
    comments = serializers.CharField(required=False)
    published = serializers.CharField(required=False)
    visibility = serializers.CharField(required=False)
    unlisted = serializers.BooleanField(required=False)
    summary = serializers.CharField(required=False)

class CommentItemSerializer(serializers.Serializer):
    id = serializers.CharField()
    type = serializers.CharField()
    author = serializers.JSONField()
    comment = serializers.CharField(max_length = 255)
    contentType = serializers.CharField()
    published = serializers.DateTimeField(required=False, default=timezone.now)
    summary = serializers.CharField(required=False)

class LikeItemSerializer(serializers.Serializer):
    context = serializers.CharField(required=True)
    summary = serializers.CharField(required=True)
    type = serializers.JSONField(required=True)
    author = serializers.JSONField(required=True)
    object = serializers.CharField(required=True)

class FollowRequestItemSerializer(serializers.Serializer):
    type = serializers.CharField()
    summary = serializers.CharField()
    actor = serializers.JSONField()
    object = serializers.JSONField()
    