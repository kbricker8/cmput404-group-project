from django.contrib import admin

# import models
from .models import Post, Author, Followers, FollowRequest, ImagePosts, Comment, Likes, Liked, Inbox

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')

class AuthorAdmin(admin.ModelAdmin):
    list_display = ('displayName', 'host', 'url')

admin.site.register(Post, PostAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Followers)
admin.site.register(FollowRequest)
admin.site.register(ImagePosts)
admin.site.register(Comment)
admin.site.register(Liked)
admin.site.register(Likes)
admin.site.register(Inbox)
