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
import { CardActionArea } from '@mui/material';

const cards = [1, 2, 3, 4, 5, 6, 7, 8];

const theme = createTheme();

export default function Album() {
  return (
    <ThemeProvider theme={theme}>
        <Container sx={{pt: 5}}>
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
                                Welcome Sankalp!
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
                            {/* <Button variant="outlined">New Private Post</Button> */}
                            </Stack>
                        </Stack>
                    </Container>
                </Box>


                <Container sx={{ py: 8 }} maxWidth="lg">
                {/* End hero unit */}
                    <Grid container spacing={4}>
                        {cards.map((card) => (
                        <Grid item key={card} md={3}>
                            <Card
                            sx={{ height: "470px", display: 'absolute', flexDirection: 'column' }}
                            variant="outlined"
                            color='#09bef0'
                            >
                                <CardActionArea>
                                    <CardContent sx={{ flexGrow: 1, bottom: "2px" }}>
                                        <Typography gutterBottom variant="h6" component="h1">
                                            <b>Check out this cool post!</b>
                                        </Typography>
                                        <Typography gutterBottom variant="subtitle2" component="h3">
                                            Kyle Bricker
                                        </Typography>
                                        <Typography gutterBottom variant="subtitle1" component="h3">
                                            Here is some information about this post. This post is about this post.
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