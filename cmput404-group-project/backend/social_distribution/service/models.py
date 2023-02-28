from django.db import models

# IMPORTANT ----------------------
# dont forget to update the admin.py, serializers.py, view.py, and urls.y files when you add/edit models

class Post(models.Model):
    type = 'post'
    title = models.CharField(max_length=120)
    description = models.TextField()

    def _str_(self):
        return self.title
