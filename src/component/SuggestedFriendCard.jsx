import React, { useState } from 'react';
import { Box, Typography, Avatar, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const SuggestedFriendCard = ({ key, user, isFollowed, LoginUser, onFollowToggle, onSelect }) => {

  let [Followed, setFollowed] = useState(isFollowed);
  let [FollowingLoader, setFollowingLoader] = useState(null)
  let [loadingIndex, setloadingIndex] = useState(null)

  console.log(key);


  const Following = async (ID) => {

    setFollowingLoader(true);
    setloadingIndex(key);

    try {
      const res = await axios.post(`https://deepchat-backend-qrc9.onrender.com/user/followeing/${ID}`, {
        currentUserId: LoginUser._id,
      });

      // window.location.reload();
      setFollowed(res.data.isFollowing);

    } catch (error) {

      console.log(error);

    } finally {

      setFollowingLoader(false);
      setFollowingLoader(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#1a1a1a',
        borderRadius: '16px',
        margin: '10px 12px',
        padding: '12px 16px',
        transition: 'all 0.3s ease',
        border: '1px solid #333',
        '&:hover': {
          backgroundColor: '#2c2c2c',
          boxShadow: '0 0 10px #bb86fc33',
        },
      }}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box display="flex" alignItems="center" gap={2} onClick={onSelect} sx={{ cursor: 'pointer', flexGrow: 1 }}>
        <Avatar
          sx={{
            mr: 2,
            fontWeight: 'bold',
            background: Followed
              ? 'linear-gradient(135deg, #666 0%, #444 100%)'
              : 'linear-gradient(135deg, #bb86fc 0%, #03dac6 100%)',
            color: '#fff',
          }}
        />
        <Box>
          <Typography fontWeight={600} color="#fff">{user.username}</Typography>
          <Typography fontSize={12} color="#888">
            {Followed ? 'Following' : 'Suggested'}
          </Typography>
        </Box>
      </Box>
      <Button
        size="small"
        variant={Followed ? 'outlined' : 'contained'}
        disabled={loadingIndex === key}
        sx={{
          textTransform: 'none',
          borderRadius: '7px',
          fontSize: '12px',
          minWidth: '70px',
          color: Followed ? '#bb86fc' : '#121212',
          borderColor: '#bb86fc',
          background: Followed
            ? 'linear-gradient(135deg, #666 0%, #444 100%)'
            : 'linear-gradient(135deg, #bb86fc 0%, #03dac6 100%)',
          '&:hover': {
            bgcolor: Followed ? '#2a2a2a' : '#9a68db',
            borderColor: '#bb86fc',
          },
        }}
        onClick={() => onFollowToggle ? onFollowToggle(user._id) : Following(user._id)}
      >
        <CircularProgress
          size={16}
          sx={{
            color: '#bb86fc',
            position: 'absolute',
            visibility: loadingIndex === key ? 'visible' : 'hidden',
          }}
        />

        <span style={{ visibility: loadingIndex === key ? 'hidden' : 'visible' }}>
          {Followed?"Following":"Follow"}
        </span>
      </Button>
    </Box>
  );
};

export default SuggestedFriendCard;
