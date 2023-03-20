from django.contrib import admin

# import models
from .models import Post, Author, Followers, Following, FollowRequest, ImagePosts, Comment, Likes, Liked, Inbox

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'published', 'visibility', 'unlisted')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'post', 'comment', 'published')

class AuthorAdmin(admin.ModelAdmin):
    list_display = ('displayName', 'host', 'url')

class FollowRequestAdmin(admin.ModelAdmin):
    list_display = ('summary',)

class FollowersAdmin(admin.ModelAdmin):
    list_display = ('type', 'author',)

class FollowingAdmin(admin.ModelAdmin):
    list_display = ('type', 'author',)

admin.site.register(Post, PostAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Followers, FollowersAdmin)
admin.site.register(Following, FollowingAdmin)
admin.site.register(FollowRequest, FollowRequestAdmin)
admin.site.register(ImagePosts)
admin.site.register(Comment)
admin.site.register(Liked)
admin.site.register(Likes)
admin.site.register(Inbox)
