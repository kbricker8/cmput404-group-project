# API GUIDE

all api calls are directed to 127.0.0.1:8000/service/

# Users

This is used to manage user accounts.  
## GET /service/users/ will return all users with some information  

I don't think this should ever be needed but I will leave it for now  

## POST /service/users/ will create a user if sent data is valid  

Post Format:  
```
{  
    "username": "example_username",  
    "email": "example_email",  
    "password": "example_password"  
}  
```
Returns:
```
HTTP 201 Created
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "author": {
        "displayName": "testtoken",
        "github": "",
        "host": "http://127.0.0.1:8000/",
        "id": "f8668faf-0abd-45d0-aa57-0c3453021c2d",
        "profileImage": "",
        "type": "author",
        "url": "http://127.0.0.1:8000/service/authors/f8668faf-0abd-45d0-aa57-0c3453021c2d"
    },
    "token": "112a303bf837d71759671401e584d588835305a6"
}
```
it is important to note that passwords are sent as raw strings, and then saved in the database after hashing.  

## POST /service/users/login/

Post Format
```
{
    "username": "username",
    "password": "password"
}
```
If OK, Returns:
```
HTTP 200 OK
Allow: POST, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "author": {
        "displayName": "testtoken",
        "github": "",
        "host": "http://127.0.0.1:8000/",
        "id": "f8668faf-0abd-45d0-aa57-0c3453021c2d",
        "profileImage": "",
        "type": "author",
        "url": "http://127.0.0.1:8000/service/authors/f8668faf-0abd-45d0-aa57-0c3453021c2d"
    },
    "token": "112a303bf837d71759671401e584d588835305a6"
}
```
If not OK returns:
```
HTTP 401 Unauthorized
Allow: POST, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "Wrong username or password."
    ]
}
```

## POST /service/users/{userId}/update_pass/
Post format:
```
{
    "old_password": "pass",
    "new_password": "newpass"
}
```
On success:
```
HTTP 200 OK
Allow: POST, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "status": "success",
    "code": 200,
    "message": "Password updated successfully"
}
```
On fail:
```
HTTP 401 Unauthorized
Allow: POST, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "old_password": [
        "Wrong Password."
    ]
}
```

# Authors

## GET /service/authors/

```
HTTP 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "type": "authors",
    "items": [
        {
            "type": "author",
            "id": "6e603d57-a12e-4482-a6fb-4fa5e8a7b15a",
            "url": "http://127.0.0.1:8000/service/authors/6e603d57-a12e-4482-a6fb-4fa5e8a7b15a",
            "host": "http://127.0.0.1:8000/",
            "displayName": "testfollow1",
            "github": "",
            "profileImage": ""
        },
        {
            "type": "author",
            "id": "6443bb45-91d3-433c-9ff5-d152942308a8",
            "url": "http://127.0.0.1:8000/service/authors/6443bb45-91d3-433c-9ff5-d152942308a8",
            "host": "http://127.0.0.1:8000/",
            "displayName": "testfollow2",
            "github": "",
            "profileImage": ""
        }
    ]
}
```

## GET /service/author/{authorId}/

```
HTTP 200 OK
Allow: GET, PUT, PATCH, DELETE, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "type": "author",
    "id": "6e603d57-a12e-4482-a6fb-4fa5e8a7b15a",
    "url": "http://127.0.0.1:8000/service/authors/6e603d57-a12e-4482-a6fb-4fa5e8a7b15a",
    "host": "http://127.0.0.1:8000/",
    "displayName": "testfollow1",
    "github": "",
    "profileImage": ""
}
```
# Followers
## GET /service/author/{authorId}/followers/

```
HTTP 200 OK
Allow: GET, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "type": "Followers",
    "author": "6e603d57-a12e-4482-a6fb-4fa5e8a7b15a",
    "items": [
        "6443bb45-91d3-433c-9ff5-d152942308a8"
    ]
}
```

## POST /service/author/{authorId}/followers/unfollow/
Post format:
```

```
Returns
```
HTTP 200 OK
Allow: POST, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "Unfollowed successfully."
    ]
}
```
```
HTTP 404 Not Found
Allow: POST, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "User is not in following list."
    ]
}
```
# Following
## GET /service/author/{authorId}/following/

```
HTTP 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "type": "Following",
    "author": "6443bb45-91d3-433c-9ff5-d152942308a8",
    "items": [
        "6e603d57-a12e-4482-a6fb-4fa5e8a7b15a"
    ]
}
```
# Follow Requests
## GET /service/author/{authorId}/follow-request/

