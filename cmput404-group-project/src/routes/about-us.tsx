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

function AboutUsPage() {
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
                About Us
              </Typography>
              <Typography variant="h6" align="center" color="#E0E0E0" component="p">
                We are a group of software engineers and computer scientists at the 
                University of Alberta who are passionate about building software that 
                is useful to the community. We are currently working on a blogging/social 
                network platform that will allow the importing of
                other sources of posts (github, twitter, etc.) as well allow the
                distributing sharing of posts and content.<br/>
                <br/>
                This project is a part of the CMPUT 404 course at the University of Alberta.

              </Typography>
            </Grid>
            <Grid item pt={5}>
              <Box
                component="img"
                sx={{height: 500,
                  width: 700,}}
                alt="Social Networking."
                src="https://www.ualberta.ca/media-library/new-brand/about-us/about-us-campus-aerial.jpg"
              />
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

export default function AboutUs() {
  return <AboutUsPage />;
};