from django.db import models
from django.contrib.auth.models import User

# IMPORTANT ----------------------
# dont forget to update the admin.py, serializers.py, view.py, and urls.y files when you add/edit models

class Author(models.Model):
    type = 'author'
    user = models.ForeignKey(User, default=1, null=True, on_delete=models.CASCADE)
    host = models.URLField(max_length=200, blank=True)
    displayName = models.CharField(max_length=150)
    url = models.URLField(max_length=200, blank=True)
    github = models.URLField(max_length=200, blank=True)
    profileImage = models.URLField(max_length=200, blank=True)

class Post(models.Model):
    type = 'post'
    title = models.CharField(max_length=120)
    description = models.TextField()

    def _str_(self):
        return self.title
