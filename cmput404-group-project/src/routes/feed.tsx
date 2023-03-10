import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router'
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
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
            navigate(0);
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

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                                    <Button variant="contained" href='./NewPost'>New Public Post</Button>
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
                                        sx={{ height: "470px", display: 'absolute', flexDirection: 'column' }}
                                        variant="outlined"
                                        color='#09bef0'
                                    >
                                        <CardActionArea
                                        onClick={handleOpen}>
                                            <CardContent sx={{ flexGrow: 1, bottom: "2px" }}>
                                                <Typography gutterBottom variant="h6" component="h1">
                                                    <b>{post.title}</b>
                                                </Typography>
                                                <Typography gutterBottom variant="subtitle2" component="h3">
                                                    {post.author.displayName}
                                                </Typography>
                                                <Typography gutterBottom variant="subtitle1" component="h3">
                                                    {post.content}
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
                                            {/* <CardActions>
                                        <Button size="small">View</Button>
                                    </CardActions> */}
                                        </CardActionArea>
                                        <Modal
                                            open={open}
                                            // sx={{overflow: scroll}}
                                            onClose={handleClose}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-content"
                                        >
                                            {/* <div> */}
                                            <Box sx={modalStyle}>
                                                    <Stack
                                                        sx={{ pb: 2, overflow: scroll }}
                                                        direction="row"
                                                        spacing={20}
                                                        // justifyContent="center"
                                                    >
                                                        <Stack
                                                            sx={{ pb: 2 }}
                                                            direction="column"
                                                            spacing={6}
                                                            justifyContent="center"
                                                            marginRight={10}
                                                            paddingLeft={3}
                                                        >
                                                            {/* <Container> */}
                                                                <Typography id="modal-muthor" variant="h6" component="h2" paddingBottom={2}>
                                                                    Post Author: <em>{post.author.displayName}</em>
                                                                </Typography>
                                                                <Typography id="modal-title" variant="h4" component="h2">
                                                                    <b>{post.title}</b>
                                                                </Typography>
                                                                <Typography id="modal-modal-content" sx={{ mt: 2 }}>
                                                                    {post.content}
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
                                                    </Stack>
                                                </Box>
                                            {/* </div> */}
                                        </Modal>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
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