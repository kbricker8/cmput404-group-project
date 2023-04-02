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
import { ButtonGroup, CardActionArea, IconButton, Modal } from '@mui/material';
import TextField from '@mui/material/TextField';
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
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Pagination from '@mui/material/Pagination';

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

    const [posts, setPosts] = React.useState([]);
    const [filterPosts, setFilterPosts] = React.useState<FilterPostsType>('all');
    const user = JSON.parse(localStorage.getItem('user')!);
    const USER_ID = localStorage.getItem('USER_ID');
    const token = JSON.parse(localStorage.getItem('token')!);
    const postsRef = React.useRef(null);
    const navigate = useNavigate();
    const [commentValue, setCommentValue] = React.useState('');
    const [clickedLike, setClickedLike] = React.useState(false);//const for like button before and after click
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
        //Test our feed
        axios.get(`${OUR_API_URL}service/authors/${USER_ID}/posts/feed/?page_size=12`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        }).then(response => {
            console.log("GET OUR FEED RESPONSE:", response);
        }).catch(error => {
            console.log("GET OUR FEED ERROR:", error);
        });
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

        Promise.all([getOurAuthors]).then(responses => {
            const authors = responses[0].data.items;
            console.log("IN FIRST PROMISE", authors);
        });

        Promise.all([getAuthorPosts, getTeam18Authors, getTeam7Authors])
            .then(responses => {
                console.log("RESPONSES", responses);
                const authorPosts = responses[0].data.posts;
                const team18Authors = responses[1];
                const team7Authors = responses[2];
                let team18PostsSave = [];
                console.log("TEAM 18 AUTHORS:", team18Authors);
                const team18PostsPromises = team18Authors.filter(author => {
                    console.log("author:", author);
                    console.log("author.id:", author.id);
                    return author.length == 32;
                }).map(author => getTeam18Posts(author));
                Promise.all(team18PostsPromises).then(team18PostsArrays => {
                    const team18Posts = [].concat(...team18PostsArrays);
                    team18PostsSave = team18Posts;
                    //setPosts([...authorPosts, ...team18Posts]);
                }).catch(error => {
                    console.log("IN SECOND PROMISE", error);
                });
                console.log("7TEAM 7 AUTHORS:", team7Authors);
                const team7PostsPromises = team7Authors.filter(author => {
                    console.log("7TEAM 7 author:", author);
                    console.log("author.id:", author.id);
                    console.log(217, author.length);
                    return author.length == 36;
                }).map(author => getTeam7Posts(author));
                console.log(219, team7PostsPromises)
                Promise.all(team7PostsPromises).then(team7PostsArrays => {
                    console.log("220:", team7PostsArrays);
                    const team7Posts = [].concat(...team7PostsArrays);
                    console.log("7TEAM 7 POSTS IN PROMISE:", team7Posts);
                    setPosts([...authorPosts, ...team18PostsSave, ...team7Posts]);
                }).catch(error => {
                    console.log("IN THIRD PROMISE", error);
                }
                );
            }).catch(error => {
                console.log("IN LAST PROMISE", error);
            });
    }, []);


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
        }).catch((error) => { console.log("MAKE LIKE ERROR:", error); })
    };
    const handleCommentLike = (clickedPost: { id: any; } | null, clickedComment: {id : any;}) => {
        //use POST service/authors/{authorId}/posts/{postId}/comments/{commentId}/like/ to add likes to comment
        console.log(JSON.parse(localStorage.getItem('user')!).id)
        console.log("CLICKED COMMENTS", clickedComment.split("/").pop());
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
    
    //const for comments list for each post  
    const commentList = (clickedPost: { id: any; } | null, page: number) => {
        //use GET service/authors/{authorId}/posts/{postId}/comments/ to get comments for post
        //console.log(JSON.parse(localStorage.getItem('user')!).id)
        console.log("THIS IS THE CLICKED POST AUTHOR ID", clickedPost?.author?.id.split("/").pop());
        console.log("THIS IS THE CLICKED POST ID", clickedPost.id.split("/").pop());
        console.log("THIS IS THE CLICKED POST", clickedPost)
        console.log("THIS IS THE USER ID", user.id)
        console.log("THIS IS THE COMMENT PAGE", page)

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
            console.log("COMMENTS LIST:", commentsList);
            console.log("COMMENTS LIST LENGTH:", commentsList.length);
            setActualComments(commentsList);
            console.log("DATA COUNT:", response.data.count);
            setCommentCount(response.data.count);
            return commentsList;
        }).catch((error) => { console.log("GET COMMENTS ERROR:", error); })
    };
    //handleComment takes two arguments: the post that the comment is being made on, and the comment itself
    const handleComment = (clickedPost: { id: any; } | null, commentValue: string) => {
        //use POST service/authors/{authorId}/posts/{postId}/comments/ to add comments to post
        console.log(JSON.parse(localStorage.getItem('user')!).id)
        console.log("THIS IS THE CLICKED POST AUTHOR ID", clickedPost?.author?.id.split("/").pop());
        console.log("THIS IS THE BIG AUTHOR ID", user.id);
        console.log("POST ID:", clickedPost.id.split("/").pop());
        console.log("COMMENT VALUE:", commentValue);
        //console log for the axios statement
        console.log("AXIOS: ", OUR_API_URL, "service/authors/", clickedPost?.author?.id.split("/").pop(), "/posts/", clickedPost.id.split("/").pop(), "/comments/")
        
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
        }).catch((error) => { console.log("MAKE COMMENT ERROR:", error); })
    };

    const handleCommentPageChange = (event, page: number) => {
        console.log("THIS IS THE PAGE", page);
        console.log("THIS IS THE COMMENT PAGE", commentPage);
        setCommentPage(page);
        console.log("THIS IS THE PAGE", page);
        console.log("THIS IS THE COMMENT PAGE", commentPage);
    };

    React.useEffect(() => {
        if (selectedPost) {
            commentList(selectedPost, commentPage);
        }
    }, [commentPage]);

    const [open, setOpen] = React.useState(false);
    const [selectedPost, setSelectedPost] = React.useState(null);
    const handleOpen = (clickedPost: React.SetStateAction<null>) => {
        var commentsList;
        setOpen(true);
        setCommentPage(1);
        setSelectedPost(clickedPost);
        commentList(clickedPost, 1);
        console.log("ACTUAL COMMENTS:", actualComments);
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
                                </Stack>
                                <Stack
                                    sx={{ pt: 20 }}
                                    direction="row"
                                    spacing={2}
                                    justifyContent="center"
                                >
                                    <FormControl variant="outlined" sx={{minWidth: 150}} >
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
                                    <Button variant="contained" href='./NewPost' startIcon={<AddIcon />}>New Post</Button>
                                </Stack>
                            </Stack>
                        </Container>
                    </Box>


                    <Container sx={{ py: 8 }} maxWidth="lg">
                        {/* End hero unit */}
                        <Grid container spacing={4}>
                            {posts?.map((post) => (
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
                                    justifyContent="end"
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
                                        {/* </Container> */}
                                        <Box component="form" noValidate
                                            sx={{ mt: 3 }}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    // make background white
                                                    sx={{ bgcolor: 'white', borderRadius: 2, borderColor: 'grey.500', borderWidth: 5, borderStyle: 'solid'}}
                                                    id="CommentId"
                                                    label="Comment"
                                                    multiline
                                                    rows={2}
                                                    defaultValue="Default Value"
                                                    value = {commentValue}
                                                    variant="outlined"
                                                    onChange={(e) => setCommentValue(e.target.value)}
                                                />
                                            </Grid>
                                            <Button
                                                sx={{ marginLeft: 0, marginTop: 1, marginBottom: 3}}
                                                type="button"
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={()=>handleComment(selectedPost, commentValue)}                                                    
                                            >
                                                Submit comment
                                            </Button>

                                            <Typography id="modal-modal-content" sx={{ mt: 2 }}>
                                                {"Comments:"}
                                            </Typography>
                                        </Box>
                                        
                                        
                                    </Stack>
                                    <Box
                                        component="img"
                                        sx={{
                                            height: 300,
                                            width: 300
                                        }}
                                        // display="flex"
                                        // justifyItems="right"
                                        alt="Post Picture"
                                        src="https://imgs.search.brave.com/QN5ZdDJqJOAbe6gdG8zLNq8JswG2gpccOqUKb12nVPg/rs:fit:260:260:1/g:ce/aHR0cHM6Ly93d3cu/YmlpYWluc3VyYW5j/ZS5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMTUvMDUvbm8t/aW1hZ2UuanBn"
                                    />
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
                                            <Container>                                              
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
                                            </Container>

                                        </Stack>
                                        : null}
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
                                            sx={{bgcolor: 'grey.500', color: 'white', height: 25}}
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
                                            bgcolor: 'grey.500', 
                                            borderColor: 'grey.500', 
                                            borderRadius: 2, 
                                            borderWidth: 5, 
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
                                            {actualComments?.map((value, index) => (
                                            <Grid alignItems='flex-start'   
                                                >
                                                {/* <ListItem
                                                    sx={{padding: 2}}
                                                    key = {index}
                                                    disableGutters
                                                > */}
                                                <Card
                                                    sx={{ 
                                                        height: "100%", 
                                                        display: 'flex', 
                                                        flexDirection: 'column', 
                                                        maxHeight: "300px", 
                                                        bgcolor : '#19191a',
                                                        color: 'white', 
                                                        borderColor: 'grey.500',
                                                        borderRadius: 2,
                                                        paddingBottom: 1, }}
                                                    variant="outlined"
                                                    color='white'
                                                >
                                                    <span>{value.author.displayName} :</span>{" "}
                                                    {/* <span>comment: {value.comment}</span>{" "} */}
                                                    {/* </ListItem> */}
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
                                                    <Typography variant="caption" component="h3">
                                                        {value.numLikes}{" likes"}
                                                    
                                                        <IconButton
                                                            sx={{color : 'red'}}
                                                            aria-label="add to favorites"
                                                            onClick={() => {
                                                                var commentId = value.id;
                                                                handleCommentLike(selectedPost, commentId);
                                                                setClickedLike(!clickedLike);
                                                            }}
                                                        >  
                                                            {clickedLike ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                        </IconButton>
                                                    </Typography>
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