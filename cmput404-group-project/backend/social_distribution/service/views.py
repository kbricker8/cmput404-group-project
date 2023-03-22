from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, status, generics, mixins
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login

from .paginations import PostsPagination, CommentsPagination

# import serializers
from .serializers import PostSerializer
from .serializers import UserSerializer
from .serializers import ChangePasswordSerializer
from .serializers import AuthorSerializer
from .serializers import LoginSerializer
from .serializers import CommentsSerializer
from .serializers import FollowRequestSerializer
from .serializers import FollowersSerializer
from .serializers import FollowingSerializer
from .serializers import AuthorIdSerializer
from .serializers import LikesSerializer
from .serializers import LikedSerializer
from .serializers import LikeSerializer

# import models
from django.contrib.auth.models import User
from .models import Post, Author, Comment, FollowRequest, Followers, Following, Liked, Likes

class UsersViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def create(self, request, *args, **kwargs):
        # create corresponding author
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        user = User.objects.get(username=serializer.data.get("username"))

        author = Author(host="http://127.0.0.1:8000/", displayName=serializer.data.get("username"), user=user)
        author.save()
        author.url = "http://127.0.0.1:8000/service/authors/" + str(author.id)
        author.save()

        followers_id = 'http://127.0.0.1:8000/service/authors/' + str(author.id) + '/followers/'
        followers = Followers(id=followers_id, author = author)
        followers.save()

        following_id = 'http://127.0.0.1:8000/service/authors/' + str(author.id) + '/following/'
        following = Following(id=following_id, author = author)
        following.save()

        liked_id = 'http://127.0.0.1:8000/service/authors/' + str(author.id) + '/liked/'
        liked = Liked(id=liked_id, author=author)
        liked.save()

        author_serializer = AuthorSerializer(instance=author)

        return Response(author_serializer.data, status=status.HTTP_201_CREATED)
    
    def list(self, request):
        recent_users = User.objects.all().order_by('-last_login')
        # page = self.paginate_queryset(recent_users)
        # if page is not None:
        #     serializer = self.get_serializer(page, many=True)
        #     return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(recent_users, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_pass(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong Password."]}, 
                                status=status.HTTP_401_UNAUTHORIZED)
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"status": "success",
                             "code": status.HTTP_200_OK,
                             "message": "Password updated successfully"})
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get("username")
            password = serializer.data.get("password")
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                author = Author.get_author_from_user(user=user)
                author_serializer = AuthorSerializer(instance=author)
                return Response(author_serializer.data,
                        status=status.HTTP_200_OK)
            return Response({"detail": ["Wrong username or password."]}, 
                            status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)


class AuthorsViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    def list(self, request, *args, **kwargs): # overrides the default list method
        authors = Author.objects.all()
        serializer = self.get_serializer(authors, many=True)
        return Response({"type": "authors",
                         "items": serializer.data})
    
    @action(detail=True)
    def liked(self, request, pk, *args, **kwargs):
        liked = Liked.objects.get(author=pk)
        serializer = LikedSerializer(instance=liked)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_pass(self, request, *args, **kwargs):
        self.object = self.get_object()
        user = self.object.user
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong Password."]}, 
                                status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"status": "success",
                             "code": status.HTTP_200_OK,
                             "message": "Password updated successfully"})
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)
    
