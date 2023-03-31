import { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/lab';
import { Box, Button, Card, CardContent, Typography, TextField, Grid, Stack, ThemeProvider, createTheme, CssBaseline, Chip } from '@mui/material';
import axios from 'axios';
import { Container } from '@mui/system';
import { Author } from '../types/author';
import { ConstructionOutlined } from '@mui/icons-material';
import { OUR_API_URL } from '../consts/api_connections';
const theme = createTheme();

type Follower = {
  id?: string;
  name?: string;
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
  const USER_ID = localStorage.getItem('USER_ID')!;
  const token = JSON.parse(localStorage.getItem('token')!);
  const handleAddFollower = () => {
    if (selectedAuthor) {
      console.log('ADD FOLLOWER:', selectedAuthor);
      axios
        .post(`${OUR_API_URL}service/authors/${selectedAuthor.id.toString().split(/[/]+/).pop()}/follow-request/${USER_ID}/send/`, {}, {
          headers: {
            'Authorization': `Token ${token}`
          }
        })
        .then((response) => {
          console.log('ADD FOLLOWER RESPONSE:', response);
        })
        .catch((error) => {
          console.log('ADD FOLLOWER ERROR:', error);
          console.log('ERROR:', selectedAuthor.id.toString().split(/[/]+/).pop());
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
    followerId = followerId.toString().split(/[/]+/).pop()!;
    setConfirmRemove(null);
    axios.post(`${OUR_API_URL}service/authors/${USER_ID}/followers/unfollow/`, { "id": followerId }, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then((response) => {
      console.log(followers);
      console.log('REMOVE FOLLOWER RESPONSE:', response);
      setFollowers(followers.filter((follower) => follower.id!.toString().split(/[/]+/).pop()! !== followerId));
      setFriends(friends.filter((friend) => friend.id!.toString().split(/[/]+/).pop()! !== followerId));
    }).catch((error) => {
      console.log('REMOVE FOLLOWER ERROR:', error);
    });
  };
  const handleAcceptRequest = (request: FollowRequest) => {
    console.log('ACCEPT REQUEST:', request);
    axios.post(`${OUR_API_URL}service/authors/${USER_ID}/follow-request/${request.id.toString().split(/[/]+/).pop()}/accept/`, {}, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(
      (response) => {
        console.log('ACCEPT REQUEST RESPONSE:', response);
        setFollowRequests(followRequests.filter((followRequest) => followRequest.id !== request.id));
        setFollowers([...followers, { id: request.id.toString().split(/[/]+/).pop(), name: request.name }]);
      }).catch((error) => {
        console.log('ACCEPT REQUEST ERROR:', error);
      }
      )
  };

  const handleRejectRequest = (request: FollowRequest) => {
    console.log('REJECT REQUEST:', request);
    axios.post(`${OUR_API_URL}service/authors/${USER_ID}/follow-request/${request.id.toString().split(/[/]+/).pop()}/decline/`, {}, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(
      (response) => {
        console.log('ACCEPT REQUEST RESPONSE:', response);
        setFollowRequests(followRequests.filter((followRequest) => followRequest.id !== request.id));
      }).catch((error) => {
        console.log('ACCEPT REQUEST ERROR:', error);
        console.log(followRequests, request.id);
      }
      )
  };
  useEffect(() => {
    const getAllAuthors = axios.get(`${OUR_API_URL}service/authors/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });

    const getFriends = axios.get(`${OUR_API_URL}service/authors/${USER_ID}/friends/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });

    const getFollowers = axios.get(`${OUR_API_URL}service/authors/${USER_ID}/followers/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });

    const getFollowRequests = axios.get(`${OUR_API_URL}service/authors/${USER_ID}/follow-request/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });

    Promise.all([getAllAuthors, getFriends, getFollowers, getFollowRequests])
      .then((responses) => {
        const allAuthorsResponse = responses[0];
        console.log('GET ALL AUTHORS RESPONSE:', allAuthorsResponse);
        const authors = allAuthorsResponse.data.items.filter((author: Author) => author.id.toString().split(/[/]+/).pop() !== USER_ID);
        console.log(authors);

        const friendsResponse = responses[1];
        console.log('GET FRIENDS RESPONSE:', friendsResponse);
        const friendPromises: Promise<Follower>[] = friendsResponse.data.items.map((friend: string) => {
          friend = friend.toString().split(/[/]+/).pop()!;
          console.log('FOR EACH FRIEND:', friend);
          return axios.get(`${OUR_API_URL}service/authors/${friend}/`, {
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
          setFollowers(followers.filter((follower) => !friends.some((friend) => friend.id === follower.id)));
          console.log(followers.filter((follower) => !friends.some((friend) => friend.id === follower.id)));
        });

        const followersResponse = responses[2];
        console.log('GET FOLLOWERS RESPONSE:', followersResponse);
        const followerPromises: Promise<Follower>[] = followersResponse.data.items.map((follower: string) => {
          console.log('FOR EACH FOLLOWER:', follower.toString().split(/[/]+/).pop());
          return axios.get(`${OUR_API_URL}service/authors/${follower.toString().split(/[/]+/).pop()}/`, {
            headers: {
              'Authorization': `Token ${token}`
            }
          }).then((response) => {
            console.log('GET FOLLOWER INFO :', response);
            return { id: follower.toString().split(/[/]+/).pop(), name: response.data.displayName };
          });
        });

        Promise.all(followerPromises).then((followers) => {
          console.log('FOLLOWERS:', followers);
          setFollowers(followers);
        });

        const followRequestsResponse = responses[3];
        console.log('GET FOLLOW REQUESTS RESPONSE:', followRequestsResponse);
        const followRequests: FollowRequest[] = [];
        for (const followerRequest of followRequestsResponse.data) {
          console.log('FOR EACH FOLLOW REQUEST:', followerRequest.toString().split(/[/]+/).pop());
          followRequests.push({ id: followerRequest.actor.id.toString().split(/[/]+/).pop(), name: followerRequest.actor.displayName });
          console.log('FOLLOW REQUESTS:', followRequests);
        }
        setFollowRequests(followRequests);
      })
      .catch((error) => {
        console.log('ERROR:', error);
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