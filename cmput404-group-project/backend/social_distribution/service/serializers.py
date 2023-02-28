from rest_framework import serializers

# import models
from .models import Post

class PostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ('type', 'id', 'title', 'description')
