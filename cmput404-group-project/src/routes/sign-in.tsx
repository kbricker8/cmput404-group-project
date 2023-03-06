import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from "../assets/copyright";

const theme = createTheme();

export default function SignIn() {
  const [signUpUsername, setSignUpUsername] = React.useState('');
  const [signUpEmail, setSignUpEmail] = React.useState('');
  const [signUpPassword, setSignUpPassword] = React.useState('');
  const [signInUsername, setSignInUsername] = React.useState('');
  const [signInPassword, setSignInPassword] = React.useState('');
  const [signInError, setSignInError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios.post('http://127.0.0.1:8000/service/users/login/', {
      username: signInUsername,
      password: signInPassword,
    })
      .then((response) => {
        console.log("RESPONSE:", response);
        if (response.status == 200) {
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem('refreshed', 'false')
          nav("/feed");
        }
      }).catch((error) => {
        console.log("Invalid username or password")
        setHelperText("Invalid username or password");
        setSignInError(true);
      });

  };
  const nav = useNavigate();

  const onSignUpSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("SUBMIT SIGN IN CALLED");

    axios.post('http://127.0.0.1:8000/service/users/', {
      username: signUpUsername,
      email: signUpEmail,
      password: signUpPassword,
    }).then((response) => {
      if (response.status == 201) {
        console.log("RESPONSE:", response);
        localStorage.setItem('refreshed', 'false');
        console.log("RESPONSE:", response.data);
        localStorage.setItem('user', JSON.stringify(response.data))
        nav("/feed", { state: { username: signUpUsername, email: signUpEmail, password: signUpPassword } });
      }else{
        console.log("Sign Up Error", response);
      }
    }).catch((error) => {
      console.log("Sign Up Error", error);
    });
    //window.location.href="feed"

  };

  return (
    <Container component="main" sx={{ pt: 15 }}>
      <Grid container spacing={0}>

        {/* Sign In Section */}

        <Grid item xs>
          <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: '#2AC07F' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in to your SocDist Account
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    onChange={(e) => { setSignInUsername(e.target.value) }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(e) => { setSignInPassword(e.target.value) }}
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <FormHelperText>{helperText}</FormHelperText>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </Grid>

        {/* Sign Up Section */}

        <Grid item xs>
          <Box sx={{ borderLeft: 1, borderColor: 'grey.500' }}>
            <ThemeProvider theme={theme}>
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                  sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: '#E53935' }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    or create a new one
                  </Typography>
                  <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="username"
                          label="Username"
                          name="username"
                          autoComplete="username"
                          onChange={(e) => { setSignUpUsername(e.target.value) }}
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
                          onChange={(e) => { setSignUpEmail(e.target.value) }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="new-password"
                          onChange={(e) => { setSignUpPassword(e.target.value) }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={<Checkbox value="allowExtraEmails" color="primary" />}
                          label="I want to receive inspiration, marketing promotions and updates via email."
                        />
                      </Grid>
                    </Grid>
                    <Button
                      type="button"
                      onClick={onSignUpSubmit}
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign Up
                    </Button>
                  </Box>
                </Box>
              </Container>
            </ThemeProvider>
          </Box>
        </Grid>
      </Grid>

      {/* Copyright Section */}

      <Copyright sx={{ mt: 10 }} />
    </Container>

  );
}