import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from "../assets/copyright";
import { ButtonGroup, CardActionArea, IconButton, Modal, TextField, ToggleButtonGroup } from '@mui/material';
import { ClassNames } from '@emotion/react';
import { Form } from 'react-router-dom';
//import CommentPost from '../components/CommentPost';
import { useRef } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ToggleButton from '@mui/material/ToggleButton';
import { Author } from '../types/author';
import { number } from 'prop-types';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import GitHubCalendar from 'react-github-calendar';

import { TEAM7_API_URL, TEAM18_API_URL, OUR_API_URL } from '../consts/api_connections';
import { Post } from '../types/post';
import { minHeight, typography } from '@mui/system';
// import convertTeam18PostToOurPost from '../helper_functions/convertTeam18PostToOurPost';
const theme = createTheme();


const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: '#19191a',
    color: "white",
    border: '2px solid #000',
    borderRadius: "30px",
    boxShadow: 24,
    p: 4,
};
function convertTeam7PostToOurPost(obj: any): Post {
    const post: Post = {
        id: obj.id,
        url: obj.id,
        type: obj.type,
        title: obj.title,
        source: obj.source,
        origin: obj.origin,
        description: obj.description,
        contentType: obj.contentType,
        author: {
            type: obj.author.type,
            id: obj.author.id,
            url: obj.author.url,
            host: obj.author.host,
            displayName: obj.author.displayName,
            github: obj.author.github,
            profileImage: obj.author.profileImage,
        },
        categories: {},
        count: obj.commentCount,
        numLikes: obj.likeCount,
        content: obj.content,
        comments: obj.comments,
        published: obj.published,
        visibility: obj.visibility,
        unlisted: obj.unlisted,
    };
    return post;
}
function convertTeam18PostToOurPost(obj: any): Post {
    const post: Post = {
        id: obj.id,
        url: obj.url,
        type: obj.type,
        title: obj.title,
        source: obj.source,
        origin: obj.origin,
        description: obj.description,
        contentType: obj.content_type,
        author: {
            type: obj.author.type,
            id: obj.author.id,
            url: obj.author.url,
            host: obj.author.host,
            displayName: obj.author.displayName,
            github: obj.author.github,
            profileImage: obj.author.profile_image,
        },
        categories: {},
        count: obj.count,
        numLikes: obj.likes.length,
        content: obj.content,
        comments: obj.comments,
        published: obj.published,
        visibility: obj.visibility,
        unlisted: obj.unlisted,
    };
    return post;
}
type FilterPostsType = 'all' | 'friends' | 'private';

