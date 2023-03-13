"""social_distribution URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_nested import routers
from service import views

# from service.views import ChangePasswordView

router = routers.SimpleRouter()
router.register(r'users', views.UsersViewSet, 'user')
router.register(r'authors', views.AuthorsViewSet, 'author')

authors_router = routers.NestedSimpleRouter(router, r'authors', lookup='author')
authors_router.register(r'posts', views.PostsViewSet, 'post')
authors_router.register(r'followers', views.FollowersViewSet, 'followers')
authors_router.register(r'following', views.FollowingViewSet, 'following')
authors_router.register(r'follow-request', views.FollowRequestViewSet, 'follow-request')

posts_router = routers.NestedSimpleRouter(authors_router, r'posts', lookup='post')
posts_router.register(r'comments', views.CommentsViewSet, 'comment')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('service/', include(router.urls)),
    path('service/', include(authors_router.urls)),
    path('service/', include(posts_router.urls)),
]
