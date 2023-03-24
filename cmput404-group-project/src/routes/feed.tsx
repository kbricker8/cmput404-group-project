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
        axios.get(`http://127.0.0.1:8000/service/authors/${user.id}/posts/`).then(
            (response) => { 
                console.log("GET POSTS IN FEED RESPONSE:", response);
                postsRef.current = response.data.items;
                setPosts(response.data.items);
                
        }
        )
    },[]);

    // DELETE NOT WORKING YET -- NEED ASH TO FINISH AUTHENTICATION

    const handleDelete = (clickedPost: { id: any; } | null) => {
        // clickedPost.preventDefault();
        console.log(JSON.parse(localStorage.getItem('user')!).id)
        // console.log(clickedPost.id);

        axios.delete(`http://127.0.0.1:8000/service/authors/${(JSON.parse(localStorage.getItem('user')!).id)}/posts/${clickedPost.id}/`)
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
                                        Welcome {user.author.displayName || "User"}!
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


                    <Container sx={{ py: 8 }} maxWidth="lg">
                        {/* End hero unit */}
                        <Grid container spacing={4}>
                            {posts.map((post) => (
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
                                        sx={{ pb: 2}}
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
                                            {/* </Container> */}
                                        </Stack>
                                        <Box
                                            component="img"
                                            sx={{height: 300,
                                            width: 300}}
                                            // display="flex"
                                            // justifyItems="right"
                                            alt="Post Picture"
                                            src="https://imgs.search.brave.com/QN5ZdDJqJOAbe6gdG8zLNq8JswG2gpccOqUKb12nVPg/rs:fit:260:260:1/g:ce/aHR0cHM6Ly93d3cu/YmlpYWluc3VyYW5j/ZS5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMTUvMDUvbm8t/aW1hZ2UuanBn"
                                        />
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