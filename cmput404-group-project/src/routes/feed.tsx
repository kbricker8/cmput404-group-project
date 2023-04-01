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
import { CardActionArea, IconButton, Modal } from '@mui/material';
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

export default function Album() {
    console.log("LOCAL STORAGE IN FEED:")
    console.log(localStorage.getItem('user'))

    const [posts,setPosts] = React.useState([]);
    const user = JSON.parse(localStorage.getItem('user')!);
    const token = JSON.parse(localStorage.getItem('token')!);
    const postsRef = React.useRef(null);
    const [commentValue, setCommentValue] = React.useState('');
    const navigate = useNavigate();
    const [clickedLike, setClickedLike] = React.useState(false);//const for like button before and after click
    const refreshPage = () => {
        if (localStorage.getItem('refreshed') === 'false') {
            localStorage.setItem('refreshed', 'true');       
            window.location.reload(true);
        }
    }
    
    React.useEffect(() => {
        refreshPage();
        axios.get(`http://127.0.0.1:8000/service/authors/${user.id}/posts/feed/?p=1&page_count=5`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        }).then(
            (response) => { 
                console.log("GET POSTS IN FEED RESPONSE:", response);
                postsRef.current = response.data.posts;
                setPosts(response.data.posts);
        }
        )
    },[]);

    // DELETE NOT WORKING YET -- NEED ASH TO FINISH AUTHENTICATION

    const handleDelete = (clickedPost: { id: any; } | null) => {
        // clickedPost.preventDefault();
        console.log(JSON.parse(localStorage.getItem('user')!).id)
        console.log(clickedPost.id);

        axios.delete(`http://127.0.0.1:8000/service/authors/${(JSON.parse(localStorage.getItem('user')!).id)}/posts/${clickedPost.id}/`,  {
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
        console.log(clickedPost.id);

        axios.post(`http://127.0.0.1:8000/service/authors/${clickedPost.author.id}/posts/${clickedPost.id}/like/`, {
            author: user.id,
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

    const handleCommentLike = (clickedPost: { id: any; }, clickedComment: {id : any;} | null) => {
        //use POST service/authors/{authorId}/posts/{postId}/comments/{commentId}/like/ to add likes to comment
        console.log(JSON.parse(localStorage.getItem('user')!).id)
        console.log(clickedComment.id);

        axios.post(`http://127.0.0.1:8000/service/authors/${clickedPost.author.id}/posts/${clickedPost.id}/comments/${clickedComment.id}/like/`, {
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
    //const for comments list for each post   
    const commentList = (clickedPost: { id: any; } | null) => {
        //use GET service/authors/{authorId}/posts/{postId}/comments/ to get comments for post
        //console.log(JSON.parse(localStorage.getItem('user')!).id)
        console.log(clickedPost.id);

        axios.get(`http://127.0.0.1:8000/service/authors/${clickedPost.author.id}/posts/${clickedPost.id}/comments/`, {
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
            return commentsList;
        }).catch((error) => { console.log("GET COMMENTS ERROR:", error); })
    };


    //handleComment takes two arguments: the post that the comment is being made on, and the comment itself
    const handleComment = (clickedPost: { id: any; } | null, commentValue: string) => {
        //use POST service/authors/{authorId}/posts/{postId}/comments/ to add comments to post
        console.log(JSON.parse(localStorage.getItem('user')!).id)
        console.log(clickedPost.id);
        console.log("COMMENT VALUE:", commentValue);

        axios.post(`http://127.0.0.1:8000/service/authors/${clickedPost.author.id}/posts/${clickedPost.id}/comments/`, {
            author: user.id,
            comment: commentValue,
            contentType: "text/plain",
            // headers: {
            //     'Authorization': `Token ${token}`
            // }
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

    const [open, setOpen] = React.useState(false);
    const [selectedPost, setSelectedPost] = React.useState(null);
    const handleOpen = (clickedPost: React.SetStateAction<null>) => {
        var commentsList;
        setOpen(true);
        setSelectedPost(clickedPost);
        //setCommentsList(commentList(clickedPost));
        console.log("COMMENTS LISTTTTTTT:", commentsList);
        commentList(clickedPost);
        console.log("COMMENTS LISTTT:", commentsList);
        
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedPost(null);
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
                                    direction="column"
                                    spacing={2}
                                    justifyContent="center"
                                >
                                    <Button variant="contained" href='./NewPost' startIcon={<AddIcon />}>New Public Post</Button>
                                </Stack>
                            </Stack>
                        </Container>
                    </Box>


                    <Container sx={{ py: 8}} maxWidth="lg">
                        {/* End hero unit */}
                        <Grid container spacing={4}>
                            {posts?.map((post) => (
                                <Grid item key={post} md={3}>
                                    <Card
                                        sx={{ height: "100%", display: 'flex', flexDirection: 'column', maxHeight: "390px"}}
                                        variant="outlined"
                                        color='#09bef0'
                                    >
                                        <CardActionArea
                                            onClick={()=>handleOpen(post)}>
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
                                            {/* <CardMedia
                                                component="img"
                                                sx={{
                                                    // 16:9
                                                    pt: '0%',
                                                }}
                                                // image="https://source.unsplash.com/random"
                                                image="https://imgs.search.brave.com/QN5ZdDJqJOAbe6gdG8zLNq8JswG2gpccOqUKb12nVPg/rs:fit:260:260:1/g:ce/aHR0cHM6Ly93d3cu/YmlpYWluc3VyYW5j/ZS5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMTUvMDUvbm8t/aW1hZ2UuanBn"
                                                alt="random"
                                            /> */}
                                            
                                            {/* TextField to add comments */}
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
                                        sx={{ pb: 2, paddingLeft: 10}}
                                        direction="row"
                                        spacing={10}
                                        justifyContent="end"
                                    >
                                        <Stack
                                            alignItems="left"
                                            flexDirection="column"
                                            sx={{ pb: 2
                                             }}
                                            direction="column"
                                            spacing={3}
                                            justifyContent="start"
                                            marginRight={10}
                                            paddingLeft={3}
                                        >
                                            <Container>
                                                <Typography id="modal-muthor" variant="h6" component="h2" paddingBottom={2} top={0}>
                                                    Post Author: <em>{selectedPost?.author?.displayName ?? 'No author'}</em>
                                                </Typography>
                                                <Typography id="modal-title" variant="h4" component="h2">
                                                    <b>{selectedPost?.title ?? 'No title'}</b>
                                                </Typography>
                                                <Typography id="modal-modal-content" sx={{ mt: 2 }}>
                                                    {selectedPost?.content ?? 'No content'}
                                                </Typography>
                                                <br></br>
                                                <br></br>
                                                <Container
                                                    maxWidth="md"
                                                    component="footer"
                                                    sx={{
                                                        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                                                        py: [3, 6],
                                                        borderColor: 'white',
                                                    }}
                                                    >
                                                    </Container>

                                            </Container>                                         
                                            <Box component="form" noValidate 
                                                sx={{ mt: 3 }}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        // make background white
                                                        sx={{ bgcolor: 'white', borderRadius: 2, borderColor: 'grey.500', borderWidth: 5, borderStyle: 'solid', marginLeft: 3 }}
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
                                                    sx={{ marginLeft: 3}}
                                                    type="submit"
                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                    onClick={()=>handleComment(selectedPost, commentValue)}                                                    
                                                >
                                                    Submit comment
                                                </Button>
                                            </Box>
                                            <Container>
                                                Comments:
                                            </Container>
                                            <Grid container spacing={15} sx={{marginLeft: 3}}>
                                                <List>
                                                    {/* use map to iterate through list of comments from list of comments */}
                                                    {actualComments?.map((value, index) => ( 
                                                    <Grid alignItems='flex-start' sx = {{width: '100%', maxWidth: '200%', bgcolor: 'grey', borderColor: 'grey.500', borderRadius: 1, borderWidth: 5, borderStyle: 'solid', marginLeft: 3 }} >
                                                        {/* <ListItem
                                                            sx={{padding: 2}}
                                                            key = {index}
                                                            disableGutters
                                                        > */}
                                                         <Card
                                                            sx={{ height: "100%", display: 'flex', flexDirection: 'column', maxHeight: "300px", bgcolor : 'white', paddingBottom: 1}}
                                                            variant="outlined"
                                                            color='white'
                                                            >
                                                            <span>Comment author: {value.author.displayName}</span>{" "}
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
                                                        </Typography>
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

                                                        </Card>
                                                    </Grid>
                                                    ))
                                                    }
                                                </List>
                                            </Grid>
                                            
                                        </Stack>
                                        {/* <Box
                                            component="img"
                                            sx={{height: 300,
                                            width: 300}}
                                            // display="flex"
                                            // justifyItems="right"
                                            alt="Post Picture"
                                            src="https://imgs.search.brave.com/QN5ZdDJqJOAbe6gdG8zLNq8JswG2gpccOqUKb12nVPg/rs:fit:260:260:1/g:ce/aHR0cHM6Ly93d3cu/YmlpYWluc3VyYW5j/ZS5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMTUvMDUvbm8t/aW1hZ2UuanBn"
                                        /> */}
                                        <Stack
                                            // justifyItems={"end"}
                                            //sx={{ right:0, top: 0}}
                                            sx = {{position: "flex", top: 5}}
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
                                                onClick={()=>localStorage.setItem('post_id', JSON.stringify(selectedPost))}
                                            >
                                                Edit
                                            </Button>
                                            {/* <Button
                                                type="submit"
                                                variant="outlined"
                                                sx={{ height: 50, width: 100 }}
                                                startIcon = {<FavoriteBorderIcon />}
                                                onClick={()=> handleLike(selectedPost)}
                                                
                                            >
                                                Like
                                            </Button> */}
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
                                    </Stack>
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