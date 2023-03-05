import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import Copyright from "../assets/copyright";
import { createTheme, Paper, Stack, ThemeProvider } from '@mui/material';
import Image from '../assets/home-page-bg.jpeg'; // Import using relative path

const styles = {
    paperContainer: {
        backgroundImage: `url(${Image})`
    }
};

const theme = createTheme();

function HomePage() {
  return (
    <Paper style={styles.paperContainer}>
      <Container component="main" sx={{pt: 15}}>
        <Grid container spacing={0} sx={{pb: 10}}>
          <Stack
              direction="row"
              spacing={15}
              justifyContent="center"
              >
            <Grid item xs>
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="white"
                fontWeight={7}
                gutterBottom
              >
                Welcome to SocDist
              </Typography>
              <Typography variant="h6" align="center" color="#E0E0E0" component="p">
                The following is quoted from Hindle's project.org:<br/><br/>The web is fundamentally 
                interconnected and peer to peer. There's no really great reason why we should 
                all use facebook.com or google+ or myspace or something like that. If these 
                social networks came up with an API you could probably link between them and 
                use the social network you wanted. Furthermore you might gain some autonomy.
              </Typography>
            </Grid>
            <Grid item pt={5}>
              <Box
                component="img"
                sx={{height: 500,
                  width: 700,}}
                alt="Social Networking."
                src="https://imgs.search.brave.com/mXOKmnPBdcZ94JKCXJKFwiMHJr7H5gnShN-vE1EVqTs/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvcHJl/dmlld3MvMDAwLzQw/MC82MDkvb3JpZ2lu/YWwvdmVjdG9yLWNo/YXJhY3RlcnMtb2Yt/cGVvcGxlLWFuZC10/aGVpci1zb2NpYWwt/bmV0d29yay1pbGx1/c3RyYXRpb24uanBn"
              />
                {/* <Typography variant="subtitle2" align="left" color="text.secondary" component="p">
                  This blogging/social network platform will allow the importing of
                  other sources of posts (github, twitter, etc.) as well allow the
                  distributing sharing of posts and content.<br/>
                  An author sitting on one server can aggregate the posts of their
                  friends on other servers.<br/>
                  We are going to go with an inbox model where by you share posts to
                  your friends by sending them your posts. This is similar to
                  activity pub: https://www.w3.org/TR/activitypub/ Activity Pub is
                  great, but too complex for a class project.<br/>
                  We also won't be adding much in the way of encryption or security
                  to this platform. We're keeping it simple and restful.
                </Typography> */}
            </Grid>
          </Stack>
        </Grid>
         
          {/* Footer */}
        <Container
          maxWidth="md"
          component="footer"
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            py: [3, 6],
            borderColor: 'white',
          }}
        >
            <Copyright color='#E0E0E0'/>
        </Container>
          {/* End footer */}
      </Container>
    </Paper>
  );
}

export default function Home() {
  return <HomePage />;
}