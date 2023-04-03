import * as React from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Markdown from 'markdown-to-jsx';
import Copyright from "../assets/copyright";
import { CardActionArea, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from '@mui/material';
import { OUR_API_URL } from '../consts/api_connections';

const theme = createTheme();

export default function NewPost() {
    const [visibility, setVisibility] = React.useState('')
    const [postType, setPostType] = React.useState('')
    const [postTitle, setPostTitle] = React.useState('')
    const [postDescription, setPostDescription] = React.useState('')
    const [postContent, setPostContent] = React.useState('')
    const [selectedImage, setSelectedImage] = React.useState(null)
    const [image, setImage] = React.useState('')
    const user = JSON.parse(localStorage.getItem('user')!);
    const token = JSON.parse(localStorage.getItem('token')!);
    const USER_ID = localStorage.getItem('USER_ID');
    const [postID, setpostID] = React.useState('');

    const navigate = useNavigate();

    // const handleImageSubmit = event => {
    //     const fileUploaded = event.target.files[0];
    //     console.log("UPLOAD IMAGE: " + fileUploaded);
    // }


    const convert = (e: React.ChangeEvent<HTMLInputElement>) => {
        // check max. file size is not exceeded
        // size is in bytes
        if (e.target.files[0].size > 2000000) {
          console.log("File too large");
          return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
    
        reader.onload = () => {
          console.log(reader.result); //base64encoded string
          setImage(reader.result);
        };
        reader.onerror = error => {
          console.log("Error: ", error);
        };
      }


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(JSON.parse(localStorage.getItem('user')!).id)
        console.log(visibility, postType, postTitle, postDescription, postContent);

        //axios.post('http://127.0.0.1:8000/service/authors/'+JSON.parse(localStorage.getItem('user')!).id+'/posts/', {
        const postBasic = () => {
            return axios.post(`${OUR_API_URL}service/authors/${USER_ID}/posts/`, {
                source: OUR_API_URL,
                origin: OUR_API_URL,
                title: postTitle,
                description: postDescription,
                content: postContent,
                contentType: postType,
                author: user.id,
                categories: {},
                count: 0,
                published: new Date().toISOString(),
                visibility: visibility,
                unlisted: false,
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            }).then((response) => {
                console.log("MAKE POST RESPONSE:", response);
                console.log("POST ID: " + response.data.id);
                const postID = response.data.id
                return postID
                // setpostID(response.data.id);
                // navigate(-1)
                }).catch((error) => { console.log("MAKE POST ERROR:", error); });
        }


        if (image) {
            postBasic()
                .then(postID => {
                    axios.post(`${OUR_API_URL}service/authors/${USER_ID}/posts/${postID}/image_post/`, {
                        image: image,
                    }, {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    }).then((response) => {
                        console.log("MAKE IMAGE POST RESPONSE:", response);
                        // navigate(-1)
                    }).catch((error) => { console.log("MAKE IMAGE POST ERROR:", error); })
                });
        }
        else {
            postBasic();
        }

        // axios.post(`${OUR_API_URL}service/authors/${USER_ID}/posts/`, {
        //     source: OUR_API_URL,
        //     origin: OUR_API_URL,
        //     title: postTitle,
        //     description: postDescription,
        //     content: postContent,
        //     contentType: postType,
        //     author: user.id,
        //     categories: {},
        //     count: 0,
        //     published: new Date().toISOString(),
        //     visibility: visibility,
        //     unlisted: false,
        // }, {
        //     headers: {
        //         'Authorization': `Token ${token}`
        //     }
        // }).then((response) => {
        //     console.log("MAKE POST RESPONSE:", response);
        //     setpostID(response.data.id);
        //     console.log("POST ID: " + response.data.id);
        //     // navigate(-1)
        // }).catch((error) => { console.log("MAKE POST ERROR:", error); })




        // axios.post(`${OUR_API_URL}service/authors/${USER_ID}/posts/${postID}/image_post`, {
        //     image: image,
        // }, {
        //     headers: {
        //         'Authorization': `Token ${token}`
        //     }
        // }).then((response) => {
        //     console.log("MAKE IMAGE POST RESPONSE:", response);
        //     // navigate(-1)
        // }).catch((error) => { console.log("MAKE IMAGE POST ERROR:", error); })
    };


    return (
        <ThemeProvider theme={theme}>
            <Container sx={{ pt: 5, pb: 12, marginTop: 4 }}>
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
                                Create Post
                            </Typography>
                        </Container>
                    </Box>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="post-visibility-label">Post Visibility</InputLabel>
                                    <Select
                                        labelId="post-visibility"
                                        id="post-visibility"
                                        label="Post Visibility"
                                        onChange={(e) => setVisibility(e.target.value as string)}
                                    >
                                        <MenuItem value={"PUBLIC"}>Public</MenuItem>
                                        <MenuItem value={"PRIVATE"}>Private (Friends)</MenuItem>
                                        <MenuItem value={"FRIENDS"}>Private</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="post-type-label">Post Type</InputLabel>
                                    <Select
                                        labelId="post-type"
                                        id="post-type"
                                        label="Post Type"
                                        onChange={(e) => setPostType(e.target.value as string)}
                                    >
                                        <MenuItem value={"text/plain"}>Plaintext</MenuItem>
                                        <MenuItem value={"text/markdown"}>CommonMark</MenuItem>
                                        {/* Change value based on  Image Type*/}
                                        <MenuItem value={"image"}>Image</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    inputProps={{ maxLength: 40 }}
                                    helperText={`${postTitle.length}/40`}
                                    id="post-title"
                                    label="Post Title"
                                    name="post-title"
                                    autoComplete="post-title"
                                    onChange={(e) => setPostTitle(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    inputProps={{ maxLength: 70 }}
                                    helperText={`${postDescription.length}/70`}
                                    id="post-description"
                                    label="Post Description"
                                    name="post-description"
                                    autoComplete="post-description"
                                    onChange={(e) => setPostDescription(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                    {selectedImage && (
                                    <div>
                                        <img
                                            alt="not found"
                                            width={"100px"}
                                            src={URL.createObjectURL(selectedImage)}
                                        />
                                    <br />
                                        <button onClick={() => setSelectedImage(null)}>Remove</button>
                                    </div>
                                )}
                                <Button 
                                    variant="contained" 
                                    component="label" 
                                >
                                    Upload Image
                                    <input 
                                        hidden accept="image/*" 
                                        multiple type="file" 
                                        name='myImage'
                                        onChange={(event) => {
                                            // console.log(event.target.files[0]);
                                            convert(event);
                                            setSelectedImage(event.target.files[0]);
                                            // console.log("IMAGE: " + event.target.files[0])
                                        }}
                                    />

                                </Button>
                            </Grid>
                            {postType !== "text/markdown" ?
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
                                        onChange={(e) => setPostContent(e.target.value)}
                                    />
                                </Grid>
                                :
                                <Grid container spacing={1} sx={{ padding: 2 }} >
                                    <Grid item xs={6}>
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
                                            onChange={(e) => setPostContent(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box
                                            display="flex"
                                            height={'100%'}
                                            sx={{

                                                padding: '20px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',

                                                overflow: 'auto'
                                            }}>
                                            <Markdown>{postContent}</Markdown>
                                        </Box>
                                    </Grid>
                                </Grid>
                            }
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Post
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