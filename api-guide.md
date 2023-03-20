# API GUIDE

all api calls are directed to 127.0.0.1:8000/service/

## /service/users/

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
    "type": "author",
    "id": "42c49442-e641-407a-b20f-f05a3cc2bd7f",
    "url": "http://127.0.0.1:8000/service/authors/42c49442-e641-407a-b20f-f05a3cc2bd7f",
    "host": "http://127.0.0.1:8000/",
    "displayName": "kyle",
    "github": "",
    "profileImage": ""
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
    "type": "author",
    "id": "42c49442-e641-407a-b20f-f05a3cc2bd7f",
    "url": "http://127.0.0.1:8000/service/authors/42c49442-e641-407a-b20f-f05a3cc2bd7f",
    "host": "http://127.0.0.1:8000/",
    "displayName": "kyle",
    "github": "",
    "profileImage": ""
}
```
If not OK returns:
```
HTTP 400 Bad Request
Allow: POST, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "Wrong username or password."
    ]
}
```

## /service/users/{userId}/

- GET /service/users/{userId}/ will return
```
{
    "id": {userId},
    "username": "example_username",
    "email": "example_email"
}
```
There is also a decent chance that this GET functionality will be removed. Tell me if you want it to stay.

## /service/author/

Returns list of all authors

## /service/author/{authorId}/

Returns the author obj at authorId

## POST /service/users/{userId}/update_pass/

This is used to change the users password.  
Requires:
```
{
    "old_password": "this_must_be_correct",
    "new_passowrd": "new_pass"
}
```
Passwords are sent in plaintext then hashed on the serverside.

## /service/author/{authorId}/followers/

Return a list of authorId's followers

## /service/author/{authorId}/followers/{followerId}/unfollow

Returns
```
HTTP 200 OK
Allow: GET, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "detail": [
        "Unfollowed successfully."
    ]
}
```
Or 400 on failure

## /service/author/{authorId}/following/

Return a list of people that authorId is following

## /service/author/{authorId}/follow-request/

Return a list of follow requests sent to authorId

## /service/author/{authorId}/follow-request/{senderId}/

Return the follow request sent by senderId to authorId, or 404 if doesnt exist

## /service/author/{authorId}/follow-request/{senderId}/send/

Send follow request from senderId to authorId

## /service/author/{authorId}/follow-request/{senderId}/accept/

Accept follow request from senderId to authorId, this also deletes the request and adds the sender to the authors followers list

## /service/author/{authorId}/follow-request/{senderId}/decline/

## GET /service/author/{authorId}/posts/

Returns a list of authorId's posts

## POST /service/author/{authorId}/posts/

Format:
```
{
    "source": "",
    "origin": "",
    "description": "",
    "contentType": null,
    "author": null,
    "categories": null,
    "count": null,
    "comments": "",
    "published": null,
    "visibility": null,
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
    "results": [
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
    "comments": [
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

## /service/author/{authorId}/posts/{postId}/comments/

Can do get requests for both:  
/service/author/{authorId}/posts/{postId}/comments/  
/service/author/{authorId}/posts/{postId}/comments/{commendId}/  

## POST /service/author/{authorId}/posts/{postId}/comments/

Format:
```
{
    "author_id": "",
    "comment": "",
    "contentType": "",
    "published": "YYYY-MM-DD",
}
```