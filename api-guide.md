# API GUIDE

all api calls are directed to 127.0.0.1:8000/service/

## /service/users/

This is used to manage user accounts.  
- GET /service/users/ will return all users with some information  

I don't think this should ever be needed but I will leave it for now  

- POST /service/users/ will create a user if sent data is valid  

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
HTTP 200 OK
Allow: POST, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "type": "author",
    "id": "42c49442-e641-407a-b20f-f05a3cc2bd7f",
    "url": "",
    "host": "http://127.0.0.1:8000/",
    "displayName": "kyle",
    "github": "",
    "profileImage": ""
}
```
it is important to note that passwords are sent as raw strings, and then saved in the database after hashing.  

- POST /service/users/login/

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
    "url": "",
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

- POST /service/users/{userId}/change_pass/

This is used to change the users password.  
Requires:
```
{
    "old_password": "this_must_be_correct",
    "new_passowrd": "new_pass"
}
```
Passwords are sent in plaintext then hashed on the serverside.

## /service/author/

Returns list of all authors

## /service/author/{authorId}/

Returns the author obj at authorId

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

## /service/author/{authorId}/follow-request/

Return a list of follow requests sent to authorId

## /service/author/{authorId}/follow-request/{senderId}/

Return the follow request sent by senderId to authorId, or 404 if doesnt exist

## /service/author/{authorId}/follow-request/{senderId}/send/

Send follow request from senderId to authorId

## /service/author/{authorId}/follow-request/{senderId}/accept/

Accept follow request from senderId to authorId, this also deletes the request and adds the sender to the authors followers list

## /service/author/{authorId}/posts/

- POST

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

## /service/author/{authorId}/posts/{postId}/comments/

Can do get requests for both:
/service/author/{authorId}/posts/{postId}/comments/
/service/author/{authorId}/posts/{postId}/comments/{commendId}/

- POST /service/author/{authorId}/posts/{postId}/comments/

Format:
```
{
    "author_id": "",
    "comment": "",
    "contentType": "",
    "published": "YYYY-MM-DD",
}
```