```
HTTP 200 OK
Allow: GET, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

[
    {
        "type": "FollowRequest",
        "summary": "testfollow1 wants to follow testfollow2.",
        "actor": {
            "type": "author",
            "id": "6e603d57-a12e-4482-a6fb-4fa5e8a7b15a",
            "url": "http://127.0.0.1:8000/service/authors/6e603d57-a12e-4482-a6fb-4fa5e8a7b15a",
            "host": "http://127.0.0.1:8000/",
            "displayName": "testfollow1",
            "github": "",
            "profileImage": ""
        },
        "object": {
            "type": "author",
            "id": "6443bb45-91d3-433c-9ff5-d152942308a8",
            "url": "http://127.0.0.1:8000/service/authors/6443bb45-91d3-433c-9ff5-d152942308a8",
            "host": "http://127.0.0.1:8000/",
            "displayName": "testfollow2",
            "github": "",
            "profileImage": ""
        }
    }
]
```

## GET /service/author/{authorId}/follow-request/{senderId}/

```
HTTP 200 OK
Allow: GET, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "type": "FollowRequest",
    "summary": "testfollow1 wants to follow testfollow2.",
    "actor": {
        "type": "author",
        "id": "6e603d57-a12e-4482-a6fb-4fa5e8a7b15a",
        "url": "http://127.0.0.1:8000/service/authors/6e603d57-a12e-4482-a6fb-4fa5e8a7b15a",
        "host": "http://127.0.0.1:8000/",
        "displayName": "testfollow1",
        "github": "",
        "profileImage": ""
    },
    "object": {
        "type": "author",
        "id": "6443bb45-91d3-433c-9ff5-d152942308a8",
        "url": "http://127.0.0.1:8000/service/authors/6443bb45-91d3-433c-9ff5-d152942308a8",
        "host": "http://127.0.0.1:8000/",
        "displayName": "testfollow2",
        "github": "",
        "profileImage": ""
    }
}
```

## GET/POST /service/author/{authorId}/follow-request/{senderId}/send/
On success
```
HTTP 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "type": "FollowRequest",
    "summary": "testfollow1 wants to follow testfollow2.",
    "actor": {
        "type": "author",
        "id": "6e603d57-a12e-4482-a6fb-4fa5e8a7b15a",
        "url": "http://127.0.0.1:8000/service/authors/6e603d57-a12e-4482-a6fb-4fa5e8a7b15a",
        "host": "http://127.0.0.1:8000/",
        "displayName": "testfollow1",
        "github": "",
        "profileImage": ""
    },
    "object": {
        "type": "author",
        "id": "6443bb45-91d3-433c-9ff5-d152942308a8",
        "url": "http://127.0.0.1:8000/service/authors/6443bb45-91d3-433c-9ff5-d152942308a8",
        "host": "http://127.0.0.1:8000/",
        "displayName": "testfollow2",
        "github": "",
        "profileImage": ""
    }
}
```
On fail
```
HTTP 400 Bad Request
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "Request already exists."
    ]
}
```

## GET/POST /service/author/{authorId}/follow-request/{senderId}/accept/
On success
```
HTTP 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "Follow request accepted."
    ]
}
```
If does not exist
```
HTTP 404 Not Found
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "Request does not exist."
    ]
}
```

## GET/POST /service/author/{authorId}/follow-request/{senderId}/decline/
On success
```
HTTP 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "Follow request declined."
    ]
}
```
If does not exist
```
HTTP 404 Not Found
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "Request does not exist."
    ]
}
```
# Posts
## GET /service/author/{authorId}/posts/

Returns a list of authorId's posts
```
HTTP 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "type": "posts",
    "items": [
        {
            "id": "da822edf-7ddd-4fe5-968b-5d65137d4f2c",
            "type": "post",
            "title": "The Title",
            "source": "http://www.thesourceurl.com",
            "origin": "http://www.theoriginurl.com",
            "description": "briefdescription",
            "contentType": "text/plain",
            "author": {
                "type": "author",
                "id": "6443bb45-91d3-433c-9ff5-d152942308a8",
                "url": "http://127.0.0.1:8000/service/authors/6443bb45-91d3-433c-9ff5-d152942308a8",
                "host": "http://127.0.0.1:8000/",
                "displayName": "testfollow2",
                "github": "",
                "profileImage": ""
            },
            "categories": null,
            "count": 0,
            "content": "the content of the post",
            "comments": null,
            "published": "2023-03-21T22:18:56.972384Z",
            "visibility": "PUBLIC",
            "unlisted": false
        }
    ]
}
```

## POST /service/author/{authorId}/posts/

