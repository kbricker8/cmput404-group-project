import { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { Container } from '@mui/system';

type Follower = {
  id: string;
  name: string;
};

type FollowRequest = {
  id: string;
  name: string;
};
// type FollowerResponseObject = {
//   actor: string; // Actor is the folowee
//   object: string; // object is the follower
//   summary: string;
// };
export default function AboutUs() {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);

  const user = JSON.parse(localStorage.getItem('user')!);
  const handleAcceptRequest = (request: FollowRequest) => {
    console.log('ACCEPT REQUEST:', request);
    axios.get(`http://127.0.0.1:8000/service/authors/${user.id}/follow-request/${request.id}/accept/`).then(
      (response) => {
        console.log('ACCEPT REQUEST RESPONSE:', response);
      }).catch((error) => {
        console.log('ACCEPT REQUEST ERROR:', error);
      }
      )
  };

  const handleRejectRequest = (request: FollowRequest) => {
    //TODO
  };
  useEffect(() => {
    //Get Followers
    axios
      .get(`http://127.0.0.1:8000/service/authors/${user.id}/followers/`)
      .then((response) => {
        console.log('GET FOLLOWERS RESPONSE:', response);

        const followerPromises: Promise<Follower>[] = response.data[0].items.map((follower: string) => {
          console.log('FOR EACH FOLLOWER:', follower);
          return axios.get(`http://127.0.0.1:8000/service/authors/${follower}/`).then((response) => {
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
      .get(`http://127.0.0.1:8000/service/authors/${user.id}/follow-request/`)
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
    <>
      <Container sx={{ paddingTop: '64px' }}>
        <Box sx={{ marginBottom: '32px' }}>
          <Typography variant="h2">Followers</Typography>
          {followers.map((follower) => (
            <Card key={follower.id}>
              <CardContent>
                <Typography>{follower.name}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Box sx={{ marginBottom: '32px' }}>
          <Typography variant="h2">Follow Requests</Typography>
          {followRequests.map((request) => (
            <Card key={request.id}>
              <CardContent>
                <Typography>{request.name}</Typography>
                <Button onClick={() => handleAcceptRequest(request)}>Accept</Button>
                <Button onClick={() => handleRejectRequest(request)}>Reject</Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

    </>
  );
};