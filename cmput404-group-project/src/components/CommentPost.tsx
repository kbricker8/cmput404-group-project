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

const theme = createTheme();

// function to comment on a post
export default function CommentPost(clickedPost: string) {
    //use POST service/authors/{authorId}/posts/{postId}/comments/ to add comments to post
    const [comment, setComment] = React.useState('');
    const user = JSON.parse(localStorage.getItem('user')!);

    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(JSON.parse(localStorage.getItem('user')!).id)
        console.log(comment);


        axios.post(`http://127.0.0.1:8000/service/authors/${clickedPost.author.id}/posts/${clickedPost.id}/comments/`, {
            author: user.id,
            comment: "This is a comment",
            contentType: "text/plain",
            })
        .then((response) => {
            console.log("MAKE COMMENT RESPONSE:", response);
        }).catch((error) => { console.log("MAKE COMMENT ERROR:", error); })

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
                                gutterBottom
                            >
                                Comment on Post
                            </Typography>
                        </Container>
                    </Box>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="comment"
                                    name="comment"
                                    label="Comment"
                                    fullWidth
                                    autoComplete="comment"
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Comment
                        </Button>
                    </Box>
                </main>
            </Container>
        </ThemeProvider>
    );
}