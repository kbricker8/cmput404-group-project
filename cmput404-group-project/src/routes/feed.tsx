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
import { CardActionArea, Modal } from '@mui/material';
import { TEAM7_API_URL, TEAM18_API_URL } from '../consts/api_connections';
import { Post } from '../types/post';
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
export default function Album() {
    // console.log("LOCAL STORAGE IN FEED:")
    // console.log(localStorage.getItem('user'))

    const [posts, setPosts] = React.useState([]);
    const [team18Posts, setTeam18Posts] = React.useState([]);
    const user = JSON.parse(localStorage.getItem('user')!);
    const token = JSON.parse(localStorage.getItem('token')!);
    const postsRef = React.useRef(null);
    const navigate = useNavigate();
    const refreshPage = () => {
        if (localStorage.getItem('refreshed') === 'false') {
            localStorage.setItem('refreshed', 'true');
            window.location.reload(true);
        }
    }

    React.useEffect(() => {
        refreshPage();
        axios.get(`http://127.0.0.1:8000/service/authors/${user.id}/posts/feed/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        }).then(
            (response) => {
                console.log("GET POSTS IN FEED RESPONSE:", response);
                const authorPosts = response.data.posts;
                axios.get(`${TEAM18_API_URL}service/authors/6952efd6743149eb86c472b96d84109a/posts`).then(
                    (response) => {
                        console.log("GET GROUP 18 POSTS RESPONSE:", response);
                        const team18Posts = response.data.items.map(item => convertTeam18PostToOurPost(item));
                        console.log("TEAM 18 POSTS:", team18Posts);
                        setPosts(authorPosts.concat(team18Posts));
                    }
                ).then(
                    () => {
                        axios.get(`${TEAM7_API_URL}authors/d3bb924f-f37b-4d14-8d8e-f38b09703bab/posts/1629b94f-04cc-459e-880e-44ebe979fb7e/`, {
                            headers: {
                                'Authorization': 'Basic ' + btoa('node01:P*ssw0rd!')
                            }
                        }).then(
                            (response) => {
                                console.log("GET GROUP 7 POSTS RESPONSE:", response);
                                const team7Post = convertTeam7PostToOurPost(response.data);
                                console.log("TEAM 7 POSTS:", team7Post);
                                setPosts(posts.concat(team7Post));
                            }
                        ).catch((error) => {
                            console.log("ERROR", error);
                        });
                    }
                );
            }
        );
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

    const [open, setOpen] = React.useState(false);
    const [selectedPost, setSelectedPost] = React.useState(null);
    const handleOpen = (clickedPost: React.SetStateAction<null>) => {
        setOpen(true);
        setSelectedPost(clickedPost);
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
                                        {/* </Container> */}
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
                                    {user.id === selectedPost?.author?.id ?
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

                                        </Stack>
                                        : null}
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