Format:
```
{
    "title": "The Title",
    "source": "http://www.thesourceurl.com",
    "origin": "http://www.theoriginurl.com",
    "description": "briefdescription",
    "contentType": "text/plain",
    "content": "the content of the post",
    "categories": null,
    "visibility": "PUBLIC",
    "unlisted": false
}
```
Returns:
```
HTTP 201 Created
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "id": "da822edf-7ddd-4fe5-968b-5d65137d4f2c",
    "url": "http://127.0.0.1:8000/service/authors/6443bb45-91d3-433c-9ff5-d152942308a8/posts/da822edf-7ddd-4fe5-968b-5d65137d4f2c",
    "type": "post",
    "title": "The Title",
    "source": "http://www.thesourceurl.com",
    "origin": "http://www.theoriginurl.com",
    "description": "briefdescription",
    "contentType": "text/plain",
    "author": {
        "type": "author",
        "id": "6443bb45-91d3-433c-9ff5-d152942308a8",
        "url": "http://127.0.0.1:8000/service/authors/6443bb45-91d3-433c-9ff5-d152942308a8",
        "host": "http://127.0.0.1:8000/",
        "displayName": "testfollow2",
        "github": "",
        "profileImage": ""
    },
    "categories": null,
    "count": 0,
    "content": "the content of the post",
    "comments": null,
    "published": "2023-03-21T22:18:56.972384Z",
    "visibility": "PUBLIC",
    "unlisted": false
}
```

## GET /service/authors/a43dd7ba-12e9-4e38-ba9b-1baf2fb2291e/posts/public/?p=1&page_size=5

Gets the first page of public posts with a page size of 5. (defualt page size is 5)
```
HTTP 200 OK
Allow: GET, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "count": 6,
    "page": 1,
    "size": 5,
    "next": "http://127.0.0.1:8000/service/authors/a43dd7ba-12e9-4e38-ba9b-1baf2fb2291e/posts/public/?p=2",
    "previous": null,
    "posts": [
        {
            "id": "a8835c2a-87dc-4ec9-81f5-832e06fd8412",
            "type": "post",
            "title": "5",
            "source": "http://127.0.0.1:8000",
            "origin": "http://127.0.0.1:8000",
            "description": "",
            "contentType": "text/plain",
            "author": {
                "type": "author",
                "id": "a43dd7ba-12e9-4e38-ba9b-1baf2fb2291e",
                "url": "http://127.0.0.1:8000/service/authors/a43dd7ba-12e9-4e38-ba9b-1baf2fb2291e",
                "host": "http://127.0.0.1:8000/",
                "displayName": "test2",
                "github": "",
                "profileImage": ""
            },
            "categories": {},
            "count": 0,
            "content": "5",
            "comments": null,
            "published": "2023-03-13T04:52:57.692000Z",
            "visibility": "PUBLIC",
            "unlisted": false
        },
        ...
    ]
}
```

## GET /service/authors/a43dd7ba-12e9-4e38-ba9b-1baf2fb2291e/posts/feed/?p=1&page_count=5

Gets all of the posts of people that the user is following
```
HTTP 200 OK
Allow: GET, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "count": 1,
    "page": 1,
    "size": 5,
    "next": null,
    "previous": null,
    "posts": [
        {
            "id": "446f3d1f-05b3-433f-8812-c34545757502",
            "type": "post",
            "title": "this is a public test",
            "source": "https://en.wikipedia.org/wiki/Main_Page",
            "origin": "https://en.wikipedia.org/wiki/Main_Page",
            "description": "this is a test",
            "contentType": "text/plain",
            "author": {
                "type": "author",
                "id": "17a8616a-360a-4bbf-ae75-040cb98c25eb",
                "url": "http://127.0.0.1:8000/service/authors/17a8616a-360a-4bbf-ae75-040cb98c25eb",
                "host": "http://127.0.0.1:8000/",
                "displayName": "test1",
                "github": "",
                "profileImage": ""
            },
            "categories": null,
            "count": 0,
            "content": "this is a test",
            "comments": null,
            "published": "2023-03-13T04:02:15.540807Z",
            "visibility": "PUBLIC",
            "unlisted": false
        }
    ]
}
```
# Comments
## GET /service/author/{authorId}/posts/{postId}/comments/

```
HTTP 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "count": 1,
    "page": 1,
    "size": 5,
    "next": null,
    "previous": null,
    "comments": [
        {
            "id": "80ecb586-ae11-4322-8ddf-f46c5aeb99c9",
            "type": "comment",
            "author": {
                "type": "author",
                "id": "6443bb45-91d3-433c-9ff5-d152942308a8",
                "url": "http://127.0.0.1:8000/service/authors/6443bb45-91d3-433c-9ff5-d152942308a8",
                "host": "http://127.0.0.1:8000/",
                "displayName": "testfollow2",
                "github": "",
                "profileImage": ""
            },
            "comment": "this is a test comment by the author",
            "contentType": "text/plain",
            "published": "2023-03-21T22:31:50.032448Z",
            "count": 0,
            "post": "Post object (da822edf-7ddd-4fe5-968b-5d65137d4f2c)"
        }
    ]
}
```

