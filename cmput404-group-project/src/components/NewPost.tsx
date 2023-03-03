import * as React from 'react';
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
import { CardActionArea, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';

const theme = createTheme();

export default function NewPost() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
        };
    
    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };


  return (
    <ThemeProvider theme={theme}>
        <Container sx={{pt: 5}}>
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
                                <InputLabel id="post-type-label">Post Type</InputLabel>
                                    <Select
                                        labelId="post-type"
                                        id="post-type"
                                        label="Post Type"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"public"}>Public</MenuItem>
                                        <MenuItem value={"friends"}>Private (Friends)</MenuItem>
                                        <MenuItem value={"private"}>Private</MenuItem>
                                    </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                            required
                            fullWidth
                            id="post-title"
                            label="Post Title"
                            name="post-title"
                            autoComplete="post-title"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" multiple type="file" />
                            </Button>
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
                            />
                        </Grid>
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