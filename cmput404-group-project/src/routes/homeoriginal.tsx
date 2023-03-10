import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import Copyright from "../assets/copyright";
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme();

function HomePage() {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <CssBaseline />
        {/* Hero unit */}
        
        <Container sx={{pt: 15}}>
          <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6, padding: 0 }}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Welcome to SocDist
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" component="p">
              The following is quoted from Hindle's project.org:<br/><br/>The web is fundamentally 
              interconnected and peer to peer. There's no really great reason why we should 
              all use facebook.com or google+ or myspace or something like that. If these 
              social networks came up with an API you could probably link between them and 
              use the social network you wanted. Furthermore you might gain some autonomy.
            </Typography>
          </Container>
          {/* End hero unit */}

        
          {/* Paragraph + Picture */}

          <Container
            maxWidth="md"
            component="main"
            sx={{ pt: 8, pb: 6, marginTop: 3, marginBottom: 0}}>
              <Grid container spacing={3}>
                <Grid item xs>
                  <Typography variant="subtitle1" align="left" color="text.secondary" component="p">
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
                  </Typography>
                </Grid>
                <Grid item xs marginTop={7}>
                  <Box
                    component="img"
                    sx={{
                      height: 300,
                      width: 500,
                    }}
                    alt="The house from the offer."
                    src="https://imgs.search.brave.com/OSBJuMAmtEUZmvzAw8bcXcEIrp7TCScjySlNh8qB1FA/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy85/Lzk0L0Rvd250b3du/LVNreWxpbmUtRWRt/b250b24tQWxiZXJ0/YS1DYW5hZGEtU3Rp/dGNoLTAxLmpwZw"
                  />
                </Grid>
              </Grid>
          </Container>

          {/* Footer */}
          <Container
            maxWidth="md"
            component="footer"
            sx={{
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              py: [3, 6],
            }}
          >
            <Copyright/>
          </Container>
          {/* End footer */}
        </Container>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default function Home() {
  return <HomePage />;
}