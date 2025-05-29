import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import {
    Box,
    Button,
    TextField,
    Typography,
    Tabs,
    Tab,
    Paper,
    CircularProgress,
    CssBaseline,
    ThemeProvider,
    createTheme,
    styled
} from '@mui/material';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserSecret } from "react-icons/fa";

// Dark theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#90caf9' },
        secondary: { main: '#f48fb1' },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    },
});

// Background container
const GradientBackground = styled(Box)({
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
});

// Glass effect box
const GlassPaper = styled(Paper)({
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    zIndex: 1,
});

// Gradient styled button
const GradientButton = styled(Button)({
    background: 'linear-gradient(45deg, #0B1C28 0%, #1A3A5F 100%)',
    border: '1px solid rgba(79, 195, 247, 0.3)',
    borderRadius: '8px !important',
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 7px 14px rgba(0, 0, 0, 0.4)',
        background: 'linear-gradient(45deg, #5a6fd8 0%, #6a42a0 100%)',
    },
});

const Signin = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [SocketID, setSocketID] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const socket = useMemo(() => io('https://deepchat-backend-qrc9.onrender.com', {
        transports: ['websocket'],
        withCredentials: true,
        autoConnect: true,
    }), []);

    useEffect(() => {
        socket.on('Welcome', (id) => {
            setSocketID(id);
            console.log(id);
        });
    }, [socket]);

    const formik = useFormik({
        initialValues: { username: '', EmailorUsername: '', password: '' },
        onSubmit: async (values) => {
            if (isSignup && !values.username) return toast.error('Username is required');
            if (!values.EmailorUsername) return toast.error('Username or email is required');

            const isEmail = values.EmailorUsername.includes('@');
            if (isEmail) {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(values.EmailorUsername)) {
                    return toast.error('Please enter a valid email');
                }
            }

            if (!values.password) return toast.error('Password is required');

            setLoading(true);
            try {
                if (isSignup) {
                    await axios.post('https://deepchat-backend-qrc9.onrender.com/user/signup', values);
                    toast.success('Signup successful');
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    const res = await axios.post('https://deepchat-backend-qrc9.onrender.com/user/login', values);
                    toast.success('Login successful');
                    localStorage.setItem("Token", res.data.token);
                    setTimeout(() => {
                        navigate('/home', { state: res.data.user });
                    }, 1000);
                }
            } catch (error) {
                const msg = error.response?.data?.message || error.response?.data?.error || 'Something went wrong.';
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <GradientBackground>
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                        opacity: 0.6,
                    }}
                >
                    <source src="/Sun.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Form Container */}
                <GlassPaper elevation={3}>
                    <Typography
                        variant="h4"
                        mb={3}
                        sx={{
                            background: 'white',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                        }}
                    >
                        <Box className="d-flex align-items-center justify-content-center"><FaUserSecret size={40} style={{ marginRight: '12px' }} />
                            Deepchat </Box>
                    </Typography>

                    <Tabs
                        value={isSignup ? 1 : 0}
                        onChange={(e, val) => setIsSignup(val === 1)}
                        centered
                        sx={{ mb: 3 }}
                        TabIndicatorProps={{
                            style: {
                                background: 'linear-gradient(45deg, #667eea 0%, #a78bfa 100%)',
                                height: '3px'
                            }
                        }}
                    >
                        <Tab label="Login" sx={{ fontWeight: 'bold', '&.Mui-selected': { color: '#a78bfa' } }} />
                        <Tab label="Sign Up" sx={{ fontWeight: 'bold', '&.Mui-selected': { color: '#a78bfa' } }} />
                    </Tabs>

                    <form onSubmit={formik.handleSubmit}>
                        {isSignup && (
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                variant="outlined"
                                margin="normal"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                sx={inputStyles}
                            />
                        )}

                        <TextField
                            fullWidth
                            label="Username,email"
                            name="EmailorUsername"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            value={formik.values.EmailorUsername}
                            onChange={formik.handleChange}
                            sx={inputStyles}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            sx={inputStyles}
                        />

                        <GradientButton
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3, py: 1.5 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : isSignup ? 'Get Started' : 'Login'}
                        </GradientButton>
                    </form>
                </GlassPaper>

                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </GradientBackground>
        </ThemeProvider>
    );
};

// Reusable input styles
const inputStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&:hover fieldset': {
            borderColor: '#a78bfa',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#a78bfa',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#a78bfa',
    },
};

export default Signin;
