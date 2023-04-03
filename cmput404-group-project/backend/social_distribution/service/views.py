from itertools import chain
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, status, generics, mixins
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.db.models import Q
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import uuid
import base64
from django.core.files.base import ContentFile
import binascii
from .paginations import PostsPagination, CommentsPagination, PostsPaginatorInspectorClass, CommentsPaginatorInspectorClass

# import serializers
from .serializers import PostSerializer
from .serializers import ImagePostsSerializer
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
from .serializers import InboxSerializer
from .serializers import PostItemSerializer
from .serializers import CommentItemSerializer
from .serializers import LikeItemSerializer
from .serializers import FollowRequestItemSerializer
# import models
from django.contrib.auth.models import User
from .models import Post, ImagePosts, Author, Comment, FollowRequest, Followers, Following, Liked, Likes, Inbox

baseURL = "https://social-distribution-group21.herokuapp.com/"
# baseURL = "http://127.0.0.1:8000/"


class UsersViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        # create corresponding author
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        user = User.objects.get(username=serializer.data.get("username"))

        author_uuid = uuid.uuid4()
        id = baseURL+'service/authors/' + str(author_uuid)
        author = Author(id=id, uuid=author_uuid, url=id, host=baseURL, displayName=serializer.data.get("username"), user=user)
        author.save()

        followers_id = str(author.id) + '/followers/'
        followers = Followers(id=followers_id, author = author)
        followers.save()

        following_id = str(author.id) + '/following/'
        following = Following(id=following_id, author = author)
        following.save()

        liked_id = str(author.id) + '/liked/'
        liked = Liked(id=liked_id, author=author)
        liked.save()

        inbox_id = str(author.id) + '/inbox/'
        inbox = Inbox(id=inbox_id, author=author)
        inbox.save()

        token = Token.objects.create(user=user)

        author_serializer = AuthorSerializer(instance=author)

        return Response(
            {
                'author': author_serializer.data,
                'token': token.key,
            },
            status=status.HTTP_201_CREATED)
    
    @action(detail=False)
    def auth_test(self, request, *args, **kwargs):
        content = {
            'user': str(request.user),  # `django.contrib.auth.User` instance.
            'auth': str(request.auth),  # None
        }
        return Response(content)
    
    ####### delete this
    # def list(self, request):
    #     recent_users = User.objects.all().order_by('-last_login')
    #     # page = self.paginate_queryset(recent_users)
    #     # if page is not None:
    #     #     serializer = self.get_serializer(page, many=True)
    #     #     return self.get_paginated_response(serializer.data)
    #     serializer = self.get_serializer(recent_users, many=True)
    #     return Response(serializer.data)

    # @action(detail=True, methods=['post'])
    # def update_pass(self, request, *args, **kwargs):
    #     object = self.get_object()
    #     if request.user != object:
    #         return Response({"detail:" ["Not authorized to do that."]},
    #                         status=status.HTTP_401_UNAUTHORIZED)
    #     serializer = ChangePasswordSerializer(data=request.data)

    #     if serializer.is_valid():
    #         if not object.check_password(serializer.data.get("old_password")):
    #             return Response({"old_password": ["Wrong Password."]}, 
    #                             status=status.HTTP_401_UNAUTHORIZED)
    #         object.set_password(serializer.data.get("new_password"))
    #         object.save()
    #         return Response({"status": "success",
    #                          "code": status.HTTP_200_OK,
    #                          "message": "Password updated successfully"})
    #     return Response(serializer.errors,
    #                     status=status.HTTP_400_BAD_REQUEST)

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
                token = get_object_or_404(Token, user=user)
                return Response({
                    'author': author_serializer.data,
                    'token': token.key,
                },
                        status=status.HTTP_200_OK)
            return Response({"detail": ["Wrong username or password."]}, 
                            status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)


