import * as React from 'react';
import axios from 'axios'
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import Container from '@mui/material/Container';
export default function AboutUs() {
  const [followRequests, setFollowRequests] = React.useState([]);
  const [followers, setFollowers] = React.useState([]);
  const user = JSON.parse(localStorage.getItem('user')!);
  React.useEffect(() => {
  }, []);


  const handleAcceptRequest = (id: number) => {
    // TODO: handle accepting the follow request with the given id
  };

  const handleRejectRequest = (id: number) => {
    // TODO: handle rejecting the follow request with the given id
  };

  return (
    <Container sx={{pt: 15}}>
    <Paper >
      <Typography variant="h5" style={{ marginBottom: 16 }}>
        {user.displayName}'s Profile
      </Typography>

      <Typography variant="h6" style={{ marginBottom: 8 }}>
        Followers
      </Typography>
      {followers.length > 0 ? (
        <List>
          {followers.map((follower) => (
            <ListItem key={follower.id}>
              <ListItemAvatar>
                <Avatar>{follower.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={follower.name} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No followers yet.</Typography>
      )}

      <Typography variant="h6" style={{ marginTop: 16, marginBottom: 8 }}>
        Follow Requests
      </Typography>
      {followRequests.length > 0 ? (
        <List>
          {followRequests.map((request) => (
            <ListItem key={request.id}>
              <ListItemAvatar>
                <Avatar>{request.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={request.name} />
              <ListItemSecondaryAction>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => handleAcceptRequest(request.id)}
                >
                  Accept
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => handleRejectRequest(request.id)}
                >
                  Reject
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No follow requests.</Typography>
      )}
    </Paper>
    </Container>
  );
};


    // return (
    //     <div id="about-us">
    //       <div>
    //         <p>
    //             About Us page
    //         </p>
    //       </div>
    //     </div>
    // )}