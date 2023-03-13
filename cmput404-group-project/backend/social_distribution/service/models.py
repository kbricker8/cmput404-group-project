from django.db import models
from django.contrib.auth.models import User
import uuid
from django.utils import timezone

# IMPORTANT ----------------------
# dont forget to update the admin.py, serializers.py, view.py, and urls.y files when you add/edit models
# also makemigations and migrate

class Author(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = 'author'
    url = models.URLField(max_length=200, blank=True)
    host = models.URLField(max_length=200, blank=True)
    displayName = models.CharField(max_length=150)
    github = models.URLField(max_length=200, blank=True)
    profileImage = models.URLField(max_length=200, blank=True)

    user = models.ForeignKey(User, default=1, null=True, on_delete=models.CASCADE, related_name='author') # the user account that the author object is linked to

    def get_author_from_user(user):
        return Author.objects.get(user=user)

class Followers(models.Model):
    type = "Followers"

    id = models.URLField(primary_key = True, max_length = 255)
    author = models.ForeignKey(Author, default=1, on_delete=models.CASCADE, related_name='followers', unique=True)
    items = models.ManyToManyField(Author, blank=True, symmetrical=False, related_name='followingitem')

    class Meta:
        verbose_name_plural = "followers"
    
class Following(models.Model):
    type = "Following"

    id = models.URLField(primary_key = True, max_length = 255)
    author = models.OneToOneField(Author, on_delete=models.CASCADE, related_name='following')
    items = models.ManyToManyField(Author, blank=True, symmetrical=False, related_name='followeritem')

    class Meta:
        verbose_name_plural = "following"

class FollowRequest(models.Model):
    type = 'FollowRequest'

    summary = models.CharField(max_length = 255)
    actor = models.ForeignKey(Author, default=1, max_length=200, on_delete=models.CASCADE, related_name='sent_requests') # the person sending the follow req
    object = models.ForeignKey(Author, default=1, max_length=200, on_delete=models.CASCADE, related_name='received_requests') # the person receiving the follow req

class Post(models.Model):
    class Visibility(models.TextChoices):
        FOLLOWERS = 'PRIVATE'
        FRIEND = 'FRIENDS'
        PUBLIC = 'PUBLIC'

    class ContentType(models.TextChoices):
        PLAIN = 'text/plain'
        MARKDOWN = 'text/markdown'
        PNG = 'image/png;base64'
        JPEG = 'image/jpeg;base64'
        APPLICATION = 'application/base64'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = 'post'
    title = models.CharField(max_length = 255)
    source = models.URLField(max_length = 255, null = True) #where did you get this post from
    origin = models.URLField(max_length = 255, null = True) #where is it actually from
    description = models.TextField(max_length = 255, default = '')
    contentType = models.CharField(max_length = 20, choices = ContentType.choices, default = ContentType.PLAIN) #change to different default?

    content = models.TextField(blank = True)
    author = models.ForeignKey(Author, null=True, on_delete = models.CASCADE, related_name='posts')
    categories = models.JSONField(default = list, null = True)
    count = models.IntegerField(default = 0, blank = True)
    comments = models.TextField(null = True)
    published = models.DateTimeField(default = timezone.now)
    visibility = models.CharField(max_length = 20, choices = Visibility.choices, default = Visibility.PUBLIC)
    unlisted = models.BooleanField(default = 'False')

    class Meta:
        ordering = ['-published']

    def _str_(self):
        return self.title
    
class ImagePosts(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = 'ImagePost'
    post = models.ForeignKey(Post, on_delete = models.CASCADE, related_name='image_posts')
    image = models.ImageField(null = True, blank = True)

    class Meta:
        verbose_name_plural = "image posts"

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = 'comment'
    author = models.ForeignKey(Author, null=True, on_delete = models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, null=True, on_delete=models.CASCADE, related_name='posts')
    comment = models.TextField(max_length = 255, default = '')
    contentType = models.CharField(max_length = 20)
    published = models.DateTimeField(default = timezone.now)

    def _str_(self):
        return self.comment

class Likes(models.Model):
    context = models.CharField(max_length = 255, default = '')
    summary = models.CharField(max_length = 255, default = '')
    type = 'likes'
    author = models.CharField(max_length=255, default = '') #change to jsonfield?
    object = models.URLField(max_length=255, default ='')

    class Meta:
        verbose_name_plural = "likes"

class Liked(models.Model):
    type = 'liked'

    author = models.CharField(max_length=255, default = '') #change to jsonfield?
    items = models.JSONField(default = list) #foreign key

    class Meta:
        verbose_name_plural = "liked"

class Inbox(models.Model):
    type = 'inbox'

    author = models.CharField(max_length=255, default = '') #change to jsonfield?
    items = models.JSONField(default = list) #foreign key

    class Meta:
        verbose_name_plural = "inbox's"