class AuthorsViewSet(viewsets.GenericViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    # permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs): # overrides the default list method
        authors = Author.objects.all()
        serializer = self.get_serializer(authors, many=True)
        return Response({"type": "authors",
                         "items": serializer.data})
    
    def retrieve(self, request, pk,*args, **kwargs):
        instance = Author.objects.get(uuid=pk)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def update(self, request, pk, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        user = request.user
        instance = Author.objects.get(uuid=pk)
        if (instance.user != user):
            return Response({"detail": ["Not authorized to do that."]},
                            status=status.HTTP_401_UNAUTHORIZED)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
    
    def perform_update(self, serializer):
        serializer.save()
    
    @swagger_auto_schema(responses={200: openapi.Response('',UserSerializer)})
    @action(detail=True)
    def get_user(self, request, pk, *args, **kwargs):
        user = request.user
        instance = Author.objects.get(uuid=pk)
        if (instance.user != user):
            return Response({"detail": ["Not authorized to do that."]},
                            status=status.HTTP_401_UNAUTHORIZED)
        user = instance.user
        serializer = UserSerializer(instance=user)
        return Response(serializer.data)
    
    @swagger_auto_schema(responses={200: openapi.Response('{\n"type": "friends",\n"items": friends\n}')})
    @action(detail=True)
    def friends(self, request, pk, *args, **kwargs):
        author = Author.objects.get(uuid=pk)
        followers = Followers.objects.filter(author=author).values_list('items', flat=True)
        following = Following.objects.filter(author=author).values_list('items', flat=True)
        friends = Author.objects.filter(
            Q(id__in=followers) & Q(id__in=following)
        ).values_list('id', flat=True)
        return Response({"type": "friends",
                         "items": friends})
    
    @swagger_auto_schema(responses={200: openapi.Response('',LikedSerializer)})
    @action(detail=True)
    def liked(self, request, pk, *args, **kwargs):
        liked = Liked.objects.get(author__uuid=pk)
        serializer = LikedSerializer(instance=liked)
        return Response(serializer.data)
    
    @swagger_auto_schema(responses={401: openapi.Response('"old_password": ["Wrong Password."]'),
                                    200: openapi.Response('"message": "Password updated successfully"')})
    @action(detail=True, methods=['post'])
    def update_pass(self, request, pk, *args, **kwargs):
        self.object = Author.objects.get(uuid=pk)
        user = self.object.user
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong Password."]}, 
                                status=status.HTTP_401_UNAUTHORIZED)
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
        author = get_object_or_404(Author, uuid=author_pk)
        queryset = FollowRequest.objects.all().filter(object=author)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, author_pk=None, *args, **kwargs):
        object = get_object_or_404(Author, uuid=author_pk)
        actor = get_object_or_404(Author, uuid=pk)
        try: 
            instance = FollowRequest.objects.get(object=object, actor=actor)
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except:
            return Response({"detail": ["Request does not exist."]},
                            status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None, author_pk=None, *args, **kwargs):
        user = request.user
        object = Author.objects.get(uuid=author_pk)
        actor = Author.objects.get(uuid=pk)
        if (actor.user != user): # user must be the actor
            return Response({"detail": ["Not authorized to do that."]},
                            status=status.HTTP_401_UNAUTHORIZED)
        
        summary = f"{actor.displayName} wants to follow {object.displayName}."
        if FollowRequest.objects.filter(actor=actor, object=object).count(): # request already exists
            return Response({"detail": ["Request already exists."]},
                            status=status.HTTP_400_BAD_REQUEST)
        id = baseURL + "service/authors/"+str(object.uuid)+"/follow-request/"+str(actor.uuid)+"/"
        follow_request = FollowRequest(id=id, summary=summary, actor=actor, object=object)
        follow_request.save()
        serializer = FollowRequestSerializer(instance=follow_request)
        # add to inbox of the user
        inbox = Inbox.objects.get(author=object)
        inbox.items.append(serializer.data)
        inbox.save()
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None, author_pk=None, *args, **kwargs):
        user = request.user
        object = get_object_or_404(Author, uuid=author_pk)
        actor = get_object_or_404(Author, uuid=pk)

        if (object.user != user):
            return Response({"detail": ["Not authorized to do that."]},
                            status=status.HTTP_401_UNAUTHORIZED)

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
    
    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None, author_pk=None, *args, **kwargs):
        user = request.user
        object = get_object_or_404(Author, uuid=author_pk)
        actor = get_object_or_404(Author, uuid=pk)

        if (object.user != user):
            return Response({"detail": ["Not authorized to do that."]},
                            status=status.HTTP_401_UNAUTHORIZED)

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
        instance = Followers.objects.get(author__uuid=author_pk)
        serializer = FollowersSerializer(instance=instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def unfollow(self, request, author_pk=None, *args, **kwargs):
        author = get_object_or_404(Author, uuid=author_pk)
        user = request.user
        follower = get_object_or_404(Author, user=user)
        followers = Followers.objects.get(author=author)
        following = Following.objects.get(author=follower)
        if followers.items.contains(follower) & following.items.contains(author):
            followers.items.remove(follower)
            following.items.remove(author)
            return Response({"detail": ["Unfollowed successfully."]},
                            status=status.HTTP_200_OK)

        return Response({"detail": ["User is not in following list."]},
                        status=status.HTTP_404_NOT_FOUND)

class FollowingViewSet(viewsets.GenericViewSet):
    queryset = Following.objects.all()
    serializer_class = FollowingSerializer

    def list(self, request, author_pk=None, *args, **kwargs):
        instance = Following.objects.get(author__uuid=author_pk)
        serializer = FollowingSerializer(instance=instance)
        return Response(serializer.data)


class PostsViewSet(viewsets.GenericViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PostsPagination

    @swagger_auto_schema(pagination_class=PostsPagination, paginator_inspectors=[PostsPaginatorInspectorClass])
    def list(self, request, author_pk=None, *args, **kwargs): # overrides the default list method
        posts = Post.objects.filter( Q(author__uuid = author_pk) & Q(unlisted=False) ).all()
        page = self.paginate_queryset(posts)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
    
    def create(self, request, author_pk=None, *args, **kwargs):
        user = request.user
        author = Author.objects.get(uuid=author_pk)
        if (author.user != user):
            return Response({"detail": ["Not authorized to do that."]},
                            status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post_uuid = uuid.uuid4()
        id = baseURL + 'service/authors/' + author_pk + '/posts/' + str(post_uuid)
        comments_url = baseURL + 'service/authors/' + author_pk + '/posts/' + str(post_uuid) + '/comments'
        post = serializer.save(id=id, uuid=post_uuid, url=id, author=author, comments=comments_url)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def retrieve(self, request, pk,*args, **kwargs):
        instance = Post.objects.get(uuid=pk)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def update(self, request, author_pk, pk, *args, **kwargs):
        user = request.user
        author = Author.objects.get(uuid=author_pk)
        if (author.user != user):
            return Response({"detail": ["Not authorized to do that."]},
                            status=status.HTTP_401_UNAUTHORIZED)
        partial = kwargs.pop('partial', False)
        instance = Post.objects.get(uuid=pk)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        title = serializer.validated_data['title']
        description = serializer.validated_data['description']
        content = serializer.validated_data['content']
        instance.title = title
        instance.description = description
        instance.content = content
        instance.save()
        serializer = PostSerializer(instance=instance)

        return Response(serializer.data)
    
    def destroy(self, request, author_pk, pk, *args, **kwargs):
        user = request.user
        author = Author.objects.get(uuid=author_pk)
        if (author.user != user):
            return Response({"detail": ["Not authorized to do that."]},
                            status=status.HTTP_401_UNAUTHORIZED)
        instance = object = Post.objects.get(uuid=pk)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True)
    def image(self, request, author_pk, pk, *args, **kwargs):
        post = Post.objects.get(uuid=pk)
        image = get_object_or_404(ImagePosts, post=post)
        serializer = ImagePostsSerializer(instance=image)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def image_post(self, request, author_pk, pk, *args, **kwargs):
        # accept image from client
        post = Post.objects.get(uuid=pk)
        image_data = request.data.get('image')
        if image_data:
            id = baseURL + 'service/authors/' + author_pk + '/posts/' + pk + '/image'
            ImagePosts.objects.create(post=post, image=image_data, id=id)
            return Response({"status": "Image uploaded successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "No image data found"}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True)
    def likes(self, request, author_pk, pk, *args, **kwargs):
        # queryset = Likes.objects.filter(author__uuid = author_pk, object__id = pk).all()
        id = baseURL + 'service/authors/' + author_pk + '/posts/' + pk
        likes = Likes.objects.filter(object = id).all()
        serializer = LikesSerializer(instance=likes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['Post'])
    def like(self, request, author_pk, pk, *args, **kwargs):
        object = Post.objects.get(uuid=pk)
        id = baseURL + 'service/authors/' + author_pk + '/posts/' + pk
        user = request.user
        author = Author.get_author_from_user(user=user)
        summary = f"{author.displayName} liked your post"
        if Likes.objects.filter(author=author, object=id).count():
            return Response({"detail": ["Request already exists."]},
                        status=status.HTTP_400_BAD_REQUEST)
        like = Likes(summary=summary, author=author, object=object.id)
        like.save()
        object.numLikes += 1
        object.save()
        liked = Liked.objects.get(author=author)
        liked.items.add(like)
        # add to the authors inbox
        serializer = LikesSerializer(instance=like)
        inbox = Inbox.objects.get(author=object.author)
        inbox.items.append(serializer.data)
        inbox.save()
        return Response({"detail": ["Liked post."]},
                    status=status.HTTP_200_OK)
    
    # @swagger_auto_schema(responses={200: openapi.Response('',PostSerializer(many=True))})
    @swagger_auto_schema(pagination_class=PostsPagination, paginator_inspectors=[PostsPaginatorInspectorClass])
    @action(detail=False)
    def public(self, request, author_pk=None, *args, **kwargs):
        self.pagination_class=PostsPagination
        posts = Post.objects.filter(
            Q(visibility='PUBLIC') & Q(unlisted=False)
            )
        page = self.paginate_queryset(posts)
        serializer = PostSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @swagger_auto_schema(pagination_class=PostsPagination, paginator_inspectors=[PostsPaginatorInspectorClass])
    @action(detail=False)
    def feed(self, request, author_pk=None, *args, **kwargs):
        self.pagination_class=PostsPagination
        author = Author.objects.get(uuid=author_pk)
        followers = Followers.objects.filter(author=author).values_list('items', flat=True)
        following = Following.objects.filter(author=author).values_list('items', flat=True)
        friends = Author.objects.filter(
            Q(id__in=followers) & Q(id__in=following)
        ).values_list('id', flat=True)

        my_posts = Post.objects.filter(Q(author__uuid=author_pk) & Q(unlisted=False) )
        public_posts = Post.objects.filter(
            Q(visibility='PUBLIC') & Q(unlisted=False)
        )
        following_posts = Post.objects.filter(
            Q(author__id__in=following) & Q(visibility='FRIENDS') & Q(unlisted=False)
        )
        # public_posts = Post.objects.filter(visibility='PUBLIC')

        posts = my_posts | following_posts | public_posts

        page = self.paginate_queryset(posts)
        serializer = PostSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class CommentsViewSet(viewsets.GenericViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentsSerializer
    pagination_class = CommentsPagination

    # def list(self, request, author_pk=None, post_pk=None, *args, **kwargs): # overrides the default list method
    #     comments = Comment.objects.filter(post=post_pk).all()
    #     serializer = self.get_serializer(comments, many=True)
    #     return Response({"type": "comments",
    #                      "items": serializer.data})
    
    @swagger_auto_schema(pagination_class=CommentsPagination, paginator_inspectors=[CommentsPaginatorInspectorClass])
    def list(self, request, author_pk=None, post_pk=None, *args, **kwargs):
        post = Post.objects.get(uuid=post_pk)
        queryset = Comment.objects.filter(post=post).all()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, author_pk=None, post_pk=None, *args, **kwargs):
        
        post_id = baseURL+'service/authors/'+author_pk+'/posts/'+post_pk
        post = Post.objects.get(id=post_id)
        user = request.user
        author = Author.get_author_from_user(user=user)
        author_serializer = AuthorSerializer(instance=author)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # self.perform_create(serializer)
        comment_uuid = uuid.uuid4()
        id = baseURL+'service/authors/'+author_pk+'/posts/'+post_pk+'/comments/'+str(comment_uuid)
        serializer.save(id=id, uuid=comment_uuid, post=post, author=author_serializer.data)
        post.count += 1
        post.save()
        # add comment to the authors inbox
        inbox = Inbox.objects.get(author=post.author)
        inbox.items.append(serializer.data)
        inbox.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # def update(self, request, pk, *args, **kwargs):
    #     user = request.user
    #     partial = kwargs.pop('partial', False)
    #     instance = Comment.objects.get(uuid=pk)
    #     author = instance.author
    #     if (author.user != user):
    #         return Response({"detail": ["Not authorized to do that."]},
    #                         status=status.HTTP_401_UNAUTHORIZED)
    #     serializer = self.get_serializer(instance, data=request.data, partial=partial)
    #     serializer.is_valid(raise_exception=True)
    #     comment = serializer.validated_data['comment']
    #     instance.comment = comment
    #     instance.save()
    #     serializer = CommentsSerializer(instance=instance)

    #     return Response(serializer.data)
    
    def destroy(self, request, pk, *args, **kwargs):
        user = request.user
        instance = Comment.objects.get(uuid=pk)
        # author = instance.author
        # if (author.user != user):
        #     return Response({"detail": ["Not authorized to do that."]},
        #                     status=status.HTTP_401_UNAUTHORIZED)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True)
    def likes(self, request, author_pk, post_pk, pk, *args, **kwargs):
        # queryset = Likes.objects.filter(author__uuid = author_pk, object__id = pk).all()
        id = baseURL + 'service/authors/' + author_pk + '/posts/' + post_pk + '/comments/' + pk
        likes = Likes.objects.filter(object = id).all()
        serializer = LikesSerializer(instance=likes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['Post'])
    def like(self, request, author_pk, post_pk, pk, *args, **kwargs):
        object = Comment.objects.get(uuid=pk)
        user = request.user
        author = Author.get_author_from_user(user=user)
        summary = f"{author.displayName} liked your comment"
        if Likes.objects.filter(author=author, object=object.id).count():
            return Response({"detail": ["Request already exists."]},
                        status=status.HTTP_400_BAD_REQUEST)
        like = Likes(summary=summary, author=author, object=object.id)
        like.save()
        object.numLikes += 1
        object.save()
        liked = Liked.objects.get(author=author)
        liked.items.add(like)
        # add to the authors inbox
        serializer = LikesSerializer(instance=like)
        inbox = Inbox.objects.get(author=object.author['id'])
        inbox.items.append(serializer.data)
        inbox.save()
        return Response({"detail": ["Liked comment."]},
                    status=status.HTTP_200_OK)
        

#create an inbox class to handle incoming posts to the inbox endpoint and get the inbox of the current user
class InboxViewSet(viewsets.GenericViewSet):
    queryset = Inbox.objects.all()
    serializer_class = InboxSerializer

    def list(self, request, author_pk=None, *args, **kwargs):
        # instance = Inbox.objects.get(author__uuid=author_pk)
        instance = get_object_or_404(Inbox, author__uuid=author_pk)
        serializer = InboxSerializer(instance=instance)
        return Response(serializer.data)

    def create(self, request, author_pk=None, *args, **kwargs):
        # inbox = Inbox.objects.get(author__uuid=author_pk)
        inbox = get_object_or_404(Inbox, author__uuid=author_pk)
        data = request.data
        
        postserializer = PostItemSerializer(data=data)
        if postserializer.is_valid():
            inbox.items.append(postserializer.data)
            inbox.save()
            return Response(postserializer.data, status=status.HTTP_201_CREATED)
        followserializer = FollowRequestItemSerializer(data=data)
        if followserializer.is_valid():
            inbox.items.append(followserializer.data)
            inbox.save()
            return Response(followserializer.data, status=status.HTTP_201_CREATED)
        commentserializer = CommentsSerializer(data=data)
        if commentserializer.is_valid():
            inbox.items.append(commentserializer.data)
            inbox.save()
            commentserializer.save()
            return Response(commentserializer.data, status=status.HTTP_201_CREATED)
        likeserializer = LikeItemSerializer(data=data)
        if likeserializer.is_valid():
            inbox.items.append(likeserializer.data)
            inbox.save()
            return Response(likeserializer.data, status=status.HTTP_201_CREATED)
        
        return Response({
            "like": likeserializer.errors, 
            "post": postserializer.errors, 
            "followreq": followserializer.errors, 
            "comment": commentserializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['Post'])
    def clear(self, request, author_pk=None, *args, **kwargs):
        inbox = get_object_or_404(Inbox, author__uuid=author_pk)
        inbox.items.clear()
        inbox.save()
        serializer = InboxSerializer(instance=inbox)

        return Response(serializer.data, status=status.HTTP_200_OK)
