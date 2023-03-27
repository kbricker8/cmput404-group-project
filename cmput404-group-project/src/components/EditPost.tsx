import * as React from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from "../assets/copyright";
import { CardActionArea, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { OUR_API_URL } from '../consts/api_connections';

const theme = createTheme();

// *******************************************************************
// TODO:
// - fix bug for helper text (doesn't update till you type)
// *******************************************************************

export default function EditPost() {

    const user = JSON.parse(localStorage.getItem('user')!);
    const USER_ID = localStorage.getItem('USER_ID')!;
    const post = JSON.parse(localStorage.getItem('post_id')!);
    const token = JSON.parse(localStorage.getItem('token')!);

    const [postTitle, setPostTitle] = React.useState(post.title)
    const [postDescription, setPostDescription] = React.useState(post.description)
    const [postContent, setPostContent] = React.useState(post.content)

    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(postTitle, postContent);

        //axios.post('http://127.0.0.1:8000/service/authors/'+JSON.parse(localStorage.getItem('user')!).id+'/posts/', {
        axios.put(`${OUR_API_URL}service/authors/${USER_ID}/posts/${post.id}/`, {
            source: OUR_API_URL,
            origin: OUR_API_URL,
            title: postTitle,
            description: postDescription,
            content: postContent,
            //author: JSON.parse(localStorage.getItem('user')!).name,
            unlisted: false,
        }, {
        headers: {
            'Authorization': `Token ${token}`
        }
        }).then((response) => {
            console.log("MAKE PUT RESPONSE:", response);
            localStorage.setItem('refreshed', 'false');
            navigate(-1)
        }).catch((error) => { console.log("MAKE PUT ERROR:", error); })
    };


    return (
        <ThemeProvider theme={theme}>
            <Container sx={{ pt: 5 }}>
                <main>
                    <Box sx={{ borderBottom: 1, borderColor: 'grey.500' }}>
                        <Container maxWidth="lg">
                            <Typography
                                component="h1"
                                variant="h2"
                                align="left"
                                color="text.primary"
                                pt={12}
                                gutterBottom
                            >
                                Edit Post
                            </Typography>
                        </Container>
                    </Box>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    inputProps={{maxLength: 40}}
                                    helperText={`${postTitle.length}/40`}
                                    id="post-title"
                                    label="Post Title"
                                    name="post-title"
                                    autoComplete="post-title"
                                    value={postTitle}
                                    onChange={(e) => setPostTitle(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    inputProps={{maxLength: 70}}
                                    helperText={`${postDescription.length}/70`}
                                    id="post-description"
                                    label="Post Description"
                                    name="post-description"
                                    autoComplete="post-description"
                                    value={postDescription}
                                    onChange={(e) => setPostDescription(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={10}
                                    maxRows={15}
                                    name="text"
                                    label="Text"
                                    type="text"
                                    id="post-text"
                                    autoComplete="post-text"
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Update
                        </Button>
                    </Box>
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