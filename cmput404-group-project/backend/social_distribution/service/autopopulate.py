from django import settings
settings.configure()
from django.contrib.auth.models import User
from django.utils import timezone
from model_bakery import baker
from faker import Faker
from service.models import Author, Followers, FollowRequest, Post, ImagePosts, Comment, Likes, Liked, Inbox


fake = Faker()

# create some users to associate with authors
users = baker.make(User, _quantity=5)

# create some authors with random data
authors = []
for user in users:
    authors.append(baker.make(
        Author,
        user=user,
        displayName=fake.name(),
        github=fake.url(),
        profileImage=fake.url()
    ))

# create some followers for each author
for author in authors:
    followers = baker.make(
        Followers,
        author=author,
        _quantity=3
    )

    # add some following relationships for each follower
    for follower in followers:
        follower.items.add(*authors)

# create some follow requests between authors
for i in range(5):
    actor = authors[i]
    for j in range(i+1, 5):
        obj = authors[j]
        baker.make(
            FollowRequest,
            actor=actor,
            object=obj,
            summary=fake.sentence()
        )

# create some posts for each author
for author in authors:
    posts = baker.make(
        Post,
        author=author,
        _quantity=3
    )

    # add some image posts for each post
    for post in posts:
        baker.make(
            ImagePosts,
            post=post,
            image=baker.image()
        )

    # add some comments for each post
    for post in posts:
        comments = baker.make(
            Comment,
            author=baker.random_choice(authors),
            post=post,
            _quantity=3
        )

        # add some likes for each comment
        for comment in comments:
            baker.make(
                Likes,
                context=fake.word(),
                summary=fake.sentence(),
                author=baker.random_choice(authors).id,
                object=comment.id
            )

# create some liked objects for each author
for author in authors:
    items = [baker.random_choice(posts).id for _ in range(3)]
    baker.make(
        Liked,
        author=author.id,
        items=items
    )

# create some inbox objects for each author
for author in authors:
    items = [baker.random_choice(authors).id for _ in range(3)]
    baker.make(
        Inbox,
        author=author.id,
        items=items
    )
