from django.contrib import admin

# import models
from .models import Post
from .models import Author

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')

class AuthorAdmin(admin.ModelAdmin):
    list_display = ('displayName', 'host', 'url')

admin.site.register(Post, PostAdmin)
admin.site.register(Author, AuthorAdmin)