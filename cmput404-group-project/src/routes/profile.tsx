import { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/lab';
import { Box, Button, Card, CardContent, Typography, TextField, Grid, Stack, ThemeProvider, createTheme, CssBaseline, Chip } from '@mui/material';
import axios from 'axios';
import { Container } from '@mui/system';
import { Author } from '../types/author';
import { ConstructionOutlined } from '@mui/icons-material';

const theme = createTheme();

type Follower = {
  id: string;
  name: string;
};

type FollowRequest = {
  id: string;
  name: string;
};
// type FollowerResponseObject = {
//   actor: string; // Actor is the folower
//   object: string; // object is the followee
//   summary: string;
// };
export default function Profile() {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [friends, setFriends] = useState<Follower[]>([]);
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem('user')!);
  const token = JSON.parse(localStorage.getItem('token')!);
  const handleAddFollower = () => {
    if (selectedAuthor) {
      console.log('ADD FOLLOWER:', selectedAuthor);
      axios
        .post(`http://127.0.0.1:8000/service/authors/${selectedAuthor.id}/follow-request/${user.id}/send/`, {}, {
          headers: {
              'Authorization': `Token ${token}`
          }
          })
        .then((response) => {
          console.log('ADD FOLLOWER RESPONSE:', response);
        })
        .catch((error) => {
          console.log('ADD FOLLOWER ERROR:', error);
        });
    }
  };
  const handleRemoveFollower = (followerId: string) => {
    setConfirmRemove(followerId);
  };
  const handleCancelRemoveFollower = () => {
    console.log('CANCEL REMOVE FOLLOWER')
    setConfirmRemove(null);
  };
  const handleConfirmRemove = (followerId: string) => {
    setConfirmRemove(null);
    axios.post(`http://127.0.0.1:8000/service/authors/${user.id}/followers/unfollow/`, { "id": followerId }, {
      headers: {
          'Authorization': `Token ${token}`
      }
      }).then((response) => {
      console.log(followers);
      console.log('REMOVE FOLLOWER RESPONSE:', response);
      setFollowers(followers.filter((follower) => follower.id !== followerId));
      setFriends(friends.filter((friend) => friend.id !== followerId));
    }).catch((error) => {
      console.log('REMOVE FOLLOWER ERROR:', error);
    });
  };
  const handleAcceptRequest = (request: FollowRequest) => {
    console.log('ACCEPT REQUEST:', request);
    axios.post(`http://127.0.0.1:8000/service/authors/${user.id}/follow-request/${request.id}/accept/`, {}, {
      headers: {
          'Authorization': `Token ${token}`
      }
      }).then(
      (response) => {
        console.log('ACCEPT REQUEST RESPONSE:', response);
        setFollowRequests(followRequests.filter((followRequest) => followRequest.id !== request.id));
        setFollowers([...followers, { id: request.id, name: request.name }]);
      }).catch((error) => {
        console.log('ACCEPT REQUEST ERROR:', error);
      }
      )
  };

  const handleRejectRequest = (request: FollowRequest) => {
    console.log('REJECT REQUEST:', request);
    axios.get(`http://127.0.0.1:8000/service/authors/${user.id}/follow-request/${request.id}/decline/`, {
      headers: {
          'Authorization': `Token ${token}`
      }
      }).then(
      (response) => {
        console.log('ACCEPT REQUEST RESPONSE:', response);
        setFollowRequests(followRequests.filter((followRequest) => followRequest.id !== request.id));
      }).catch((error) => {
        console.log('ACCEPT REQUEST ERROR:', error);
      }
      )
  };
  useEffect(() => {
    //Get all authors for sending friend requests
    axios.get(`http://127.0.0.1:8000/service/authors/`, {
      headers: {
          'Authorization': `Token ${token}`
      }
      }).then((response) => {
      console.log('GET ALL AUTHORS RESPONSE:', response);
      console.log(response.data.items);
      setAuthors(response.data.items.filter((author: Author) => author.id !== user.id));
      console.log(authors);
    });
    // Get Friends
    axios
      .get(`http://127.0.0.1:8000/service/authors/${user.id}/friends/`, {
        headers: {
            'Authorization': `Token ${token}`
        }
        })
      .then((response) => {
        console.log('GET FRIENDS RESPONSE:', response);
        const friendPromises: Promise<Follower>[] = response.data.items.map((friend: string) => {
          console.log('FOR EACH FRIEND:', friend);
          return axios.get(`http://127.0.0.1:8000/service/authors/${friend}/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
            }).then((response) => {
            console.log('GET FRIEND INFO :', response);
            return { id: friend, name: response.data.displayName };
          });
        });
        Promise.all(friendPromises).then((friends) => {
          console.log('FRIENDS:', friends);
          setFriends(friends);
        });

      }).catch((error) => {
        console.log('GET FRIENDS ERROR:', error);
      });
    //Get Followers
    axios
      .get(`http://127.0.0.1:8000/service/authors/${user.id}/followers/`, {
        headers: {
            'Authorization': `Token ${token}`
        }
        })
      .then((response) => {
        console.log('GET FOLLOWERS RESPONSE:', response);

        const followerPromises: Promise<Follower>[] = response.data.items.map((follower: string) => {
          console.log('FOR EACH FOLLOWER:', follower);
          return axios.get(`http://127.0.0.1:8000/service/authors/${follower}/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
            }).then((response) => {
            console.log('GET FOLLOWER INFO :', response);
            return { id: follower, name: response.data.displayName };
          });
        });

        Promise.all(followerPromises).then((followers) => {
          console.log('FOLLOWERS:', followers);
          setFollowers(followers);
        });
      })
      .catch((error) => {
        console.log('GET FOLLOWERS ERROR:', error);
      });

    //Get Follow Requests
    axios
      .get(`http://127.0.0.1:8000/service/authors/${user.id}/follow-request/`, {
        headers: {
            'Authorization': `Token ${token}`
        }
        })
      .then((response) => {
        console.log('GET FOLLOW REQUESTS RESPONSE:', response);
        const followRequests: FollowRequest[] = [];
        for (const followerRequest of response.data) {
          console.log('FOR EACH FOLLOW REQUEST:', followerRequest);
          followRequests.push({ id: followerRequest.actor.id, name: followerRequest.actor.displayName });
          console.log('FOLLOW REQUESTS:', followRequests);
        }
        setFollowRequests(followRequests);
      })
      .catch((error) => {
        console.log('GET FOLLOW REQUESTS ERROR:', error);
      });
  }, []);

  // return <p>Howdy</p>
  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ pt: 5 }}>
        <main>
          <Box sx={{ borderBottom: 1, borderColor: 'grey.500' }}>
            <Container maxWidth="lg">
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
                      Welcome to your profile!
                  </Typography>
                  <Typography variant="h6" align="left" paddingLeft={5} color="text.secondary" paragraph>
                      Here you can add/remove friends and manage follow-requests!
                  </Typography>
              </Stack>
            </Container>
          </Box>

        <Box sx={{ marginBottom: '30px', paddingTop: '25px', paddingLeft: '25px' }} alignContent="center">
          <Grid container spacing={2} alignItems="center" sx={{ marginTop: '16px' }}>
            <Grid item>
              <Typography variant="h4">Send a New Follow Request</Typography>
            </Grid>
            <Grid item>
              <Autocomplete
                sx={{ width: '300px' }}
                options={authors}
                getOptionLabel={(option) => option.displayName}
                value={selectedAuthor}
                onChange={(_, newValue) => setSelectedAuthor(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Select an author" />
                )}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleAddFollower}
                disabled={!selectedAuthor}
              >
                Confirm
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={0}>
          <Grid item xs={3}>
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
                <Typography variant="h3" paddingBottom={2}>Friends</Typography>
                {friends.length == 0 ?
                  <Typography>No friends yet!</Typography>
                  : friends.map((friend) => (
                    <Card key={friend.id}>
                      <CardContent>
                        <Typography>{friend.name}</Typography>
                      </CardContent>
                    </Card>
                  ))}
              </Box>
            </Container>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ borderLeft: 1, borderRight: 1, borderColor: 'grey.500' }}>
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
                  <Typography variant="h3" paddingBottom={2}>Followers</Typography>
                  {followers.length == 0 ?
                    <Typography>No followers yet!</Typography>
                    : followers.map((follower) => (
                      <Card key={follower.id}>
                        <CardContent>
                          <Typography>{follower.name}</Typography>
                          {confirmRemove === follower.id ? (
                            <Box>
                              <Button onClick={() => handleCancelRemoveFollower()}>Cancel</Button>
                              <Button onClick={() => handleConfirmRemove(follower.id)}>Confirm</Button>

                            </Box>
                          ) : (
                            <Button onClick={() => handleRemoveFollower(follower.id)}>Remove</Button>
                            // <Button onClick={() => handleCancelRemoveFollower(follower.id)}>Remove</Button>

                          )}
                        </CardContent>
                      </Card>
                    ))}
                </Box>
              </Container>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ borderColor: 'grey.500', height: '100%' }}>
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
                  <Typography variant="h3" paddingBottom={2}>Follow Requests</Typography>
                  {followRequests.length == 0 ?
                    <Typography>No follow requests yet!</Typography>
                    : followRequests.map((request) => (
                      <Card key={request.id}>
                        <CardContent>
                          <Typography>{request.name}</Typography>
                          <Button onClick={() => handleAcceptRequest(request)}>Accept</Button>
                          <Button onClick={() => handleRejectRequest(request)}>Reject</Button>
                        </CardContent>
                      </Card>
                    ))}

                  {/* POTENTIAL ALTERNATIVE TO CARD/CARDCONTENT */}

                  {/* {followRequests.length == 0 ?
                    <Typography>No follow requests yet!</Typography>
                    : followRequests.map((request) => (
                      <Chip 
                        key={request.id}
                        label={request.name}
                        // onDelete={handleRejectRequest(request)}
                      />
                  ))} */}

                </Box>
              </Container>
            </Box>
          </Grid>
        </Grid>
      </main>
      </Container>
    </ThemeProvider>
  
  );
};