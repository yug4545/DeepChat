import React, { useState } from 'react';
import { Box, Typography, Avatar, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const SuggestedFriendCard = ({ index, isloading, user, isFollowed, LoginUser, onFollowToggle, onSelect }) => {

  let [Followed, setFollowed] = useState(false);
  let [Followloader, setFollowloader] = useState(null);

  const Following = async (ID, i) => {

    setFollowloader(true);
    try {
      const res = await axios.post(`https://deepchat-backend-qrc9.onrender.com/user/followeing/${ID}`, {
        currentUserId: LoginUser._id,
      });

      // window.location.reload();
      setFollowed(res.data.isFollowing);

    } catch (error) {

      toast.error(error);

    } finally {
      setFollowloader(false);
    }

  };

  return (
    <Box
      sx={{
        backgroundColor: '#1a1a1a',
        borderRadius: '16px',
        margin: '10px 0px',
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
            background: isFollowed || Followed
              ? 'linear-gradient(135deg, #666 0%, #444 100%)'
              : 'linear-gradient(135deg, #bb86fc 0%, #03dac6 100%)',
            color: '#fff',
          }}
        />
        <Box>
          <Typography fontWeight={600} color="#fff">{user.username}</Typography>
          <Typography fontSize={12} color="#888">
            {isFollowed || Followed ? 'Following' : 'Suggested'}
          </Typography>
        </Box>
      </Box>
      <Button
        size="small"
        variant={isFollowed || Followed ? 'outlined' : 'contained'}
        disabled={isloading}
        sx={{
          textTransform: 'none',
          borderRadius: '7px',
          fontSize: '12px',
          minWidth: '70px',
          height: '32px',
          '&:hover': {
            backgroundColor: '#2a2a2a',
            borderColor: '#bb86fc',
          },
          color: isFollowed || Followed ? '#bb86fc' : '#121212',
          borderColor: '#bb86fc',
          background: isFollowed || Followed
            ? 'linear-gradient(135deg, #666 0%, #444 100%)'
            : 'linear-gradient(135deg, #bb86fc 0%, #03dac6 100%)',
          '&:hover': {
            bgcolor: isFollowed || Followed ? '#2a2a2a' : '#9a68db',
            borderColor: '#bb86fc',
          },
        }}
        onClick={() => onFollowToggle ? onFollowToggle(user._id, index) : Following(user._id, index)}
      >
        <CircularProgress
          size={16}
          sx={{
            color: 'black',
            position: 'absolute',
            visibility: isloading || Followloader ? 'visible' : 'hidden',
          }}
        />

        <span style={{ visibility: isloading || Followloader ? 'hidden' : 'visible' }}>{isFollowed || Followed ? "Following" : "Follow"}</span>
      </Button>
    </Box>
  );
};

export default SuggestedFriendCard;
