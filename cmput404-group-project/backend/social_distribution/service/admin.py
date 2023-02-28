from django.contrib import admin

# import models
from.models import Post

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')

admin.site.register(Post, PostAdmin)