export default function Album() {
    // console.log("LOCAL STORAGE IN FEED:")
    // console.log(localStorage.getItem('user'))
    const [friends, setFriends] = React.useState([]);
    const [posts, setPosts] = React.useState([]);
    const [filterPosts, setFilterPosts] = React.useState<FilterPostsType>('all');
    const [gitHubUsername, setgitHubUsername] = React.useState('');
    const [gitHubClicked, setgitHubClicked] = React.useState();
    const user = JSON.parse(localStorage.getItem('user')!);
    const USER_ID = localStorage.getItem('USER_ID');
    const token = JSON.parse(localStorage.getItem('token')!);

    const postsRef = React.useRef(null);
    const navigate = useNavigate();
    const [commentValue, setCommentValue] = React.useState('');
    const [clickedLike, setClickedLike] = React.useState(false);//const for like button before and after click
    //const for whether or not the user has liked the author's post
    const [clickedCommentLike, setClickedCommentLike] = React.useState(false);//const for comment like button before and after click
    const refreshPage = () => {
        if (localStorage.getItem('refreshed') === 'false') {
            localStorage.setItem('refreshed', 'true');
            window.location.reload(true);
        }
    }

    React.useEffect(() => {
        refreshPage();
        console.log("Reached ADAD")
        // console.log(localStorage.getItem('USER_ID'));
        const getOurAuthors = axios.get(`${OUR_API_URL}service/authors/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        // Get user friends
        // axios.get(`${OUR_API_URL}service/authors/${USER_ID}/friends/`, {
        //     headers: {
        //         'Authorization': `Token ${token}`
        //     }
        // }).then(response => {
        //     console.log("GET OUR FRIENDS RESPONSE:", response)
        //     console.log(response.data.items.map(item => item.toString().split("/").pop()));
        //     setFriends(response.data.items.map(item => item.toString().split("/").pop()));
        // }).catch(error => {
        //     console.log("GET OUR FRIENDS ERROR:", error)
        // });
        //Test our feed
        const getOurFeed = axios.get(`${OUR_API_URL}service/authors/${USER_ID}/posts/feed/?page_size=999`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        // const getGitHub = () => {
        //     // const user = JSON.parse(localStorage.getItem('user')!);
        if (user.github) {
            setgitHubUsername(user.github.split('/')[3]);
            setgitHubClicked(true);
            console.log('OLD GITHUB: ' + gitHubUsername);
        }
        else {
            setgitHubClicked(false);
        }

        const handleGitHub = () => {
            console.log("USERNAME: " + gitHubUsername)
            axios.put(`${OUR_API_URL}service/authors/${USER_ID}/`, {
                type: "author",
                id: `${user.id}`,
                url: `https://social-distribution-group21.herokuapp.com/service/authors/"${user.id}`,
                host: "https://social-distribution-group21.herokuapp.com/",
                displayName: user.displayName,
                github: `https://github.com/${gitHubUsername}`,
                profileImage: "",
            }, {
            headers: {
                'Authorization': `Token ${token}`
            }
            }).then((response) => {
                console.log("MAKE PUT RESPONSE:", response);
                localStorage.setItem('gitHub', 'false');
            }).catch((error) => { console.log("MAKE PUT ERROR:", error); })
        }

        const getAuthorPosts = axios.get(`${OUR_API_URL}service/authors/${USER_ID}/posts/feed/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        const getTeam18Authors = axios.get(`${TEAM18_API_URL}service/authors`)
            .then(response => {
                console.log("GET GROUP 18 Authors RESPONSE:", response);
                const team18Authors = response.data.items.map(item => item.id.toString().split("/").pop());
                console.log("TEAM 18 AUTHORS:", team18Authors);
                return team18Authors;
            });


        const getTeam18Posts = (authorId) => axios.get(`${TEAM18_API_URL}service/authors/${authorId}/posts/`)
            .then(response => {
                console.log("GET GROUP 18 POSTS RESPONSE:", response);
                const team18Posts = response.data.items.map(item => convertTeam18PostToOurPost(item));
                console.log("TEAM 18 POSTS:", team18Posts);
                return team18Posts;
            });

        const getTeam7Authors = axios.get(`${TEAM7_API_URL}authors/`, {
            headers: {
                'Authorization': 'Basic ' + btoa('node01:P*ssw0rd!')
            }
        }).then(response => {
            console.log("GET GROUP 7 AUTHORS RESPONSE:", response);
            const team7Authors = response.data.items.map(item => item.id.toString().split("/").pop());
            console.log("TEAM 7 AUTHORS:", team7Authors);
            return team7Authors;
        }).catch(error => {
            console.log("Get Group 7 authors ERROR", error);
        });
        const getTeam7Posts = (authorId) => axios.get(`${TEAM7_API_URL}authors/${authorId}/posts/`, {
            headers: {
                'Authorization': 'Basic ' + btoa('node01:P*ssw0rd!')
            }
        })
            .then(response => {
                console.log("GET GROUP 7 POSTSSS RESPONSE:", response);
                const team7Posts = response.data.items.map(item => convertTeam7PostToOurPost(item));
                console.log("164 TEAM 7 POSTS:", team7Posts);
                return team7Posts;
            });
        axios.get(`${TEAM7_API_URL}authors/80e83b86-0d26-4189-b68a-bf57e8c87af1/posts/`, {
            headers: {
                'Authorization': 'Basic ' + btoa('node01:P*ssw0rd!')
            }
        }).then(response => {
            console.log("GET GROUP 7 POSTT TESTTT RESPONSE:", typeof (response), response);
        }).catch(error => {
            console.log("Get Group 7 POST TEST ERROR", error);
        });

        // const getTeam7Posts = axios.get(`${TEAM7_API_URL}authors/d3bb924f-f37b-4d14-8d8e-f38b09703bab/posts/1629b94f-04cc-459e-880e-44ebe979fb7e/`, {
        //     headers: {
        //         'Authorization': 'Basic ' + btoa('node01:P*ssw0rd!')
        //     }
        // }).then(response => {
        //     console.log("GET GROUP 7 POSTS RESPONSE:", response);
        //     const team7Post = convertTeam7PostToOurPost(response.data);
        //     console.log("TEAM 7 POSTS:", team7Post);
        //     return team7Post;
        // }).catch(error => {
        //     console.log("ERROR", error);
        // });

        // Promise.all([getOurFeed]).then(responses => {
        //     const ourPosts = responses[0].data.items;
        //     console.log("IN FIRST PROMISE AUTHORS", authors);
        // });


        Promise.all([getOurFeed, getTeam18Authors, getTeam7Authors])
            .then(responses => {
                const ourPosts = responses[0].data.posts;
                console.log("IN FIRST PROMISE OUR POSTS", ourPosts)
                const team18Authors = responses[1];
                const team7Authors = responses[2];
                console.log("IN SECOND PROMISE", ourPosts, team18Authors, team7Authors);
                const team18PostsPromises = team18Authors.filter(author => author.length === 32).map(author => getTeam18Posts(author));
                const team7PostsPromises = team7Authors.filter(author => author.length === 36).map(author => getTeam7Posts(author));

                return Promise.all([...team18PostsPromises, ...team7PostsPromises])
                    .then(allPostsArrays => {
                        const team18Posts = [].concat(...allPostsArrays.slice(0, team18PostsPromises.length));
                        const team7Posts = [].concat(...allPostsArrays.slice(team18PostsPromises.length));

                        // Set friends here:
                        axios.get(`${OUR_API_URL}service/authors/${USER_ID}/friends/`, {
                            headers: {
                                'Authorization': `Token ${token}`
                            }
                        }).then(response => {
                            console.log("GET OUR FRIENDS RESPONSE:", response);
                            console.log(response.data.items.map(item => item.toString().split("/").pop()));
                            setFriends(response.data.items.map(item => item.toString().split("/").pop()));
                            // ourPosts.forEach(post => {
                            //     console.log("POST VIS:", post.visibility,typeof(post.visibility));
                            //     if (post.visibility === "PRIVATE") {
                            //         console.log("PRIVATE POST:", post);
                            //     }
                            // });
                            const filteredPosts = ourPosts.concat(team18Posts, team7Posts)
                                .filter(post => post.visibility === "PUBLIC" || ((post.visibility === "PRIVATE" || post.visibility =="FRIENDS") && !friends.includes(post.author.id.split("/").pop())));
                            console.log("AUTHOR POSTS:", ourPosts);
                            console.log("TEAM 18 POSTS:", team18Posts);
                            console.log("TEAM 7 POSTS:", team7Posts);
                            console.log("ALL POSTS:", ourPosts.concat(team18Posts, team7Posts));
                            console.log("FILTERED POSTS:", filteredPosts);
                            function diffPostsArray(arr1: Post[], arr2: Post[]): Post[] {
                                const ids2 = new Set(arr2.map(post => post.id));
                                return arr1.filter(post => !ids2.has(post.id));
                              }
                            console.log("DIFFERENT POSTS:", diffPostsArray(ourPosts.concat(team18Posts, team7Posts), filteredPosts));
                            setPosts(filteredPosts);
                        }).catch(error => {
                            console.log("GET OUR FRIENDS ERROR:", error);
                        });

                    }).catch(error => {
                        console.log("IN POSTS PROMISES ERROR", error);
                    });
            }).catch(error => {
                console.log("IN LAST PROMISE ERROR", error);
            });
    }, [gitHubUsername]);

    const handleDelete = (clickedPost: { id: any; } | null) => {
        // clickedPost.preventDefault();
        console.log(JSON.parse(localStorage.getItem('user')!).id)
        // console.log(clickedPost.id);

        axios.delete(`http://127.0.0.1:8000/service/authors/${(JSON.parse(localStorage.getItem('user')!).id)}/posts/${clickedPost.id}/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then((response) => {
                console.log("MAKE DELETE RESPONSE:", response);
            }).catch((error) => { console.log("MAKE DELETE ERROR:", error); })
    };

    const handleGitHub = () => {
        console.log("USERNAME: " + gitHubUsername)
        axios.put(`${OUR_API_URL}service/authors/${USER_ID}/`, {
            type: "author",
            id: `${user.id}`,
            url: `https://social-distribution-group21.herokuapp.com/service/authors/"${user.id}`,
            host: "https://social-distribution-group21.herokuapp.com/",
            displayName: user.displayName,
            github: `https://github.com/${gitHubUsername}`,
            profileImage: "",
        }, {
        headers: {
            'Authorization': `Token ${token}`
        }
        }).then((response) => {
            console.log("MAKE PUT RESPONSE:", response);
            localStorage.setItem('gitHub', 'false');
            user.github = `https://github.com/${gitHubUsername}`;
        }).catch((error) => { console.log("MAKE PUT ERROR:", error); })
    }

    const handleLike = (clickedPost: { id: any; } | null) => {
        //use POST service/authors/{authorId}/posts/{postId}/like/ to add likes to post
        console.log(JSON.parse(localStorage.getItem('user')!).id)
        console.log("THIS IS THE CLICKED POST ID", clickedPost.id.split("/").pop());
        console.log(clickedPost);
        console.log(clickedPost?.author?.id.split("/").pop());
        console.log("THIS IS THE PERSON LIKING THE POST", user.id.split("/").pop());
        axios.post(`${OUR_API_URL}service/authors/${clickedPost?.author?.id.split("/").pop()}/posts/${clickedPost.id.split("/").pop()}/like/`, {
            author: user.id.split("/").pop(),
            },
            {
                headers: {
                    'Authorization': `Token ${token}`
                }
            }
            )
        .then((response) => {
            console.log("MAKE LIKE RESPONSE:", response);
            handleCommentPageChange(null, commentPage);
        }).catch((error) => { console.log("MAKE LIKE ERROR:", error); })
    };
    const handleCommentLike = (clickedPost: { id: any; } | null, clickedComment: {id : any;}) => {
        //use POST service/authors/{authorId}/posts/{postId}/comments/{commentId}/like/ to add likes to comment
        // console.log(JSON.parse(localStorage.getItem('user')!).id)
        // console.log("CLICKED COMMENTS", clickedComment.split("/").pop());
        axios.post(`${OUR_API_URL}service/authors/${clickedPost?.author?.id.split("/").pop()}/posts/${clickedPost.id.split("/").pop()}/comments/${clickedComment.split("/").pop()}/like/`, {
        },
        {
            headers: {
                'Authorization': `Token ${token}`
            }
        }
        )
        .then((response) => {
            console.log("MAKE COMMENT LIKE RESPONSE:", response);
        }).catch((error) => { console.log("MAKE COMMENT LIKE ERROR:", error); })
    };
    //commentListDummy contains all parameters for a comment
    const commentListDummy = [{id: '', comment: '', contentType: '', published: '', author: '', post_id: '', numlikes: number}];
    var [actualComments, setActualComments] = React.useState(commentListDummy);
    //commentCount is the number of comments for a post
    var [commentCount, setCommentCount] = React.useState(0);
    //commentPage is the page number of comments for a post
    const [commentPage, setCommentPage] = React.useState(1);

    //list for checking if a comment is liked by the user

    var commentLiked = Array(0,0,0,0,0);
    console.log("COMMENT LIKED", commentLiked);
    var commentIdListdummy = [{id: ''}]
    var [commentIdList, setCommentIdList] = React.useState(commentIdListdummy);

    var displayCommentsDummy = [{id: '', comment: '', liked: 0}]
    var displayComments = React.useState(displayCommentsDummy);
    
    //const for comments list for each post  
    const commentList = (clickedPost: { id: any; } | null, page: number) => {
        //use GET service/authors/{authorId}/posts/{postId}/comments/ to get comments for post
        //console.log(JSON.parse(localStorage.getItem('user')!).id)
        // console.log("THIS IS THE CLICKED POST AUTHOR ID", clickedPost?.author?.id.split("/").pop());
        // console.log("THIS IS THE CLICKED POST ID", clickedPost.id.split("/").pop());
        // console.log("THIS IS THE CLICKED POST", clickedPost)
        // console.log("THIS IS THE USER ID", user.id)
        // console.log("THIS IS THE COMMENT PAGE", page)

        axios.get(`${OUR_API_URL}service/authors/${clickedPost?.author?.id.split("/").pop()}/posts/${clickedPost.id.split("/").pop()}/comments/?p=${commentPage}`, {            
            headers: {
                'Authorization': `Token ${token}`
            }
        }
        )
        .then((response) => {
            console.log("GET COMMENTS RESPONSE:", response);
            // return response.data.items;
            // put data in a list
            const commentsList = response.data.comments;
            // console.log("COMMENTS LIST:", commentsList);
            // console.log("DATA COUNT:", response.data.count);
            setCommentCount(response.data.count);
            // console.log("COMMENTS LIST LENGTH:", commentsList.length);
            
            
            //map the list of comments to get a list of comment ids and put them in a list
            const commentIds = commentsList.map((comment: { id: any; }) => comment.id.split("/").pop());
            setCommentIdList(commentIds);
            console.log("COMMENT IDS:", commentIds);
            // console.log("COMMENT IDS:", commentIds);
            // for every comment in the list, check if the user has liked it using checkCommentLike
            for (let i = 0; i < commentIds.length; i++) {
                // if (checkCommentLike(actualComments[i])) {
                //     console.log("USER HAS LIKED THIS COMMENT", actualComments[i]);
                // }
                // console.log("THIS IS THE POST ID FOR THE COMMENT", clickedPost.id.split("/").pop());
                // console.log("THIS IS THE AUTHOR ID FOR THE COMMENT", clickedPost?.author?.id.split("/").pop());
                checkCommentLike(commentIds[i], clickedPost, i)
                console.log("This is the first comment list", commentsList[i]); 
                // commentsList[i].liked = commentLiked[i];  
                // commentsList[i].liked = 1;     
                console.log("This is the actual second comment list", commentsList[i]); 
                //get just the comment from actual comments and put it in a new list
                // const displayComments = actualComments.map((comment: { comment: any; }) => comment.comment);
                // console.log("DISPLAY COMMENTS", displayComments);

                // console.log("checkcommentslikes", checkCommentLike(commentIds[i], clickedPost));
                // console.log("ACTUAL COMMENTS", commentIds[i]);
                // setDisplayComments[i].liked = checkCommentLike(commentIds[i], clickedPost)
                // add 
            }
            setActualComments(commentsList);
            return commentsList;
        }).catch((error) => { console.log("GET COMMENTS ERROR:", error); })
    };
    //handleComment takes two arguments: the post that the comment is being made on, and the comment itself
    const handleComment = (clickedPost: { id: any; } | null, commentValue: string) => {
        //use POST service/authors/{authorId}/posts/{postId}/comments/ to add comments to post
        // console.log(JSON.parse(localStorage.getItem('user')!).id)
        // console.log("THIS IS THE CLICKED POST AUTHOR ID", clickedPost?.author?.id.split("/").pop());
        // console.log("THIS IS THE BIG AUTHOR ID", user.id);
        // console.log("POST ID:", clickedPost.id.split("/").pop());
        // console.log("COMMENT VALUE:", commentValue);
        //console log for the axios statement
        // console.log("AXIOS: ", OUR_API_URL, "service/authors/", clickedPost?.author?.id.split("/").pop(), "/posts/", clickedPost.id.split("/").pop(), "/comments/")
        
        axios.post(`${OUR_API_URL}service/authors/${clickedPost?.author?.id.split("/").pop()}/posts/${clickedPost.id.split("/").pop()}/comments/`, {
            comment: commentValue,
            contentType: "text/plain",
            },
            {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })
        .then((response) => {
            console.log("MAKE COMMENT RESPONSE:", response);
            console.log("COMMENT VALUE:", commentValue);
            handleCommentPageChange(null, 1);
        }).catch((error) => { console.log("MAKE COMMENT ERROR:", error); })
    };

    const handleCommentPageChange = (event, page: number) => {
        // console.log("THIS IS THE PAGE", page);
        // console.log("THIS IS THE COMMENT PAGE", commentPage);
        setCommentPage(page);
        // console.log("THIS IS THE PAGE", page);
        // console.log("THIS IS THE COMMENT PAGE", commentPage);
    };

    React.useEffect(() => {
        if (selectedPost) {
            commentList(selectedPost, commentPage);
        }
    }, [commentPage]);

    //const for checking if the user has liked a post
    const checkLike = (clickedPost: { id: any; } | null) => {
        //use GET service/authors/{authorId}/posts/{postId}/likes/ to check if user has liked post
        // console.log(JSON.parse(localStorage.getItem('user')!).id)
        // console.log("THIS IS THE CLICKED POST AUTHOR ID", clickedPost?.author?.id.split("/").pop());
        // console.log("THIS IS THE CLICKED POST ID", clickedPost.id.split("/").pop());
        axios.get(`${OUR_API_URL}service/authors/${clickedPost?.author?.id.split("/").pop()}/posts/${clickedPost.id.split("/").pop()}/likes/`, {
            headers: {
                'Authorization': `Token ${token}`
                }
            }
        )
        .then((response) => {
            //if the response.data does not contain the user id, then the user has not liked the post
            // console.log("CHECK LIKE RESPONSE:", response);
            // console.log("LIKES LIST:", response.data);
            //map response data into a list
            const authorIds = response.data.map(item => item.author.id);
            // console.log("AUTHOR IDS:", authorIds);
            const authorsList = authorIds.map(item => item.split("/").pop());
            // console.log("AUTHORS LIST:", authorsList);
            // console.log("USER ID:", user.id.split("/").pop());
            //if authorsList contains the user id, then the user has liked the post
            if (authorsList.includes(user.id.split("/").pop())) {
                console.log("USER HAS LIKED POST");
                setClickedLike(true);
            }
            else {
                console.log("USER HAS NOT LIKED POST");
                setClickedLike(false);
            }
        }).catch((error) => { console.log("CHECK LIKE ERROR:", error); })
    };

    //const for checking if the user has liked a comment
    const checkCommentLike = (clickedComment: { id: any; } | null, clickedPost: { id: any; } | null, index: number) => {
        //use GET service/authors/{authorId}/posts/{postId}/comments/{commentId}/likes/ to check if user has liked comment
        // console.log(JSON.parse(localStorage.getItem('user')!).id)
        // console.log("THIS IS THE CLICKED POST AUTHOR ID", clickedPost?.author?.id.split("/").pop());
        //console.log("THIS IS THE CLICKED COMMENT ID", clickedComment.id.split("/").pop());
        // console.log("AXIOS: ", OUR_API_URL, "service/authors/", clickedPost?.author?.id.split("/").pop(), "/posts/", clickedPost.id.split("/").pop(), "/comments/", clickedComment, "/likes/");
        axios.get(`${OUR_API_URL}service/authors/${clickedPost?.author?.id.split("/").pop()}/posts/${clickedPost.id.split("/").pop()}/comments/${clickedComment}/likes/`, {
            //console log for axios statement
            headers: {
                'Authorization': `Token ${token}`
                }
            }
        )
        .then((response) => {
            //if the response.data does not contain the user id, then the user has not liked the comment
            // console.log("CHECK COMMENT LIKE RESPONSE:", response);
            // console.log("LIKES LIST:", response.data);
            //map response data into a list
            const authorIds = response.data.map(item => item.author.id);
            // console.log("AUTHOR IDS:", authorIds);
            const authorsList = authorIds.map(item => item.split("/").pop());
            // console.log("AUTHORS LIST:", authorsList);
            // console.log("USER ID:", user.id.split("/").pop());
            //if authorsList contains the user id, then the user has liked the comment
            if (authorsList.includes(user.id.split("/").pop())) {
                console.log("USER HAS LIKED COMMENT", clickedComment);
                commentLiked[index] = 1;
                // displayComments[index].liked = 1;
                // console.log("displayComments[index]:", displayComments[index]);
                console.log("COMMENT LIKED:", commentLiked);
                return true;
            }
            else {
                console.log("USER HAS NOT LIKED COMMENT", clickedComment);
                return false;
            }
        }).catch((error) => { console.log("CHECK COMMENT LIKE ERROR:", error); })
    };

    
    // //promose.all for checking if the user has liked a comment
    // Promise.all([commentList, checkCommentLike, checkLike]).then((values) => {
    //     console.log("PROMISE ALL:", values);
    // });

    const [open, setOpen] = React.useState(false);
    const [selectedPost, setSelectedPost] = React.useState(null);
    const handleOpen = (clickedPost: React.SetStateAction<null>) => {
        var commentsList;
        checkLike(clickedPost);
        setOpen(true);
        setCommentPage(1);
        setSelectedPost(clickedPost);
        commentList(clickedPost, 1);
        console.log("ACTUAL COMMENTS:", actualComments);
        // displayList = [{actualComments}, {commentLiked}];
        // console.log("DISPLAY LIST:", displayList);
        // // console log for first element of displayList
        // console.log("ACTUAL COMMENTS:", displayList[0].actualComments);
        // // console log for second element of displayList
        // console.log("COMMENT LIKED:", displayList[1].commentLiked);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedPost(null);
        setActualComments(commentListDummy);
        setCommentCount(0);
        setCommentPage(1);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container sx={{ pt: 5 }}>
                <main>
                    <Box sx={{ borderBottom: 1, borderColor: 'grey.500' }}>
                        <Container maxWidth="lg">
                            <Stack
                                sx={{ pb: 2 }}
                                direction="row"
                                spacing={15}
                                justifyContent="center"
                            >
                                <Stack
                                    sx={{ pt: 4 }}
                                    direction="column"
                                    spacing={0}
                                    justifyContent="center"
                                >
                                    <Typography
                                        component="h1"
                                        variant="h2"
                                        align="left"
                                        color="text.primary"
                                        pt={8}
                                        gutterBottom
                                    >
                                        Welcome {user.displayName || "User"}!
                                    </Typography>
                                    <Typography variant="h6" align="left" paddingLeft={5} color="text.secondary" paragraph>
                                        This is your <em>dashboard</em>. View public posts here or publish your own!
                                    </Typography>
                                        {gitHubClicked 
                                            ?
                                            <GitHubCalendar username={gitHubUsername} />
                                            :
                                            <Stack
                                                // sx={{ pt: 20 }}
                                                direction="row"
                                                spacing={2}
                                                justifyContent="center"
                                            >
                                                <TextField
                                                    fullWidth
                                                    id="github username"
                                                    label="GitHub Username"
                                                    name="github username"
                                                    autoComplete="github username"
                                                    onChange={(e) => { setgitHubUsername(e.target.value) }}
                                                />
                                                <Button 
                                                    // type="submit"
                                                    variant="outlined"
                                                    onClick={handleGitHub}
                                                    // onClick={() => {
                                                    //     handleGitHub();
                                                    // }}
                                                >
                                                    Add your GitHub activity!
                                                </Button>
                                            </Stack>
                                        }     
                                </Stack>
                                <Stack
                                    sx={{ pt: 20 }}
                                    direction="row"
                                    spacing={2}
                                    justifyContent="center"
                                >
                                    <FormControl variant="outlined" sx={{ minWidth: 150 }} >
                                        <InputLabel id="filter-posts-label">Filter</InputLabel>
                                        <Select
                                            labelId="filter-posts-label"
                                            id="filter-posts"
                                            onChange={(event) => setFilterPosts(event.target.value.toString().toLowerCase())}
                                            label="Filter"
                                            defaultValue={"all"}
                                        >
                                            <MenuItem value="all">All</MenuItem>
                                            <MenuItem value="friends">Friends</MenuItem>
                                            <MenuItem value="private">Private</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button variant="contained" href='./NewPost' startIcon={<AddIcon />} style={{maxHeight: '75px'}}>New Post</Button>
                                </Stack>
                            </Stack>
                        </Container>
                    </Box>


                    <Container sx={{ py: 8 }} maxWidth="lg">
                        {/* End hero unit */}
                        <Grid container spacing={4}>
                            {posts?.filter(post => {
                                if (filterPosts === "all") {
                                    return true;
                                }
                                else if (filterPosts === "friends") {
                                    //console.log("IN FILTER", friends, "AND", post.author.id.split("/").pop())
                                    return friends.includes(post.author.id.split("/").pop());
                                }
                            }
                            ).map((post) => (
                                <Grid item key={post} md={3}>
                                    <Card
                                        sx={{ height: "100%", display: 'flex', flexDirection: 'column', maxHeight: "390px" }}
                                        variant="outlined"
                                        color='#09bef0'
                                    >
                                        <CardActionArea
                                            onClick={() => handleOpen(post)}>
                                            <CardContent sx={{ flexGrow: 1, bottom: "2px" }}>
                                                <Typography gutterBottom variant="h6" component="h1">
                                                    <b>{post.title}</b>
                                                </Typography>
                                                <Typography gutterBottom variant="subtitle2" component="h3">
                                                    {post.author.displayName}
                                                </Typography>
                                                <Typography gutterBottom variant="subtitle1" component="h3">
                                                    {post.description}
                                                </Typography>
                                                <Typography gutterBottom variant="caption" component="h3">
                                                    {post.numLikes}{" likes"}
                                                </Typography>
                                                <Typography gutterBottom variant="caption" component="h3">
                                                    {post.count}{" comments"}
                                                </Typography>
                                            </CardContent>
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    // 16:9
                                                    pt: '0%',
                                                }}
                                                // image="https://source.unsplash.com/random"
                                                image="https://imgs.search.brave.com/QN5ZdDJqJOAbe6gdG8zLNq8JswG2gpccOqUKb12nVPg/rs:fit:260:260:1/g:ce/aHR0cHM6Ly93d3cu/YmlpYWluc3VyYW5j/ZS5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMTUvMDUvbm8t/aW1hZ2UuanBn"
                                                alt="random"
                                            />
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Modal
                            open={selectedPost}
                            // sx={{overflow: scroll}}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-content"
                        >
                            {/* <div> */}
                            <Box sx={modalStyle}>
                                <Stack
                                    sx={{ pb: 2 }}
                                    direction="row"
                                    spacing={10}
                                    justifyContent="start"
                                >
                                    <Stack
                                        sx={{ pb: 2 }}
                                        direction="column"
                                        spacing={3}
                                        justifyContent="start"
                                        marginRight={10}
                                        paddingLeft={3}
                                    >
                                        {/* <Container> */}
                                        <Typography id="modal-muthor" variant="h6" component="h2" paddingBottom={2} top={0}>
                                            Post Author: <em>{selectedPost?.author?.displayName ?? 'No author'}</em>
                                        </Typography>
                                        <Typography id="modal-title" variant="h4" component="h2">
                                            <b>{selectedPost?.title ?? 'No title'}</b>
                                        </Typography>
                                        <Typography id="modal-modal-content" sx={{ mt: 2 }}>
                                            {selectedPost?.content ?? 'No content'}
                                        </Typography>
                                        <Typography id="modal-modal-source" sx={{ mt: 2 }}>
                                            Source (for proving ): {selectedPost?.source ?? 'No source'}
                                        </Typography>
                                        <Typography id="modal-modal-source" sx={{ mt: 2 }}>
                                            Visibility: {selectedPost?.visibility ?? 'No vis'}
                                        </Typography> 
                                        <Container
                                            maxWidth="md"
                                            component="footer"
                                            sx={{
                                                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                                                py: [3, 1],
                                                borderColor: 'white',
                                            }}
                                            >
                                        </Container>
                                        <Container>                                              
                                            <IconButton
                                                sx={{color : 'red'}}
                                                aria-label="add to favorites"
                                                edge="start"
                                                onClick={() => {
                                                    handleLike(selectedPost);
                                                    setClickedLike(!clickedLike);
                                                }}                                        
                                            >  
                                                {clickedLike ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                            </IconButton>
                                        </Container>
                                        {/* </Container> */}
                                        <Box component="form" noValidate
                                            sx={{ mt: 3 }}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    // make background white
                                                    sx={{ bgcolor: '#19191a', borderRadius: 0, borderColor: 'grey.500', borderWidth: 1, borderStyle: 'solid', 
                                                        '& .MuiInputBase-input': {
                                                        color: 'white'
                                                      },
                                                        '& .MuiInputLabel-root': {
                                                        color: 'white'
                                                        },
                                                    }}
                                                    id="CommentId"
                                                    label="Add a comment!"
                                                    multiline
                                                    rows={2}
                                                    defaultValue="Default Value"
                                                    value = {commentValue}
                                                    variant="outlined"
                                                    onChange={(e) => setCommentValue(e.target.value)}
                                                />
                                            </Grid>
                                            <Button
                                                sx={{ marginLeft: 0, marginTop: 1, marginBottom: 3, bgcolor: '#19191a', borderRadius: 0, 
                                                borderColor: 'grey.500', borderWidth: 1, borderStyle: 'solid',                                                    
                                                }}
                                                type="button"
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                onClick={()=> 
                                                    handleComment(selectedPost, commentValue)
                                                }                                                    
                                            >
                                                Submit comment
                                            </Button>

                                            <Typography id="modal-modal-content" sx={{ mt: 2 }}>
                                                {"Comments:"}
                                            </Typography>
                                        </Box>
                                        
                                        
                                    </Stack>
                                    {/* <Box
                                        component="img"
                                        sx={{
                                            height: 300,
                                            width: 300
                                        }}
                                        // display="flex"
                                        // justifyItems="right"
                                        alt="Post Picture"
                                        src="https://imgs.search.brave.com/QN5ZdDJqJOAbe6gdG8zLNq8JswG2gpccOqUKb12nVPg/rs:fit:260:260:1/g:ce/aHR0cHM6Ly93d3cu/YmlpYWluc3VyYW5j/ZS5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMTUvMDUvbm8t/aW1hZ2UuanBn"
                                    /> */}
                                    {USER_ID === selectedPost?.author?.id.split("/").pop() ?
                                        <Stack
                                            // justifyItems={"end"}
                                            //sx={{ right:0, top: 0}}
                                            sx={{ position: "flex", top: 5 }}
                                            direction="column"
                                            spacing={2}
                                            justifyContent="front"
                                        >

                                            <Button
                                                type="submit"
                                                color='error'
                                                variant="contained"
                                                onClick={() => {
                                                    handleDelete(selectedPost);
                                                    handleClose();
                                                    window.location.reload(true);
                                                }}
                                                sx={{ height: 50, width: 100 }}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                type="submit"
                                                href='./EditPost'
                                                variant="outlined"
                                                sx={{ height: 50, width: 100 }}
                                                onClick={() => localStorage.setItem('post_id', JSON.stringify(selectedPost))}
                                            >
                                                Edit
                                            </Button>
                                            {/* <Container>                                              
                                                <IconButton
                                                    sx={{color : 'red'}}
                                                    aria-label="add to favorites"
                                                    onClick={() => {
                                                        handleLike(selectedPost);
                                                        setClickedLike(!clickedLike);
                                                    }}                                        
                                                >  
                                                    {clickedLike ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                </IconButton>
                                            </Container> */}

                                        </Stack>
                                        : null}
                                        {/* <Container>                                              
                                                <IconButton
                                                    sx={{color : 'red'}}
                                                    aria-label="add to favorites"
                                                    onClick={() => {
                                                        handleLike(selectedPost);
                                                        setClickedLike(!clickedLike);
                                                    }}                                        
                                                >  
                                                    {clickedLike ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                </IconButton>
                                            </Container> */}
                                </Stack>
                                

                                {actualComments.length === 0 ? 
                                    <Typography id="modal-modal-content" sx={{ mt: 0, paddingLeft:5 }}>
                                        {"No comments yet!"}
                                    </Typography>
                                : null}
                                {actualComments.length > 0 ?
                                    <Container>
                                        {/* toggleButtonGroup that has options depending on actualComments.length */}
                                        <ToggleButtonGroup 
                                            sx={{bgcolor: '#19191a', color: 'white', height: 25, borderRadius: 2, borderColor: '#19191a', borderStyle: 'solid', paddingBottom:3,                                       
                                            '& .MuiToggleButton-root': {
                                                color: 'white',
                                                borderColor: 'white',
                                            },
                                            }}
                                            value={commentPage}
                                            exclusive
                                            aria-label="page selection"
                                            onChange = {handleCommentPageChange}
                                        >
                                            <ToggleButton value = "1">1</ToggleButton>
                                            {commentCount > 5 ?
                                            <ToggleButton value = "2">2</ToggleButton>
                                            : null}
                                            {commentCount > 10 ?
                                            <ToggleButton value = "3">3</ToggleButton>
                                            : null}
                                            {commentCount > 15 ?
                                            <ToggleButton value = "4">4</ToggleButton>
                                            : null}
                                            {commentCount > 20 ?
                                            <ToggleButton value = "5">5</ToggleButton>
                                            : null}
                                        </ToggleButtonGroup>
                                        
                                    <Stack 
                                        spacing={1}
                                        sx = {{
                                            width: '100%', 
                                            maxWidth: 400, 
                                            height: 200,
                                            bgcolor: '#19191a', 
                                            borderColor: '#19191a', 
                                            borderRadius: 0, 
                                            borderWidth: 2, 
                                            borderStyle: 'solid', 
                                            marginLeft: 0,
                                            overflowX: 'hidden',
                                            overflowY: 'scroll',
                                            paddingRight: 0.5,
                                            '&::-webkit-scrollbar-vertical': {
                                                width: '0.4em',
                                                height: '1em',
                                            },
                                        }}>
                                            {/* use map to iterate through list of comments from list of comments */}
                                            
                                            {/* {displayList[0]?.actualComments?.map((value, index) => ( */}
                                            {actualComments?.map((value, index) => (
                                            <Grid alignItems='flex-start'   
                                                >
                                                <Card
                                                    sx={{ 
                                                        height: "100%", 
                                                        display: 'flex', 
                                                        flexDirection: 'column', 
                                                        maxHeight: "300px", 
                                                        bgcolor : '#19191a',
                                                        color: 'white', 
                                                        borderColor: 'grey.500',
                                                        borderRadius: 1,
                                                        paddingBottom: 1, }}
                                                    variant="outlined"
                                                    color='white'
                                                >
                                                    {/* <span>{""}{value.author.displayName} :</span>{" "} */}
                                                    {/* </ListItem> */}
                                                    <ListItemText
                                                        sx={{paddingLeft: 1}}
                                                        primary={value.author.displayName}
                                                    />
                                                    <Container
                                                        maxWidth="md"
                                                        component="footer"
                                                        sx={{
                                                            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                                                            borderColor: 'grey.500',
                                                        }}
                                                        >
                                                    </Container>
                                                    <ListItemText
                                                        sx={{padding: 1}}
                                                        primary={value.comment}
                                                        // secondary={secondary ? 'Secondary text' : null}
                                                    />
                                                    {/* {commentLiked[index] === 0 ?
                                                        <Typography 
                                                            variant="caption" component="h3"
                                                            sx={{paddingLeft: 1}}
                                                            >
                                                            {value.numLikes}{" likes"}
                                                        </Typography>
                                                     : null}
                                                    {commentLiked[index] === 1 ? */}
                                                        <Typography 
                                                            variant="caption" component="h3"
                                                            sx={{paddingLeft: 1}}
                                                            >
                                                            {value.numLikes}{" likes"}
                                                        
                                                            <IconButton
                                                                sx={{color : 'red'}}
                                                                aria-label="add to favorites"
                                                                // make the button smaller
                                                                size= "small"
                                                                onClick={() => {
                                                                    var commentId = value.id;
                                                                    handleCommentLike(selectedPost, commentId);
                                                                    setClickedCommentLike(!clickedCommentLike);
                                                                }}
                                                            >  
                                                                {clickedCommentLike ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                            </IconButton>
                                                        </Typography>
                                                    {/* : null} */}
                                                </Card>
                                            </Grid>
                                            ))
                                            }
                                    </Stack>
                                </Container>
                                    : null}
                            </Box>
                            
                            {/* </div> */}
                        </Modal>
                    </Container>
                </main>


                {/* Footer */}
                <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
                    <Typography variant="h6" align="center" gutterBottom>
                        Footer
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        color="text.secondary"
                        component="p"
                    >
                        Something here to give the footer a purpose!
                    </Typography>
                    <Copyright />
                </Box>
                {/* End footer */}
            </Container>
        </ThemeProvider>
    );
}