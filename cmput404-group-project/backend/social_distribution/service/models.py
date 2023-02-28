from django.db import models
from django.utils import timezone

# IMPORTANT ----------------------
# dont forget to update the admin.py, serializers.py, view.py, and urls.y files when you add/edit models

class Inbox(models.Model):
    type = 'inbox'

    author = models.CharField(max_length=255, default = '')
    message = JSONField(default = list)

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
    title = models.CharField(max_length = 120)
    #id = models.URLField
    source = models.URLField(max_length = 255) #where did you get this post from
    origin = models.URLField(max_length = 255) #where is it actually from
    description = models.TextField(max_length = 255, default = '')
    contentType = models.CharField(max_length = 20, choices = ContentType.choices, default = ContentType.plain) #change to different default?

    content = models.TextField(blank = True)
    #author = 
    categories = models.JSONField(default = default_list, null = True)
    count = models.IntegerField(default = 0, blank = True)
    comments = model.TextField(null = True)
    published = models.DateTimeField(default = timezone.now)
    visibility = models.CharField(max_length = 20, choices = Visibility.choices, default = Visibility.PUBLIC)
    unlisted = models.BooleanField(default = 'False')

    def _str_(self):
        return self.title

class Comments(models.Model):
    type = 'comment'
    author = models.CharField(max_length=120, default='')
    comment = models.CharField(default = '')
    contentType = models.CharField(max_length = 20)
    published = models.DateTimeField(default = timezone.now)
    # id = models.URLField

    def _str_(self):
        return self.comment
