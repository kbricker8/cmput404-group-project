//@ts-nocheck
import { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/lab';
import { Box, Button, Card, CardContent, Typography, TextField, Grid, Stack, ThemeProvider, createTheme, CssBaseline, Chip } from '@mui/material';
import axios from 'axios';
import { Container } from '@mui/system';
import { Author } from '../types/author';
import { ConstructionOutlined } from '@mui/icons-material';
import { OUR_API_URL, TEAM18_API_URL, TEAM7_API_URL } from '../consts/api_connections';
const theme = createTheme();

type Follower = {
  id?: string;
  name?: string;
  host?: string;
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
  const [following, setFollowing] = useState<Follower[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [friends, setFriends] = useState<Follower[]>([]);
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [confirmRemoveFriend, setConfirmRemoveFriend] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem('user')!);
  const USER_ID = localStorage.getItem('USER_ID')!;
  const token = JSON.parse(localStorage.getItem('token')!);
  const handleAddFollower = () => {
    if (selectedAuthor?.host === OUR_API_URL) {
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
    console.log('SELECTED AUTHOR:', selectedAuthor)
    if (selectedAuthor?.host === "https://sd-7-433-api.herokuapp.com") {
      console.log('ADD FOLLOWER TEAM 7:', selectedAuthor);
      axios.post(`${TEAM7_API_URL}authors/${selectedAuthor.id.toString().split(/[/]+/).pop()}/inbox/`,
        {
          summary: "Our author wants to follow you",
          type: "follow",
          author: { url: `${TEAM7_API_URL}authors/${selectedAuthor.id.toString().split(/[/]+/).pop()}` },
          object: `${OUR_API_URL}service/authors/${USER_ID}`,
        },
        {
          headers: {
            'Authorization': 'Basic ' + btoa('node01:P*ssw0rd!')
          }
        }
      ).then((response) => {
        console.log('TEAM7 AUTHOR RESPONSE:', response);
      }).catch((error) => {
        console.log('TEAM7 AUTHOR ERROR:', error);
      });
    }
    if (selectedAuthor?.host === "https://distributed-social-net.herokuapp.com/") {
      console.log('ADD FOLLOWER TEAM 18:', selectedAuthor);
      axios.post(`${TEAM18_API_URL}authors/${selectedAuthor.id.toString().split(/[/]+/).pop()}/inbox`,
        {
          summary: "Our author wants to follow you",
          type: "follow",
          author: { url: `${TEAM18_API_URL}authors/${selectedAuthor.id.toString().split(/[/]+/).pop()}` },
          object_id: `${OUR_API_URL}service/authors/${USER_ID}`,
        }
      ).then((response) => {
        console.log('TEAM18 ADD FOLLOWER RESPONSE:', response);
      }).catch((error) => {
        console.log('TEAM18  ADD FOLLOWER ERROR:', error);
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
    //followerId = followerId.toString().split(/[/]+/).pop()!;
    setConfirmRemove(null);
    console.log('REMOVE FOLLOWER:', followerId);
    //axios.post(`${OUR_API_URL}service/authors/${USER_ID}/followers/unfollow/`, { "id": followerId }, {
    axios.post(`${OUR_API_URL}service/authors/${followerId}/followers/unfollow/`, { "id": USER_ID }, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then((response) => {
      console.log(followers);
      console.log('REMOVE FOLLOWER RESPONSE:', response);
      //setFollowers(followers.filter((follower) => follower.id!.toString().split(/[/]+/).pop()! !== followerId));
      setFollowing(following.filter((follower) => follower.id!.toString().split(/[/]+/).pop()! !== followerId));
      setFriends(friends.filter((friend) => friend.id!.toString().split(/[/]+/).pop()! !== followerId));
    }).catch((error) => {
      console.log('followerId:', followerId);
      console.log('REMOVE FOLLOWER ERROR:', error);
    });
  };
  const handleAcceptRequest = (request: FollowRequest, host: string) => {
    console.log('ACCEPT REQUEST:', request);
    axios.post(`${OUR_API_URL}service/authors/${USER_ID}/follow-request/${request.id.toString().split(/[/]+/).pop()}/accept/`, {}, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(
      (response) => {
        console.log('ACCEPT REQUEST RESPONSE:', response);
        setFollowRequests(followRequests.filter((followRequest) => followRequest.id !== request.id));
        setFollowers([...followers, { id: request.id.toString().split(/[/]+/).pop(), name: request.name, host: OUR_API_URL }]);
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
  const testOnclick = () => {
    console.log('TEST ONCLICK');
    //boop5
    // const us = "134fdf86-19be-4245-884f-3dd8c6731d66";
    //boop 
    const us = "a71a002a-b0e3-401b-81f1-a7222de30720";
    // Sign up to team 18
    // axios.post(`${TEAM18_API_URL}service/authors`, {
    //   "url": `https://distributed-social-net.herokuapp.com/134fdf86-19be-4245-884f-3dd8c6731d66`,
    //   "host": "https://social-distribution-group21.herokuapp.com/",
    //   "displayName": "boop5",
    //   "github": "https://github.com/jacob-gerun",
    //   "profileImage": ""
    // }).then((response) => {
    //   console.log('TEAM18 SIGN UP RESPONSE:', response);
    // }
    // ).catch((error) => {
    //   console.log('TEAM18 SIGN UP ERROR:', error);
    // });
    // 401 from team18, cant put
    // const team18 = "d1e33fd42e1c441d90bb13558883aae3";
    // axios.put(`${TEAM18_API_URL}service/authors/${team18}/followers/134fdf86-19be-4245-884f-3dd8c6731d66`).then((response) => {
    //   console.log('TEAM18 RESPONSE:', response);
    // }
    // ).catch((error) => {
    //   console.log('TEAM18 ERROR:', error);
    // });
    //Sign up to team 7
    // C. S. Lewis ID
    const team7 = "12fae447-fb43-4cbc-84f9-8965aab66926"
    // axios.put(`${TEAM7_API_URL}/authors/${team7}/followers/${us}/`,
    // {
    //   headers: {
    //     'Authorization': 'Basic ' + btoa('node01:P*ssw0rd!')
    //   }
    // }).then((response) => {
    //   console.log('TEAM7 AUTHOR RESPONSE:', response);
    // }).catch((error) => {
    //   console.log('TEAM7 AUTHOR ERROR:', error);
    // }
    // );
    axios.post(`${OUR_API_URL}authors/${us}/inbox/`,
    {
      summary: "Our author wants to follow you",
      type: "follow",
      object: `${TEAM7_API_URL}authors/${team7}` ,
      author: { url: `${OUR_API_URL}service/authors/${us}`},
    },
    {
      headers: {
        'Authorization': `Token ${token}`
      },
      data: {
        summary: "Our author wants to follow you",
        type: "follow",
        object: `${TEAM7_API_URL}authors/${team7}` ,
        author: { url: `${OUR_API_URL}service/authors/${us}`},
      }
    }
  ).then((response) => {
    console.log('TEAM7 AUTHOR RESPONSE:', response);
  }).catch((error) => {
    console.log('TEAM7 AUTHOR ERROR:', error);
  });
    // axios.post(`${OUR_API_URL}authors/${us}/inbox/`,
    //   {
    //     summary: "Our author wants to follow you",
    //     type: "follow",
    //     object: `${TEAM7_API_URL}authors/${team7}` ,
    //     author: { url: `${OUR_API_URL}service/authors/${us}`},
    //   },
    //   {
    //     headers: {
    //       'Authorization': 'Basic ' + btoa('node01:P*ssw0rd!')
    //     },
    //     data: {
    //       summary: "Our author wants to follow you",
    //       type: "follow",
    //       object: `${TEAM7_API_URL}authors/${team7}` ,
    //       author: { url: `${OUR_API_URL}service/authors/${us}`},
    //     }
    //   }
    // ).then((response) => {
    //   console.log('TEAM7 AUTHOR RESPONSE:', response);
    // }).catch((error) => {
    //   console.log('TEAM7 AUTHOR ERROR:', error);
    // });
    // axios.post(`${TEAM7_API_URL}/authors/`,
    //   {
    //     headers: {
    //       'Authorization': 'Basic ' + btoa('node01:P*ssw0rd!')
    //     }
    //   }, {
    //   "url": `https://distributed-social-net.herokuapp.com/${us}`,
    //   "host": "https://social-distribution-group21.herokuapp.com/",
    //   "displayName": "boop5",
    //   "github": "https://github.com/jacob-gerun",
    //   "profileImage": ""
    // }).then((response) => {
    //   console.log('TEAM7 SIGN UP RESPONSE:', response);
    // }
    // ).catch((error) => {
    //   console.log('TEAM7 SIGN UP ERROR:', error);
    // });

  };

  useEffect(() => {
    const getOurAuthors = axios.get(`${OUR_API_URL}service/authors/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    const getTeam18Authors =
      axios.get(`${TEAM18_API_URL}service/authors`);
    const getTeam7Authors =
      axios.get(`${TEAM7_API_URL}authors/`, {
        headers: {
          'Authorization': 'Basic ' + btoa('node01:P*ssw0rd!')
        }
      });
    const getFriends = axios.get(`${OUR_API_URL}service/authors/${USER_ID}/friends/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    const getFollowing = axios.get(`${OUR_API_URL}service/authors/${USER_ID}/following/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    // const getTeam18Following = 
    axios.get(`${TEAM18_API_URL}service/authors/${USER_ID}/following/`).then((response) => {
      console.log('TEAM18 FOLLOWING:', response);

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
    //Get inbox follow requests
    const getInbox = axios.get(`${OUR_API_URL}service/authors/${USER_ID}/inbox/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    // }).then((response) => {
    //   console.log('OUR INBOX:', response);
    // }).catch((error) => {
    //   console.log('OUR INBOX ERROR:', error);
    // });
    Promise.all([getOurAuthors, getFriends, getFollowers, getFollowRequests, getFollowing, getTeam18Authors, getTeam7Authors,getInbox])
      .then((responses) => {
        const [ourAuthorsResponse, friendsResponse, followersResponse, followRequestsResponse, followingResponse, team18AuthorsResponse, team7AuthorsResponse,inboxResponse] = responses;

        const processItems = (items, type) => {
          return items.map((item) => {
            const id = item.toString().split(/[/]+/).pop();
            return axios.get(`${OUR_API_URL}service/authors/${id}/`, {
              headers: {
                'Authorization': `Token ${token}`
              }
            }).then((response) => {
              console.log(`GET ${type} INFO :`, response);
              return { id, name: response.data.displayName, host: OUR_API_URL };
            });
          });
        };

        const authors = ourAuthorsResponse.data.items.filter((author: Author) => author.id.toString().split(/[/]+/).pop() !== USER_ID);
        const team18Authors = team18AuthorsResponse.data.items.filter((author: Author) => author.id.toString().split(/[/]+/).pop() !== USER_ID);
        const team7Authors = team7AuthorsResponse.data.items.filter((author: Author) => author.id.toString().split(/[/]+/).pop() !== USER_ID);
        console.log("TESTING T18 Auths",team18Authors.filter((author: Author) => author.displayName !=="boop"));
        console.log("TESTING T7 Auths",team7Authors);
        setAuthors([...authors, ...team18Authors.filter((author: Author) => author.displayName !=="boop"), ...team7Authors.filter((author: Author) => author.displayName !=="boop")]);

        const friendPromises = processItems(friendsResponse.data.items, "FRIEND");
        const followerPromises = processItems(followersResponse.data.items, "FOLLOWER");
        const followingPromises = processItems(followingResponse.data.items, "FOLLOWING");
        console.log("IN PROMISE INBOX",inboxResponse.data.items);
        const inboxFollowRequests = inboxResponse.data.items.filter((item) => item.type === "follow-request");
        console.log("INBOX FOLLOW REQUESTS",inboxFollowRequests);
        Promise.all(followerPromises).then((followers) => {
          console.log('FOLLOWERS:', followers);
          setFollowers(followers);
        });

        Promise.all(friendPromises).then((friends) => {
          setFriends(friends);
          setFollowers(followers.filter((follower) => !friends.some((friend) => friend.id === follower.id)));
        });

        Promise.all(followingPromises).then((following) => {
          setFollowing(following);
        });

        const followRequests: FollowRequest[] = [];
        for (const followerRequest of followRequestsResponse.data) {
          const id = followerRequest.actor.id.toString().split(/[/]+/).pop();
          followRequests.push({ id, name: followerRequest.actor.displayName });
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
          {/* <Button onClick={testOnclick}>Test</Button> */}
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
                          {/* {confirmRemove === friend.id ? (
                            <Box>
                              <Button onClick={() => handleCancelRemoveFollower()}>Cancel</Button>
                              <Button onClick={() => handleConfirmRemove(friend.id)}>Confirm</Button>

                            </Box>
                          ) : (
                            <Button onClick={() => handleRemoveFollower(friend.id)}>Remove</Button>
                            // <Button onClick={() => handleCancelRemoveFollower(follower.id)}>Remove</Button>

                          )} */}
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

                          </CardContent>
                        </Card>
                      ))}
                  </Box>
                </Container>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ borderRight: 1, borderColor: 'grey.500', height: '100%' }}>
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
                    <Typography variant="h3" paddingBottom={2}>Following</Typography>
                    {following.length == 0 ?
                      <Typography>You are not following anyone yet!</Typography>
                      : following.map((following) => (
                        <Card key={following.id}>
                          <CardContent>
                            <Typography>{following.name}</Typography>
                            {confirmRemove === following.id ? (
                              <Box>
                                <Button onClick={() => handleCancelRemoveFollower()}>Cancel</Button>
                                <Button onClick={() => handleConfirmRemove(following.id)}>Confirm</Button>

                              </Box>
                            ) : (
                              <Button onClick={() => handleRemoveFollower(following.id)}>Remove</Button>
                              // <Button onClick={() => handleCancelRemoveFollower(follower.id)}>Remove</Button>

                            )}
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
            <Grid item xs={3}>
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