import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Divider,
    IconButton,
    Grid,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Input,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import SuggestedFriendCard from './SuggestedFriendCard';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';


// Custom styled components
const GradientBox = styled(Box)({
    height: '180px',
    width: '100%',
    background: 'linear-gradient(135deg, #bb86fc 0%, #03dac6 100%)',
    position: 'relative',
    borderRadius: '0 0 20px 20px',
    boxShadow: '0 4px 20px rgba(187, 134, 252, 0.3)'
});

const ProfileAvatar = styled(Avatar)({
    width: '140px',
    height: '140px',
    border: '4px solid #121212',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    '&:hover': {
        transform: 'scale(1.05)',
        transition: 'transform 0.3s ease'
    }
});

const StatsBox = styled(Box)({
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    padding: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 15px rgba(187, 134, 252, 0.3)'
    }
});

const ProfilePage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const LoginUser = location.state?.LoginUser;
    let allUsers = location.state?.users || [];

    const [Loginuser, setLoginuser] = useState({});
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [profileData, setProfileData] = useState({
        username: '',
        bio: '',
        gender: '',
        profileImage: null
    });

    const [isLoadingSuggested, setIsLoadingSuggested] = useState(true);
    const [suggestedUsers, setsuggestedUsers] = useState([]);

    useEffect(() => {

        const fetchSuggestedUsers = async () => {
            setIsLoadingSuggested(true);

            let filter = allUsers.filter(
                (u) => {u._id !== Loginuser?._id && !Loginuser?.isFollowing?.includes(u._id);
                console.log(u.username);
                }
                
            );

            setIsLoadingSuggested(filter);
            setTimeout(() => setIsLoadingSuggested(false), 1500);
        };

        fetchSuggestedUsers();
    }, [allUsers]);

    const fetchUsersfollowing = async () => {
        try {
            const ress = await axios.get(`https://deepchat-backend-qrc9.onrender.com/user/following/${LoginUser?._id}`);
            setLoginuser({
                ...ress.data.user,
                isFollowing: ress.data.user?.isFollowing || [],
                isFollower: ress.data.user?.isFollower || []
            });
            // Initialize profile data with current user data
            setProfileData({
                username: ress.data.user?.username || '',
                bio: ress.data.user?.bio || '',
                gender: ress.data.user?.gender || '',
                profileImage: ress.data.user?.profileImage || null
            });
        } catch (error) {
            console.error('Error fetching users or following list:', error);
        }
    };

    const handleOpenEditDialog = () => {
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleChange = (e) => {
        const { username, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [username]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({
                    ...prev,
                    profileImage: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // try {
        //     const formData = new FormData();
        //     formData.append('name', profileData.name);
        //     formData.append('bio', profileData.bio);
        //     formData.append('gender', profileData.gender);
        //     if (e.target.profileImage.files[0]) {
        //         formData.append('profileImage', e.target.profileImage.files[0]);
        //     }

        //     const response = await axios.put(
        //         `https://deepchat-backend-qrc9.onrender.com/user/update/${Loginuser._id}`,
        //         formData,
        //         {
        //             headers: {
        //                 'Content-Type': 'multipart/form-data'
        //             }
        //         }
        //     );

        //     setLoginuser(prev => ({
        //         ...prev,
        //         ...response.data.user
        //     }));
        // } catch (error) {
        //     console.error('Error updating profile:', error);
        // }
        handleCloseEditDialog();
    };

    useEffect(() => {
        if (!localStorage.getItem("Token")) {
            navigate("/");
        }
        fetchUsersfollowing();
    }, []);

    return (
        <Box
            height="100dvh"
            width="100%"
            bgcolor="#121212"
            color="#fff"
            overflow="auto"
            sx={{
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#1e1e1e',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#bb86fc',
                    borderRadius: '4px',
                },
            }}
        >
            {/* Header */}
            <Box display="flex" alignItems="center" p={1}>
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{
                        backgroundColor: '#1e1e1e',
                        '&:hover': {
                            backgroundColor: '#2a2a2a'
                        }
                    }}
                >
                    <ArrowBackIcon sx={{ color: '#bb86fc' }} />
                </IconButton>
                <Typography variant="h5" fontWeight={600} ml={1}>
                    Profile
                </Typography>
            </Box>

            {/* Cover Photo with Gradient */}
            <GradientBox sx={{ height: "173px" }}>
                <Box
                    position="absolute"
                    bottom={-60}
                    left="50%"
                    sx={{ transform: 'translateX(-50%)' }}
                >
                    <ProfileAvatar
                        src={Loginuser?.profileImage}
                        sx={{
                            bgcolor: '#bb86fc',
                            fontSize: 40,
                        }}
                    >
                        {Loginuser?.username ? Loginuser.username.charAt(0) : ''}
                    </ProfileAvatar>
                </Box>
            </GradientBox>

            {/* User Info */}
            <Box mt={8} textAlign="center" >
                <Typography variant="h5" fontWeight={700}>{Loginuser?.username}</Typography>
                <Typography fontSize={14} color="#bbb" mt={0.5}>
                    @{Loginuser?.username ? Loginuser.username.toLowerCase() : ""}
                </Typography>

                {Loginuser?.bio && (
                    <Chip
                        label={Loginuser?.bio}
                        sx={{
                            mt: 2,
                            backgroundColor: '#1e1e1e',
                            color: '#fff',
                            maxWidth: '80%',
                            borderColor: '#bb86fc'
                        }}
                        variant="outlined"
                    />
                )}
            </Box>

            {/* Stats */}
            <Box mt={3} maxWidth="600px" mx="auto" px={2}>
                <Grid container spacing={3} justifyContent="center" alignItems="center" height="80px">
                    <Grid item xs={4}>
                        <StatsBox
                            className='px-4'
                            sx={{
                                cursor: 'pointer',
                                background: 'linear-gradient(135deg, rgba(187, 134, 252, 0.2) 0%, rgba(3, 218, 198, 0.2) 100%)',
                                border: '1px solid rgba(187, 134, 252, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(187, 134, 252, 0.3) 0%, rgba(3, 218, 198, 0.3) 100%)',
                                    boxShadow: '0 8px 25px rgba(187, 134, 252, 0.3)',
                                }
                            }}
                            onClick={handleOpenEditDialog}
                        >
                            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                <EditIcon sx={{
                                    fontSize: 18,
                                    background: 'linear-gradient(45deg, #bb86fc, #03dac6)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }} />
                                <Typography fontWeight={600} fontSize={15} sx={{
                                    background: 'linear-gradient(45deg, #bb86fc, #03dac6)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Edit Profile
                                </Typography>
                            </Box>
                        </StatsBox>
                    </Grid>
                    <Grid item xs={4} sx={{ cursor: 'pointer' }}>
                        <StatsBox className='px-4' sx={{
                            '&:hover': {
                                background: 'linear-gradient(135deg, rgba(255, 117, 151, 0.1) 0%, rgba(30, 30, 30, 0.8) 100%)',
                                border: '1px solid rgba(255, 117, 151, 0.3)',
                            }
                        }}>
                            <Typography fontWeight={600} color="#ff7597" fontSize={25}>
                                {Loginuser.isFollower?.length || 0}
                            </Typography>
                            <Typography fontSize={12} color="#aaa">Followers</Typography>
                        </StatsBox>
                    </Grid>
                    <Grid item xs={4} sx={{ cursor: 'pointer' }}>
                        <StatsBox className='px-4' sx={{
                            '&:hover': {
                                background: 'linear-gradient(135deg, rgba(3, 218, 198, 0.1) 0%, rgba(30, 30, 30, 0.8) 100%)',
                                border: '1px solid rgba(3, 218, 198, 0.3)',
                            }
                        }}>
                            <Typography fontWeight={600} color="#03dac6" fontSize={25}>
                                {Loginuser.isFollowing?.length || 0}
                            </Typography>
                            <Typography fontSize={12} color="#aaa">Following</Typography>
                        </StatsBox>
                    </Grid>
                </Grid>
            </Box>

            {/* Edit Profile Dialog */}
            <Dialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        background: '#1e1e1e',
                        border: '1px solid rgba(187, 134, 252, 0.2)',
                        boxShadow: '0 8px 32px rgba(187, 134, 252, 0.2)',
                        overflow: 'hidden',
                        maxWidth: '500px',
                        width: '90%',
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        background: 'linear-gradient(135deg, rgba(187, 134, 252, 0.8) 0%, rgba(3, 218, 198, 0.8) 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        py: 2,
                        textAlign: 'center',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80%',
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'
                        }
                    }}
                >
                    Edit Your Profile
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ py: 3, px: 4 }}>
                        <Box display="flex" flexDirection="column" gap={3}>
                            {/* Profile Image Upload */}
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                gap={1}
                                sx={{
                                    position: 'relative',
                                    mb: 2
                                }}
                            >
                                <label htmlFor="profile-image-upload">
                                    <Input
                                        id="profile-image-upload"
                                        name="profileImage"
                                        type="file"
                                        onChange={handleImageChange}
                                        sx={{ display: 'none' }}
                                        accept="image/*"
                                    />
                                    <Avatar
                                        src={profileData.profileImage || Loginuser?.profileImage}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            cursor: 'pointer',
                                            border: '3px solid #bb86fc',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0 0 20px rgba(187, 134, 252, 0.5)'
                                            }
                                        }}
                                    />
                                </label>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#bb86fc',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                    onClick={() => document.getElementById('profile-image-upload').click()}
                                >
                                    Change Profile Picture
                                </Typography>
                            </Box>

                            {/* Username Field */}
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={profileData.username}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        '& fieldset': {
                                            borderColor: '#bb86fc',
                                            borderRadius: '12px'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#bb86fc',
                                            boxShadow: '0 0 10px rgba(187, 134, 252, 0.3)'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#bb86fc',
                                            boxShadow: '0 0 15px rgba(187, 134, 252, 0.5)'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#bb86fc',
                                        '&.Mui-focused': {
                                            color: '#bb86fc'
                                        }
                                    },
                                }}
                                InputProps={{
                                    sx: {
                                        fontSize: '1rem',
                                        padding: '2px'
                                    }
                                }}
                            />

                            {/* Bio Field */}
                            <TextField
                                fullWidth
                                label="Bio"
                                name="bio"
                                value={profileData.bio}
                                onChange={handleChange}
                                variant="outlined"
                                multiline
                                rows={3}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        '& fieldset': {
                                            borderColor: '#03dac6',
                                            borderRadius: '12px'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#03dac6',
                                            boxShadow: '0 0 10px rgba(3, 218, 198, 0.3)'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#03dac6',
                                            boxShadow: '0 0 15px rgba(3, 218, 198, 0.5)'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#03dac6',
                                        '&.Mui-focused': {
                                            color: '#03dac6'
                                        }
                                    },
                                }}
                                InputProps={{
                                    sx: {
                                        fontSize: '1rem',
                                        padding: '12px 15px'
                                    }
                                }}
                            />

                            {/* Gender Select */}
                            <FormControl fullWidth>
                                <InputLabel
                                    sx={{
                                        color: '#bb86fc',
                                        '&.Mui-focused': {
                                            color: '#bb86fc'
                                        }
                                    }}
                                >
                                    Gender
                                </InputLabel>
                                <Select
                                    name="gender"
                                    value={profileData.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                    sx={{
                                        color: '#fff',
                                        borderRadius: '12px',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#bb86fc',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#bb86fc',
                                            boxShadow: '0 0 10px rgba(187, 134, 252, 0.3)'
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#bb86fc',
                                            boxShadow: '0 0 15px rgba(187, 134, 252, 0.5)'
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: '#bb86fc'
                                        }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                bgcolor: '#2a2a2a',
                                                color: '#fff',
                                                '& .MuiMenuItem-root': {
                                                    '&:hover': {
                                                        bgcolor: 'rgba(187, 134, 252, 0.1)'
                                                    },
                                                    '&.Mui-selected': {
                                                        bgcolor: 'rgba(187, 134, 252, 0.2)'
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                    <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            bgcolor: 'rgba(30, 30, 30, 0.8)',
                            px: 4,
                            py: 2,
                            borderTop: '1px solid rgba(187, 134, 252, 0.1)',
                            backdropFilter: 'blur(8px)'
                        }}
                    >
                        <Button
                            onClick={handleCloseEditDialog}
                            sx={{
                                color: '#ff7597',
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                borderRadius: '10px',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 117, 151, 0.1)',
                                    boxShadow: '0 0 10px rgba(255, 117, 151, 0.2)'
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, rgba(187, 134, 252, 0.9) 0%, rgba(3, 218, 198, 0.9) 100%)',
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                borderRadius: '10px',
                                boxShadow: '0 4px 15px rgba(187, 134, 252, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(187, 134, 252, 0.4)',
                                    background: 'linear-gradient(135deg, rgba(187, 134, 252, 1) 0%, rgba(3, 218, 198, 1) 100%)',
                                }
                            }}
                        >
                            Save Changes
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Divider sx={{
                my: 2,
                bgcolor: 'transparent',
                borderBottom: '1px dashed gray',
                width: '80%',
                mx: 'auto'
            }} />

            {/* Suggested Friends Section */}
            <Box px={3} mt={2} mb={0}>
                <Box
                    className="d-flex flex-column gap-3 p-3"
                    justifyContent="space-between"
                    mb={3}
                    sx={{
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '12px',
                            padding: '1px',
                            background: 'linear-gradient(135deg, #bb86fc, #03dac6, #ff7597)',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude',
                            animation: 'borderSpin 4s linear infinite',
                        },
                        '@keyframes borderSpin': {
                            '100%': { backgroundPosition: '200% 200%' },
                        },
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={800}
                        sx={{
                            background: 'linear-gradient(45deg, #bb86fc, #03dac6, #ff7597)',
                            backgroundSize: '200% 200%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            animation: 'gradientShift 4s ease infinite',
                            px: 2,
                            py: 1,
                            '@keyframes gradientShift': {
                                '0%, 100%': { backgroundPosition: '0% 50%' },
                                '50%': { backgroundPosition: '100% 50%' },
                            },
                        }}
                    >
                        🌟 Suggested Friends
                    </Typography>

                    <Box
                        borderRadius="20px"
                        p={2}
                        sx={{
                            background: 'rgba(30, 30, 30, 0.4)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 3,
                                justifyContent: { xs: 'center', sm: 'flex-start' },
                            }}
                        >
                            {isLoadingSuggested ? (
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <CircularProgress size={30} thickness={3} sx={{ color: '#bb86fc' }} />
                                </Box>
                            ) : suggestedUsers.length > 0 ? (
                                suggestedUsers.map((u) => (
                                    <Box
                                        key={`suggested-${u._id}`}
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                sm: 'calc(50% - 12px)',
                                                md: 'calc(33.33% - 12px)',
                                                lg: 'calc(25% - 12px)',
                                            },
                                            minWidth: '280px',
                                            transition: 'all 0.4s',
                                            '&:hover': {
                                                transform: 'translateY(-8px) scale(1.02)',
                                                '& .friend-card': {
                                                    boxShadow: '0 20px 40px rgba(187, 134, 252, 0.6)',
                                                },
                                            },
                                        }}
                                    >
                                        <SuggestedFriendCard
                                            user={u}
                                            LoginUser={Loginuser}
                                            isFollowed={Loginuser?.isFollowing?.includes(u._id)}
                                            onFollowToggle={null}
                                            className="friend-card"
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                minHeight: '300px',
                                                borderRadius: '18px',
                                                background: 'rgba(40, 40, 40, 0.7)',
                                                border: '1px solid rgba(187, 134, 252, 0.2)',
                                                p: 3,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    background: 'rgba(50, 50, 50, 0.9)',
                                                    borderColor: 'rgba(187, 134, 252, 0.4)',
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                                                },
                                            }}
                                        />
                                    </Box>
                                ))
                            ) : (
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '10px',
                                        background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.7) 0%, rgba(50, 50, 50, 0.5) 100%)',
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: '-50%',
                                            left: '-50%',
                                            width: '200%',
                                            height: '200%',
                                            background: 'linear-gradient(45deg, transparent 45%, rgba(187, 134, 252, 0.1) 50%, transparent 55%)',
                                            animation: 'shimmer 3s infinite linear',
                                            '@keyframes shimmer': {
                                                '0%': { transform: 'rotate(0deg) translateX(-25%)' },
                                                '100%': { transform: 'rotate(360deg) translateX(-25%)' },
                                            },
                                        },
                                        '&:hover': {
                                            borderColor: 'rgba(187, 134, 252, 0.3)',
                                            boxShadow: '0 6px 20px rgba(187, 134, 252, 0.2)',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            fontSize: '18px',
                                            fontWeight: 500,
                                            textAlign: 'center',
                                            position: 'relative',
                                            zIndex: 1,
                                            background: 'linear-gradient(90deg, #bb86fc, #a162e8)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        No user suggestions available
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ProfilePage;