## GET /service/author/{authorId}/posts/{postId}/comments/{commentId}/

```
HTTP 200 OK
Allow: GET, PUT, PATCH, DELETE, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "id": "80ecb586-ae11-4322-8ddf-f46c5aeb99c9",
    "type": "comment",
    "author": {
        "type": "author",
        "id": "6443bb45-91d3-433c-9ff5-d152942308a8",
        "url": "http://127.0.0.1:8000/service/authors/6443bb45-91d3-433c-9ff5-d152942308a8",
        "host": "http://127.0.0.1:8000/",
        "displayName": "testfollow2",
        "github": "",
        "profileImage": ""
    },
    "comment": "this is a test comment by the author",
    "contentType": "text/plain",
    "published": "2023-03-21T22:31:50.032448Z",
    "count": 0,
    "post": "Post object (da822edf-7ddd-4fe5-968b-5d65137d4f2c)"
}
```

## POST /service/author/{authorId}/posts/{postId}/comments/

Post format:
```
{
    "author": "{authorId of comment}",
    "comment": "comment content",
    "contentType": "text/plain"
}
```
On success returns:
```
HTTP 201 Created
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "id": "80ecb586-ae11-4322-8ddf-f46c5aeb99c9",
    "type": "comment",
    "author": {
        "type": "author",
        "id": "6443bb45-91d3-433c-9ff5-d152942308a8",
        "url": "http://127.0.0.1:8000/service/authors/6443bb45-91d3-433c-9ff5-d152942308a8",
        "host": "http://127.0.0.1:8000/",
        "displayName": "testfollow2",
        "github": "",
        "profileImage": ""
    },
    "comment": "this is a test comment by the author",
    "contentType": "text/plain",
    "published": "2023-03-21T22:31:50.032448Z",
    "count": 0,
    "post": "Post object (da822edf-7ddd-4fe5-968b-5d65137d4f2c)"
}
```

# Likes

## GET service/authors/{authorId}/posts/{postId}/likes/
Returns a list of likes
```
[
    {
        "context": "",
        "summary": "testlike2 liked your post",
        "type": "Like",
        "author": "69dc2090-aa0b-4acc-8b77-3b3711c7756c",
        "object": {
            "type": "post",
            "id": "1102fd2c-a143-49c6-9498-53dcd69c1be0"
        }
    }
    ...
]
```

## POST service/authors/{authorId}/posts/{postId}/like/
Post format:
```
{
    "author": "69dc2090-aa0b-4acc-8b77-3b3711c7756c"
}
```
Result on success:
```
HTTP 200 OK
Allow: POST, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "Liked post."
    ]
}
```
If already exists:
```
HTTP 400 Bad Request
Allow: POST, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "Request already exists."
    ]
}
```

## GET service/authors/{authorId}/posts/{postId}/comments/{commentId}/likes
Returns a list of likes
```
HTTP 200 OK
Allow: GET, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

[
    {
        "context": "",
        "summary": "testlike2 liked your comment",
        "type": "Like",
        "author": "69dc2090-aa0b-4acc-8b77-3b3711c7756c",
        "object": {
            "type": "comment",
            "id": "7e8b30e0-8f86-4b4a-b06b-a69fad06ca6e"
        }
    }
]
```

## POST service/authors/{authorId}/posts/{postId}/comments/{commentId}/like
Post format:
```

```
Result on success:
```
HTTP 200 OK
Allow: POST, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "Liked comment."
    ]
}
```
If already exists:
```
HTTP 400 Bad Request
Allow: POST, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "Request already exists."
    ]
}
```

# Liked

## GET /service/authors/{authorId}/liked/
Returns a list of objects liked by the author
```
HTTP 200 OK
Allow: GET, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "type": "liked",
    "author": "69dc2090-aa0b-4acc-8b77-3b3711c7756c",
    "items": [
        {
            "context": "",
            "summary": "testlike2 liked your post",
            "type": "Like",
            "author": "69dc2090-aa0b-4acc-8b77-3b3711c7756c",
            "object": {
                "type": "post",
                "id": "1102fd2c-a143-49c6-9498-53dcd69c1be0"
            }
        },
        {
            "context": "",
            "summary": "testlike2 liked your comment",
            "type": "Like",
            "author": "69dc2090-aa0b-4acc-8b77-3b3711c7756c",
            "object": {
                "type": "comment",
                "id": "7e8b30e0-8f86-4b4a-b06b-a69fad06ca6e"
            }
        }
    ]
}
```