class FollowRequestViewSet(viewsets.GenericViewSet):
    queryset = FollowRequest.objects.all()
    serializer_class = FollowRequestSerializer

    def list(self, request, author_pk=None, *args, **kwargs):
        author = get_object_or_404(Author, id=author_pk)
        queryset = FollowRequest.objects.all().filter(object=author)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, author_pk=None, *args, **kwargs):
        object = get_object_or_404(Author, id=author_pk)
        actor = get_object_or_404(Author, id=pk)
        try: 
            instance = FollowRequest.objects.get(object=object, actor=actor)
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except:
            return Response({"detail": ["Request does not exist."]},
                            status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get', 'post'])
    def send(self, request, pk=None, author_pk=None, *args, **kwargs):
        object = Author.objects.get(id=author_pk)
        actor = Author.objects.get(id=pk)
        summary = f"{actor.displayName} wants to follow {object.displayName}."
        if FollowRequest.objects.filter(actor=actor, object=object).count(): # request already exists
            return Response({"detail": ["Request already exists."]},
                            status=status.HTTP_400_BAD_REQUEST)
        follow_request = FollowRequest(summary=summary, actor=actor, object=object)
        follow_request.save()
        serializer = FollowRequestSerializer(instance=follow_request)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get', 'post'])
    def accept(self, request, pk=None, author_pk=None, *args, **kwargs):
        object = get_object_or_404(Author, id=author_pk)
        actor = get_object_or_404(Author, id=pk)
        if FollowRequest.objects.filter(actor=actor, object=object).count():
            instance = FollowRequest.objects.get(object=object, actor=actor)
            followers = Followers.objects.get(author=object)
            followers.items.add(actor)
            following = Following.objects.get(author=actor)
            following.items.add(object)
            instance.delete()
            return Response({"detail": ["Follow request accepted."]},
                        status=status.HTTP_200_OK)

        return Response({"detail": ["Request does not exist."]},
                        status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['get', 'post'])
    def decline(self, request, pk=None, author_pk=None, *args, **kwargs):
        object = get_object_or_404(Author, id=author_pk)
        actor = get_object_or_404(Author, id=pk)
        if FollowRequest.objects.filter(actor=actor, object=object).count():
            instance = FollowRequest.objects.get(object=object, actor=actor)
            instance.delete()
            return Response({"detail": ["Follow request declined."]},
                        status=status.HTTP_200_OK)

        return Response({"detail": ["Request does not exist."]},
                        status=status.HTTP_404_NOT_FOUND)


class FollowersViewSet(viewsets.GenericViewSet):
    queryset = Followers.objects.all()
    serializer_class = FollowersSerializer

    def list(self, request, author_pk=None, *args, **kwargs):
        instance = Followers.objects.get(author__id=author_pk)
        serializer = FollowersSerializer(instance=instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def unfollow(self, request, author_pk=None, *args, **kwargs):
        author = get_object_or_404(Author, id=author_pk)
        serializer = AuthorIdSerializer(data=request.data)
        if serializer.is_valid():
            pk = serializer.data.get("id")
            follower = get_object_or_404(Author, id=pk)
            followers = Followers.objects.get(author=author)
            following = Following.objects.get(author=follower)
            if followers.items.contains(follower) & following.items.contains(author):
                followers.items.remove(follower)
                following.items.remove(author)
                return Response({"detail": ["Unfollowed successfully."]},
                                status=status.HTTP_200_OK)

            return Response({"detail": ["User is not in following list."]},
                            status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

class FollowingViewSet(viewsets.ModelViewSet):
    queryset = Following.objects.all()
    serializer_class = FollowingSerializer

    def list(self, request, author_pk=None, *args, **kwargs):
        instance = Following.objects.get(author__id=author_pk)
        serializer = FollowingSerializer(instance=instance)
        return Response(serializer.data)


class PostsViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # pagination_class = PostsPagination

    def list(self, request, author_pk=None, *args, **kwargs): # overrides the default list method
        posts = Post.objects.filter(author__id = author_pk).all()
        serializer = self.get_serializer(posts, many=True)
        return Response({"type": "posts",
                         "items": serializer.data})
    
    def create(self, request, author_pk=None, *args, **kwargs):
        
        author = Author.objects.get(id=author_pk)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # self.perform_create(serializer)
        serializer.save(author=author)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True)
    def likes(self, request, author_pk, pk, *args, **kwargs):
        # queryset = Likes.objects.filter(author__id = author_pk, object__id = pk).all()
        likes = Likes.objects.filter(object_id = pk).all()
        serializer = LikesSerializer(instance=likes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['Post'])
    def like(self, request, author_pk, pk, *args, **kwargs):
        object = self.get_object()
        serializer = LikeSerializer(data=request.data)
        if serializer.is_valid():
            authorid = serializer.data.get('author')
            author = get_object_or_404(Author, id=authorid)
            summary = f"{author.displayName} liked your post"
            if Likes.objects.filter(author=author, object_id=pk).count():
                return Response({"detail": ["Request already exists."]},
                            status=status.HTTP_400_BAD_REQUEST)
            like = Likes(summary=summary, author=author, object=object)
            like.save()
            object.numLikes += 1
            object.save()
            liked = Liked.objects.get(author=author)
            liked.items.add(like)
            return Response({"detail": ["Liked post."]},
                        status=status.HTTP_200_OK)
        
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False)
    def public(self, request, author_pk=None, *args, **kwargs):
        self.pagination_class=PostsPagination
        posts = Post.objects.filter(visibility='PUBLIC')
        page = self.paginate_queryset(posts)
        serializer = PostSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=False)
    def feed(self, request, author_pk=None, *args, **kwargs):
        self.pagination_class=PostsPagination
        following = Following.objects.get(author__id=author_pk)
        followed_authors = following.items.all()
        posts = Post.objects.filter(author__in=followed_authors)
        page = self.paginate_queryset(posts)
        serializer = PostSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class CommentsViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentsSerializer
    pagination_class = CommentsPagination

    # def list(self, request, author_pk=None, post_pk=None, *args, **kwargs): # overrides the default list method
    #     comments = Comment.objects.filter(post=post_pk).all()
    #     serializer = self.get_serializer(comments, many=True)
    #     return Response({"type": "comments",
    #                      "items": serializer.data})
    
    def list(self, request, author_pk=None, post_pk=None, *args, **kwargs):
        queryset = Comment.objects.filter(post=post_pk).all()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, author_pk=None, post_pk=None, *args, **kwargs):
        
        post = Post.objects.get(id=post_pk)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # self.perform_create(serializer)
        serializer.save(post=post)
        post.count += 1
        post.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True)
    def likes(self, request, author_pk, post_pk, pk, *args, **kwargs):
        # queryset = Likes.objects.filter(author__id = author_pk, object__id = pk).all()
        likes = Likes.objects.filter(object_id = pk).all()
        serializer = LikesSerializer(instance=likes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['Post'])
    def like(self, request, author_pk, post_pk, pk, *args, **kwargs):
        object = self.get_object()
        serializer = LikeSerializer(data=request.data)
        if serializer.is_valid():
            authorid = serializer.data.get('author')
            author = get_object_or_404(Author, id=authorid)
            summary = f"{author.displayName} liked your comment"
            if Likes.objects.filter(author=author, object_id=pk).count():
                return Response({"detail": ["Request already exists."]},
                            status=status.HTTP_400_BAD_REQUEST)
            like = Likes(summary=summary, author=author, object=object)
            like.save()
            object.numLikes += 1
            object.save()
            liked = Liked.objects.get(author=author)
            liked.items.add(like)
            return Response({"detail": ["Liked comment."]},
                        status=status.HTTP_200_OK)
