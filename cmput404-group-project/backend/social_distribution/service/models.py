from django.db import models
from django.utils import timezone

# IMPORTANT ----------------------
# dont forget to update the admin.py, serializers.py, view.py, and urls.y files when you add/edit models

class Followers(model.Model):
    type: "followers"

    id models.URLField(primary_key = True, max_length = 255)
    items = models.JSONField(default = list)

class FollowRequest(model.Model):
    type: 'Follow'

    summary = models.CharField(max_length = 255)
    actor = models.CharField(max_length = 255)
    object = models.CharField(max_length = 255)
    

class Post(models.Model):
    class Visibility(models.TextChoices):
        DM = 'PRIVATE'
        FRIEND = 'FRIENDS'
        PUBLIC = 'PUBLIC'

    class ContentType(models.TextChoices):
        PLAIN = 'text/plain'
        MARKDOWN = 'text/markdown'
        PNG = 'image/png;base64'
        JPEG = 'image/jpeg;base64'
        MARKDOWN = 'text/markdown'
        APPLICATION = 'application/base64'

    type = 'post'
    title = models.CharField(max_length = 255)
    id = models.URLField(primary_key = True, max_length = 255)
    source = models.URLField(max_length = 255) #where did you get this post from
    origin = models.URLField(max_length = 255) #where is it actually from
    description = models.TextField(max_length = 255, default = '')
    contentType = models.CharField(max_length = 20, choices = ContentType.choices, default = ContentType.plain) #change to different default?

    content = models.TextField(blank = True)
    #author = #change to jsonfield?
    categories = models.JSONField(default = list, null = True)
    count = models.IntegerField(default = 0, blank = True)
    comments = model.TextField(null = True)
    published = models.DateTimeField(default = timezone.now)
    visibility = models.CharField(max_length = 20, choices = Visibility.choices, default = Visibility.PUBLIC)
    unlisted = models.BooleanField(default = 'False')

    def _str_(self):
        return self.title

class ImagePosts(models.Model):
    type = 'ImagePost'
    post = models.ForeignKey(Post, on_delete = models.CASCADE)
    image = models.ImageField(null = True, blank = True)

class Comments(models.Model):
    type = 'comment'
    author = models.CharField(max_length= 255, default='') #change to jsonfield?
    comment = models.CharField(default = '')
    contentType = models.CharField(max_length = 20)
    published = models.DateTimeField(default = timezone.now)
    id = models.URLField(primary_key = True, max_length = 255)

    def _str_(self):
        return self.comment

class Likes(models.Model):
    context = models.CharField(max_length = 255, default = '')
    summary = models.CharField(max_length = 255, default = '')
    type = 'likes'
    author = models.CharField(max_length=255, default = '') #change to jsonfield?
    object = models.URLField(max_length=255, default ='')

class Liked(models.Model):
    type = 'liked'

    items = models.JSONField(default = list)
    author = models.CharField(max_length=255, default = '') #change to jsonfield?

class Inbox(models.Model):
    type = 'inbox'

    author = models.CharField(max_length=255, default = '') #change to jsonfield?
    items = JSONField(default = list)