import React, { useEffect, useState, useRef } from 'react';
import { Box, TextField, Button, Typography, Avatar, IconButton, Menu, MenuItem, LinearProgress, Drawer } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import socket from './Socket';
import axios from 'axios';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom'; // import useNavigate
import SearchIcon from '@mui/icons-material/Search';
import { Fade, Slide } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SuggestedFriendCard from '../component/SuggestedFriendCard';
import Tooltip from '@mui/material/Tooltip';
import ClearIcon from '@mui/icons-material/Clear';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';

const Home = () => {
  const [messages, setMessages] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const messageEndRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [SearchName, setSearchName] = useState('');
  const [isOnline, setisOnline] = useState('');
  const [Searchfilteruser, setSearchfilteruser] = useState([]);
  const settings = ['Profile', 'Logout'];
  const [ActiveChat, setActiveChat] = useState(null);
  const [Chatloader, setChatloader] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [FollowLoadingIndex, setFollowLoadingIndex] = useState(null);
  const [UserLoader, setUserLoader] = useState(null);
  const [open, setOpen] = React.useState(false);




  const location = useLocation();
  const navigate = useNavigate();
  let LoginUser = location?.state;

  const [filteredList, setFilteredList] = useState([]);
  const [followedList, setFollowedList] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [suggestedList, setSuggestedList] = useState([]);


  // filter following , follow , searchName 


  useEffect(() => {
    const list = SearchName ? Searchfilteruser : users;
    setFilteredList(list);

    // Users that current user follows
    const followed = list.filter(user => followedUsers.includes(user._id));
    setFollowedList(followed);

    // Users not followed (suggested)
    const suggestions = list.filter(
      user => !followedUsers.includes(user._id) && user.username !== LoginUser.username
    );
    setSuggestedList(suggestions);
    setFilteredSuggestions(suggestions);
  }, [SearchName, Searchfilteruser, users, followedUsers, LoginUser]);


  const sectionStyle = {
    fontWeight: 600,
    fontSize: '14px',
    background: 'linear-gradient(to right, #1e1e1e, #2c2c2c)',
    color: '#bb86fc',
    padding: '10px 16px',
    borderRadius: '8px',
    margin: '16px 12px 8px',
  };

  const userCardStyle = {
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
  };



  const SubmitHandler = async (e) => {
    e.preventDefault();

    const newMessage = {
      sender: LoginUser?._id,
      receiver: selectedUser?._id,
      messages,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };

    setMessages("")
    setReceivedMessages((prev) => [...prev, newMessage]);
    try {

      let res = await axios.post('https://deepchat-backend-qrc9.onrender.com/chat/createchat', {
        sender: newMessage.sender,
        receiver: newMessage.receiver,
        text: newMessage.messages,
      });

      socket.emit('Message', newMessage);


    } catch (error) {
      toast.error(error);

    }
    setMessages('');
  };

  const UserSelect = async (user, index) => {

    if (selectedUser?._id !== user?._id) {

      setSelectedUser(user);
      setActiveChat(user?._id);
      setReceivedMessages([]);
      setChatloader(true);
      try {

        let res = await axios.post('https://deepchat-backend-qrc9.onrender.com/chat/getchat', { sender: LoginUser?._id, receiver: user?._id })

        if (res.data?.chat?.messages?.length > 0) {

          setReceivedMessages(res.data.chat.messages);
        } else {
          setReceivedMessages([]);
        }

      } catch (error) {

        toast.error("Failed to load chat.");

      } finally {
        setChatloader(false);
      }
    }
  };

  const Following = async (ID, index, True = false) => {

    True ? setFollowLoadingIndex(index) : setLoadingIndex(index);

    try {

      const res = await axios.post(`https://deepchat-backend-qrc9.onrender.com/user/followeing/${ID}`, {
        currentUserId: LoginUser._id,
      });

      //get perticuler Following or Follow

      const ress = await axios.get(`https://deepchat-backend-qrc9.onrender.com/user/following/${ID}`);

      const updatedUser = ress.data.user;

      setUsers(prevUsers =>
        prevUsers.map(user => user._id === ID ? { ...user, ...updatedUser } : user)
      );

      if (res.data.isFollowing) {

        setFollowedUsers(prev => [...new Set([...prev, ID])]);

      } else {

        setFollowedUsers(prev => prev.filter(userId => userId !== ID));

      }

    } catch (error) {

      toast.error(error);

    } finally {

      setFollowLoadingIndex(null);
      setLoadingIndex(null);

    }
  };

  const SearchFriends = (e) => {
    const searchInput = e.target.value;
    setSearchName(searchInput);

    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchInput.toLowerCase())
    );
    setSearchfilteruser(filtered);
  };

  const handleClear = () => {
    setSearchName('');
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [receivedMessages]);

  const fetchUsers = async () => {
    setUserLoader(true)
    try {
      const res = await axios.get('https://deepchat-backend-qrc9.onrender.com/user/read');
      setUsers(res.data.users);

      const ress = await axios.get(`https://deepchat-backend-qrc9.onrender.com/user/following/${LoginUser._id}`);

      setFollowedUsers(ress.data.user.isFollowing);
    } catch (error) {
      toast.error('Error fetching users or following list:', error);
    } finally {
      setUserLoader(false);
    }
  };

  useEffect(() => {

    if (!LoginUser) {
      navigate("/");
      return;
    }
    if (!LoginUser) return;

    socket.emit("join", LoginUser._id);

    socket.on("receive-message", (data) => {

      // console.log("Received real-time message:", data.message);
      setReceivedMessages((prev) => [...prev, data]);
    });
  }, []);

  useEffect(() => {

    if (!localStorage.getItem("Token")) {
      navigate("/");
      return;
    } else {

      fetchUsers();
    }


  }, [navigate]);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Drawer

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setOpen(open);
  };

  const drawerList = (
    <Box
      sx={{
        width: 250,
        px: 3,
        py: 3,
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {/* Header Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" color="#fff" gutterBottom>
          Settings
        </Typography>
        <Divider sx={{ borderColor: '#444'}} />
      </Box>

      {/* Welcome Message */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          sx={{ lineHeight: 1.6, fontSize: 14, opacity: 0.85 }}
        >
          Welcome{' '}
          <Box component="span" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {LoginUser?.username}
          </Box>
          ! <br />
          You can view your profile or log out using the options below.
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#444'}} />

      {/* Menu List */}
      <List sx={{ flex: 1 }} dense>
        {settings.map((text, index) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => {
              handleCloseUserMenu();
              text === 'Profile'
                ? navigate('/profile', { state: { LoginUser, users } })
                : Logout();
            }}
          >
            <ListItemButton sx={{ py: 1.2 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                {index % 2 === 0 ? (
                  <PersonOutlineIcon sx={{ color: 'white' }} />
                ) : (
                  <LogoutIcon sx={{ color: 'white' }} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer Slogan */}
      <Box sx={{ textAlign: 'center', mt: 'auto', mb: 1 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 12, opacity: 0.4 }}
        >
          DeepChat – Connect. Chat. Repeat.
        </Typography>
      </Box>
    </Box>
  );

  let Logout = () => {

    localStorage.removeItem("Token");
    LoginUser = null;
    navigate("/");
    return;
  }


  return (
    <Box height="100vh" display="flex" bgcolor="#121212" color="#fff">
      {/* Sidebar */}
      <Box
        width="25%"
        bgcolor="#1e1e1e"
        borderRight="1px solid #333"
        display="flex"
        flexDirection="column"
      >
        {/* Header for Sidebar (optional) */}
        <Box px={2} py={2} fontWeight={600} borderBottom="1px solid #333" className="d-flex align-items-center justify-content-between">
          <Typography variant="h6" fontWeight={700} sx={{
            background: 'linear-gradient(45deg, #bb86fc, #03dac6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}> Chats </Typography>

          {/* You might also include a small profile icon in the header */}

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={toggleDrawer(true)} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: '#bb86fc',
                    color: '#121212',
                    fontSize: 16,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  {LoginUser?.username?.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Drawer
              anchor="right"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.95), rgba(45,45,45,0.98))',
                  borderLeft: '1px solid rgba(255,255,255,0.12)',
                  borderTopLeftRadius: '16px',
                  borderBottomLeftRadius: '16px',
                  boxShadow: `
        0 10px 25px -5px rgba(0, 0, 0, 0.6),
        0 16px 30px 2px rgba(0, 0, 0, 0.4),
        inset 0 0 0 1px rgba(255, 255, 255, 0.08)
      `,
                  backdropFilter: 'blur(16px) saturate(180%)',
                  width: 260,
                  overflowX: 'hidden',
                  px: 0,
                },
              }}
            >
              {drawerList}
            </Drawer>
          </Box>


        </Box>


        {/* Search Input */}
        <Box px={2} p={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search friends..."
            value={SearchName}
            onChange={SearchFriends}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: '#aaa', mr: 1 }} />
              ),
              endAdornment: SearchName && (
                <IconButton onClick={handleClear} sx={{ color: '#aaa' }}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
            sx={{
              input: { color: '#fff' },
              backgroundColor: '#2c2c2c',
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                paddingLeft: '8px',
                '& fieldset': {
                  borderColor: '#444',
                },
                '&:hover fieldset': {
                  borderColor: '#bb86fc',
                },
              },
            }}
          />
        </Box>

        {/* User List */}
        <Box flexGrow={1}
          overflow="auto"
          sx={{
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#555',
              borderRadius: '10px',
              border: '2px solid transparent',
              backgroundClip: 'content-box',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#777',
            },
            scrollbarWidth: 'thin', // Firefox
            scrollbarColor: '#555 transparent', // Firefox
          }}>
          {UserLoader ? (

            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress sx={{ color: 'gray' }} size={30} />
            </Box>

          ) : (
            <>
              {/* Following Section */}
              {followedList.length > 0 && (
                <Typography sx={sectionStyle}>Following</Typography>
              )}

              {followedList.map((user, index) => (
                <Box
                  key={`followed-${index}`}
                  onClick={() => UserSelect(user)}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    ...userCardStyle,
                    cursor: 'pointer',
                    flexGrow: 1,
                    backgroundColor: ActiveChat === user?._id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    borderRadius: 2,
                    transition: 'all 0.1s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: '#bb86fc', mr: 2, fontWeight: 'bold' }}>
                      {user?.username.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600} color="#fff">{user?.username}</Typography>
                      <Typography fontSize={12} color="#888">Following</Typography>
                    </Box>
                  </Box>

                  <Button
                    size="small"
                    variant="outlined"
                    disabled={UserLoader || loadingIndex === index}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '7px',
                      fontSize: '12px',
                      minWidth: '70px',
                      color: '#bb86fc',
                      borderColor: '#bb86fc',
                      height: '32px',
                      '&:hover': {
                        backgroundColor: '#2a2a2a',
                        borderColor: '#bb86fc',
                      },
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      Following(user._id, index);
                    }}
                  >
                    <CircularProgress
                      size={16}
                      sx={{
                        color: '#bb86fc',
                        position: 'absolute',
                        visibility: loadingIndex === index ? 'visible' : 'hidden',
                      }}
                    />
                    <span style={{ visibility: loadingIndex === index ? 'hidden' : 'visible' }}>
                      Following
                    </span>
                  </Button>
                </Box>
              ))}

              {/* Suggested Section */}
              {suggestedList.length > 0 && (
                <Typography sx={sectionStyle}>Suggested</Typography>
              )}

              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((user, index) => (
                  <SuggestedFriendCard
                    key={index}
                    isloading={FollowLoadingIndex === index}
                    user={user}
                    isFollowed={followedUsers.includes(user._id)}
                    onFollowToggle={() => Following(user._id, index, true)}
                    onSelect={() => UserSelect(user)}
                    sx={{ backgroundColor: ActiveChat == user?._id ? 'rgba(255, 255, 255, 0.2)' : 'transparent', }}
                  />
                ))
              ) : (
                <Typography
                  sx={{
                    color: '#888',
                    fontSize: '16px',
                    textAlign: 'center',
                    mt: 4,
                    background: 'linear-gradient(135deg, #bb86fc33, #03dac633)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #333',
                    maxWidth: '94%',
                    margin: '20px auto',
                    fontWeight: 500,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  No suggestions available for{' '}
                  <span style={{ color: '#bb86fc' }}>{LoginUser?.username}</span>
                </Typography>
              )}
            </>
          )}
        </Box>

      </Box>

      {/* Chat Section */}
      <Box width="75%" display="flex" flexDirection="column" bgcolor="#121212">
        {/* Header */}
        {selectedUser ? <Box bgcolor="#1f1f1f" p={1.1375} display="flex" alignItems="center" gap={2} sx={{ cursor: 'pointer' }} borderBottom="1px solid #333" >

          <Avatar sx={{ bgcolor: '#bb86fc', color: '#121212', fontWeight: 'bold' }} onClick={() => navigate("/profile", { state: { selectedUser, users } })}>
            {selectedUser ? selectedUser?.username.charAt(0) : '?'}
          </Avatar>

          <Box flexGrow={1}>
            <Typography variant="h6" color="#fff" >
              {selectedUser ? selectedUser?.username : 'ChatApp'}
            </Typography>
            {selectedUser && <Typography fontSize={12} color={selectedUser ? "#03dac6" : "#888"}>Online</Typography>}
          </Box>


        </Box> : ""}

        {/* Chat Messages */}
        <Box
          flexGrow={1}
          p={2}
          overflowY="auto"
          display="flex"
          flexDirection="column"
          gap={1.5}
          sx={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #2a2a2a 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { backgroundColor: '#1e1e1e' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#bb86fc',
              borderRadius: '4px',
              '&:hover': { backgroundColor: '#a36ce3' }
            },
          }}
        >
          {selectedUser ? (
            followedUsers.includes(selectedUser._id) ? (
              <Fade in timeout={500}>
                {/* Chat Messages */}
                <Box
                  flexGrow={1}
                  p={2}
                  height={"400px"}
                  overflow="auto"
                  display="flex"
                  flexDirection="column"
                  gap={1.5}
                  sx={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, #2a2a2a 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-track': { backgroundColor: '#1e1e1e' },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'linear-gradient( #bb86fc, #03dac6)',
                      borderRadius: '4px',
                      '&:hover': { backgroundColor: '#a36ce3' }
                    },
                  }}
                >
                  {selectedUser && followedUsers.includes(selectedUser._id) ? (
                    <Fade in timeout={500}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={1.5}
                        flexGrow={1}
                      >
                        {Chatloader ? (
                          <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={0.6}>

                            <LinearProgress color="inherit" />
                          </Stack>
                        ) : (
                          receivedMessages.map((msg, index) => {
                            if (msg.messages?.toLowerCase().includes('add')) return null;

                            const isLast = index === receivedMessages.length - 1;

                            const messageBox = (
                              <Box
                                key={index}
                                alignSelf={msg.sender === LoginUser?._id ? 'flex-end' : 'flex-start'}
                                px={2}
                                py={1}
                                maxWidth="75%"
                                sx={{
                                  background: msg.sender === LoginUser?._id
                                    ? 'linear-gradient(135deg, #3a0ca3, #7209b7, #4361ee)'
                                    : 'linear-gradient(135deg, rgba(33,33,33,0.8), rgba(66,66,66,0.9))',
                                  borderRadius: msg.sender === LoginUser?._id
                                    ? '10px 4px 10px 10px'
                                    : '4px 10px 10px 10px',
                                  boxShadow: msg.sender === LoginUser?._id
                                    ? '0 4px 15px rgba(114, 9, 183, 0.5)'
                                    : '0 4px 12px rgba(0, 0, 0, 0.3)',
                                  border: msg.sender === LoginUser?._id
                                    ? '1px solid rgba(114, 9, 183, 0.3)'
                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                  color: '#fff',
                                  backdropFilter: 'blur(6px)',
                                  WebkitBackdropFilter: 'blur(6px)',
                                  position: 'relative',
                                  transition: 'all 0.3s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  overflow: 'hidden',
                                  '&:hover': {
                                    transform: 'scale(1.015)',
                                    boxShadow: msg.sender === LoginUser?._id
                                      ? '0 0 20px rgba(114, 9, 183, 0.6)'
                                      : '0 0 12px rgba(255, 255, 255, 0.2)'
                                  },
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: msg.sender === LoginUser?._id
                                      ? 'linear-gradient(90deg, transparent, #4cc9f0, transparent)'
                                      : 'linear-gradient(90deg, transparent, #aaa, transparent)',
                                    opacity: 0.7
                                  }
                                }}
                              >
                                {/* Message Text */}
                                <Typography
                                  fontSize={15}
                                  sx={{
                                    flex: 1,
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: 1.5,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                                    pr: 2
                                  }}
                                >
                                  {msg?.messages}
                                </Typography>

                                {/* Time & Dot */}
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography
                                    fontSize={10}
                                    sx={{
                                      color: msg.sender === LoginUser?._id ? 'rgba(200, 225, 255, 0.9)' : 'rgba(200, 200, 200, 0.7)',
                                      whiteSpace: 'nowrap',
                                      letterSpacing: '0.5px',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    {msg?.time}
                                  </Typography>
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      background: msg.sender === LoginUser?._id ? '#4cc9f0' : '#a5a5a5',
                                      borderRadius: '50%',
                                      boxShadow: msg.sender === LoginUser?._id ? '0 0 6px #4cc9f0' : 'none',
                                      opacity: msg.sender === LoginUser?._id ? 0.8 : 0.6,
                                      animation: msg.sender === LoginUser?._id ? 'pulse 1.8s infinite' : 'none'
                                    }}
                                  />
                                </Box>

                                {/* Pulse Animation */}
                                <style>
                                  {`
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.3); opacity: 0.4; }
        100% { transform: scale(1); opacity: 0.8; }
      }
    `}
                                </style>
                              </Box>

                            );

                            return isLast && msg.sender === selectedUser._id && msg.receiver === LoginUser?._id
                              && msg.receiver === selectedUser._id && msg.sender === LoginUser?._id ? (
                              <Slide
                                key={index}
                                direction={msg.sender === LoginUser?._id ? 'left' : 'right'}
                                in={true}
                                timeout={300}
                              >
                                {messageBox}
                              </Slide>
                            ) : (
                              messageBox
                            );
                          })
                        )}

                        <div ref={messageEndRef} />
                      </Box>
                    </Fade>
                  ) : (
                    <Typography color="gray" textAlign="center" mt={4}>
                      {selectedUser ? 'Follow this user to start chatting!' : 'Select a user to start chatting.'}
                    </Typography>
                  )}
                </Box>
              </Fade>
            ) : (
              <Slide direction="down" in timeout={500}>
                <Box
                  textAlign="center"
                  mt={8}
                  p={4}
                  borderRadius={3}
                  mx="auto"
                  maxWidth="400px"
                  boxShadow={4}
                  bgcolor="#1e1e1e"
                  border="1px dashed #444"
                >
                  <PersonAddAlt1Icon sx={{ fontSize: 48, color: '#bb86fc', mb: 1 }} />
                  <Typography variant="h6" color="#fff" gutterBottom>
                    You must follow this user to chat
                  </Typography>
                  <Typography fontSize={14} color="#bbb" gutterBottom>
                    Click the <strong style={{ color: '#bb86fc' }}>“Follow”</strong> button from the sidebar to start messaging.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: '#bb86fc', color: '#000', fontWeight: 'bold' }}
                    onClick={() => Following(selectedUser._id)}
                  >
                    Follow Now
                  </Button>
                </Box>
              </Slide>
            )
          ) : (
            <Fade in timeout={500}>
              <Box
                className="w-100 h-100 d-flex align-items-center justify-content-center"
                sx={{ color: '#aaa', px: 2 }}
              >
                <Box textAlign="center" maxWidth="500px">
                  <Typography variant="h3" gutterBottom>
                    <Diversity3Icon sx={{ fontSize: 50, color: '#bb86fc' }} />
                  </Typography>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Welcome to ChatApp
                  </Typography>
                  <Typography gutterBottom>
                    Select a contact from the sidebar to start a conversation.
                  </Typography>
                  <Typography color="#888" paragraph>
                    ChatApp is a fast and secure messaging platform that lets you stay connected
                    with your friends, teammates, or clients — all in real-time.
                  </Typography>
                  <Typography color="#666">
                    Messages are end-to-end encrypted. Available across all your devices.
                  </Typography>
                </Box>
              </Box>
            </Fade>
          )}
          <div ref={messageEndRef} />
        </Box>

        {/* Message Input */}
        <Box
          component="form"
          onSubmit={SubmitHandler}
          display="flex"
          alignItems="center"
          p={2}
          bgcolor="#1e1e1e"
          gap={2}
          borderTop="1px solid #333"
        >
          <TextField
            fullWidth
            placeholder={`Type a message to ${selectedUser?.username || ''}...`}
            variant="outlined"
            size="small"
            value={messages}
            onChange={(e) => setMessages(e.target.value)}
            disabled={!selectedUser || !followedUsers.includes(selectedUser._id)}
            sx={{
              input: { color: '#fff' },
              backgroundColor: '#2c2c2c',
              borderRadius: '25px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                '& fieldset': {
                  borderColor: '#444',
                },
                '&:hover fieldset': {
                  borderColor: '#bb86fc',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#bb86fc',
                  borderWidth: '2px',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!selectedUser || !messages.trim() || !followedUsers.includes(selectedUser._id)}
            sx={{
              minWidth: '50px',
              borderRadius: '50%',
              padding: '12px',
              bgcolor: '#bb86fc',
              color: '#000',
              '&:hover': { bgcolor: '#9a68db' },
            }}
          >
            <SendIcon sx={{ color: '#fff' }} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
