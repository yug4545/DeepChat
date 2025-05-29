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

// Styled container with full screen background video
const BackgroundContainer = styled(Box)({
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    '& video': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -1,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
    },
});

// Glassmorphic form
const GlassPaper = styled(Paper)({
    position: 'relative',
    zIndex: 1,
    background: 'rgba(30, 30, 30, 0.75)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(11, 8, 42, 0.6)',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
});

// Gradient button
const GradientButton = styled(Button)({
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '8px',
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        background: 'linear-gradient(45deg, #5a6fd8 0%, #6a42a0 100%)',
    },
});

const Signin = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [SocketID, setSocketID] = useState(null);
    const [loading, setLoading] = useState(false);

    const socket = useMemo(() =>
        io('https://deepchat-backend-qrc9.onrender.com', {
            transports: ['websocket'],
            withCredentials: true,
            autoConnect: true,
        }), []);

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        onSubmit: async (values) => {
            if (isSignup && !values.username) return toast.error('Username is required');
            if (!values.email) return toast.error('Email is required');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return toast.error('Enter a valid email');
            if (!values.password) return toast.error('Password is required');

            setLoading(true);
            try {
                const url = isSignup
                    ? 'https://deepchat-backend-qrc9.onrender.com/user/signup'
                    : 'https://deepchat-backend-qrc9.onrender.com/user/login';

                const res = await axios.post(url, values);

                toast.success(isSignup ? 'Signup successful' : 'Login successful');

                if (!isSignup) {

                    localStorage.setItem("Token", res.data.token);
                    setTimeout(() => navigate('/home', { state: res.data.user }), 1000);
                } else {
                    setTimeout(() => window.location.reload(), 1000);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || error.response?.data?.error || 'Something went wrong.');
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        socket.on('Welcome', (id) => {
            setSocketID(id);
            console.log(id);
        });
    }, [socket]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <BackgroundContainer>
                <video autoPlay loop muted>
                    <source src="/Sun.mp4" type="video/mp4" />
                </video>

                <GlassPaper elevation={3}>
                    <Typography
                        variant="h4"
                        textAlign="center"
                        mb={1}
                        sx={{
                            background: 'linear-gradient(45deg, #667eea 0%, #a78bfa 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold',
                        }}
                    >
                        Deepchat
                    </Typography>

                    <Tabs
                        value={isSignup ? 1 : 0}
                        onChange={(e, val) => setIsSignup(val === 1)}
                        centered
                        sx={{ mb: 2 }}
                        TabIndicatorProps={{ style: { background: '#a78bfa', height: 3 } }}
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
                                margin="normal"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                variant="outlined"
                                sx={textFieldStyles}
                            />
                        )}

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            margin="normal"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            variant="outlined"
                            sx={textFieldStyles}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            margin="normal"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            variant="outlined"
                            sx={textFieldStyles}
                        />

                        <GradientButton
                            type="submit"
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
                    autoClose={4000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    theme="dark"
                />
            </BackgroundContainer>
        </ThemeProvider>
    );
};

const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
        '&:hover fieldset': { borderColor: '#a78bfa' },
        '&.Mui-focused fieldset': { borderColor: '#a78bfa' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#a78bfa' },
};

export default Signin;
